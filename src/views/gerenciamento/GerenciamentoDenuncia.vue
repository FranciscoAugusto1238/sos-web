<template>
    <v-card class="pa-4">
        <v-card-title class="text-h5 font-weight-bold teal--text mb-4">
            <v-icon left color="teal">mdi-clipboard-list</v-icon>
            Gerenciamentos
        </v-card-title>
        <v-alert v-if="gerenciamentos.length === 0" type="info" border="left" colored-border>
            Nenhum gerenciamento encontrado.
        </v-alert>
        <v-list two-line>
            <v-list-item v-for="gerenciamento in gerenciamentos" :key="gerenciamento.id"
                @click="abrirDialog(gerenciamento)" class="cursor-pointer">
                <v-list-item-content>
                    <v-list-item-title>Status: {{ gerenciamento.status }}</v-list-item-title>
                    <v-list-item-subtitle>Data Início: {{ formatarData(gerenciamento.dataInicio)
                        }}</v-list-item-subtitle>
                </v-list-item-content>
                <v-list-item-icon>
                    <v-icon>mdi-chevron-right</v-icon>
                </v-list-item-icon>
            </v-list-item>
        </v-list>
        <v-dialog v-model="dialog" max-width="600px">
            <v-card>
                <v-card-title>
                    <span class="text-h6">Editar Status e Visualizar Denúncia</span>
                </v-card-title>

                <v-card-text>
                    <v-select v-model="statusSelecionado" :items="opcoesStatus" label="Status" dense></v-select>

                    <v-divider class="my-4"></v-divider>

                    <div v-if="denunciaSelecionada">
                        <h3>Dados da Denúncia</h3>
                        <p><strong>Descrição:</strong> {{ denunciaSelecionada.descricao }}</p>
                        <p><strong>Geolocalização:</strong> {{ denunciaSelecionada.geolocalizacao }}</p>
                        <div v-if="latitude !== null && longitude !== null" style="margin-top: 16px;">
                            <l-map :zoom="15" :center="[latitude, longitude]" style="height: 300px; width: 100%;">
                                <l-tile-layer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                                <l-marker :lat-lng="[latitude, longitude]" />
                            </l-map>
                        </div>
                        <p><strong>Usuário:</strong> {{ denunciaSelecionada.usuario.nome }} - CPF: {{
                            formatarCPF(denunciaSelecionada.usuario.cpf) }}</p>
                        <v-divider class="my-4"></v-divider>
                        <h3>Classificação</h3>
                        <v-row dense>
                            <v-col cols="6">
                                <v-checkbox v-model="gerenciamentoSelecionado.residuosOrganicos"
                                    label="Resíduos Orgânicos"></v-checkbox>
                                <v-checkbox v-model="gerenciamentoSelecionado.eletrodomesticos"
                                    label="Eletrodomésticos"></v-checkbox>
                                <v-checkbox v-model="gerenciamentoSelecionado.construcaoCivil"
                                    label="Construção Civil"></v-checkbox>
                            </v-col>
                            <v-col cols="6">
                                <v-checkbox v-model="gerenciamentoSelecionado.eletronicos"
                                    label="Eletrônicos"></v-checkbox>
                                <v-checkbox v-model="gerenciamentoSelecionado.moveis" label="Móveis"></v-checkbox>
                            </v-col>
                        </v-row>

                        <div v-if="denunciaSelecionada.arquivo">
                            <strong>Arquivo (Imagem):</strong>
                            <br />
                            <img :src="denunciaSelecionada.arquivo" alt="Imagem da Denúncia"
                                style="max-width: 100%; max-height: 300px; margin-top: 8px; border-radius: 4px;" />
                        </div>
                    </div>
                </v-card-text>

                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn text @click="fecharDialog">Cancelar</v-btn>
                    <v-btn color="primary" @click="salvarStatus">Salvar</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
        <v-btn color="primary" @click="gerarRelatorioPDF">
            Gerar Relatório PDF
        </v-btn>

    </v-card>

</template>

<script>
import gerenciamentoService from '@/services/GerenciamentoService';
import { LMap, LTileLayer, LMarker } from 'vue2-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import jsPDF from 'jspdf';
import Chart from 'chart.js/auto';
import ChartDataLabels from 'chartjs-plugin-datalabels';

Chart.register(ChartDataLabels);
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
    iconUrl: require('leaflet/dist/images/marker-icon.png'),
    shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

export default {
    name: 'GerenciamentoDenuncia',
    components: {
        LMap,
        LTileLayer,
        LMarker,
    },
    data() {
        return {
            latitude: null,
            longitude: null,

            gerenciamentos: [],
            dialog: false,
            gerenciamentoSelecionado: null,
            denunciaSelecionada: null,
            statusSelecionado: null,
            opcoesStatus: ['EM ANALISE', 'EM ANDAMENTO', 'FINALIZADO', 'REJEITADO']
        };
    },
    mounted() {
        this.carregarGerenciamentos();
    },
    methods: {

        gerarRelatorioPDF() {
            const bairros = {};
            const residuos = {
                residuosOrganicos: 0,
                eletrodomesticos: 0,
                construcaoCivil: 0,
                eletronicos: 0,
                moveis: 0
            };

            this.gerenciamentos.forEach(g => {
                const bairro = g.denuncia?.bairro || 'Desconhecido';
                bairros[bairro] = (bairros[bairro] || 0) + 1;

                if (g.residuosOrganicos) residuos.residuosOrganicos++;
                if (g.eletrodomesticos) residuos.eletrodomesticos++;
                if (g.construcaoCivil) residuos.construcaoCivil++;
                if (g.eletronicos) residuos.eletronicos++;
                if (g.moveis) residuos.moveis++;
            });

            this.$nextTick(() => {
                this.renderGraficos(bairros, residuos);
            });
        },

        async renderGraficos(bairros, residuos) {
            const canvasBairros = document.createElement('canvas');
            const canvasResiduos = document.createElement('canvas');

            document.body.appendChild(canvasBairros);
            document.body.appendChild(canvasResiduos);

            // Gráfico de Bairros (barra) com fonte maior nos labels
            new Chart(canvasBairros, {
                type: 'bar',
                data: {
                    labels: Object.keys(bairros),
                    datasets: [{
                        label: 'Denúncias por Bairro',
                        data: Object.values(bairros),
                        backgroundColor: 'teal'
                    }]
                },
                options: {
                    plugins: {
                        legend: {
                            labels: {
                                font: {
                                    size: 16 // tamanho maior para legenda
                                }
                            }
                        },
                        datalabels: {
                            display: true,
                            color: 'black',
                            font: {
                                size: 14,
                                weight: 'bold'
                            },
                            anchor: 'end',
                            align: 'top',
                            formatter: (value) => value
                        }
                    },
                    scales: {
                        x: {
                            ticks: {
                                font: {
                                    size: 14 // tamanho maior para labels eixo X
                                }
                            }
                        },
                        y: {
                            ticks: {
                                font: {
                                    size: 14 // tamanho maior para labels eixo Y
                                }
                            },
                            beginAtZero: true
                        }
                    }
                },
                plugins: [ChartDataLabels]
            });

            // Gráfico de Resíduos (pizza) com porcentagem nas fatias e fonte maior
            new Chart(canvasResiduos, {
                type: 'pie',
                data: {
                    labels: ['Orgânicos', 'Eletrodomésticos', 'Construção Civil', 'Eletrônicos', 'Móveis'],
                    datasets: [{
                        label: 'Tipos de Resíduos',
                        data: Object.values(residuos),
                        backgroundColor: ['#4DB6AC', '#FF8A65', '#9575CD', '#81C784', '#FFD54F']
                    }]
                },
                options: {
                    plugins: {
                        legend: {
                            labels: {
                                font: {
                                    size: 16 // legenda maior
                                }
                            }
                        },
                        datalabels: {
                            color: '#fff',
                            font: {
                                size: 14,
                                weight: 'bold'
                            },
                            formatter: (value, context) => {
                                const data = context.chart.data.datasets[0].data;
                                const total = data.reduce((a, b) => a + b, 0);
                                if (total === 0) return '0%';
                                const percentage = (value / total * 100).toFixed(1);
                                return `${percentage}%`;
                            }
                        }
                    }
                },
                plugins: [ChartDataLabels]
            });

            await new Promise(resolve => setTimeout(resolve, 1000));

            const imgBairros = canvasBairros.toDataURL('image/png');
            const imgResiduos = canvasResiduos.toDataURL('image/png');

            document.body.removeChild(canvasBairros);
            document.body.removeChild(canvasResiduos);

            const doc = new jsPDF();
            doc.setFontSize(20);
            doc.text('Relatório de Denúncias', 10, 10);

            doc.addImage(imgBairros, 'PNG', 10, 20, 180, 80);
            doc.addPage();
            doc.addImage(imgResiduos, 'PNG', 10, 20, 180, 100);

            doc.save('relatorio-denuncias.pdf');
        },
        carregarGerenciamentos() {
            gerenciamentoService.listarTodos()
                .then(response => {
                    this.gerenciamentos = response.data;
                })
                .catch(() => {
                    this.$toast.error('Erro ao carregar gerenciamentos');
                });
        },
        abrirDialog(gerenciamento) {
            this.gerenciamentoSelecionado = gerenciamento;
            this.statusSelecionado = gerenciamento.status;
            this.denunciaSelecionada = gerenciamento.denuncia || null;

            if (this.denunciaSelecionada && this.denunciaSelecionada.geolocalizacao) {
                const geo = this.denunciaSelecionada.geolocalizacao;
                const latMatch = geo.match(/latitude:([-+]?[0-9]*\.?[0-9]+)/);
                const lngMatch = geo.match(/longitude:([-+]?[0-9]*\.?[0-9]+)/);
                this.latitude = latMatch ? parseFloat(latMatch[1]) : null;
                this.longitude = lngMatch ? parseFloat(lngMatch[1]) : null;
            } else {
                this.latitude = null;
                this.longitude = null;
            }

            this.dialog = true;
        },
        fecharDialog() {
            this.dialog = false;
            this.gerenciamentoSelecionado = null;
            this.denunciaSelecionada = null;
            this.statusSelecionado = null;
        },
        salvarStatus() {
            if (!this.statusSelecionado) return;

            const atualizado = { ...this.gerenciamentoSelecionado, status: this.statusSelecionado };

            gerenciamentoService.atualizar(this.gerenciamentoSelecionado.id, atualizado)
                .then(() => {
                    this.carregarGerenciamentos();
                    this.fecharDialog();
                })
                .catch(() => {
                    this.$toast.error('Erro ao atualizar status');
                });
        },
        formatarData(data) {
            if (!data) return '';
            return new Date(data).toLocaleString();
        },
        formatarCPF(cpf) {
            if (!cpf) return '';
            const str = cpf.toString().padStart(11, '0');
            return str.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
        }
    }
};
</script>

<style scoped>
.cursor-pointer {
    cursor: pointer;
}
</style>

<template>
    <v-container class="py-8">
        <v-row justify="center">
            <v-col cols="12" md="10">
                <v-card v-for="(denuncia, index) in denuncias" :key="index" class="mb-4">
                    <v-card-title class="text-subtitle-1 font-weight-bold">
                        Denúncia #{{ index + 1 }}
                    </v-card-title>
                    <v-card-text>
                        <p><strong>Descrição:</strong> {{ denuncia.descricao }}</p>
                        <p v-if="denuncia.gerenciamentos && denuncia.gerenciamentos.length > 0">
                            <strong>Status:</strong> {{ denuncia.gerenciamentos[0].status }}
                        </p>
                    </v-card-text>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
import DenunciaService from '@/services/DenunciaService';
import { exibirMensagemErro } from '@/util/MessageUtils.js';
export default {
    name: 'ListarDenuncias',
    data() {
        return {
            denuncias: []
        };
    },
    mounted() {
        this.carregarDenuncias();
    },
    methods: {
        async carregarDenuncias() {
            const usuarioStr = localStorage.getItem('usuarioLogado');
            if (!usuarioStr) {
                exibirMensagemErro('Você precisa estar logado para acessar esta página.');
                this.$router.push('/login');
                return;
            }

            const usuario = JSON.parse(usuarioStr);

            try {
                const response = await DenunciaService.listarPorUsuario(usuario.id);
                this.denuncias = response.data;
            } catch (error) {
                console.error(error);
                exibirMensagemErro('Erro ao carregar denúncias: ' + (error.response?.data?.message || error.message));
            }
        },

        formatarData(dataISO) {
            const data = new Date(dataISO);
            return data.toLocaleString('pt-BR');
        }
    }
};
</script>

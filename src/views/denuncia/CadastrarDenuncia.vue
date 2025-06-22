<template>
  <v-container class="py-8">
    <v-row justify="center">
      <v-col cols="12" md="10" lg="12">
        <v-card class="pa-4 elevation-10 rounded-xl">
          <v-card-title class="text-h5 font-weight-bold teal--text mb-4">
            <v-icon left color="teal">mdi-alert</v-icon>
            Nova Denúncia
          </v-card-title>
          <v-form ref="formDenuncia" v-model="formValido">
            <v-textarea label="Descrição da Denúncia" v-model="denuncia.descricao"
              :rules="[v => !!v || 'Campo obrigatório']" outlined auto-grow rows="3" class="mb-4"
              prepend-inner-icon="mdi-text"></v-textarea>
            <v-file-input label="Imagem ou Arquivo" v-model="arquivoSelecionado" accept="image/*,.pdf" outlined
              show-size prepend-icon="mdi-paperclip" @change="converterParaBase64" class="mb-4"></v-file-input>
            <v-combobox label="Bairro" v-model="denuncia.bairro" :items="bairros"
              :rules="[v => !!v || 'Campo obrigatório']" outlined dense class="mb-4" prepend-inner-icon="mdi-city" />
            <v-btn color="primary" block class="mb-2" @click="obterLocalizacao" prepend-icon="mdi-crosshairs-gps">
              Obter Localização Atual
            </v-btn>
            <v-alert v-if="denuncia.geolocalizacao" type="info" class="mb-4" border="left" colored-border elevation="2">
              <v-icon left class="mr-2">mdi-map-marker</v-icon>
              Localização obtida: {{ denuncia.geolocalizacao }}
            </v-alert>
            <l-map v-if="latitude !== null && longitude !== null" :zoom="15" :center="[latitude, longitude]"
              style="height: 300px; width: 100%;" class="mb-4">
              <l-tile-layer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

              <l-marker :lat-lng="[latitude, longitude]" />
            </l-map>



            <v-btn color="teal" block large class="mt-4" @click="enviarDenuncia" :disabled="!formValido"
              prepend-icon="mdi-send">
              Enviar Denúncia
            </v-btn>
          </v-form>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>


<script>
import DenunciaService from '@/services/DenunciaService';
import { LMap, LTileLayer, LMarker } from 'vue2-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { exibirMensagemSucesso, exibirMensagemErro } from "@/util/MessageUtils.js";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});
export default {
  name: 'CadastrarDenuncia',
  components: {
    LMap,
    LTileLayer,
    LMarker
  },
  data() {
    return {
      formValido: false,
      denuncia: {
        descricao: '',
        arquivo: '',
        geolocalizacao: null,
        bairro: '',
        dataInicio: new Date().toISOString(),
        dataFim: null,
        usuario: {}
      },
      bairros: [
        'Alvorada', 'Campo Experimental', 'Carboni', 'Centro',
        'Cidade Alta', 'Dois Pinheiros', 'Dois Trevos', 'Farroupilha', 'Floresta',
        'Interior', 'Iomere', 'Marafon', 'Matriz', 'Portal', 'Rio Das Pedras',
        'Rio Pedras', 'Santa Gema', 'Santa Tereza', 'Sao Cristovao', 'Sta Tereza'
      ],
      latitude: null,
      longitude: null,
      arquivoSelecionado: null
    };
  },
  methods: {
    obterLocalizacao() {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          position => {
            const lat = parseFloat(position.coords.latitude.toFixed(6));
            const lng = parseFloat(position.coords.longitude.toFixed(6));

            this.latitude = lat;
            this.longitude = lng;

            this.denuncia.geolocalizacao = `latitude:${lat},longitude:${lng}`;
          },
          error => {
            console.error(error);
            exibirMensagemErro('Erro ao obter localização: ' + error.message);
          }
        );
      } else {
        exibirMensagemErro('Geolocalização não é suportada pelo navegador.');
      }
    },
    async enviarDenuncia() {
      const usuarioStr = localStorage.getItem('usuarioLogado');
      if (!usuarioStr) {
        exibirMensagemErro('Usuário não logado. Por favor, faça login para enviar uma denúncia.');
        return;
      }
      if (!this.denuncia.descricao || !this.denuncia.descricao.trim()) {
        exibirMensagemErro('Por favor, preencha a descrição da denúncia.');
        return;
      }
      if (!this.arquivoSelecionado || !this.denuncia.arquivo) {
        exibirMensagemErro('Por favor, selecione uma imagem ou arquivo para anexar à denúncia.');
        return;
      }
      if (!this.denuncia.geolocalizacao) {
        exibirMensagemErro('Por favor, obtenha sua localização antes de enviar.');
        return;
      }
      if (!this.denuncia.bairro) {
        exibirMensagemErro('Por favor, selecione o bairro.');
        return;
      }
      const usuario = JSON.parse(usuarioStr);
      this.denuncia.usuario = { id: usuario.id };

      try {
        await DenunciaService.salvar(this.denuncia);
        exibirMensagemSucesso('Denúncia enviada com sucesso!');
        this.$router.push({ name: 'HomeCliente' });
      } catch (err) {
        console.error(err);
        exibirMensagemErro('Erro ao enviar denúncia: ' + (err.response?.data?.message || err.message));
      }
    },

    converterParaBase64(file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.denuncia.arquivo = reader.result;
      };
      reader.readAsDataURL(file);
    },
  }

};
</script>

<style scoped>
.leaflet-container {
  z-index: 1;
  position: relative;
  width: 100%;
  height: 100%;
}
</style>
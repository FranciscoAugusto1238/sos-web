<template>
  <v-container fluid class="no-space">

    <!-- Hero banner -->
    <v-parallax
      src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1470&q=80"
      height="800"
    >
      <v-row
        class="fill-height"
        align="center"
        justify="center"
        style="background-color: rgba(0, 0, 0, 0.5);"
      >
        <v-col class="text-center white--text px-8">
          <h1 class="display-2 font-weight-black mb-3">SOS Meio Ambiente</h1>
          <h2 class="subtitle-1 mb-6 font-weight-regular">
            Denuncie descarte ilegal de lixo e ajude a preservar nosso planeta!
          </h2>
          <v-btn
            color="green accent-4"
            class="white--text font-weight-bold"
            large
            rounded
            @click="$router.push('/denuncia')"
          >
            Fazer Denúncia Agora
            <v-icon right>mdi-alert-circle</v-icon>
          </v-btn>
        </v-col>
      </v-row>
    </v-parallax>

    <!-- Por que denunciar? -->
    <v-container class="my-16">
      <h2 class="text-center font-weight-bold mb-12 teal--text text--darken-3">
        Por que denunciar descarte ilegal?
      </h2>
      <v-row dense justify="center" align="stretch">
        <v-col cols="12" md="4" class="text-center px-6">
          <v-icon size="64" color="green darken-2">mdi-earth</v-icon>
          <h3 class="my-4 font-weight-medium">Preservar o Meio Ambiente</h3>
          <p>Evite a contaminação do solo, água e ar, protegendo nossa fauna e flora.</p>
        </v-col>

        <v-col cols="12" md="4" class="text-center px-6">
          <v-icon size="64" color="green darken-2">mdi-account-group</v-icon>
          <h3 class="my-4 font-weight-medium">Saúde Pública</h3>
          <p>Reduza riscos à saúde da comunidade, evitando a proliferação de doenças.</p>
        </v-col>

        <v-col cols="12" md="4" class="text-center px-6">
          <v-icon size="64" color="green darken-2">mdi-badge-account-alert</v-icon>
          <h3 class="my-4 font-weight-medium">Garantia de Justiça</h3>
          <p>Contribua para que os responsáveis sejam identificados e responsabilizados.</p>
        </v-col>
      </v-row>
    </v-container>

    <!-- Como funciona -->
    <v-container class="my-16 pa-12 teal lighten-5 rounded-lg">
      <h2 class="text-center font-weight-bold mb-10 teal--text text--darken-4">
        Como funciona o sistema SOS Meio Ambiente
      </h2>
      <v-row dense justify="space-around">
        <v-col cols="12" md="3" class="text-center">
          <v-icon size="56" color="green darken-2">mdi-file-document-edit</v-icon>
          <h4 class="my-3 font-weight-medium">1. Faça sua denúncia</h4>
          <p>Informe local, data e descreva o descarte ilegal de lixo que você presenciou.</p>
        </v-col>
        <v-col cols="12" md="3" class="text-center">
          <v-icon size="56" color="green darken-2">mdi-magnify</v-icon>
          <h4 class="my-3 font-weight-medium">2. Análise e verificação</h4>
          <p>Nossa equipe analisa a denúncia para garantir sua veracidade e priorizar as ações.</p>
        </v-col>
        <v-col cols="12" md="3" class="text-center">
          <v-icon size="56" color="green darken-2">mdi-shield-check</v-icon>
          <h4 class="my-3 font-weight-medium">3. Ações de fiscalização</h4>
          <p>As autoridades são acionadas para atuar nos locais denunciados, combatendo o crime ambiental.</p>
        </v-col>
      </v-row>
      <v-row justify="center" class="mt-10">
        <v-btn
          color="green accent-4"
          class="white--text font-weight-bold"
          large
          rounded
          @click="$router.push('/denuncia')"
        >
          Denuncie Agora
          <v-icon right>mdi-alert-circle</v-icon>
        </v-btn>
      </v-row>
    </v-container>

    <!-- Imagem / Mapa ilustrativo -->
    <v-container class="my-16" style="max-width: 1000px; margin: auto;">
      <v-img
        src="https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1470&q=80"
        alt="Meio Ambiente"
        height="400"
        class="rounded-lg elevation-5"
      ></v-img>
    </v-container>

    <!-- Footer social -->
    <v-footer color="teal darken-3" dark app>
      <v-container>
        <v-row justify="space-between" align="center">
          <v-col cols="12" md="4" class="text-center text-md-left">
            <div class="font-weight-bold">SOS Meio Ambiente</div>
            <small>© 2025 - Todos os direitos reservados.</small>
          </v-col>
          <v-col cols="12" md="4" class="text-center">
            <v-icon large class="mr-4" @click="abrirRedeSocial('facebook')">mdi-facebook</v-icon>
            <v-icon large class="mr-4" @click="abrirRedeSocial('instagram')">mdi-instagram</v-icon>
            <v-icon large @click="abrirRedeSocial('whatsapp')">mdi-whatsapp</v-icon>
          </v-col>
          <v-col cols="12" md="4" class="text-center text-md-right">
            <div>Contato: (37) 99875-0927</div>
          </v-col>
        </v-row>
      </v-container>
    </v-footer>

  </v-container>
</template>

<script>
export default {
  name: "HomeCliente",
  methods: {
    abrirRedeSocial(rede) {
      const urls = {
        facebook: "https://www.facebook.com/people/Ronaldo-Piscinas-RN/61576370217048/",
        instagram: "https://www.instagram.com/ronaldopiscinas2025?igsh=cXZ4dWFjaHc0YXJw",
        whatsapp:
          "https://wa.me/37998750927?text=Olá!%20Gostaria%20de%20mais%20informações%20sobre%20os%20serviços%20da%20SOS%20Meio%20Ambiente.",
      };
      window.open(urls[rede], "_blank");
    },
  },
};
</script>

<style scoped>
h1, h2, h3, h4 {
  font-family: 'Montserrat', sans-serif;
}
.v-parallax__content {
  display: flex !important;
  align-items: center;
  justify-content: center;
}

.no-space {
  padding: 20 !important;
  margin: 0 !important;
}
.v-container {
  padding: 0 !important;
}
</style>

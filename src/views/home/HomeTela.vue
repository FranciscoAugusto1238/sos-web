<template>
  <v-app>
    <v-app-bar color="teal darken-3" dark app elevate-on-scroll>
      <v-app-bar-nav-icon @click="drawer = !drawer">
        <v-icon>mdi-menu</v-icon>
      </v-app-bar-nav-icon>
      <v-toolbar-title class="font-weight-bold"> <img :src="logo" alt="Logo do EventIF" class="logo-img-app-bar" />
      </v-toolbar-title>
      <span class="ml-2">SOS Meio Ambiente</span>
      <v-spacer></v-spacer>
      <v-btn icon @click="logout" title="Sair" v-if="usuarioLogado">
        <v-icon>mdi-logout</v-icon>
      </v-btn>
    </v-app-bar>

    <v-navigation-drawer v-model="drawer" app temporary color="teal darken-1">
      <v-toolbar-title class="d-flex align-center">
        <img :src="logo" alt="Logo do EventIF" class="logo-img" />
        SOS Meio Ambiente
      </v-toolbar-title>
      <div v-if="usuarioLogado" class="px-4 py-2 white--text text-subtitle-2">
        Olá, {{ usuarioLogado.nome }}
      </div>
      <v-list dense nav>
        <v-list-item to="/principal" exact>
          <v-list-item-icon><v-icon>mdi-home</v-icon></v-list-item-icon>
          <v-list-item-content><v-list-item-title>Home</v-list-item-title></v-list-item-content>
        </v-list-item>

        <v-list-item to="/denuncia" exact>
          <v-list-item-icon><v-icon>mdi-file-document-edit</v-icon></v-list-item-icon>
          <v-list-item-content><v-list-item-title>Cadastrar Denúncia</v-list-item-title></v-list-item-content>
        </v-list-item>

        <v-list-item to="/listar-denuncia" exact>
          <v-list-item-icon><v-icon>mdi-format-list-bulleted</v-icon></v-list-item-icon>
          <v-list-item-content><v-list-item-title>Listar Denúncias</v-list-item-title></v-list-item-content>
        </v-list-item>

        <v-list-item to="/gerenciamento-denuncias" exact v-if="usuarioLogado && usuarioLogado.permissao === 'admin'">
          <v-list-item-icon><v-icon>mdi-clipboard-list</v-icon></v-list-item-icon>
          <v-list-item-content><v-list-item-title>Gerenciamento de Denúncias</v-list-item-title></v-list-item-content>
        </v-list-item>

        <v-list-item v-if="!usuarioLogado" to="/usuario/cadastro" exact>
          <v-list-item-icon><v-icon>mdi-account-plus</v-icon></v-list-item-icon>
          <v-list-item-content><v-list-item-title>Cadastro de Usuário</v-list-item-title></v-list-item-content>
        </v-list-item>

        <v-list-item v-if="!usuarioLogado" to="/login" exact>
          <v-list-item-icon><v-icon>mdi-login</v-icon></v-list-item-icon>
          <v-list-item-content><v-list-item-title>Login</v-list-item-title></v-list-item-content>
        </v-list-item>

        <v-list-item link v-if="usuarioLogado" @click="logout">
          <v-list-item-icon><v-icon>mdi-logout</v-icon></v-list-item-icon>
          <v-list-item-content><v-list-item-title>Sair</v-list-item-title></v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-main>
      <router-view />
    </v-main>

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
  </v-app>
</template>

<script>
import Logo from '@/assets/sos.png';

export default {
  name: "HomeTela",
  data() {
    return {
      drawer: false,
      usuarioLogado: null,
      logo: Logo,
    };
  },
  created() {
    const usuarioStr = localStorage.getItem("usuarioLogado");
    if (usuarioStr) {
      this.usuarioLogado = JSON.parse(usuarioStr);
      console.log("Usuário logado:", this.usuarioLogado);
    }
  },
  methods: {
    logout() {
      localStorage.removeItem("usuarioLogado");
      localStorage.removeItem("token");
      this.usuarioLogado = null;
      this.$router.push({ name: "LoginForm" });
    },
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
.bg-gradient {
  color: white;
  font-weight: 600;
}

.drawer-custom {
  border-top-right-radius: 12px;
  border-bottom-right-radius: 12px;
}

ul {
  padding-left: 1.2rem;
}

li {
  margin-bottom: 8px;
}

.logo-img {
  width: 250px;
  height: auto;
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

.logo-img-app-bar {
  width: 50px;
  height: auto;
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

.toolbar-logo-title {
  display: flex;
  align-items: center;
  top: -30px;
}

.toolbar-logo-title span {
  position: relative;
  top: -10px;
}
</style>

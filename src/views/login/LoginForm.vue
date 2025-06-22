<template>
  <div class="login-wrapper">
    <v-container class="d-flex align-center justify-center fill-height pa-0 ma-0" fluid>
      <v-card class="login-card elevation-12" style="background-color: #C8E6C9; padding: 16px;">
        <v-card-title class="d-flex justify-center align-center">
          <img :src="logo" alt="Logo do SOS" class="logo-img"
            style="max-height: 60px; max-width: 60px; margin-bottom: 8px;" />
          <div class="toolbar-logo-title">
            <span class="text-h5 font-weight-bold white--text">SOS Meio Ambiente</span> 
          </div>
          </v-card-title>


        <v-card-subtitle class="text-center text-h6 font-weight-medium mb-6 welcome-text">
          Bem-vindo ao Sistema
        </v-card-subtitle>

        <v-form ref="form" v-model="valid" lazy-validation>
          <v-text-field label="CPF" v-model="cpfString" :rules="[rules.required, rules.cpf]" maxlength="14"
            @input="onCpfInput" prepend-inner-icon="mdi-card-account-details-outline" outlined dense color="primary"
            class="mb-4 custom-input" />

          <v-text-field label="Senha" v-model="senha" :rules="[rules.required]" type="password"
            prepend-inner-icon="mdi-lock-outline" outlined dense color="primary" class="mb-4 custom-input" />

          <v-btn style="background-color: #203a43; color: white" block large @click="login" :disabled="!valid">
            <v-icon left>mdi-login</v-icon>
            Entrar
          </v-btn>

          <v-btn text block class="text-caption secondary-button" @click="irParaCadastro">
            <v-icon left small>mdi-account-plus-outline</v-icon>
            Criar uma conta
          </v-btn>
        </v-form>
      </v-card>
    </v-container>
    <v-snackbar
  v-model="snackbar"
  :color="snackbarColor"
  timeout="3000"
  top
  elevation="4"
>
  {{ snackbarMessage }}
</v-snackbar>

  </div>
</template>

<script>
import UsuarioService from "../../services/UsuarioService";
import Logo from '@/assets/sos.png';
import {exibirMensagemSucesso, exibirMensagemErro} from "@/util/MessageUtils.js";

export default {
  name: "LoginUsuario",
  data() {
    return {
      snackbar: false,
    snackbarMessage: '',
    snackbarColor: '',
      logo: Logo,
      valid: false,
      cpfString: "",
      cpfNumerico: null,
      senha: "",
      rules: {
        required: (value) => !!value || "Campo obrigatório",
        cpf: (value) =>
          /^\d{3}\.?\d{3}\.?\d{3}-?\d{2}$/.test(value) ||
          "CPF deve estar no formato 000.000.000-00",
      },
    };
  },
  methods: {
    onCpfInput(value) {
      let digits = value.replace(/\D/g, "");
      if (digits.length > 11) digits = digits.slice(0, 11);
      this.cpfString = digits.replace(
        /(\d{3})(\d{3})(\d{3})(\d{2})/,
        "$1.$2.$3-$4"
      );
      this.cpfNumerico = digits.length === 11 ? Number(digits) : null;
    },
    async login() {
      this.$refs.form.validate();
      if (this.valid) {
        try {
          const response = await UsuarioService.login(this.cpfNumerico, this.senha);
          localStorage.setItem("token", response.token);
          localStorage.setItem("usuarioLogado", JSON.stringify(response));
          exibirMensagemSucesso("Login realizado com sucesso! Bem-vindo");
          this.$router.push({ name: "HomeCliente" });
        } catch (error) {
          exibirMensagemErro("Erro ao realizar login. Verifique suas credenciais.");
          console.error(error);
        }
      }
    },
    irParaCadastro() {
      this.$router.push({ name: "UsuarioForm" });
    },
  },
};
</script>

<style scoped>
.login-wrapper {
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(-45deg, #1e3c72, #2a5298, #0f2027, #203a43);
  background-size: 400% 400%;
  animation: gradientBG 12s ease infinite;
  padding: 16px;
  overflow: hidden;
}

.login-inner {
  width: 100%;
  max-width: 500px;
  padding: 20px;
}

.login-card {
  width: 650%;
  padding: 40px 32px;
  border-radius: 18px;
  background-color: rgb(255, 255, 255);
  color: #333;
  box-shadow: 0 20px 35px rgba(0, 0, 0, 0.25);
  transition: transform 0.3s ease;
}

@keyframes gradientBG {
  0% {
    background-position: 0% 50%;
  }

  50% {
    background-position: 100% 50%;
  }

  100% {
    background-position: 0% 50%;
  }
}

.login-card:hover {
  transform: translateY(-5px);
}

.v-card-subtitle {
  color: #555;
  font-weight: 500;
  font-family: "Segoe UI", sans-serif;
}

.custom-input input {
  font-size: 16px;
  font-family: "Segoe UI", sans-serif;
}

.animated-button {
  background-color: #1976d2;
  font-weight: bold;
  transition: all 0.3s ease;
}

.animated-button:hover {
  background-color: #125ea3;
  transform: scale(1.02);
}

.secondary-button {
  color: #1976d2;
  font-weight: 500;
  font-family: "Segoe UI", sans-serif;
  transition: color 0.3s ease;
}

.toolbar-logo-title {
  display: flex;
  align-items: center;
  top: -30px;
}

.secondary-button:hover {
  color: #0d47a1;
}

.custom-input {
  font-family: "Segoe UI", sans-serif;
}
</style>

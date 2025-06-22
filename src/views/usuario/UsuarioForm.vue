<template>
  <div class="form-wrapper">
    <v-container class="d-flex align-center justify-center fill-height pa-0 ma-0" fluid>
      <v-card class="form-card elevation-12" style="background-color: #C8E6C9; padding: 16px;">
        <v-card-title class="d-flex justify-center align-center">
          <img :src="logo" alt="Logo do SOS" class="logo-img"
            style="max-height: 60px; max-width: 60px; margin-bottom: 8px;" />
          <div class="toolbar-logo-title">
            <span class="text-h5 font-weight-bold white--text">SOS Meio Ambiente</span> 
          </div>
          </v-card-title>
        <v-card-subtitle class="text-center text-h6 font-weight-medium mb-6 welcome-text">
          Cadastro de Usuário
        </v-card-subtitle>
        <v-form ref="form" v-model="valid" lazy-validation>
          <v-row dense>
            <v-col cols="12" md="6">
              <v-text-field label="Nome" v-model="usuario.nome" :rules="[rules.required]" outlined dense required
                class="custom-input" />
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field label="CPF" v-model="cpfString" :rules="[rules.required, rules.cpf]" maxlength="14"
                @input="onCpfInput" hint="Somente números ou formato: 000.000.000-00" persistent-hint outlined dense
                required class="custom-input" />
            </v-col>
            <v-col cols="12" md="3">
              <v-text-field label="UF" v-model="usuario.uf" :rules="[rules.required, rules.uf]" maxlength="2"
                class="text-uppercase custom-input" outlined dense required />
            </v-col>
            <v-col cols="12" md="9">
              <v-text-field label="Município" v-model="usuario.municipio" :rules="[rules.required]" outlined dense
                required class="custom-input" />
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field label="Data de Nascimento" v-model="usuario.dataNascimento" type="date"
                :rules="[rules.required]" outlined dense required class="custom-input" :max="maxDataNascimento" />
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field label="Senha" v-model="usuario.senha" :rules="[rules.required, rules.minSenha]"
                type="password" outlined dense required class="custom-input" />
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field label="Confirmar Senha" v-model="confirmarSenha"
                :rules="[rules.required, validarConfirmarSenha]" type="password" outlined dense required
                class="custom-input" />
            </v-col>
            <v-col cols="12" class="text-center">
              <v-btn color="blue" @click="submit" :disabled="!valid" class="mt-4 animated-button" large>
                <v-icon left>mdi-content-save</v-icon>
                Salvar
              </v-btn>
              <v-btn color="blue" @click="voltarParaLogin" class="mt-4 animated-button" large>
                <v-icon left>mdi-arrow-left</v-icon>
                Voltar
              </v-btn>
            </v-col>
          </v-row>
        </v-form>
      </v-card>
    </v-container>
  </div>
</template>

<script>
import UsuarioService from '../../services/UsuarioService.js';
import Logo from '@/assets/sos.png';
import {exibirMensagemSucesso, exibirMensagemErro, exibirMensagemInfo} from "@/util/MessageUtils.js";

export default {
  name: "UsuarioForm",
  data() {
    return {
      logo: Logo,
      maxDataNascimento: new Date().toISOString().substr(0, 10),
      valid: false,
      menuDataNascimento: false,
      usuario: {
        nome: "",
        cpf: null,
        uf: "",
        municipio: "",
        dataNascimento: null,
        senha: "",
      },
      confirmarSenha: "",
      cpfString: "",
      rules: {
        required: value => !!value || "Campo obrigatório",
        cpf: value =>
          /^\d{3}\.?\d{3}\.?\d{3}-?\d{2}$/.test(value) ||
          "CPF deve estar no formato 000.000.000-00",
        uf: value =>
          /^[A-Za-z]{2}$/.test(value) || "UF deve conter 2 letras",
        minSenha: value =>
          (value && value.length >= 6) || "A senha deve ter pelo menos 6 caracteres",
      },
    };
  },
  computed: {
    dataNascimentoFormatted() {
      if (!this.usuario.dataNascimento) return "";
      // converte string ISO para formato local dd/mm/yyyy
      const parts = this.usuario.dataNascimento.split("-");
      if (parts.length === 3) {
        return `${parts[2]}/${parts[1]}/${parts[0]}`;
      }
      return this.usuario.dataNascimento;
    },
  },


  methods: {
voltarParaLogin() {
    this.$router.push('/login');
  },
    onDataNascimentoChange(value) {
      this.usuario.dataNascimento = value;
      this.menuDataNascimento = false;
    },
    validarConfirmarSenha(value) {
      return value === this.usuario.senha || "As senhas não coincidem";
    },
    onCpfInput(value) {
      let digits = value.replace(/\D/g, "");
      if (digits.length > 11) digits = digits.slice(0, 11);
      this.cpfString = digits.replace(
        /(\d{3})(\d{3})(\d{3})(\d{2})/,
        "$1.$2.$3-$4"
      );
      this.usuario.cpf = digits.length === 11 ? Number(digits) : null;
    },
    async submit() {
      // Força validação do form e dos campos
      const formValido = this.$refs.form.validate();
      const senhaConfirmaValida = this.validarConfirmarSenha(this.confirmarSenha) === true;

      if (formValido && senhaConfirmaValida) {
        try {
          const usuarioCriado = await UsuarioService.criarUsuario(this.usuario);
          exibirMensagemSucesso("Usuário cadastrado com sucesso!" + usuarioCriado.nome);
          this.$router.push({ name: "LoginForm" });
          this.resetForm();
        } catch (error) {
          exibirMensagemErro("Erro ao salvar usuário");
          console.error(error);
        }
      } else {
        if (!senhaConfirmaValida) {
          exibirMensagemInfo("As senhas não coincidem.");
        } else {
          exibirMensagemInfo("Por favor, preencha todos os campos corretamente.");
        }
      }
    },
    resetForm() {
      this.usuario = {
        nome: "",
        cpf: null,
        uf: "",
        municipio: "",
        dataNascimento: null,
        senha: "",
      };
      this.confirmarSenha = "";
      this.cpfString = "";
      this.$refs.form.resetValidation();
    },
  },
};
</script>

<style scoped>
.form-wrapper {
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

.form-card {
  width: 650px;
  padding: 40px 32px;
  border-radius: 18px;
  background-color: white;
  color: #333;
  box-shadow: 0 20px 35px rgba(0, 0, 0, 0.25);
  transition: transform 0.3s ease;
}

.form-card:hover {
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
  color: rgb(11, 56, 0) !important;
}

.animated-button:hover {
  background-color: #048500;
  transform: scale(1.02);
}

.logo {
  filter: drop-shadow(0 0 1px rgba(0, 0, 0, 0.1));
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
</style>

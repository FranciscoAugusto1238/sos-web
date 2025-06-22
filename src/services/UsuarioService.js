import axios from 'axios';

const API_URL = 'https://api-sos-meio-ambiente-production.up.railway.app/usuarios';

export default {

  async login(cpf, senha) {
    try {
      const response = await axios.post(`${API_URL}/login`, { cpf, senha });
      return response.data;
    } catch (error) {
      console.error("Erro ao fazer login:", error);
      throw error;
    }
  },

  async criarUsuario(usuario) {
    try {
      const response = await axios.post(API_URL, usuario);
      return response.data;
    } catch (error) {
      console.error('Erro ao criar usuário:', error);
      throw error;
    }
  },

  async listarUsuarios() {
    try {
      const response = await axios.get(API_URL);
      return response.data;
    } catch (error) {
      console.error('Erro ao listar usuários:', error);
      return [];
    }
  },

  async buscarUsuarioPorId(id) {
    try {
      const response = await axios.get(`${API_URL}/${id}`);
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar usuário por ID:', error);
      throw error;
    }
  },

  async atualizarUsuario(id, usuario) {
    try {
      const response = await axios.put(`${API_URL}/${id}`, usuario);
      return response.data;
    } catch (error) {
      console.error(`Erro ao atualizar usuário (ID: ${id}):`, error);
      throw error;
    }
  },

  async deletarUsuario(id) {
    try {
      // O controller usa DELETE para deletar
      await axios.delete(`${API_URL}/${id}`);
    } catch (error) {
      console.error(`Erro ao deletar usuário (ID: ${id}):`, error);
      throw error;
    }
  },

  // O controller não tem endpoint /filtro, então comentei:
  /*
  async listarUsuariosPorFiltro(nome, cpf) {
    try {
      const params = {};
      if (nome) params.nome = nome;
      if (cpf) params.cpf = cpf;

      const response = await axios.get(`${API_URL}/filtro`, { params });
      return response.data;
    } catch (error) {
      console.error('Erro ao filtrar usuários:', error);
      return [];
    }
  },
  */
};

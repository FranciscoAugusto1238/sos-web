import axios from 'axios';

const API_URL = 'https://api-sos-meio-ambiente-production.up.railway.app/denuncias';

export default {
async listarPorUsuario(usuarioId) {
  const token = localStorage.getItem('token');
  return axios.get(`${API_URL}/usuario/${usuarioId}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
},

  async salvar(denuncia) {
    const token = localStorage.getItem('token');
    return axios.post(API_URL, denuncia, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  },

  async listarTodos() {
    return axios.get(API_URL);
  },

  async buscarPorId(id) {
    return axios.get(`${API_URL}/${id}`);
  },

  async atualizar(id, denuncia) {
    const token = localStorage.getItem('token');
    return axios.put(`${API_URL}/${id}`, denuncia, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  },

  async deletar(id) {
    const token = localStorage.getItem('token');
    return axios.delete(`${API_URL}/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  }
};

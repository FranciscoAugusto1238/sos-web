import axios from 'axios';

const API_URL = 'https://api-sos-meio-ambiente-production.up.railway.app/gerenciamentos';

export default {
  listarTodos() {
    return axios.get(API_URL);
  },

  atualizar(id, gerenciamentoAtualizado) {
    return axios.put(`${API_URL}/${id}`, gerenciamentoAtualizado);
  }
};

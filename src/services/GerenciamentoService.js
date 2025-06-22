import axios from 'axios';

const API_URL = 'http://localhost:8082/gerenciamentos';

export default {
  listarTodos() {
    return axios.get(API_URL);
  },

  atualizar(id, gerenciamentoAtualizado) {
    return axios.put(`${API_URL}/${id}`, gerenciamentoAtualizado);
  }
};

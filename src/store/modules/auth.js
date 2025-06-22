// store/modules/auth.js
export default {
  namespaced: true,
  state: () => ({
    usuarioLogado: null,
  }),
  mutations: {
    setUsuarioLogado(state, usuario) {
      state.usuarioLogado = usuario;
    },
    limparUsuarioLogado(state) {
      state.usuarioLogado = null;
    }
  },
  actions: {
    async login({ commit }, { cpf, senha }) {
      try {
        const response = await fetch('/api/login', {
          method: 'POST',
          body: JSON.stringify({ cpf, senha }),
          headers: { 'Content-Type': 'application/json' }
        });
        const data = await response.json();
        if(data.usuario) {
          commit('setUsuarioLogado', data.usuario);
          localStorage.setItem('token', data.token);
          return true;
        }
        return false;
      } catch {
        return false;
      }
    },
    logout({ commit }) {
      commit('limparUsuarioLogado');
      localStorage.removeItem('token');
    },
    async carregarUsuarioLogado({ commit }) {
      const token = localStorage.getItem('token');
      if(token) {
        const response = await fetch('/api/usuario-logado', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if(response.ok) {
          const usuario = await response.json();
          commit('setUsuarioLogado', usuario);
        }
      }
    }
  },
  getters: {
    usuarioLogado: (state) => state.usuarioLogado,
    isAdmin: (state) => state.usuarioLogado?.permissao === 'ADMIN',
  }
};

import Vue from 'vue';
import VueRouter from 'vue-router';

import Home from '../views/home/HomeTela.vue';
import HomeCliente from '../views/home/HomeCliente.vue';
import UsuarioForm from '../views/usuario/UsuarioForm.vue';
import LoginForm from '../views/login/LoginForm.vue';
import CadastrarDenuncia from '../views/denuncia/CadastrarDenuncia.vue';
import ListarDenuncias from '../views/denuncia/ListarDenuncias.vue';
import GerenciamentoDenuncia from '../views/gerenciamento/GerenciamentoDenuncia.vue';



Vue.use(VueRouter);

const routes = [
  // Rotas públicas
  { path: '/usuario/cadastro', name: 'UsuarioForm', component: UsuarioForm },
  { path: '/login', name: 'LoginForm', component: LoginForm },

  // Rotas protegidas
  {
    path: '/',
    component: Home,
    children: [
      { path: '', redirect: '/home' },
      { path: 'home', name: 'Home', component: Home },
      { path: 'principal', name: 'HomeCliente', component: HomeCliente },
      { path: '/denuncia', name: 'CadastrarDenuncia',component: CadastrarDenuncia},
      { path: '/listar-denuncia', name: 'ListarDenuncias',component: ListarDenuncias},
      { path: '/gerenciamento-denuncias', name: 'GerenciamentoDenuncia',component: GerenciamentoDenuncia},

    ],
  },
];

const router = new VueRouter({
  mode: 'history',
  routes,
});

// Função simulada para verificar autenticação
function isAuthenticated() {
  return !!localStorage.getItem('token'); // Substituir por lógica real de autenticação
}

// Guard global para rotas protegidas
router.beforeEach((to, from, next) => {
  // Rotas públicas
  const publicRoutes = ['UsuarioForm', 'LoginForm'];

  if (publicRoutes.includes(to.name)) {
    next(); // Permite acesso às rotas públicas
  } else if (isAuthenticated()) {
    next(); // Usuário autenticado, permite acesso
  } else {
    next({ name: 'LoginForm' }); // Redireciona para a tela de login
  }
});

export default router;

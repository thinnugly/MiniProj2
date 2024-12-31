import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';

import VueSimpleAlert from 'vue-simple-alert';
import BootstrapVue from 'bootstrap-vue';
import 'bootstrap-vue/dist/bootstrap-vue.css';

Vue.use(BootstrapVue);
Vue.use(VueSimpleAlert);

Vue.filter('currency', function (value) {
  if (!value) return '';
  value = value.toString();
  return `R$ ${parseFloat(value).toFixed(2).replace('.', ',')}`;
});

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app');

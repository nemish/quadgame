import Vue from 'vue';
import app from '@/components/app.vue';
import { genId } from '@/utils';

const APP_ELEMENT_ID = 'app-' + genId();

const div = document.createElement('div');
div.setAttribute('id', APP_ELEMENT_ID);
document.body.appendChild(div);

new Vue({
  el: '#' + APP_ELEMENT_ID,
  render: h => h(app)
});

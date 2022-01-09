import { createApp } from 'vue'
import App from './App.vue'
import 'material-icons'
import 'prismjs/themes/prism.css'

createApp(App)
  .mount('#app')
  .$nextTick(window.removeLoading)


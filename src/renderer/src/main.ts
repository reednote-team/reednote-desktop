import { createApp } from 'vue'
import App from './App.vue'
import store from './store'
import prism from 'prismjs'
import 'material-icons'
import 'prismjs/themes/prism.css'


prism.highlightAll()

createApp(App)
	.use(store)
	.mount('#app')
	.$nextTick(window.removeLoading)

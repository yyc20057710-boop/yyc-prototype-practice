import { createApp } from 'vue'
import { createPinia } from 'pinia'
import 'element-plus/dist/index.css'
import ElementPlus from 'element-plus'
import App from './App.vue'
import router from './router'
import perHandler from '@/modules/vue-router-directive-menu/utils/directive/per'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(ElementPlus)
app.directive('per', perHandler)

app.mount('#app')

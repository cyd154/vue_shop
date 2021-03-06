import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login.vue'
import Home from '../components/Home.vue'
import Welcome from '../components/Welcome.vue'
import Users from '../components/user/Users.vue'
import Rights from '../components/power/Rights.vue'
import Roles from '../components/power/Roles.vue'
import Goods from '../components/goods/Goods.vue'
import Params from '../components/goods/Params.vue'
import Categories from '../components/goods/Categories.vue'
import Add from '../components/goods/Add.vue'
import Orders from '../components/order/Orders.vue'
import Reports from '../components/report/Reports.vue'

Vue.use(VueRouter)

const routes = [
	{path:'/',redirect:'/login'},
	{
		path:'/login',
		component:Login,
	},
	{
		path:'/home',
		component:Home,
		redirect:'/welcome',
		children:[
			{path:'/welcome',component:Welcome},
			{path:'/users',component:Users},
			{path:'/rights',component:Rights},
			{path:'/roles',component:Roles},
			{path:'/goods',component:Goods},
			{path:'/params',component:Params},
			{path:'/categories',component:Categories},
			{path:'/goods/add',component:Add},
			{path:'/orders',component:Orders},
			{path:'/reports',component:Reports}
		]
	}

]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach((to, from, next) => {
	//to将要访问的路径
	// from代表从哪个路径跳转而来
	if(to.path === '/login') return next()
	//获取token
	const tokenStr = window.sessionStorage.getItem('token')
	if(!tokenStr) return next('/login')
	next()
})

export default router

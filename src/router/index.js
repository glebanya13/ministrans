import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Profile from '../views/Profile.vue'
import TimeTable from '../views/TimeTable.vue'
import WriteDown from '../views/WriteDown.vue'
import Signin from '../views/Signin.vue'
import Signup from '../views/Signup.vue'
import Signup2 from '../views/Signup2.vue'
import Store from '../store'


Vue.use(VueRouter)

  const routes = [
  {
    path: '/',
    name: 'home',
    component: Home
  },
  {
    path: '/profile',
    name: 'profile',
    component: Profile,
    meta: {authRequired: true}
  },
  {
    path: '/timetable',
    name: 'timetable',
    component: TimeTable
  },
  {
    path: '/write',
    name: 'writedown',
    component: WriteDown
  },
  {
    path: '/signin',
    name: 'signin',
    component: Signin
  },
  {
    path: '/signup',
    name: 'signup',
    component: Signup
  },
  {
    path: '/signup2',
    name: 'signup2',
    component: Signup2
  },
]

const router = new VueRouter({
  routes,
  mode: 'history'
})

router.beforeEach((to, from, next) => {
  Store.dispatch('INIT_AUTH')
  .then(user => {
  if(to.matched.some(route => route.meta.authRequired))
  {
  if(user)
    next()
  else
    next('/signin')
  }else{
    next()
  }
})
})

export default router

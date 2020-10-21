import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Profile from '../views/Profile.vue'
import ListOfMinistrans from '../views/ListOfMinistrans.vue'
import Schedule from '../views/Schedule.vue'
import Stats from '../views/Stats.vue'
import Checkin from '../views/Checkin.vue'
import Signin from '../views/Signin.vue'
import Signup from '../views/Signup.vue'
import EditProfile from '../views/EditProfile.vue'
import Admin from '../views/Admin.vue'
import Parish from '../views/Parish.vue'
import Store from '../store'
import phoneAuth from '../components/PhoneAuth.vue'
import setPassword from '../components/phonePassword.vue'
import PhoneLogin from '../components/PhoneLogin.vue'


Vue.use(VueRouter)

const routes = [
  { path: '/loginPhone',
component: PhoneLogin },
  {
  path: '/setPassword',
  name: 'Set Password',
  component: setPassword},
  {
    path: '/',
    name: 'home',
    component: Home
  },
  {
    path: '/profile',
    name: 'profile',
    component: Profile,
    meta: { authRequired: true }
  },
  {
    path: '/ministrans',
    name: 'ministrans',
    component: ListOfMinistrans,
    meta: { authRequired: true }
  },
  {
    path: '/phone',
    name: 'phone',
    component: phoneAuth,
  },
  {
    path: '/admin',
    name: 'admin',
    component: Admin,
    meta: { authRequired: true }
  },
  {
    path: '/parish',
    name: 'parish',
    component: Parish,
    meta: { authRequired: true }
  },
  {
    path: '/schedule',
    name: 'schedule',
    component: Schedule,
    meta: { authRequired: true }
  },
  {
    path: '/stats',
    name: 'stats',
    component: Stats,
    meta: { authRequired: true }
  },
  {
    path: '/checkin',
    name: 'checkin',
    component: Checkin,
    meta: { authRequired: true }
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
    path: '/edit-profile/:tab',
    name: 'edit-profile',
    component: EditProfile,
    meta: { authRequired: true }
  }
]

const router = new VueRouter({
  routes,
  mode: 'history'
})

router.beforeEach((to, from, next) => {
  Store.dispatch('INIT_AUTH')
    .then(user => {
      if (to.matched.some(route => route.meta.authRequired)) {
        if (user)
          next()
        else
          next('/signin')
      } else {
        next()
      }
    })
})

export default router

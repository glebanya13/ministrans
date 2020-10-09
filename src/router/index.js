import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Profile from '../views/Profile.vue'
import Schedule from '../views/Schedule.vue'
import Stats from '../views/Stats.vue'
import Checkin from '../views/Checkin.vue'
import Signin from '../views/Signin.vue'
import Signup from '../views/Signup.vue'
import EditProfile from '../views/EditProfile.vue'
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
    meta: { authRequired: true }
  },
  {
    path: '/schedule',
    name: 'schedule',
    component: Schedule
  },
  {
    path: '/stats',
    name: 'stats',
    component: Stats
  },
  {
    path: '/checkin',
    name: 'checkin',
    component: Checkin
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
    component: EditProfile
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

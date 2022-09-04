import { createRouter, createWebHistory } from "vue-router"
import Home from "@/views/HomeView.vue"
import About from "@/views/AboutView.vue"
import Manage from "@/views/ManageView.vue"
import Song from "@/views/SongView.vue"
import FourOhFour from "@/views/FourOhFourView.vue"
import useUserStore from "@/stores/user"

const routes = [{
  path: "/",
  name: "home",
  component: Home,
},{ 
  path: "/about",
  name: "about",
  component: About,
},{ 
  path: "/manage-music",
  // alias: "/manage",
  name: "manage",
  component: Manage,
  beforeEnter: (to, from, next) => {
    next()
  },
  meta: {
    requiresAuth: true,
  }
},{
  path: "/manage",
  redirect: { name: 'manage'},
},{
  path: "/:catchAll(.*)*",
  redirect: { name: "home" },
},{
  path: "/error",
  name: "error",
  component: FourOhFour,
},{
  name: "song",
  path: "/song/:id",
  component: Song
}
]
// ,{
//   path: "/:pathMatch(.*)*",
//   name: "home",
//   component: Home,
// }

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  linkExactActiveClass: "text-yellow-500 dark:text-yellow-600 underline underline-offset-8 decoration-2",
  // routes: [

    // {
    //   path: '/',
    //   name: 'home',
    //   component: HomeView
    // },
    // {
    //   path: '/about',
    //   name: 'about',
    //   // route level code-splitting
    //   // this generates a separate chunk (About.[hash].js) for this route
    //   // which is lazy-loaded when the route is visited.
    //   component: () => import('../views/AboutView.vue')
    // }
  // ]
})

// route guards 

// global guard:
router.beforeEach((to, from, next) => {

  // console.log(to.meta)
  if (!to.meta.requiresAuth) {
    next()
    return
  }

  const store = useUserStore()

  if (store.userLoggedIn) {
    next()
  } else {
    next({ name: "error"} )
  }
  // console.log(to, from)

})

export default router

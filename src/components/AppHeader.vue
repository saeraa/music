<template>
  <!-- Header -->
  <header id="header" class="bg-gray-700 dark:bg-gray-800">
    <nav class="container mx-auto flex justify-start items-center py-5 px-4">
      <!-- App Name -->
      <router-link class="text-white dark:text-gray-200 font-bold uppercase text-2xl mr-4 dark:hover:text-yellow-500"
        :to="{ name: 'home' }" exact-active-class="no-active">
        <img src="@/assets/music.svg" alt="Music logo" width="30" height="30"
        class="inline relative top-1.5 align-baseline" />
        Much Music</router-link>

      <div class="flex flex-grow items-center">
        <!-- Primary Navigation -->
        <ul class="flex flex-row mt-2">
          <li>
            <router-link class="px-2 text-white dark:text-gray-200 dark:hover:text-yellow-500" :to="{ name: 'about' }">About</router-link>
          </li>
          <!-- Navigation Links -->
          <li v-if="!userStore.userLoggedIn">
            <a class="px-2 text-white dark:text-gray-200 dark:hover:text-yellow-500" href="#"
              @click.prevent="toggleAuthModal">Login / Register</a>
          </li>
          <template v-else>
            <li>
              <router-link class="px-2 text-white dark:text-gray-200 dark:hover:text-yellow-500" :to="{ name: 'manage' }">Manage</router-link>
            </li>
            <li>
              <a class="px-2 text-white dark:text-gray-200 dark:hover:text-yellow-500" href="#"
                @click.prevent="this.signOut">Logout</a>
            </li>
          </template>
        </ul>
      </div>
    </nav>
  </header>
</template>

<script>
import { mapStores } from "pinia";
import useModalStore from "@/stores/modal";
import useUserStore from "@/stores/user";

export default {
  name: "AppHeader",
  computed: {
    ...mapStores(useModalStore, useUserStore),
  },
  methods: {
    toggleAuthModal() {
      this.modalStore.isOpen = !this.modalStore.isOpen;
      console.log(this.modalStore.isOpen);
    },
    signOut() {
      this.userStore.signOut()
      // console.log(this.$route)
      // if (this.$route.name === "manage") { 
      if (this.$route.meta.requiresAuth) { // better way when multiple routes requiring authentication
        this.$router.push({ name: "home" }) // redirecting user to homepage when logged out
      }
    }
  },
};
</script>

<!-- additional way of doing it: 
                import { mapStores, mapWritableState } from "pinia";
                
                 ...mapWritableState(useModalStore, ["isOpen"])
                    
                     this.isOpen = !this.isOpen; -->

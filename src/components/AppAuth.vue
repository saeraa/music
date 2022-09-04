<template>
  <!-- Auth Modal -->
  <div class="fixed z-10 inset-0 overflow-y-auto" id="modal" :class="hiddenClass">
    <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
      <div class="fixed inset-0 transition-opacity">
        <div class="absolute inset-0 bg-gray-800 opacity-75"></div>
      </div>

      <!-- This element is to trick the browser into centering the modal contents. -->
      <span class="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>

      <div
        class="inline-block align-bottom bg-white dark:bg-gray-600 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
        <!-- Add margin if you want to see some of the overlay behind the modal-->
        <div class="py-4 text-left px-6">
          <!--Title-->
          <div class="flex justify-between items-center pb-4">
            <p class="text-2xl font-bold dark:text-gray-300">Your Account</p>
            <!-- Modal Close Button -->
            <div class="modal-close cursor-pointer z-50" @click="modalVisibility = false">
              <i class="fas fa-times text-red-600"></i>
            </div>
          </div>

          <!-- Tabs -->
          <ul class="flex flex-wrap mb-4">

            <li class="flex-auto text-center">
              <a @click.prevent="tab = 'login'" :class="{
                'hover:text-white text-white bg-blue-600 dark:bg-orange-700': tab === 'login',
                'hover:text-blue-600 dark:hover:text-orange-600': tab === 'register'
              }" class="dark:text-gray-300 block rounded py-3 px-4 transition " href="#">Login</a>
            </li>

            <li class="flex-auto text-center">
              <a @click.prevent="tab = 'register'" :class="{
                'hover:text-white text-white bg-blue-600 dark:bg-orange-700': tab === 'register',
                'hover:text-blue-600 dark:hover:text-orange-600': tab === 'login'
              }" class="dark:text-gray-300 block rounded py-3 px-4 transition" href="#">Register</a>
            </li>

          </ul>


          <LoginForm v-if="tab === 'login'" />
          <RegisterForm v-else />
        </div>
      </div>
    </div>
  </div>
</template>


<style>
input:-internal-autofill-selected {
  color-scheme: dark;
  background-color: inherit;
  -webkit-box-shadow: 0 0 0px 1000px rgb(156 163 175 / var(--tw-bg-opacity)) inset;
  box-shadow: 0 0 0px 1000px rgb(156 163 175 / var(--tw-bg-opacity)) inset;
}

.password-field {
  position: relative;
}

.eye-icon {
  cursor: pointer;
  position: absolute;
  right: 1em;
  top: 2.2em;
  color: black;
}
</style>

<script>
import { mapState, mapWritableState } from "pinia"
import useModalStore from "@/stores/modal"
import LoginForm from "./LoginForm.vue"
import RegisterForm from "./RegisterForm.vue"

export default {
  name: "AppAuth",
  components: {
    LoginForm, RegisterForm
  },
  data() {
    return {
      tab: "login",
    }
  },
  methods: {},
  computed: {
    ...mapState(useModalStore, ["hiddenClass"]),
    ...mapWritableState(useModalStore, {
      modalVisibility: "isOpen",
    }),
  }
};
</script>

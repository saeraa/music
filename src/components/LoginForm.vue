<template>
  <!-- Login Form -->
  <vee-form @submit="login" :validation-schema="loginSchema">
    <!-- Alert popup -->
    <div class="text-white text-center font-bold p-4 rounded mb-4" v-if="login_show_alert" :class="login_alert_variant">
      {{ login_alert_msg }}
    </div>
    <!-- Email -->
    <div class="mb-3">
      <label class="block w-full mb-2 dark:text-white">Email
        <vee-field type="email" name="email" class="input-field" placeholder="Enter Email" />
      </label>
      <ErrorMessage class="text-red-600 dark:text-orange-500" name="email" />
    </div>
    <!-- Password -->
    <div class="mb-3">
      <label class="block w-full mb-2 dark:text-white password-field">
        Password
        <vee-field type="password" name="password" class="input-field" placeholder="Password" />
        <i class="fas fa-solid fa-eye eye-icon" @click="revealPassword"></i>
      </label>
      <ErrorMessage class="text-red-600 dark:text-orange-500" name="password" />
    </div>
    <button type="submit" :disabled="login_in_submission" class="submit-btn">
      <span v-if="!login_in_submission">Submit</span>
      <span v-else><i class="fas fa-duotone fa-spinner animate-spin-slow mr-2"></i> Logging in ...</span>
    </button>
  </vee-form>
</template>

<script>
import { mapActions } from "pinia"
import useUserStore from "@/stores/user"

export default {
  name: "LoginForm",
  data() {
    return {
      hidePassword: true,
      loginSchema: {
        'email': "required|min:3|max:100|email",
        'password': "required|min:9|max:100|excluded:password",
      },
      login_in_submission: false,
      login_show_alert: false,
      login_alert_variant: "bg-blue-500",
      login_alert_msg: "Please wait! We are logging you in.",
    }
  },
  methods: {
    ...mapActions(useUserStore, ["authenticate"]),
    async login(values) {
      this.login_show_alert = true;
      this.login_in_submission = true;
      this.login_alert_variant = "bg-blue-500 dark:bg-blue-700";
      this.login_alert_msg = "Please wait! We are logging you in.";

      try {
        await this.authenticate(values)
      } catch (error) {
        this.login_in_submission = false
        this.login_alert_variant = "bg-red-500 dark:bg-red-700"
        this.login_alert_msg = "Invalid login details."
        return
      }

      this.login_alert_variant = "bg-green-500 dark:bg-green-700";
      this.login_alert_msg = "Success! You are now logged in.";

      this.login_in_submission = true

      setTimeout(() => {
        window.location.reload()
      }, 1000)
    },
    revealPassword(event) {
      if (this.hidePassword) {
        event.target.classList.remove("fa-eye-slash")
        event.target.classList.add("fa-eye")
        event.target.previousElementSibling.type = "password"
        this.hidePassword = false
      } else {
        event.target.classList.add("fa-eye-slash")
        event.target.classList.remove("fa-eye")
        event.target.previousElementSibling.type = "text"
        this.hidePassword = true
      }
    }
  }
}
</script>
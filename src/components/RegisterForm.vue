<template>
  <!-- Registration Form -->
  <vee-form :validation-schema="schema" @submit="register">
    <!-- Alert popup -->
    <div class="text-white text-center font-bold p-4 rounded mb-4" v-if="reg_show_alert" :class="reg_alert_variant">
      {{ reg_alert_msg }}
    </div>
    <!-- Name -->
    <div class="mb-3">
      <label class="block w-full mb-2 dark:text-white">Name
        <vee-field class="input-field" type="text" name="name" placeholder="Enter Name"></vee-field>
      </label>
      <ErrorMessage class="text-red-600  dark:text-orange-500" name="name" />
    </div>
    <!-- Email -->
    <div class="mb-3">
      <label class="block w-full mb-2 dark:text-white">Email
        <vee-field type="email" name="email" class="input-field" placeholder="Enter Email" />
      </label>
      <ErrorMessage class="text-red-600  dark:text-orange-500" name="email" />
    </div>
    <!-- Age -->
    <div class="mb-3">
      <label class="block w-full mb-2 dark:text-white">Age
        <vee-field type="number" name="age" class="input-field" />
      </label>
      <ErrorMessage class="text-red-600  dark:text-orange-500" name="age" />
    </div>
    <!-- Password -->
    <div class="mb-3">
      <label class="block w-full mb-2 dark:text-white password-field"> Password
        <vee-field name="password" v-slot="{ field, errors }" :bails="false">
          <input type="password" class="input-field" placeholder="Password" v-bind="field" />
          <div class="text-red-600 dark:text-orange-500" v-for="error in errors" :key="error"> {{ error }}
          </div>
        </vee-field>
        <i class="fas fa-solid fa-eye eye-icon" @click="revealPassword"></i>
      </label>
    </div>
    <!-- Confirm Password -->
    <div class="mb-3">
      <label class="block w-full mb-2 dark:text-white password-field">Confirm Password
        <vee-field name="confirm_password" type="password" class="input-field password-field"
          placeholder="Confirm Password" />
        <i class="fas fa-solid fa-eye eye-icon" @click="revealPassword"></i>
      </label>
      <ErrorMessage class="text-red-600 dark:text-orange-500" name="confirm_password" />

    </div>
    <!-- Country -->
    <div class="mb-3">
      <label class="block w-full mb-2 dark:text-white">Country
        <vee-field as="select" name="country" class="input-field">
          <option value="USA">USA</option>
          <option value="Sweden">Sweden</option>
          <option value="Mexico">Mexico</option>
          <option value="Germany">Germany</option>
          <option value="Wakanda">Wakanda</option>
        </vee-field>
      </label>
      <ErrorMessage class="text-red-600 dark:text-orange-500" name="country" />

    </div>
    <!-- TOS -->
    <div class="mb-3 pl-6">
      <label class="inline-block dark:text-gray-200">
        <vee-field type="checkbox" class="w-4 h-4 float-left -ml-6 mt-1 rounded accent-purple-500" name="tos"
          value="1" />
        Accept terms of service
      </label><br />
      <ErrorMessage class="text-red-600 dark:text-orange-500" name="tos" />
    </div>
    <button type="submit" class="submit-btn" :disabled="reg_in_submission">
      Submit
    </button>
  </vee-form>

</template>

<script>
import { mapActions } from "pinia"
import useUserStore from "@/stores/user"

export default {
  name: "RegisterForm",
  data() {
    return {
      hidePassword: true,
      schema: {
        name: "required|min:3|max:100|alpha_spaces",
        email: "required|min:3|max:100|email",
        age: "required|min_value:18|max_value:115",
        password: "required|min:9|max:100|excluded:password",
        confirm_password: "passwords_mismatch:@password",
        country: "required|country_excluded:Wakanda",
        tos: "tos",
      },
      userData: {
        country: "Sweden"
      },
      reg_in_submission: false,
      reg_show_alert: false,
      reg_alert_variant: "bg-blue-500",
      reg_alert_msg: "Please wait! Your account is being created.",
    }
  },
  computed: {

  },
  methods: {
    ...mapActions(useUserStore, {
      createUser: "register"
    }),
    async register(values) {
      this.reg_show_alert = true;
      this.reg_in_submission = true;
      this.reg_alert_variant = "bg-blue-500 dark:bg-blue-700";
      this.reg_alert_msg = "Please wait! Your account is being created.";


      try {
        await this.createUser(values)
      } catch (error) {
        this.reg_in_submission = false;
        this.reg_alert_variant = "bg-red-700";
        this.reg_alert_msg = "An unexpected error occurred! Please try again later."
        return
      }


      this.reg_alert_variant = "bg-green-500 dark:bg-green-700";
      this.reg_alert_msg = "Success! Your account has been created!"

      setTimeout(() => {
        window.location.reload()
      }, 800)


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
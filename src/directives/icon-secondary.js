export default {
  beforeMount(el, binding) {
    let iconClass = `fa fa-${binding.value.icon} text-xl dark:text-green-500`

    if (binding.value.right) {
      iconClass += ' float-right'
    }

    el.innerHTML += `<i class="${iconClass}"></i>`
  }
}


// directive with object syntax
// v-icon-secondary="{ icon: 'headphones-alt', right: true }"

// added directly to component:
//   import IconSecondary from "@/directives/icon-secondary"
//
// directives: {
//   "icon-secondary": IconSecondary,
// },
export default {
  beforeMount(el, binding) {
    let iconClass = `fa fa-${binding.value} text-xl`

    // v-icon:full="'headphones-alt'" 
    if (binding.arg === "full") {
      iconClass = binding.value
    }

    //  v-icon.right.yellow="'headphones-alt'"
    if (binding.modifiers.right) {
      iconClass += ' float-right'
    }
    if (binding.modifiers.yellow) {
      iconClass += ' dark:text-yellow-500'
    } else {
      iconClass += ' text-green-400 dark:text-green-500'
    }

    el.innerHTML += `<i class="${iconClass}"></i>`
  }
}


// global directive
//
// import Icon from "./directives/icon"
//     app.directive("icon", Icon) // in main.js
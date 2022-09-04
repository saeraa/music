<template>
              <div class="border border-gray-200 dark:border-gray-800 p-3 mb-4 rounded">
              <div v-show="!showForm">
                <h4 class="inline-block text-2xl font-bold dark:text-gray-400"> {{ song.modified_name }}</h4>
                <button class="ml-1 py-1 px-2 text-sm rounded text-white dark:text-gray-200 dark:bg-red-700 bg-red-600 float-right"
                @click.prevent="deleteSong">
                  <i class="fa fa-times"></i>
                </button>
                <button class="ml-1 py-1 px-2 text-sm rounded text-white bg-blue-600 dark:text-gray-200 float-right"
                @click.prevent="showForm = !showForm">
                  <i class="fa fa-pencil-alt"></i>
                </button>
              </div>
              <div v-show="showForm">
                <div class="text-white text-center font-bold p-4 mb-4"
                v-if="show_alert" :class="alert_variant"> {{ alert_message }}</div>
                <vee-form :validation-schema="schema" :initial-values="song" @submit="edit">
                  <div class="mb-3">
                    <label class="block mb-2">Song Title
                    <vee-field name="modified_name" type="text"
                      class="input-field"
                      placeholder="Enter Song Title" 
                      @input="updateUnsavedFlag(true)" /></label>
                    <ErrorMessage class="text-red-600 dark:text-orange-500" name="modified_name" />
                  </div>
                  <div class="mb-3">
                    <label class="block mb-2">Genre
                    <vee-field name="genre" type="text"
                      class="input-field"
                      placeholder="Enter Genre" 
                      @input="updateUnsavedFlag(true)" /></label>
                    <ErrorMessage class="text-red-600 dark:text-orange-500" name="genre" />
                  </div>
                  <button type="submit" class="py-1.5 px-3 rounded text-white dark:text-gray-200 bg-green-600 dark:bg-green-700 mr-2"
                   :disabled="in_submission">
                    Submit
                  </button>
                  <button type="button" class="py-1.5 px-3 rounded dark:text-gray-200 text-white bg-gray-600 dark:bg-gray-600"
                  @click.prevent="showForm = false"
                   :disabled="in_submission">
                    Go Back
                  </button>
                </vee-form>
              </div>
            </div>
</template>

<script>
  import { songsCollection, storage } from '@/includes/firebase'
  export default {
    name: "CompositionItem",
    data() {
      return {
        showForm: false,
        schema: {
          modified_name: "required",
          genre: "alpha_spaces",
        },
        in_submission: false,
        show_alert: false,
        alert_variant: "bg-blue-500",
        alert_message: "Pleae wait! Updating song info.",
      }
    },
    methods: {
      async deleteSong() {
        const storageRef = storage.ref()
        const songRef = storageRef.child(`songs/${this.song.original_name}`)
        
        // delete from storage
        await songRef.delete()
        // delete from db collection
        await songsCollection.doc(this.song.docID).delete()

        this.removeSong(this.index)
      },
      async edit(values) {
        this.in_submission = true
        this.show_alert = true
        this.alert_variant = "bg-blue-500",
        this.alert_message = "Pleae wait! Updating song info."

        try {
          await songsCollection.doc(this.song.docID).update(values)
        } catch (error) {
          console.log(error)
          this.in_submission = false
          this.alert_variant = "bg-red-700"
          this.alert_message = "Something went wrong! Please try again later."
          return
        }

        this.updateSong(this.index, values)
        this.updateUnsavedFlag(false)
        
        this.in_submission = false
        this.alert_variant = "bg-green-700"
        this.alert_message = "Success!"
      },
    },
    props: {
      song: {
        type: Object,
        required: true
      },
      updateSong: {
        type: Function,
        required: true
      },
      index: {
        type: Number,
        required: true
      },
      removeSong: {
        type: Function,
        required: true
      },
      updateUnsavedFlag: {
        type: Function
      }
    }
  }
</script>
<template>
  <main>
    <!-- Main Content -->
    <section class="container mx-auto mt-6 dark:text-gray-400">
      <div class="md:grid md:grid-cols-3 md:gap-4">
        
        <app-upload ref="upload" :addSong="addSong" />
        
        <div class="col-span-2">
          <div class="dark:bg-gray-700 bg-white rounded border dark:border-gray-800 border-gray-200 relative flex flex-col">
            <div class="px-6 pt-6 pb-5 font-bold border-b dark:border-gray-800 border-gray-200">
            <span class="card-title dark:text-gray-200 text-2xl">My Songs</span>
            <i class="fa fa-compact-disc float-right text-green-400 dark:text-green-600 text-2xl"></i>
          </div>
          <div class="p-6">
            <!-- Composition Items -->
            
            <composition-item v-for="(song, i) in songs" 
            :key="song.docID"
            :song="song" 
            :updateSong = "updateSong" 
            :index="i" 
            :removeSong="removeSong" 
            :updateUnsavedFlag="updateUnsavedFlag" />
            
            
          </div>
        </div>
      </div>
    </div>
  </section>
  </main>
</template>


<script>
  import CompositionItem from "@/components/CompositionItem.vue"
  import AppUpload from "@/components/Upload.vue"
  import { songsCollection, auth } from "@/includes/firebase"
  // import useUserStore from "@/stores/user"
  
  export default {
    name: "manage",
    data() {
      return {
        songs: [],
        unsavedFlag: false,
      }
    },
    methods: {
      updateUnsavedFlag(value) {
        this.unsavedFlag = value;
      },
      removeSong(i) {
        this.songs.splice(i, 1)
      },
      updateSong(i, values) {
        this.songs[i].modified_name = values.modified_name
        this.songs[i].genre = values.genre
      },
      addSong(doc) {
        const song = { 
          ...doc.data(),
          docID: doc.id,
        }

        this.songs.push(song)
      }
    },
    components: {
      AppUpload,
      CompositionItem
    },
    async created() {
      const snapshot = await songsCollection.where("uid", "==", auth.currentUser.uid).get()

      snapshot.forEach(this.addSong)
    },
    beforeRouteLeave(to, from, next) {
      if(!this.unsavedFlag) {
        next()
      } else {
        const leave = confirm("You have unsaved changes. Are you sure you want to leave?")
        next(leave)
      }
    }
    // below functionality inplemented directly in Upload.vue via lifecycle hooks
    // beforeRouteLeave(to, from, next) {
    //   this.$refs.upload.cancelUploads()
    //   next()
    // }
  
    // beforeRouteEnter(to, from, next) { // if present, router will run before displaying component
    //   const store = useUserStore()
    //   if (store.userLoggedIn) {
    //     next()
    //   } else {
    //     next({ name: "error" })
    //   }     
    // }
  }
</script>
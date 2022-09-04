<template>
      <div class="col-span-1">
        <div class="bg-white dark:bg-gray-700 rounded border dark:border-gray-800 border-gray-200 relative flex flex-col">
          <div class="px-6 pt-6 pb-5 font-bold border-b dark:border-gray-800 border-gray-200">
            <span class="card-title dark:text-black text-2xl">Upload</span>
            <i class="fas fa-upload float-right text-green-400 dark:text-green-600 text-2xl"></i>
          </div>
          <div class="p-6">
            <!-- Upload Dropbox -->
            <div
              class="w-full px-10 py-20 rounded text-center cursor-pointer border border-dashed
                border-gray-400 dark:border-gray-800 text-gray-400 transition duration-500 hover:text-white
                hover:bg-green-400 hover:dark:bg-gray-600 hover:border-green-400 hover:border-solid"
                :class="{ 'dark:border-solid border-solid dark:bg-gray-600 text-white': is_dragover }"
                @drag.prevent.stop=""
                @dragstart.prevent.stop=""
                @dragend.prevent.stop="is_dragover = false"
                @dragover.prevent.stop="is_dragover = true"
                @dragenter.prevent.stop="is_dragover = true"
                @dragleave.prevent.stop="is_dragover = false"
                @drop.prevent.stop="upload($event)"
                @click="fileInput">
              <h5>Drop your files here <br />
              or click to upload</h5>
          </div>
            <input type="file" ref="inputFile" multiple @change="upload($event)" hidden />
            <hr class="my-6 dark:border-top dark:border-black" />
            <!-- Progess Bars -->
            <div class="mb-4" v-for="upload in uploads" :key="upload.name">
              <!-- File Name -->
              <div class="font-bold text-sm mb-1" :class="upload.text_class">
                <i :class="upload.icon"></i>
                {{upload.name}}</div>
              <div class="flex h-4 overflow-hidden dark:bg-gray-800 bg-gray-200 rounded">
                <!-- Inner Progress Bar -->
                <div class="transition-all progress-bar" 
                :class="upload.variant"
                :style="{width: upload.current_progress + '%'}"></div>
              </div>
            </div>

          </div>
        </div>
      </div>
</template>


<script>
import { storage, auth, songsCollection } from "@/includes/firebase"
export default {
  name: "Upload",
  props: {
    addSong: { type: Function, required: true }
  },
  data() {
    return {
      is_dragover: false,
      uploads: [],
    }
  },
  methods: {
    fileInput() {
      this.$refs.inputFile.click()
    },
    upload($event) {
      this.is_dragover = false
      // const { files } = $event.dataTransfer // bug in Chrome, need to look at the files specifically or the $event will show an empty object
      const files = $event.dataTransfer ? 
      [...$event.dataTransfer.files] : 
      [...$event.target.files];
      
      files.forEach((file) => {
        if(file.type !== "audio/mpeg"){
          return
        }
        
        const storageRef = storage.ref()
        const songsRef = storageRef.child(`songs/${file.name}`)
        const task = songsRef.put(file)
        
        const uploadIndex = this.uploads.push({
          task, 
          current_progress: 0,
          name: file.name,
          variant: "dark:bg-blue-700",
          icon: "fas fa-spinner fa-spin",
          text_class: "",
        }) - 1;
        
        task.on("state_changed", (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          this.uploads[uploadIndex].current_progress = progress;
        }, (error) => {
          this.uploads[uploadIndex].variant = "dark:bg-red-400"
          this.uploads[uploadIndex].icon = "fas fa-times"
          this.uploads[uploadIndex].text_class = "text-red-500"
          // console.log(error)
        }, async () => { // on success
          const song = {
            uid: auth.currentUser.uid,
            display_name: auth.currentUser.displayName,
            original_name: task.snapshot.ref.name,
            modified_name: task.snapshot.ref.name,
            genre: "",
            comment_count: 0,
          }
          
          song.url = await task.snapshot.ref.getDownloadURL()
          const songRef = await songsCollection.add(song)
          const songSnapshot = await songRef.get()
          
          this.addSong(songSnapshot)
          
          this.uploads[uploadIndex].variant = "dark:bg-green-600"
          this.uploads[uploadIndex].icon = "fas fa-check"
          this.uploads[uploadIndex].text_class = "text-green-600"
          
        });
      })
      
    }
  },
    //cancelUploads() {
  //   this.uploads.forEach(upload => {
  //   upload.task.cancel()
  // })
  // },
    beforeUnmount() {
      this.uploads.forEach(upload => {
          upload.task.cancel()
        })
      }
}
</script>
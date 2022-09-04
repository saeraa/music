<template>
  <main>
  <!-- Music Header -->
  <section class="w-full mb-8 py-14 text-center text-white relative">
    <div class="absolute inset-0 w-full h-full box-border bg-contain music-bg"
      style="background-image: url(/assets/img/song-header.png)">
    </div>
    <div class="container mx-auto flex items-center">

      <!-- Play/Pause Button -->
      <button 
      @click.prevent="newSong(song)"
      type="button" 
      class="z-50 h-24 w-24 text-3xl dark:bg-gray-500 bg-white text-black rounded-full focus:outline-none">
        <i class="fas"
        :class="{ 'fa-play': !playing, 'fa-pause': playing }"></i>
      </button>
      <div class="z-50 text-left ml-8">
        
        <!-- Song Info -->
        <div class="text-3xl font-bold">{{ song.modified_name }}</div>
        <div>{{ song.genre }}</div>
      </div>
    </div>
  </section>
  <!-- Form -->
  <section class="container mx-auto mt-6" id="comments">
    <div class="bg-white dark:bg-gray-700 rounded border dark:border-gray-800 border-gray-200 relative flex flex-col">
      <div class="px-6 pt-6 pb-5 font-bold border-b dark:border-gray-800 border-gray-200">
        <!-- Comment Count -->
        <span class="card-title font-bold text-xl dark:text-gray-200">Comments ({{ song.comment_count }})</span>
        <i class="fa fa-comments float-right text-green-400 dark:text-green-500 text-2xl"></i>
      </div>
      <div class="p-6">
        <div class="text-white dark:text-gray-200 text-center font-bold p-4 mb-4" 
          v-if="comment_show_alert"
          :class="comment_alert_variant">
          {{ comment_alert_message }}
        </div>
        
        <vee-form :validation-schema="schema" @submit="addComment"
        v-if="userLoggedIn">
          <vee-field as="textarea" name="comment"
            class="input-field"
            placeholder="Your comment here..."></vee-field>
            <ErrorMessage class="text-red-600 dark:text-orange-500" name="comment"></ErrorMessage>
          <button type="submit" class="py-1.5 px-3 mt-3 mb-4 rounded text-white bg-green-600 dark:bg-green-700 block"
          :disabled="comment_in_submission">
            Submit
          </button>
        </vee-form>

        <!-- Sort Comments -->
        <select
          class="input-field" v-model="sort">
          <option value="1">Latest</option>
          <option value="2">Oldest</option>
        </select>

      </div>
    </div>
  </section>
  <!-- Comments -->
  <ul class="container mx-auto dark:text-gray-300">
    <li class="p-6 bg-gray-50 dark:bg-gray-600 border dark:border-gray-800 border-gray-200" v-for="comment in sortedComments" :key="comment.docID">
      <!-- Comment Author -->
      <div class="mb-5">
        <div class="font-bold dark:text-gray-400">{{ comment.name }}</div>
        <time>{{ comment.datePosted }}</time>
      </div>

      <p>
        {{ comment.content }}
      </p>
    </li>
  </ul>
  </main>
</template>

<script>
  import { mapState, mapActions } from "pinia"
  import { songsCollection, auth, commentsCollection } from "@/includes/firebase"
  import useUserStore from "@/stores/user"
  import usePlayerStore from "@/stores/player"

export default {
  name: "Song",
  computed: {
    ...mapState(usePlayerStore, ["playing"]),
    ...mapState(useUserStore, ["userLoggedIn"]),
    sortedComments() {
      return this.comments.slice().sort((a,b) => {
        if(this.sort === "1") {
          return new Date(b.datePosted) - new Date(a.datePosted)
        }
        return new Date(a.datePosted) - new Date(b.datePosted)
      })
    }

  },
  data() {
    return {
      sort: "1",
      song: {},
      comments: [],
      schema: {
        comment: "required|min:3",
      },
      comment_in_submission: false,
      comment_show_alert: false,
      comment_alert_variant: "bg-blue-500 dark:bg-blue-700",
      comment_alert_message: "Please wait! Your comment is being submitted."
    }
  },
  methods: {
    ...mapActions(usePlayerStore, ["newSong"]),
    async getComments() {
      const snapshots = await commentsCollection.where("sid", "==", this.$route.params.id).get()

      this.comments = []
      
      snapshots.forEach((doc) => {
        this.comments.push({
          docID: doc.id,
          ...doc.data()
        })
      })
    },
    async addComment(values, { resetForm }) {
      this.comment_in_submission = true,
      this.comment_show_alert = true,
      this.comment_alert_variant = "bg-blue-500 dark:bg-blue-700",
      this.comment_alert_message = "Please wait! Your comment is being submitted."
      
      const comment = {
        content: values.comment,
        datePosted: new Date().toString(),
        sid: this.$route.params.id,
        name: auth.currentUser.displayName,
        uid: auth.currentUser.uid,
      }

      await commentsCollection.add(comment)

      this.song.comment_count += 1
      await songsCollection.doc(this.$route.params.id).update({
        comment_count: this.song.comment_count
      })

      this.getComments()

      this.comment_in_submission = false;
      this.comment_alert_variant = "bg-green-500 dark:bg-green-700"
      this.comment_alert_message = "Comment added!"

      resetForm()
    }
  },
  async created() {
    const docSnapshot = await songsCollection.doc(this.$route.params.id).get()
    
    if (!docSnapshot.exists) {
      this.$router.push({ name: "home" })
      return
    }

    const { sort } = this.$route.query

    this.sort = sort === "1" || sort === "2" ? sort : "1"

    this.song = docSnapshot.data()
    this.getComments()
  },
  watch: {
    sort(newVal) {
      if (newVal === this.$route.query.sort) {
        return
      }
      this.$router.push({
        query: {
          sort: newVal,
        }
      })
    }
  }
  
}
</script>

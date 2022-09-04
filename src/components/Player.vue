<template>
    <!-- Player -->
    <div class="fixed bottom-0 left-0 dark:bg-gray-900 bg-white p-5 pb-4 text-left align-top w-full h-18">
      <div class="relative" v-if="current_song.modified_name">
        <!-- Play/Pause Button -->
        <div class="float-left w-7 h-7 leading-3 mt-1">
          <button type="button" @click.prevent="toggleAudio">
            <i class="fa  text-gray-500 dark:text-gray-300 text-xl"
            :class="{ 'fa-play': !playing, 'fa-pause': playing }"></i>
          </button>
        </div>
        <!-- Current Position -->
        <div class="float-left w-7 h-7 leading-3 dark:text-gray-300 text-gray-400 mt-3 text-lg w-14 ml-5">
          <span class="player-currenttime">{{ seek }}</span>
        </div>
        <!-- Scrub -->
        <div class="float-left w-7 h-7 leading-3 ml-7 mt-2 player-scrub">
          <div class="absolute left-0 right-0 text-lg text-center mx-auto player-song-info dark:text-gray-400">
            <span class="song-title">{{ current_song.modified_name }}</span> by
            <span class="song-artist">{{ current_song.display_name }}</span>
          </div>
          <!-- Scrub Container  -->
          <span @click.prevent="updateSeek"
          class="block w-full h-2 rounded m-1 mt-2 bg-gray-200 relative cursor-pointer dark:bg-gray-400">
            <!-- Player Ball -->
            <!-- <span class="absolute top-neg-8 text-gray-800 dark:text-gray-600 text-lg" :style="{ left: playerProgress }">
              <i class="fas fa-circle"></i>
            </span> -->
            <!-- Player Progress Bar-->
            <span class="block h-2 rounded bg-gradient-to-t from-green-500 to-green-400" :style="{ width: playerProgress }"></span>
          </span>
        </div>
        <!-- Duration -->
        <div class="float-left w-7 h-7 leading-3 text-gray-400 dark:text-gray-300 text-lg w-14 ml-8 mt-3">
          <span class="player-duration">{{ duration }}</span>
        </div>
      </div>
    </div>
</template>

<script>
  import { mapActions, mapState } from "pinia"
  import usePlayerStore from "@/stores/player"

export default {
  name: "Player",
  methods: {
    ...mapActions(usePlayerStore, ["toggleAudio", "updateSeek"])
  },
  computed: {
    ...mapState(usePlayerStore, ["playing", "seek", "duration", "playerProgress", "current_song"])
  }
}
</script>

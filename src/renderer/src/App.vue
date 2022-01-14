<script setup lang="ts">
import { reactive, ref, watch } from 'vue';
import MilkdownEditorVue from './components/MilkdownEditor.vue';
import LoadSaveVue from './components/LoadSave.vue';
import { useStore } from 'vuex';
import { computed } from 'vue';

const store = useStore()

const editorStatus = computed(() => {
	return store.state.status
})

const url = computed(() => {
  return store.state.currentNote.url
})

const fileName = url.value.split('/')[url.value.split('/').length - 1]

</script>

<template>
<!--<div class="fixed top-0 left-0 right-0 h-10 mx-auto" id="title-bar">-->
  <!--<div class="py-2 font-sans text-sm font-bold text-center text-gray-700" id="title">{{ fileName == '' ? "Untitled" : fileName }}</div>-->
<!--</div>-->
  <div class="cursor-text relative min-h-screen bg-white dark:bg-[@2e3440] overflow:hidden">
    <LoadSaveVue/>
    <MilkdownEditorVue v-if="editorStatus == 'loaded' " />
  </div>
</template>

<style>
body {
  background-color: rgba(var(--background), 1);
  background-color: white;
}

#title-bar {
  -webkit-app-region: drag;
}
</style>

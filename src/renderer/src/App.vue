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

</script>

<template>
  <div class="container">
    <LoadSaveVue/>
    <MilkdownEditorVue v-if="editorStatus == 'loaded' " />
  </div>
</template>

<style>
body {
  background-color: rgba(var(--background), 1);
}
</style>

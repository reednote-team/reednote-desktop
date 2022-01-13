<script setup lang='ts'>
import { ref, reactive, watch } from 'vue'
import { useStore } from 'vuex'

// store.commit('updateCurrentNoteContent', '')

// const props = defineProps<{
//   getter: {
//     status: string,
//     content: string,
//     error: string
//   }
// }>()
// 
// const file = ref<File | null>(null)
// 
// const loadTextFromFile = (e: Event) => {
//   props.getter.status = 'loading'
//   const target = e.target as HTMLInputElement
//   if (target.files?.length) {
//     file.value = target.files[0]
//     const reader = new FileReader()
//     reader.readAsText(file.value)
//     reader.onload = () => {
//       props.getter.status = 'loaded'
//       props.getter.content = reader.result as string
//       props.getter.error = ''
//     }
//   }
// }
// 
// const SaveTextToFile = () => {
//   let filename = 'untitled.md'
//   if (file.value) {
//     filename = file.value.name
//   }
//   let text = props.getter.content
//   let blob = new Blob([text], { type: 'text/plain' })
//   let link = document.createElement("a")
//   link.download = filename as string
//   link.href = window.URL.createObjectURL(blob)
//   document.body.appendChild(link)
//   link.click()
//   setTimeout(() => {
//     document.body.removeChild(link)
//     window.URL.revokeObjectURL(link.href)
//   }, 100);
// }

console.log('fs', window.fs)
console.log('ipcRenderer', window.ipcRenderer)


const ipcRenderer = window.ipcRenderer
const store = useStore()
function updateTitle(filePath: string) {
	document.title = filePath.split('/')[filePath.split('/').length - 1]
}


ipcRenderer.on("open-file", (event, { content, filePath }) => {
	console.log('[ipcRenderer] open-file event listened')
	store.commit('updateStatus', 'loading')
	store.commit('updateCurrentNoteContent', '')
	store.commit('updateCurrentNoteURL', '')
	store.commit('updateCurrentNoteContent', content) 
	store.commit('updateCurrentNoteURL', filePath) 
	setTimeout(() => {
		store.commit('updateStatus', 'loaded')
	}, 10)
	updateTitle(filePath)
});

// if (store.state.currentNote.modified === true) document.title = document.title + ' *'

ipcRenderer.on("save-file", (event) => {
	console.log('[ipcRenderer] save-file event listened')
	// const vueSave = document.getElementById('VueSave') as HTMLInputElement
	// vueSave.click()
	const content = store.state.currentNote.content
	const filePath = store.state.currentNote.url
	store.commit('updateModified', false)
	fs.writeFileSync(filePath, content, 'utf8')
});

ipcRenderer.on("save-copy", (event, { filePath }) => {
	console.log('[ipcRenderer] save-copy event listened')
	// console.log("FILEPATH:", typeof filePath)
	store.commit('updateModified', false)
	store.commit('updateCurrentNoteURL', filePath)
	updateTitle(filePath)
	const content = store.state.currentNote.content
	fs.writeFileSync(filePath, content, 'utf8')
});

</script>

<template>
  <div>
    <!-- <input style="display:none" type="button" id="VueSave" value="Save" @click="SaveTextToFile" /> -->
  </div>
</template>

<style scoped>
</style>

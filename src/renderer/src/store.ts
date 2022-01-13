import { createStore } from 'vuex'

export default createStore({
	state: {
		status: 'loaded',
		currentNote: {
			url: '',
			content: '',
			modified: true,
		}
	},
	mutations: {
		updateCurrentNoteContent(state, content: string) {
			state.currentNote.content = content
		},
		updateCurrentNoteURL(state, url: string) {
			state.currentNote.url =	url
		},
		updateStatus(state, status: string) {
			state.status = status
		},
		updateModified(state, mod: boolean) {
			state.currentNote.modified = mod
		}
	},
	actions: {}
})

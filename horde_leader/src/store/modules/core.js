// import Vue from 'vue'
// import idb from '@/api/idb-nodes';
// import * as Automerge from 'automerge'
// import { v4 as uuidv4 } from 'uuid';
// import { Story } from '@/api/story.js'
// import { HordeClient } from '@/api/horde_client.js'


const state = () => ({
    scribes: [{one: "two"}]
//   showMenu: false,
//   showConfig: false,
//   level: 0,
//   stories: [],
//   story: null,
//   hordeClient: new HordeClient(),
//   reading: null,
//   hordeApi: localStorage.getItem('hordeApi') || '0000000000'
})

const mutations = {
//   createStory(state, options) {
//     console.log(state, options)
//     let story = new Story(options)
//     console.log('STORY', story)
//     state.story = story
//     state.stories.push(story)
//   },
//   incrementLevel(state) {
//     state.level = state.level + 1
//     console.log(state.level)
//   },
//   setConfig(state, c) {
//     state.config = c
//   },
//   showMenu(state, v) {
//     state.showMenu = v
//   },
//   setReading(state, story) {
//     state.reading = story
//   },
//   setShowConfig(state, value) {
//     state.showConfig = value
//     console.log(this.setShowConfig)
//   },
//   changeApi(state, api) {
//     localStorage.setItem('hordeApi', api)
//     state.hordeApi = api
//   }
}

const actions = {
//   async publishStory(context, storyName) {
//     let { story, images } = context.state.story.getClean(storyName)
//     console.log('Published Story', story)
//     console.log(images)

//     context.dispatch('firestore/publishStory', story, { root: true })
//     context.dispatch(
//       'firestore/publishImages',
//       { images: images, story_id: story.id },
//       { root: true }
//     )
//   },
//   async newUserMessage(context, userMessage) {
//     context.state.story.onNewUserMessage(userMessage)
//     await context.dispatch('getCompletion', context.state.story)
//   },
//   async getCompletion(context, story) {
//     story.hordeApiKey = context.state.hordeApi
//     console.log(context.state, story)
//     let completion = await context.state.hordeClient.getCompletion(story)
//     console.log('completion', completion)
//   }
  // async newDoc(context){
  //   let doc = Automerge.init()
  //   context.commit('setDoc', doc)
  // },
  // addItem(context, text) {
  //   console.log(context.state.doc)
  //   let newDoc = Automerge.change(context.state.doc, doc => {
  //     if (!doc.items) doc.items = []
  //     doc.items.push({ text, done: false })
  //   })
  //   context.commit('updateDoc', newDoc)
  // }
}

export default {
  namespaced: true,
  state,
  actions,
  mutations
}

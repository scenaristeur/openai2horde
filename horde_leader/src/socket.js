// https://socket.io/fr/how-to/use-with-vue

import { reactive } from 'vue'
import { io } from 'socket.io-client'

export const state = reactive({
  connected: false,
  scribes: [],
  actifs:[],
  fooEvents: [],
  barEvents: []
})

// "undefined" means the URL will be computed from the `window.location` object
//const URL = process.env.NODE_ENV === "production" ? undefined : "http://localhost:3000";
const URL = 'http://localhost:5678'

export const socket = io(URL)

socket.on('connect', () => {
  state.connected = true
})

socket.on('disconnect', () => {
  state.connected = false
})
socket.on('scribes', (scribes) => {
  console.log(scribes)
  state.scribes = scribes
})

socket.on('selected', (actifs) => {
  console.log(actifs)
  state.actifs = actifs
})

socket.on('foo', (...args) => {
  state.fooEvents.push(args)
})

socket.on('bar', (...args) => {
  state.barEvents.push(args)
})

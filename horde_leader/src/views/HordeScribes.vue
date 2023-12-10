<template>
    <div>
        connected : {{  connected }}
        {{  scribes }}
        <v-list lines="one">
            <v-list-item
              v-for="n in 3"
              :key="n"
              :title="'Item ' + n"
              subtitle="Lorem ipsum dolor sit amet consectetur adipisicing elit"
              prepend-avatar="https://randomuser.me/api/portraits/women/8.jpg"
            ></v-list-item>
          </v-list>
    </div>
</template>

<script>
import { state } from "@/socket";
    export default {
        name: "HordeScribes",
        computed: {
        scribes() {
            return state.scribes;
        },
        connected() {
            return state.connected;
        }
    }

    }
</script>

<style scoped>

</style>
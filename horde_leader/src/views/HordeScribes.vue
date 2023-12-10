<template>
    <div>
        connected : {{ connected }}, {{ actifs.length }} / {{ scribes.length }} scribes
        <div> <a href="https://aqualxx.github.io/stable-ui/workers" taget="blank">More on models</a></div>

        <v-data-table :items="scribes" :headers="headers" v-model="selected" item-value="models[0]" show-select>
            <template v-slot:selected="{ item }">
                <v-checkbox v-model="item.exclusive" readonly></v-checkbox>
            </template>

        </v-data-table>
        selected : {{ selected }}<br>
        actifs: {{  actifs }}

        <v-list lines="one">
            <v-list-item v-for="scribe in scribes" :key="scribe.name" :title="scribe.name"
                subtitle="Lorem ipsum dolor sit amet consectetur adipisicing elit"
                prepend-avatar="https://randomuser.me/api/portraits/women/8.jpg">
                {{ scribe }}
            </v-list-item>
        </v-list>
    </div>
</template>

<script>
import { socket, state } from "@/socket";
export default {
    name: "HordeScribes",
    data() {
        return {
            selected: [],
            headers: [
                //   {
                //     title: 'Dessert (100g serving)',
                //     align: 'start',
                //     sortable: false,
                //     key: 'name',
                //   },
                { title: 'Name', key: 'name' },
                {
                    title: 'models', key: 'models',
                    value: item => `${item.models[0]}`
                },
                { title: 'online', key: 'online' },
                { title: 'performance', key: 'performance' },
                { title: 'max_context_length', key: 'max_context_length' },
                { title: 'max_length', key: 'max_length' },
            ],
        }
    },
    watch: {
        selected() {
            console.log(this.selected)
            socket.emit('selected', this.selected)
        },
        actifs() {
            console.log(this.actifs)
            socket.emit('actifs', this.actifs)
            JSON.stringify(this.selected) != JSON.stringify(this.actifs) ? this.selected = this.actifs : ""
        }
    },
    computed: {
        scribes() {
            return state.scribes;
        },
        connected() {
            return state.connected;
        },
        actifs() {
            return state.actifs;
        }
    }

}
</script>

<style>
.v-selection-control__input input {
    opacity: 0.5 !important;

}
</style>
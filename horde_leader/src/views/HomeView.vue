

<template>
  <main>
    <HordeScribes />
    <!-- <TheWelcome /> -->
  </main>
</template>
<script>
// import TheWelcome from '@/components/TheWelcome.vue'
import HordeScribes from '@/views/HordeScribes.vue';


export default {
    name: "MainView",
    components: { HordeScribes
      // , TheWelcome 
    }
}


</script>

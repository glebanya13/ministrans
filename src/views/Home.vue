<template>
  <div>
    <section>
      <v-parallax :src="require('../assets/sky.jpg')" height="450">
        <v-layout column align-center justify-center class="white--text">
          <h1 class="white--text mb-2 display-2 text-xs-center">Ministrans</h1>
        </v-layout>
      </v-parallax>
    </section>

    <section>
      <v-layout column wrap class="my-2" aligh-center>
        <v-flex xs12 sm4 class="my-3">
          <v-container grid-list-xl>
            <news></news>
          </v-container>
        </v-flex>
      </v-layout>
    </section>

    
  </div>
</template>

<script>
import news from '../components/News.vue'
export default {
  name: "home",
  components: {news},
  methods:{
    
  }
};
</script>

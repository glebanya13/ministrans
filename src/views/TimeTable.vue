<template>
  <div class="small">
    <canvas ref="canvas">
    </canvas>
    <v-btn @click="ex()"></v-btn>
  </div>
</template>

<script>
import { HorizontalBar } from "vue-chartjs";

export default {
  extends: HorizontalBar,
  data(){
    return {
      chartdata: {
      datasets: [{
         labels: ['asd', 'adsad', 'dasdass'],
         data: this.userDate,
         backgroundColor: ["#73BFB8", "#73BFB8", "#73BFB8", "#73BFB8", "#73BFB8", "#73BFB8", "#73BFB8"], 
      }]
    },
    }
  },
  computed: {
    marks(){
      return this.$store.getters.marks
    },
    userDate(){
      return this.marks.forEach(mark => {
        return mark.date
      })
    }
  },
  methods:{
    ex(){
      console.log(this.userDate)
    }
  },
  mounted() {
    this.renderChart(this.chartdata);
  },
};
</script>

<style>
.small {
    max-width: 600px;
    margin:  150px auto;
  }
</style>
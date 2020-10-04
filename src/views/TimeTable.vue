<template>
  <div class="small">
    <canvas ref="canvas">
    </canvas>
    <v-btn @click="userDate()">Проверка...</v-btn>
  </div>
</template>

<script>
import { HorizontalBar } from "vue-chartjs"
// import Vue from 'vue'

export default {
  extends: HorizontalBar,
  data(){
    return {
      chartdata: {
         labels: this.userName,
      datasets: [{
        label: 'График посещения',
         data: ['5'],
         backgroundColor: ["#73BFB8", "#73BFB8", "#73BFB8", "#73BFB8", "#73BFB8"], 
      }]
    },
    }
  },
  computed: {
    marks(){
      return this.$store.getters.marks
    },
    users(){
      return this.$store.getters.users
    },
    // userName(){
      // let userName = this.marks.map(mark =>{ 
      //   return mark.name
      // })
      // let userId = this.marks.map(mark => {
      //   return mark.uid
      // })
      // let names = this.marks.filter()

      // let map = new Map([
      //   [userId, userName]
      // ])

      // return names
    // },
    userDates(){
      let userDate = this.marks.map(mark => {
        return mark.date
      })
      return userDate
    }
  },
  methods:{
    userDate(){
      console.log(this.userName)
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
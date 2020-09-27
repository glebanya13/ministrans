<template>
<div>
  <v-flex>
    <check-form></check-form>
  </v-flex>
  <v-flex>
      <last-day></last-day>
  </v-flex>
</div>
</template>

<script>
import checkForm from '../components/CheckInForm'
import lastDay from '../components/CheckInLastDays'

export default {
  components:{
    checkForm,
    lastDay
  },
  computed:{
    
  },
  methods: {
  //   checkin(entity) {
  //     let userMarks = this.$store.getters.marks
  //     let markAdded = userMarks[entity.key]
  //     console.log(markAdded)
  //     if (Object.keys(userMarks).length > 4) {
  //           this.snackbar = true
  //           this.snackbarText = "Вы уже добавили слишком много слов для изучения"
  //       } 
  //     if(markAdded){
  //       this.snackbar = true
  //       this.snackbarText = 'Вы уже отметились в этот день'
  //     }
  //     else{
  //       this.$store.dispatch("CHECK_IN", {
  //       date: this.date,
  //       time: this.time,
  //       isSunday: this.isSunday,
  //       entity
  //     });
  //     this.dialog = false
  //     this.snackbar = true
  //     this.snackbarText = "Поздравляем, вы отметились!"
  //   }
  // },
 
    
  },
 
}
</script>

<style>

</style>
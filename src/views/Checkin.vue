<template>
  <div>
    <v-flex>
      <check-in-form></check-in-form>
    </v-flex>
    <v-flex>
      <last-day></last-day>
    </v-flex>
  </div>
</template>

<script>
import checkInForm from "../components/CheckInForm";
import lastDay from "../components/CheckInLastDays";

export default {
  components: {
    checkInForm,
    lastDay,
  },
};
</script>

<style>
</style>
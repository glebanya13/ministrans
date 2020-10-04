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
import checkForm from "../components/CheckInForm";
import lastDay from "../components/CheckInLastDays";

export default {
  components: {
    checkForm,
    lastDay,
  },
};
</script>

<style>
</style>
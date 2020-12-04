<template>
  <div>
    <v-flex>
      <v-tabs v-model="tab" fixed-tabs>
        <v-tab :key="'church'" ripple> Имша </v-tab>
        <v-tab :key="'meet'"> Встреча </v-tab>
        <v-tab-item :key="'church'">
          <check-in-form :tab="tab"></check-in-form>
          <last-day :tab="tab"></last-day>
        </v-tab-item>
        <v-tab-item :key="'meet'">
          <check-in-form :tab="tab"></check-in-form>
          <last-day :tab="tab"></last-day>
        </v-tab-item>
      </v-tabs>
    </v-flex>
  </div>
</template>

<script>
import checkInForm from "../components/CheckInForm";
import lastDay from "../components/CheckInLastDays";

export default {
  data() {
    return {
      tab: "church",
    };
  },
  components: {
    checkInForm,
    lastDay,
  },
};
</script>

<style>
</style>
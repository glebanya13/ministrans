<template>
  <div>
    <v-footer :fixed="true" app>
      <span> <v-icon>mdi-heart</v-icon> Ministrants &copy;2020 (v 1.2)</span>
     <message-wall></message-wall>
    </v-footer>
  </div>
</template>

<script>
import MessageWall from "./MessageWall";

export default {
  components: {
    MessageWall,
  }
};
</script>

<style>
</style>
<template>
  <div>
    <v-footer :fixed="true" app>
      <span> <v-icon>mdi-heart</v-icon> Ministrans &copy;2020 </span>
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
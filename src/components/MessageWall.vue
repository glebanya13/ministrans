<template>
    <div>
         <v-snackbar v-model="errorSnackbar" :timeout="timeout" color="error">
        {{ errorText }}
        <template v-slot:action="{ attrs }">
          <v-btn  text v-bind="attrs" @click="errorSnackbar = false">
            <v-icon left>mdi-close</v-icon>
          </v-btn>
        </template>
      </v-snackbar>
      <v-snackbar v-model="messageSnackbar" :timeout="timeout" color="warning">
        {{ messageText }}
        <template v-slot:action="{ attrs }">
          <v-btn  text v-bind="attrs" @click="messageSnackbar = false">
            <v-icon left>mdi-close</v-icon>
          </v-btn>
        </template>
      </v-snackbar>
    </div>
</template>
<script>
import messages from "@/utils/messages.js";
export default {
  data: () => ({
    errorSnackbar: false,
    messageSnackbar: false,
    errorText: "",
    messageText: "",
    timeout: 4000,
  }),
  computed: {
    error() {
      return this.$store.getters.getError;
    },
    message() {
      return this.$store.getters.getMessage;
    },
  },
  watch: {
    error(e) {
      if (e) {
        //console.error(e);
        this.errorText = messages[e.code] || messages['default-error'];
        this.errorSnackbar = true;
      } else {
        this.errorSnackbar = false;
        this.errorText = ''
      }
    },
    message(msg) {
      if (msg) {
        console.log(msg);
        this.messageText = messages[msg] || msg;
        this.messageSnackbar = true;
      } else {
        this.messageSnackbar = false;
        this.messageText = '';
      }
    },
  },
};
</script>
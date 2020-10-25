<template>
 <v-container grid-list-md>
    <v-layout row wrap>
      <v-flex xs12 sm10 offset-sm-1>
        <v-form>
          <v-text-field label="Заглавие" outlined v-model="header" type="text"> </v-text-field>
          <v-text-field label="Дата публикации" outlined type="date" v-model="date"></v-text-field>
          <v-textarea solo name="input-7-4" label="Содержание" v-model="p1" type="text"> </v-textarea>
          <h3>Выберите фото для артикля:</h3>
          <input type="file" @change="onFileChanged" /> <br>
          <v-btn color="primary" class="float-right" @click="onUpload()">Готово</v-btn>
        </v-form>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import firebase from "firebase";

export default {
    data(){
        return {
            header: null,
            p1: null,
            imageData: null,
            picture: null,
            uploadValue: null,
            date: null,
        }
    },
    methods: {
    onFileChanged(event) {
      const file = event.target.files[0];
      this.uploadValue = 0;
      this.picture = null;
      this.imageData = file;
    },
    onUpload() {
      this.picture = null;
      const storageRef = firebase
        .storage()
        .ref(`/${'news'}/${this.imageData.name}`)
        .put(this.imageData);
      storageRef.on(
        "state_changed",
        (snapshot) => {
          this.uploadValue =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        },
        (error) => {
          console.log(error.message);
          this.SET_ERROR(error);
        },
        () => {
          this.uploadValue = 100;
          storageRef.snapshot.ref.getDownloadURL().then((url) => {
            this.picture = url;
            this.$store.dispatch("ADD_NEWS", { url: this.picture, header: this.header, p1: this.p1, date: this.date });
          });
        }
      ),
        (this.$router.push('/'));
    },
  },
}
</script>

<style>

</style>
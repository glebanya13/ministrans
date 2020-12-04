<template>
  <v-container grid-list-md>
    <v-layout row wrap>
      <v-flex xs12 sm10 offset-sm-1>
        <v-form>
          <v-text-field label="Заглавие" outlined v-model="header" type="text">
          </v-text-field>
          <v-text-field
            label="Дата публикации"
            outlined
            type="date"
            v-model="date"
          ></v-text-field>
          <v-textarea
            solo
            name="input-7-4"
            label="Содержание"
            v-model="p1"
            type="text"
          >
          </v-textarea>
          <h3>Выберите фото для артикля:</h3>
          <image-uploader
            :preview="false"
        :className="['fileinput', { 'fileinput--loaded': hasImage }]"
        capture="environment"
        :debug="1"
        doNotResize="gif"
        :autoRotate="true"
        outputFormat="file"
        @input="setImage"
          >
            <label for="fileInput" slot="upload-label">
          <figure>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="32"
              height="32"
              viewBox="0 0 32 32"
            >
              <path
                class="path1"
                d="M9.5 19c0 3.59 2.91 6.5 6.5 6.5s6.5-2.91 6.5-6.5-2.91-6.5-6.5-6.5-6.5 2.91-6.5 6.5zM30 8h-7c-0.5-2-1-4-3-4h-8c-2 0-2.5 2-3 4h-7c-1.1 0-2 0.9-2 2v18c0 1.1 0.9 2 2 2h28c1.1 0 2-0.9 2-2v-18c0-1.1-0.9-2-2-2zM16 27.875c-4.902 0-8.875-3.973-8.875-8.875s3.973-8.875 8.875-8.875c4.902 0 8.875 3.973 8.875 8.875s-3.973 8.875-8.875 8.875zM30 14h-4v-2h4v2z"
              ></path>
            </svg>
          </figure>
          <span class="upload-caption">{{
            hasImage ? "Replace" : "Click to upload"
          }}</span>
        </label>
          </image-uploader>
          <v-btn color="primary" class="float-right" @click="onUpload()"
            >Готово</v-btn
          >
        </v-form>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import ImageUploader from "vue-image-upload-resize";

export default {
  data() {
    return {
      header: null,
      p1: null,
      image: null,
      date: null,
      hasImage: false,
    };
  },
  methods: {
    setImage: function (output) {
      this.hasImage = true;
      let img = output;
      this.image = img;
    },
    onUpload() {
      console.log(this.image);
      this.$store.dispatch("ADD_NEWS", {
        header: this.header,
        p1: this.p1,
        date: this.date,
        image: this.image,
      });
    },
  },
  components: {
    ImageUploader,
  },
};
</script>

<style>
</style>
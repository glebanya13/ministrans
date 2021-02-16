<template>
  <div>
    <section>
      <v-parallax :src="require('../assets/1.jpg')" height="500">
        <v-layout column align-center justify-center class="white--text">
          <h1 class="white--text mb-2 display-2 text-xs-center">Ministrans</h1>
        </v-layout>
      </v-parallax>
    </section>

    <section>
      <v-container grid-list-xl>
        <v-layout row wrap class="my-2">
          <v-flex xs12 sm6 md6>
            <v-card class="elevation-0 transparent" width="900">
              <v-card-text>
                <v-carousel xs12 md4>
                  <v-carousel-item
                    style="cursor: pointer"
                    v-for="(image, i) in images"
                    :key="i"
                    :src="image.url"
                  >
                  </v-carousel-item>
                </v-carousel>
              </v-card-text>
            </v-card>
          </v-flex>
          <v-flex xs12 sm6 md6>
            <v-card class="elevation-0 transparent">
              <v-card-title class="text-center">Хвала Христу!</v-card-title>
              <v-card-text>
                <p>
                  Дорогие друзья, это сайт министрантов в Беларуси. Предлагаем
                  вам расширенный функционал, например отметка на службе/встрече
                  министрантов, график, расписание и много другое. Приятного
                  использования!
                </p>
                <v-img
                  src="https://cyril-methodius.de/images/minstr.jpg"
                  height="350"
                  width="450"
                  class="ml-16 hidden-sm-and-down"
                ></v-img>
                <!-- optimize for dark theme -->
                <v-img
                  src="https://cyril-methodius.de/images/minstr.jpg"
                  height="250"
                  width="350"
                  class="hidden-md-and-up"
                ></v-img>
              </v-card-text>
            </v-card>
          </v-flex>
        </v-layout>
      </v-container>
    </section>

    <section>
      <v-container grid-list-xl>
        <v-layout row wrap class="my-2">
          <v-flex xs12 sm6 md6>
            <v-card class="elevation-0 transparent">
              <v-card-title class="layout justify-center">
                <div class="headline mr-6">Техподдержка:</div>
              </v-card-title>
              <v-list class="transparent">
                <v-list-item>
                  <v-list-item-action class="ml-8">
                    <v-icon class="text-lighten-2">email</v-icon>
                    <v-icon class="text-lighten-2 mt-2">email</v-icon>
                  </v-list-item-action>
                  <v-list-item-content>
                    <v-list-item-title
                      >glebanya.com@gmail.com</v-list-item-title
                    >
                    <v-list-item-title class="mt-2"
                      >senddownrain@gmail.com</v-list-item-title
                    >
                  </v-list-item-content>
                </v-list-item>
              </v-list>
            </v-card>
          </v-flex>
          <v-flex xs12 sm4 md4>
            <v-card class="elevation-0 transparent">
              <v-card-title class="layout justify-center">
                <div class="headline mr-6">Помощь проекту</div>
              </v-card-title>
              <v-card-text>
                Если вам понравился данный продукт и вы хотели бы отблагодарить
                автора, то вы можете сделать это тут: <br /><br />
                <v-btn class="yellow darken-4 rounded-pill" small>Donate</v-btn>
              </v-card-text>
            </v-card>
          </v-flex>
        </v-layout>
      </v-container>
    </section>
  </div>
</template>

<script>
export default {
  name: "home",
  data() {
    return {
      images: [
        // send to production firebase storage
        {
          id: 1,
          url:
            "https://firebasestorage.googleapis.com/v0/b/ministrans-60ff9.appspot.com/o/images%2F1.jpg?alt=media&token=eff922d2-532b-4dd1-98eb-7be1edcc6dbf",
        },
        {
          id: 2,
          url:
            "https://firebasestorage.googleapis.com/v0/b/ministrans-60ff9.appspot.com/o/images%2F2.jpg?alt=media&token=25373de8-9bc1-4eb9-96c5-0670afad9c61",
        },
        {
          id: 3,
          url:
            "https://firebasestorage.googleapis.com/v0/b/ministrans-60ff9.appspot.com/o/images%2F3.jpg?alt=media&token=e46d8e55-e96b-44d9-b8ab-55f04de5f8ee",
        },
        {
          id: 4,
          url:
            "https://firebasestorage.googleapis.com/v0/b/ministrans-60ff9.appspot.com/o/images%2F4.jpg?alt=media&token=0a259ace-570b-4138-8a30-e90514b6c1d1",
        },
        {
          id: 5,
          url:
            "https://firebasestorage.googleapis.com/v0/b/ministrans-60ff9.appspot.com/o/images%2F5.jpg?alt=media&token=e8777e25-afff-4217-b151-d39a6fadb7e5",
        },
      ],
    };
  },
};
</script>
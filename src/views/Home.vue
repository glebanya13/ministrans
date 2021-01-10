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
    <v-btn
      v-scroll="onScroll"
      v-show="fab"
      fab
      dark
      fixed
      bottom
      right
      color="primary"
      @click="toTop"
    >
      <v-icon>keyboard_arrow_up</v-icon>
    </v-btn>
  </div>
</template>

<script>
export default {
  name: "home",
  data() {
    return {
      fab: false,
      images: [ // send to firebase storage
        {
          id: 1,
          url:
            "https://sun9-10.userapi.com/impf/c850724/v850724949/1d6f10/Gz2S5vaw-Y4.jpg?size=2560x1707&quality=96&proxy=1&sign=d98c07bd7a72bc81e7a4abec954c235c&type=album",
        },
        {
          id: 2,
          url:
            "https://sun9-24.userapi.com/impf/c850724/v850724949/1d6f38/3hbY0IGNiao.jpg?size=2560x1706&quality=96&proxy=1&sign=0642b073c8a092b8fd70cd63eef7bfd9&type=album",
        },
        {
          id: 3,
          url:
            "https://sun9-13.userapi.com/impf/WjDZU-0WppOoR5licN0MNjvCb86aNwgoAChWxQ/mpCsOfARNGs.jpg?size=2560x1707&quality=96&proxy=1&sign=c3f2cd326c3a3e0dfd967a15b19b237b&type=album",
        },
        {
          id: 4,
          url:
            "https://sun9-48.userapi.com/impf/c850732/v850732805/1007b2/hkq1Zz1TmTI.jpg?size=2560x1707&quality=96&proxy=1&sign=e2aa782888aafdaa912ab8dda8f1906a&type=album",
        },
        {
          id: 5,
          url:
            "https://sun9-71.userapi.com/impf/-YW28VhRzQekKSmgtofiBHHgaMuiNyKkoZ3dMA/Sc0Hpkr81EY.jpg?size=2560x1707&quality=96&proxy=1&sign=34ee3ccbb97455c85cd66cefec782234&type=album",
        },
      ],
    };
  },
  methods: {
    onScroll(e) {
      if (typeof window === "undefined") return;
      const top = window.pageYOffset || e.target.scrollTop || 0;
      this.fab = top > 20;
    },
    toTop() {
      this.$vuetify.goTo(0);
    },
  },
};
</script>
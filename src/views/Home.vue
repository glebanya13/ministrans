<template>
  <div>
    <section>
      <v-parallax :src="require('../assets/sky.jpg')" height="450">
        <v-layout column align-center justify-center class="white--text">
          <h1 class="white--text mb-2 display-2 text-xs-center">Ministrans</h1>
        </v-layout>
      </v-parallax>
    </section>

    <section>
      <v-layout column wrap class="my-2" aligh-center>
        <v-flex xs12 sm4 class="my-3">
          <div class="text-center">
            <h2 class="headline">Служи Богу с радостью!</h2>
          </div>
        </v-flex>
        <v-flex xs12>
          <v-container grid-list-xl>
            <v-layout row wrap align-center>
              <v-flex xs12 md4>
                <v-card class="elevation-0 transparent">
                  <v-card-text class="text-center">
                    <v-icon x-large class="blue--text text--lighten-2">mdi-christianity</v-icon>
                  </v-card-text>
                  <v-card-title primary-title class="layout justify-center">
                    <div class="headline text-xs-center">Министрант — это</div>
                  </v-card-title>
                  <v-card-text
                    class="layout justify-center"
                  >в латинском обряде Католической церкви мирянин (обычно юноша), прислуживающий священнику во время мессы и иных богослужений.</v-card-text>
                </v-card>
              </v-flex>
              <v-flex xs12 md4>
                <v-card class="elevation-0 transparent">
                  <v-card-text class="text-center">
                    <v-icon x-large class="blue--text text--lighten-2">mdi-text-box-multiple-outline</v-icon>
                  </v-card-text>
                  <v-card-title primary-title class="layout justify-center">
                    <div class="headline text-xs-center">Расписание</div>
                  </v-card-title>
                  <v-card-text
                    class="layout justify-center"
                  >Служи в костёле по своему раписанию, в любое записаное время. Или в любой день по твоему желанию.</v-card-text>
                </v-card>
              </v-flex>
              <v-flex xs12 md4>
                <v-card class="elevation-0 transparent">
                  <v-card-text class="text-center">
                    <v-icon x-large class="blue--text text--lighten-2">mdi-devices</v-icon>
                  </v-card-text>
                  <v-card-title primary-title class="layout justify-center">
                    <div class="headline text-xs-center">График на любом устройстве</div>
                  </v-card-title>
                  <v-card-text
                    class="layout justify-center"
                  >Этот веб-сайт оптимизирован для работы на любом устройстве, записывайся везде!</v-card-text>
                </v-card>
              </v-flex>
            </v-layout>
          </v-container>
        </v-flex>
      </v-layout>
    </section>

    <section>
      <v-card class="elevation-0 transparent">
        <v-card-title primary-title class="layout justify-center">
          <div class="headline">О проекте</div>
        </v-card-title>
        <v-card-text>Этот веб-сайт помогает министрантам. Здесь храниться график Имш, а также здесь можно отметиться.</v-card-text>
        <v-list class="transparent">
          <v-list-item>
            <v-list-item-action>
              <v-icon class="blue--text text-lighten-2">mdi-email</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title>glebanya.com@gmail.com</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-card>
    </section>
  </div>
</template>

<script>
export default {
  name: "home",
  components: {},
  methods:{
    
  }
};
</script>

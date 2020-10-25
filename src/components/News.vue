<template>
  <v-container fluid>
    <v-layout column>
<v-card class="mx-auto" width="700px" outlined v-for="article in news" :key="article.date">
            <v-card-text>
                <h1 class="text-center headline black--text">{{article.header}}</h1>
                <p class="float-right">Опубликовано {{article.date}}</p><br><br>
                <p style="text-align: justify;">
                <span style="font-size: medium;">
                    <v-img width="150px" height="150px" :src="article.url" style="margin: 5px 15px 15px 5px; float: left;" class="frame"></v-img>
                    {{article.p1}}
                </span>
                </p>
            </v-card-text>
        </v-card>
      
    </v-layout>
  </v-container>
</template>

<script>
export default {
    created(){
        this.$store.dispatch('LOAD_NEWS')
    },
    computed:{
         news(){
            return this.$store.getters.news
        },
    },
    methods:{
        
    },
};
</script>

<style scoped>
.frame {
    border-radius: 18px;
   }
</style>
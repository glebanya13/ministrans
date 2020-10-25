<template>
    <div>
        <v-card>
            <v-card-title>
                Министранты {{ministrantsCount}}
            </v-card-title>
            <schedule-for-users></schedule-for-users>
        </v-card>
    </div>
</template>
<script>

import { mapGetters } from "vuex";
import ScheduleForUsers from "@/components/ScheduleForUsers";
export default {
    components:{
        ScheduleForUsers
    },
    computed:{
        ...mapGetters(['users']),
    ministrantsCount(){
      return (this.users && this.users.length > 0) ? `(${this.users.filter(f => f.level != "Ксендз").length})` : ''
      //return (this.users && this.users.length != 0)  ? ` (${this.users.filter(u => !u.isPriest).length})` : ''
    }
    }
}
</script>
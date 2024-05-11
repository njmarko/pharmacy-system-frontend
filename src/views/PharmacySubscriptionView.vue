<template>
  <b-container class="subscription-container">
    <h1>My subscriptions</h1>
    <div v-if="pagePharmacy">
        <b-container>
            <b-row class="row-spacing" v-for="(row, rowI) in numRows" :key="rowI">
                <b-col
                v-bind:lg="cardWidth"
                sm="12"
                v-for="(pharmacy, index) in pagePharmacy.content.slice(
                    rowI * numCols,
                    rowI * numCols + numCols
                )"
                :key="index"
                >
                <PharmacySubscriptionCard :pharmacy="pharmacy"/>
                </b-col>
            </b-row>
        </b-container>
      <h1 v-if="pagePharmacy.empty">No subscriptions found.</h1>
      <b-pagination
        v-model="page"
        :total-rows="pagePharmacy.totalElements"
        :per-page="size"
        first-number
        last-number
        align="center"
        v-on:input="loadPage"
      ></b-pagination>
    </div>
    <h1 v-else>No subscriptions found.</h1>
  </b-container>
</template>

<script>
import patientService from "../service/PatientService"
import { mapGetters } from 'vuex'
import PharmacySubscriptionCard from "../components/pharmacy/PharmacySubscriptionCard"
import {eventBus} from "../util/eventBus"

export default {
    name: "PharmacySubscriptionView",
    components:{
        PharmacySubscriptionCard
    },
    data() {
        return {
            listType: "subscription",
            numCols: 3,
            numRows: 2,
            imgWidth: 253,
            imgHeight: 169,
            imgBlur: 0,
            page: 1,
            size: 8,
            cardWidth: 4,
            pagePharmacy: null,

        }
    },

    methods: {
        goToSpecifiedRoute(route) {
            this.$router.push(route);
        },
        getRoute: function (pharmacy) {
            return { name: "PharmacyHomePage", params: { id: pharmacy.id } };
        },
        ...mapGetters(["loggedUser"]),
        loadPage(){
            patientService.getSubscriptions(this.loggedUser().id)
                .then(response=>{
                    this.pagePharmacy = response.data;
                })

        },
    
    },
    mounted(){
        this.loadPage();
        eventBus.$on("SUBSCRIPTION_REMOVED", ()=>{
                this.loadPage();
        })
    
    }
}
</script>


<style scoped>
    .subscription-container{
        background: white;
    }
</style>
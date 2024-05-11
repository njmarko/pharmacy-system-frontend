<template>
  <b-container class="offer-container">
    <h1>Offers</h1>
    <div v-if="pageOffers">
    <b-container>
      <b-row class="mb-3 row-spacing">
        <b-col md="10">
          <b-form inline v-on:submit.prevent="onSearch">
           <div class="form-label-group">
                      <b-form-select
                        v-model="status"
                        id="status-input"
                        class="mr-2"
                        :options="statusOptions"
                      />
            <label for="status-input">Offer status</label>
           </div>
            <b-button type="submit" variant="primary">
              <b-icon-search></b-icon-search> Search</b-button
            >
          </b-form>
        </b-col>
       
      </b-row>
      <b-row class="row-spacing" v-for="(row, rowI) in numRows" :key="rowI">
        <b-col
          v-bind:lg="cardWidth"
          sm="12"
          v-for="(offer, index) in pageOffers.content.slice(
            rowI * numCols,
            rowI * numCols + numCols
          )"
          :key="index"
        >
          
          <OfferCard :offer="offer" :key="offer.id">
          </OfferCard>
        </b-col>
      </b-row>
    
      <h1 v-if="pageOffers.empty">No offers found.</h1>
      <b-pagination
        v-model="page"
        :total-rows="pageOffers.totalElements"
        :per-page="size"
        first-number
        last-number
        align="center"
        v-on:input="load"
      ></b-pagination>
     </b-container>
    </div>
    <h1 v-else>No offers found.</h1>
  </b-container>
</template>


<script>
import OfferCard from "./OfferCard"
import offerService from "../../service/OfferService"
import {mapGetters} from 'vuex'


export default {
    name: "OfferFilter",
    components: {
        OfferCard
    },
    data() {
        return {
            page: 1,
            size: 8,
            cardWidth: 3,
            numRows: 2,
            numCols: 4,
            pageOffers: null,
            status: null,
            statusOptions: [
                { value: null, text: "-"},
                { value: "ACCEPTED", text: "Accepted"},
                { value: "PENDING", text: "Pending"},
                { value: "REJECTED", text: "Rejected"}
            ]
        }
    },
    mounted(){
        this.load();
    }   
    ,
    methods: {
        load(){
            offerService.getOffers(this.loggedUser().id, this.status)
                .then(response=>{
                    this.pageOffers = response.data;
                })
        },
        onSearch(){
            this.page = 1;
            this.load();
        },
        ...mapGetters(["loggedUser"])
    }
}
</script>

<style scoped>
    .offer-container{
        background: white;
    }
    .row-spacing {
        margin-top: 15px;
        margin-bottom: 15px;
    }
</style>
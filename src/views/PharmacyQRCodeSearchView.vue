<template>
  <b-container class="offer-container">
    <h1>QR Code search</h1>
    <div>
    <b-container>
      <b-row class="mb-3 row-spacing">
        <b-col md="10">
          <b-form inline v-on:submit.prevent="onSearch" v-if="!mozillaUsed">
           <div class="form-label-group" >
                <qrcode-capture id="qr-code" @decode="onDecode"></qrcode-capture>
                <label for="qr-code">Choose qr code</label> 
           </div>
                    
           <div class="form-label-group">
               <b-form-select
                        v-model="sortCriteria"
                        id="status-input"
                        class="mr-2"
                        :options="sortCriteriaOptions"
                      />
            <label for="status-input">Sorting criteria</label>
           </div>
           <div class="form-label-group">
                    <b-form-select
                        v-model="sortDirection"
                        id="status-input"
                        class="mr-2"
                        :options="sortDirectionOptions"
                      />
            <label for="status-input">Sorting direction</label>
           </div>
            <b-button type="submit" variant="primary" :disabled="disabledSearch">
              <b-icon-search></b-icon-search> Search</b-button>
            
          </b-form>
          <h1 class="centered-header" v-else>This feature isn't supported on Mozilla Firefox.</h1>
        </b-col>
       
      </b-row>
      <div v-if="pageAvailable">
      <b-row class="row-spacing" v-for="(row, rowI) in numRows" :key="rowI" >
        <b-col
          v-bind:lg="cardWidth"
          sm="12"
          v-for="(pharmacy, index) in pagePharmacies.content.slice(
            rowI * numCols,
            rowI * numCols + numCols
          )"
          :key="index"
        >
          
          <PharmacyQRCodeSearchCard :pharmacy="pharmacy" :key="pharmacy.pharmacyId"/>
        </b-col>
      </b-row>
      </div>
      <h1 v-if="!results && !mozillaUsed">No pharmacies found.</h1>
      <b-pagination
        v-if="pageAvailable"
        v-model="page"
        :total-rows="pagePharmacies.totalElements"
        :per-page="size"
        first-number
        last-number
        align="center"
        v-on:input="load"
      ></b-pagination>
     </b-container>
    </div>
    <b-toast id="toast" title="Loading successful" toaster="b-toaster-top-center" variant="success">
        <table class="table">
            <tr><th>Id</th><th>Name</th><th>Amount</th><th>Therapy duration</th></tr>
            <tr v-for="(item, index) in this.messages" :key=index><td>{{item.id}}</td><td>{{item.name}}</td><td>{{item.amount}}</td><td>{{item.therapyDuration}}</td></tr>
        </table>
    </b-toast>
  </b-container>
</template>

<script>
import { QrcodeCapture } from 'vue-qrcode-reader'
import PharmacyQRCodeSearchCard from "../components/pharmacy/PharmacyQRCodeSearchCard"
import pharmacyService from "../service/PharmacyService"
import medicineService from "../service/MedicineService"
//import {makeToast} from "../util/makeToast"
import {eventBus} from "../util/eventBus"
import { makeToast } from '../util/makeToast'
import {mapGetters} from 'vuex'

export default {
    name: "PharmacyQRCodeSearchView",
    components: {
        QrcodeCapture,
        PharmacyQRCodeSearchCard
    },
    data() {
        return {
            page: 1,
            size: 8,
            sortCriteria: "pharmacyName",
            sortDirection: "asc",
            cardWidth: 3,
            numRows: 2,
            numCols: 4,
            payload: [],
            num: 0,
            message: '',
            messages: [],
            pagePharmacies: null,
            sortCriteriaOptions: [
                    { value: "pharmacyName", text: "Pharmacy name"},
                    { value: "totalStockPrice", text: "Total price"},
                    { value: "pharmacyAddress", text: "Pharmacy address"},
                    { value: "pharmacyAverageGrade", text: "Pharmacy average grade"}
                    ],
            sortDirectionOptions: [
                {value: "desc", text: "Descending"},
                {value: "asc", text: "Ascending"}
            ]
        }
    },
    computed: {
        pageAvailable(){
            if(this.pagePharmacies === null)
                return false;
            else if(this.pagePharmacies.empty)
                return false;
            else
                return true;
        },
        disabledSearch(){
            return this.payload.length === 0;
        },
        results(){
           if(this.payload.length === 0 || this.pagePharmacies === null)
                return false;
            else if(this.pagePharmacies !== null){
                if(this.pagePharmacies.content.length === 0)
                    return false;
                else
                    return true;
            }
            else
                return true;

            },
        mozillaUsed(){
                return navigator.userAgent.toLowerCase().indexOf('firefox') > -1;
            },
        ...mapGetters(["loggedUser"])
    },
    mounted(){
        eventBus.$on("CHECK-MESSAGE", ()=>{
            if(this.num === this.payload.length){
                this.$bvToast.show('toast');
            }
        })
    },
    methods: {
        load(){
            pharmacyService.qrCodeSearch(this.payload, this.sortDirection, this.sortCriteria, this.page - 1, this.size, this.loggedUser.id)
                .then(response=> {
                    this.pagePharmacies = response.data;
                })
                .catch(error=>{
                    if(error.response)
                        makeToast(this, "Error", error.response.data.message, "danger");
                })
        },
        onDecode(decodedString){
            //TODO: dodati ovdje provjeru da li je ovaj string u pravom formatu
            this.messages = [];
            this.num = 0;
            this.payload = JSON.parse(decodedString);
            this.payload.forEach((item)=>{
                    medicineService.getMedicineDetails(item.id)
                        .then(response=>{
                            this.num += 1;
                            this.messages.push({
                                id: response.data.id,
                                name: response.data.name,
                                amount: item.amount,
                                therapyDuration: item.therapyDays
                            })
                            eventBus.$emit("CHECK-MESSAGE");
                        })
            });

            

        },
        onSearch(){
            this.load();
        }
    }
    
}
</script>

<style scoped>
    .centered-header{
        margin-left: 10%;
    }
    .offer-container{
        background: white;
    }
    .row-spacing {
        margin-top: 15px;
        margin-bottom: 15px;
    }

    .loaded-medicine{
        margin-left: 2%;
    }
    
</style>
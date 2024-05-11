<template>
  <b-card
    no-body
    img-top
    title-variant="card-title"
    class="mb-2 h-100 option-card"
  >
    <b-card-header>
      <h3>Offer {{this.offer.id}}  <b-badge v-b-tooltip.hover
              title="Order id">{{this.offer.originalOrderId}}</b-badge></h3>
    </b-card-header>
    <b-card-body class="h-100 d-flex flex-column">
      <b-card-text>
        <p>
            <b-badge :variant="determineVariant">{{this.offer.status}}</b-badge>
            <br/>
          <strong>Delivery date: </strong><br />
          <span>{{ this.offer.deliveryDate | moment("DD.MM.YYYY. HH:mm")}}</span>
          <br />
          <strong>Total price: </strong><br />
          <span>{{ this.offer.totalPrice }}</span>
          <br />
          
        </p>
      </b-card-text>
    </b-card-body>
    <b-card-footer >
          <b-button :disabled="this.offer.status !== 'PENDING'" size="lg" variant="warning" class="mb-2"  @click="showEditModal" v-b-tooltip.hover
              title="Edit">
              <b-icon icon="pencil-square" aria-label="Help"></b-icon>
          </b-button>
    </b-card-footer>
    <b-modal
    :id="'modal-' + this.offer.id"
    :title="'Edit offer ' + this.offer.id"
    header-text-variant="light"
    header-bg-variant="primary"
    @ok="handleOk"
    >
      <b-row class="spacing">
          <b-col>
            <label for="amount-input">Enter offer cost</label>
          </b-col>
          
          <b-col>
            <label for="delivery-date">Choose delivery date</label>       
          </b-col>
          
      </b-row>
                              
      <b-row class="spacing">
          <b-col>
            <b-form-input 
              type="number" 
              v-model="newCost" 
              min="0"
              id="amount-input"
            />
          </b-col>

          <b-col>
            <date-picker
                type="datetime"
                :clearable="false"
                format="DD.MM.YYYY. HH:mm"
                v-model="deliveryDateAsDate"
            >
            </date-picker>
          </b-col>
       </b-row>
    </b-modal>
  </b-card>
</template>


<script>
import DatePicker from "vue2-datepicker";
import supplierService from "../../service/SupplierService"
import { mapGetters } from 'vuex'
import {makeToast} from "../../util/makeToast"

export default {
    name: "OfferCard",
    props: ["offer"],
    components:{
      DatePicker
    },
    data() {
        return {
            deliveryDateAsDate: null,
            newCost: 0
        }
    },

    mounted(){
        let utcmili = Date.parse(this.offer.deliveryDate);
        this.deliveryDateAsDate = new Date(0);
        this.deliveryDateAsDate.setUTCMilliseconds(utcmili);
        this.newCost = this.offer.totalPrice;
    },
    methods: {
        showEditModal(){
          this.$bvModal.show('modal-' + this.offer.id);
        },
        handleOk(bvModalEvt){
            bvModalEvt.preventDefault();
            var tzoffset = (new Date()).getTimezoneOffset() * 60000; //offset in milliseconds
            var localISOTime = (new Date(this.deliveryDateAsDate - tzoffset)).toISOString().slice(0, -1);
            supplierService.updateOffer(this.loggedUser().id, this.offer.id, {
              deliveryDate: localISOTime,
              totalCost: this.newCost
            })
              .then(response=>{
                  makeToast(this, "Update successful", `Offer with id ${response.data.id} updated successfully.`, "success");
                  this.$bvModal.hide('modal-' + this.offer.id);
                  this.offer.deliveryDate = localISOTime;
                  this.offer.totalPrice = this.newCost;

              })
              .catch(error=>{
                if(error.response)
                    makeToast(this, "Error", error.response.data.message, "danger");
                else
                  makeToast(this, "Error", "An error occured.", "danger");
              })
        },
        ...mapGetters(["loggedUser"])
    },
    computed: {
        determineVariant(){
            if(this.offer.status === "ACCEPTED")
                return "success";
            else if(this.offer.status === "PENDING")
                return "warning";
            else
                return "danger";
        }
    }
}
</script>

<style scoped>
.option-card:hover {
  box-shadow: #0000005e 0 12px 26px;
  transform: translate(0px, -10px);
}
.option-card {
  transition: 0.5s ease all;
  border-radius: 1.5em;
  background: #eee;
  margin-bottom: 5px;
}
</style>
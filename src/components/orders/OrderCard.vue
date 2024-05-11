<template>
  <b-card
    no-body
    img-top
    title-variant="card-title"
    class="mb-2 h-100 option-card"
    :title="this.order.pharmacyName"
  >
    <b-card-header>
      <h3>{{order.pharmacyName}}  <b-badge v-b-tooltip.hover
              title="Order id">{{this.order.id}}</b-badge></h3>
    </b-card-header>
    <b-card-body class="h-100 d-flex flex-column">
      <b-card-text>
        <p>
          <strong>Due date: </strong><br />
          <span>{{ this.order.dueDate | moment("DD.MM.YYYY. HH:mm")}}</span>
          <br />
          <strong>Number of items: </strong><br />
          <span>{{ this.order.numOfMedicines }}</span>
          <br />
          
        </p>
      </b-card-text>
    </b-card-body>
    <b-card-footer>
          <b-button size="lg" variant="primary" class="mb-2"  @click="showModal" v-b-tooltip.hover
              title="See details">
              <b-icon icon="question-circle-fill" aria-label="Help"></b-icon>
          </b-button>
    </b-card-footer>
    <b-modal 
      :id="'modal-' + this.order.id"
      :title="'Details for order ' + this.order.id"
       hide-footer
       header-text-variant="light"
       header-bg-variant="primary"
       scrollable
       class="order-modal"
       >
        <div v-if="orderDetails">
              <h3>{{orderDetails.pharmacyName}} <b-badge v-b-tooltip.hover title="Made by">{{orderDetails.pharmacyAdmin}}</b-badge></h3>
              <hr/>
                 <p> {{this.orderDetails.dueDate | moment("DD.MM.YYYY. HH:mm")}} </p>

                 <div class="overflow-auto">
                   <b-table
                   id="item-table"
                   :items="orderDetails.orderItems"
                   :per-page="perPage"
                   :current-page="page"
                   :fields="fields"
                   small
                   striped
                   hover>
                    <template v-slot:cell(medicineName)="data">
                        <router-link :to="{name: 'MedicineDetailedView', params: {id: data.item.medicineId}}">{{data.item.medicineName}}</router-link>
                    </template>
                   </b-table>

                    <b-pagination
                      v-model="page"
                      :total-rows="rows"
                      :per-page="perPage"
                      aria-controls="item-table"
                      align="center">
                    </b-pagination>
                 </div>
 
                  <hr/>
                  <h4>Write offer</h4>
                  
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
                        v-model="payload.totalPrice" 
                        min="0"
                        id="amount-input"
                        />
                    </b-col>

                    <b-col>
                      <date-picker
                          type="datetime"
                          :clearable="false"
                          format="DD.MM.YYYY. HH:mm"
                          v-model="payload.deliveryDate"
                    ></date-picker>
                    </b-col>
                  </b-row>
                  <b-button class="mt-3" block variant="primary" @click="createOffer">Create offer</b-button>
              
        </div>
        <div v-else>
          <div class="loading">
            <p>Loading...</p>
            <b-icon icon="arrow-counterclockwise" animation="spin-reverse" font-scale="4"></b-icon>
          </div>
        </div>
        <hr/>
      <b-button class="mt-3" block variant="danger" @click="hideModal">Close</b-button>
    </b-modal>
  </b-card>
</template>

<script>
import orderService from "../../service/OrderService"
import {mapGetters} from 'vuex'
import DatePicker from "vue2-datepicker";
import {makeToast} from "../../util/makeToast"

export default {
    name: "OrderCard",
    props: ['order'],
    components: {
      DatePicker
    },
    data() {
        return {
            fields: [
              {
                key: "medicineName",
                sortable: true
              },
              {
                key: "quantity",
                sortable: true
              }
            ],
            orderDetails: null,
            page: 1,
            perPage: 4,
            payload: {
              totalPrice: 0,
              deliveryDate: null,
            },
        }
    },
    
    methods: {
      showModal(){
          this.$bvModal.show('modal-' + this.order.id);

          if(this.orderDetails === null){
            orderService.getOrderDetails(this.order.id)
              .then(response=>{
                this.orderDetails = response.data;

              })
          }
          
      },
      createOffer(){
          if(this.payload.deliveryDate === null){
            makeToast(this, "Error", "Delivery date cannot be empty.", "danger")
          }
          else{
            var tzoffset = (new Date()).getTimezoneOffset() * 60000; //offset in milliseconds
            var localISOTime = (new Date(this.payload.deliveryDate - tzoffset)).toISOString().slice(0, -1);

            orderService.createOfferForOffer(this.order.id, {
              totalPrice: this.payload.totalPrice,
              deliveryDate: localISOTime,
              supplierId: this.loggedUser().id
            })
              .then(response=>{
                  makeToast(this, "Offer made", `Successfully made an offer.It is saved under id ${response.data.id}`, "success");
                  this.payload.totalPrice = 0;
                  this.payload.deliveryDate = null;
              })
              .catch(error=>{
                if(error.response)
                  makeToast(this, "Error", error.response.data.message, "danger");

              })
          }
      },
      hideModal(){
          this.$bvModal.hide('modal-' + this.order.id);

      },
      ...mapGetters(["loggedUser"]),

    },
    computed: {
      rows(){
        return this.orderDetails.orderItems.length;
      }
    }
}
</script>

<style scoped>
    .card-title {
  color: #002664;
}
    .scrollbar-custom {
      position: relative;
      height: 180px;
      overflow: auto;
    }
    .table-wrapper {
      display: block;
    }
  .spacing{
    margin-top: 0 !important;
    margin-bottom: 0 !important;
  }
  .loading{
    margin-left: 43%;
  }
  .order-modal{
    padding-bottom: 15px;
  }
.order-info{
  margin-left: 40%;
}
.option-card img {
  border-radius: 10%;
}
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
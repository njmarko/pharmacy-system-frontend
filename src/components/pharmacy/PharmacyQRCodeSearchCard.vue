<template>
  <b-card
    no-body
    img-top
    title-variant="card-title"
    class="mb-2 h-100 option-card"
    :title="this.pharmacy.pharmacyName"
  >
    <b-card-header>
      <h3>{{pharmacy.pharmacyName}} </h3>
    </b-card-header>
    <b-card-body class="h-100 d-flex flex-column">
      <b-card-text>
        <p>
          <strong>Address: </strong><br />
          <span>{{ this.pharmacy.pharmacyAddress }}</span>
          <br />
          <b-form-rating
            class="pharmacy-rating"
            v-model="pharmacy.pharmacyAverageGrade"
            readonly
            show-value
            show-value-max
            no-border
            variant="warning"
            precision="2"
            ></b-form-rating>
          <strong>Total price of items: </strong><br />
          <span>{{ this.pharmacy.totalStockPrice | round }}</span>
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
    :id="'modal-' + this.pharmacy.pharmacyId"
     hide-footer
     header-text-variant="light"
     header-bg-variant="primary"
     :title="'Search results for ' + this.pharmacy.pharmacyName"
     scrollable>
      <div v-if="this.pharmacy">
          <h3>{{pharmacy.pharmacyName}} <b-badge v-b-tooltip.hover title="Pharmacy id">{{pharmacy.pharmacyId}}</b-badge></h3>
          <b-form-rating
            class="pharmacy-rating"
            v-model="pharmacy.pharmacyAverageGrade"
            readonly
            show-value
            show-value-max
            no-border
            variant="warning"
            precision="2"
            ></b-form-rating>
          <p><strong>Address: </strong>{{pharmacy.pharmacyAddress}}</p>
          <p><strong>Total price: </strong>{{pharmacy.totalStockPrice}}</p>

            <div class="overflow-auto">
                   <b-table
                   id="item-table"
                   :items="pharmacy.medicineStock"
                   :per-page="perPage"
                   :current-page="page"
                   :fields="fields"
                   small
                   striped
                   hover>
                    <template v-slot:cell(total)="data">
                        <span>{{data.item.quantity  * data.item.medicinePrice | round}}</span>
                    </template>


                    <template v-slot:cell(name)="data">
                        <router-link :to="{name: 'MedicineDetailedView', params: {id: data.item.medicineId}}">{{data.item.medicineName}}</router-link>
                    </template>


                    <template v-slot:cell(price)="data">
                      <span>{{data.item.medicinePrice | round}}</span>
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
              <b-button class="mt-3" block variant="primary" @click="reserve">Reserve</b-button>


      </div>

    </b-modal>
  </b-card>
</template>


<script>
import patientService from "../../service/PatientService"
import {mapGetters} from 'vuex'
import {makeToast} from "../../util/makeToast"

export default {
    name: "PharmacyQRCodeSearchCard",
    props: ["pharmacy"],
    data() {
        return {
            page: 1,
            perPage: 4,
            fields: [
              {
                key: "name",
              },
              {
                key: "quantity",
              },
              {
                key: "price",
              },
              {
                key:"therapyDays",
              },
              {
                key:"Total",
                sortable: false
              }
            ],
        }
    },

    methods: {
        showModal(){
          this.$bvModal.show('modal-' + this.pharmacy.pharmacyId);
        },
        reserve(){
            let payload = {
              pharmacyId: this.pharmacy.pharmacyId,
              stocks: []
            };
            this.pharmacy.medicineStock.forEach((stock)=>{
                payload.stocks.push({
                  quantity: stock.quantity,
                  medicineId: stock.medicineId,
                  medicineName: stock.medicineName,
                  therapyDays: stock.therapyDays

                })
            })
            patientService.createRecipeReservation(this.loggedUser().id, payload)
              .then(response=>{
                  makeToast(this, "Reservation successfull", `Created recipe with id ${response.data.recipeId}.`, "success")
              })
              .catch(error=>{
                if(error.response){
                  makeToast(this, "Error", error.response.data.message, "danger");
                }
                else{
                  makeToast(this, "Error", "An error occured.", "danger");
                }
              })
        },
        ...mapGetters(["loggedUser"])
    },
    computed: {
      rows(){
        return this.pharmacy.medicineStock.length;
      }
    },
    filters: {
      round(num) {
        var m = Number((Math.abs(num) * 100).toPrecision(15));
        return Math.round(m) / 100 * Math.sign(num);
}
    }
}
</script>

<style scoped>
.pharmacy-rating {
  background: transparent;
}
    .card-title {
  color: #002664;
}

  .spacing{
    margin-top: 0 !important;
    margin-bottom: 0 !important;
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

.address{
  margin-left: 10%;
}
</style>
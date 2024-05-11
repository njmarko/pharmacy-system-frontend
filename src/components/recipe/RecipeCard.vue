<template>
  <b-card
    no-body
    img-top
    title-variant="card-title"
    class="mb-2 h-100 option-card"
    :title="'Recipe ' + this.recipe.id"
  >
    <b-card-header>
      <h3>Recipe <b-badge v-b-tooltip.hover
              title="Recipe id">{{this.recipe.recipeId}}</b-badge></h3>
    </b-card-header>
    <b-card-body class="h-100 d-flex flex-column">
      <b-card-text>
        <p>
          <strong>Reservation date: </strong><br />
          <span>{{ this.recipe.reservationDate | moment("DD.MM.YYYY. HH:mm")}}</span>
          <br />

          <strong>Total item price: </strong> <br/>
          <span>{{this.recipe.totalPrice}}</span> <br/>

          <strong>Reserved at: </strong> <br/>
          <span><router-link :to="{name: 'PharmacyHomePage', params: {id: this.recipe.pharmacyId}}">{{this.recipe.pharmacyName}}</router-link></span>

          
        </p>
          
      </b-card-text>
    </b-card-body>
    <b-card-footer>
          <b-button variant="primary" class="mb-2"  @click="showRecipeModal" v-b-tooltip.hover
              title="See recipe details">
              <b-icon icon="question-circle-fill" aria-label="Help"></b-icon>
          </b-button>

    </b-card-footer>
    <b-modal 
    :id="'modal-recipe-' + this.recipe.recipeId"
     hide-footer
     header-text-variant="light"
     header-bg-variant="primary"
     :title="'Details for recipe ' + this.recipe.recipeId"
     scrollable>
      <div v-if="this.recipe">
          

            <b-row class="margin-row">
                <b-col class="col-lg-4 col-md-6 col-sm-6 col-6 text-center">
                    <strong>Reservation date: </strong><br />
                    <span>{{ this.recipe.reservationDate | moment("DD.MM.YYYY. HH:mm")}}</span>

                </b-col>

                <b-col class="col-lg-4 col-md-6 col-sm-6 col-6 text-center">
                    <strong>Reserved at: </strong> <br/>
                    <span><router-link :to="{name: 'PharmacyHomePage', params: {id: this.recipe.pharmacyId}}">{{this.recipe.pharmacyName}}</router-link></span>

                </b-col>

                <b-col class="col-lg-4 col-md-6 col-sm-6 col-6 text-center">
                   <strong>Total item price: </strong> <br/>
                    <span>{{this.recipe.totalPrice}}</span> <br/>
                </b-col>
            </b-row>
            

            <div class="overflow-auto">
                   <b-table
                   id="item-table"
                   :items="recipeItems"
                   :per-page="perPage"
                   :current-page="page"
                   :fields="fields"
                   small
                   striped
                   hover>
                   <template v-slot:cell(total)="data">
                        <span>{{data.item.price * data.item.quantity}}</span>
                    </template>


                    <template v-slot:cell(name)="data">
                        <router-link :to="{name: 'MedicineDetailedView', params: {id: data.item.medicineId}}">{{data.item.medicineName}}</router-link>
                    </template>


                    <template v-slot:cell(price)="data">
                      <span>{{data.item.price}}</span>
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
              <b-button class="mt-3" block variant="primary" @click="hideRecipeModal">Close</b-button>


      </div>

    </b-modal>
  </b-card>
</template>

<script>
import patientService from "../../service/PatientService"


export default {
    name: "RecipeCard",
    props: ["recipe"],
    data() {
        return {
            recipeItems: [],
            page: 1,
            perPage: 4,
            fields: [
                {
                    key: "name"
                },
                {
                    key: "quantity"
                },
                {
                    key: "price",
                },
                {
                    key: "therapyDays"
                },
                {
                    key: "total"
                }
            ]
        }
    },
    methods: {
        showRecipeModal(){
            patientService.getRecipeMedicine(this.recipe.recipeId)
                .then(response=>{
                    this.recipeItems = response.data;
                })

            this.$bvModal.show("modal-recipe-" + this.recipe.recipeId);
        },
        hideRecipeModal(){
            this.$bvModal.hide("modal-recipe-" + this.recipe.recipeId);

        }
    },
    computed: {
        rows(){
            return this.recipeItems.length;
        }
    }
}
</script>

<style scoped>
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

.margin-row{
    margin-bottom: 5%;
}
</style>
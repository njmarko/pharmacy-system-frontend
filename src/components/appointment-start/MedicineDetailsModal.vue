<template>
   <b-modal
      ref="medicineDetails"
      :header-bg-variant="headerBgVariant"
      :header-text-variant="headerTextVariant"
      :body-bg-variant="bodyBgVariant"
      :body-text-variant="bodyTextVariant"
      ok-only ok-variant="secondary" ok-title="Close"
    >
     <template #modal-header>
         <div class="mx-auto">
          <h3>{{medicineToDisplay.name}}</h3>
         </div>
      </template>
      <b-container fluid v-if="medicineToDisplay">
        <b-row>
          <b-col class="text-center">
            Manufacturer: <br/> <strong>{{medicineToDisplay.manufacturer}}</strong>
          </b-col>
        </b-row>
        <hr/>
        <b-row>
          <b-col class="col-lg-6 col-md-6 col-sm-6 col-6 text-center">
            Type: <br/> <strong>{{medicineToDisplay.medicineType | capitalize}}</strong>
          </b-col>
          <b-col class="col-lg-6 col-md-6 col-sm-6 col-6 text-center">
            Shape: <br/>  <strong>{{medicineToDisplay.medicineShape | capitalize}}</strong>
          </b-col>
        </b-row>
        <hr/>
        <b-row>
          <b-col class="col-lg-6 col-md-6 col-sm-6 col-6 text-center">
            Points: <br/> <strong>{{medicineToDisplay.points}}</strong>
          </b-col>
          <b-col class="col-lg-6 col-md-6 col-sm-6 col-6 text-center">
            Price: <br/>  <strong>{{medicineToDisplay.currentPrice}} RSD</strong>
          </b-col>
        </b-row>
        <hr/>
        <b-row>
          <b-col class="col-lg-6 col-md-6 col-sm-6 col-6 text-center">
            Composition: <br/> <strong>{{medicineToDisplay.composition}}</strong>
          </b-col>
          <b-col class="col-lg-6 col-md-6 col-sm-6 col-6 text-center">
            Issue on recipe: <br/>  <strong>{{ medicineToDisplay.issueOnRecipe | formatOutput }}</strong>
          </b-col>
        </b-row>
        <hr/>
        <b-row>
          <b-col>
            <b-form-textarea
              id="textarea"
              v-model="medicineToDisplay.additionalNotes"
              :disabled="true"
              rows="4"
              max-rows="6"
            ></b-form-textarea>
          </b-col>
        </b-row>
        <br/>
        <b-row>
          <b-col class="text-center">
            <star-rating
              :read-only="true"
              :inline="true"
              :increment="0.01"
              :star-size="25"
              :rating="medicineToDisplay.medicineAverageGrade"
              :show-rating="false"
            />
          </b-col>
        </b-row>
      </b-container>
    </b-modal>
</template>

<script>
import StarRating from "vue-star-rating";

export default {
  props: ["medicineToDisplay"],
  name: "MedicineDetailsModal",
  components: {
    StarRating
  },
  data: function() {
      return {
        variants: ['primary', 'secondary', 'success', 'warning', 'danger', 'info', 'light', 'dark'],
        headerBgVariant: 'dark',
        headerTextVariant: 'light',
        bodyBgVariant: 'light',
        bodyTextVariant: 'dark',
      };
  },
  filters: {
    capitalize(value){
        return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
    },
    formatOutput(value){
    if(value)
        return "Recipe isn't needed";
    else
        return "Recipe is required"
    }
  },
  methods: {
      show() {
        this.$refs.medicineDetails.show();
      },
      close() {
        this.$refs.medicineDetails.hide();
      }
  }
};
</script>

<style scoped>
</style>
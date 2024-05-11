<template>
  <b-container>
    <b-card v-if="medicine !== null" class="medicine-details-card">
      <b-row class="no-gutter">
        <b-col cols="12">
          <h1>{{ this.medicine.name }}</h1>
          <hr />
          <b-list-group flush>
            <b-list-group-item>
              <strong>Medicine type: </strong>
              {{ this.medicine.medicineType | capitalize }}
            </b-list-group-item>
            <b-list-group-item>
              <strong>Manufacturer:</strong>
              {{ this.medicine.medicineManufacturer }}
            </b-list-group-item>
            <b-list-group-item>
              <strong>Rating:</strong>
              <star-rating
                :read-only="true"
                :inline="true"
                :increment="0.01"
                :star-size="20"
                v-bind:rating="this.medicine.medicineAverageGrade"
              />
              / 5
            </b-list-group-item>
            <b-list-group-item>
              <strong>Medicine shape:</strong>
              {{ this.medicine.medicineShape | capitalize }}
            </b-list-group-item>
            <b-list-group-item>
              <strong>Medicine composition: </strong>
              {{ this.medicine.medicineComposition }}
            </b-list-group-item>
            <b-list-group-item>
              <strong>Purchase info: </strong>
              {{ this.medicine.issueOnRecipe | formatOutput }}
            </b-list-group-item>
            <b-list-group-item>
              <strong>Points: </strong>
              {{ this.medicine.points }}
            </b-list-group-item>
            <b-list-group-item>
              <strong>Additional notes: </strong>
              {{ this.medicine.additionalNotes }}
            </b-list-group-item>
          </b-list-group>
        </b-col>
      </b-row>
    </b-card>

    <b-container>
      <div v-if="checkRegisteredUser">
        <div v-if="availableAtPage">
          <h1 v-if="availableAtPage.empty" class="availability-header">
            This drug is currently unavailable.
          </h1>
          <div v-else>
            <h1 class="availability-header">Available at:</h1>
            <b-row
              class="row-spacing"
              v-for="(row, rowI) in numRows"
              :key="rowI"
            >
              <b-col
                v-bind:lg="cardWidth"
                sm="12"
                v-for="(medicine, index) in availableAtPage.content.slice(
                  rowI * numCols,
                  rowI * numCols + numCols
                )"
                :key="index"
              >
                <MedicineReservationCard :medicine="medicine" :key="medicine.medicineId + '-' + medicine.pharmacyId" :discount="discount">
                </MedicineReservationCard>
              </b-col>
            </b-row>
            <b-pagination
              v-model="page"
              :total-rows="availableAtPage.totalElements"
              :per-page="size"
              first-number
              last-number
              align="center"
              v-on:input="loadPharmacies"
            ></b-pagination>
          </div>
        </div>
        <h1 v-else class="availability-header">
          This drug is currently unavailable.
        </h1>
      </div>
    </b-container>
  </b-container>
</template>


<script>
import medicineService from "../../service/MedicineService";
import StarRating from "vue-star-rating";
import { mapGetters } from "vuex";
import MedicineReservationCard from "./MedicineReservationCard";
import patientService from "../../service/PatientService"


export default {
  data() {
    return {
      medicine: null,
      availableAtPage: null,
      page: 1,
      size: 4,
      numRows: 1,
      numCols: 4,
      cardWidth: 3,
      discount: 0
    };
  },
  components: { StarRating, MedicineReservationCard },
  computed: {
    ...mapGetters(["loggedUser"]),

    checkRegisteredUser() {
      if (this.loggedUser.jwt) {
        if (this.loggedUser.authorities[0] === "ROLE_PATIENT") {
          return true;
        } else {
          return false;
        }
      } else {
        return false;
      }
    },
  },
  methods: {
    loadPharmacies() {
      medicineService
        .getPharmaciesForMedicine(this.medicine.id, this.page - 1, this.size)
        .then((response) => {
          this.availableAtPage = response.data;
        });
    },
  },
  mounted() {
    medicineService
      .getMedicineDetails(this.$route.params.id)
      .then((response) => {
        this.medicine = response.data;
        this.loadPharmacies();
        patientService.getCurrentPatientCategory(this.loggedUser.id)
        .then(response=>{
            this.discount = response.data.discount;
      })
      });
    
  },
  filters: {
    capitalize(value) {
      return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
    },
    formatOutput(value) {
      if (value) return "Recipe isn't needed";
      else return "Recipe is required";
    },
  },
};
</script>

<style scoped>
.availability-header {
  margin-top: 15px;
  background: white;
  border-radius: 5px;
}
.row-spacing {
  margin-top: 15px;
  margin-bottom: 15px;
}

.medicine-details-card {
  box-shadow: #0000005e 0 12px 26px;
  border-radius: 15px;
  margin-top: 5px;
}
</style>
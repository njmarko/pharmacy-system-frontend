<template>
  <b-card
    v-bind:title="this.pharmacyData.name"
    v-bind:img-src="image"
    img-alt="Image of pharmacy"
    img-top
    tag="article"
    class="mb-2 h-100 link-card"
    v-on:click="redirect"
  >
    <div v-if="this.userRole == 'Patient'" :key="refreshKey">
      <star-rating
        :read-only="false"
        :inline="true"
        :round-start-rating="false"
        :star-size="20"
        :rating="this.pharmacyData.averageGrade"
        :glow="10"
        :animate="true"
        :title="`Rate Pharmacy`"
        :fixed-points="2"
        @click.native.stop=""
        @rating-selected="ratePharmacy"
        @mouseleave="this.pharmacyData.averageGrade"
      />
      <div
        v-if="this.userRole == 'Patient' && this.pharmacyData.previousRating"
        style="margin-top: 10px; font-weight: bold"
      >
        You rated: {{ this.pharmacyData.previousRating }} stars
      </div>
      <div
        v-else-if="this.userRole == 'Patient'"
        style="margin-top: 10px; font-weight: bold"
      >
        You didn't rate yet
      </div>
    </div>
    <div v-else>
      <star-rating
        :read-only="true"
        :inline="true"
        :increment="0.01"
        :star-size="20"
        :fixed-points="2"
        :rating="this.pharmacyData.averageGrade"
      />
      <div
        v-if="this.userRole == 'Patient' && this.pharmacyData.previousRating"
        style="margin-top: 10px; font-weight: bold"
      >
        You rated: {{ this.pharmacyData.previousRating }} stars
      </div>
      <div
        v-else-if="this.userRole == 'Patient'"
        style="margin-top: 10px; font-weight: bold"
      >
        You didn't rate yet
      </div>
    </div>
    <p>
      <strong>Address:</strong>
      <span>{{ this.pharmacyAddress(pharmacy) }}</span>
    </p>
    <p>
      <strong>Appointment price: </strong>
      <span v-if="this.cardType != `goToAppointments`">
        <strong>Pharmacist: </strong>
        <span>{{ pharmacy.currentPharmacistAppointmentPrice }} RSD</span>
        <br />
      </span>

      <span v-if="this.cardType != `goToPharmacists`">
        <strong>Dermatologist: </strong>
        <span>{{ pharmacy.currentDermatologistAppointmentPrice }} RSD</span>
        <br />
      </span>
    </p>
    <b-card-footer v-if="this.cardType === 'subscription'">
      <b-button variant="danger">Unsubsribe</b-button>
    </b-card-footer>
  </b-card>
</template>

<script>
import { mapGetters } from "vuex";
import StarRating from "vue-star-rating";
import patientService from "../../service/PatientService";
import pharmacyService from "../../service/PharmacyService";
import { makeToast } from "../../util/makeToast";

export default {
  name: "PharmacyCard",
  components: {
    StarRating,
  },
  props: {
    pharmacy: Object,
    route: Object,
    image: String,
    cardType: {
      type: String,
      default: "goToPharmacy",
    },
  },
  data: function () {
    return {
      pharmacyData: this.pharmacy,
      refreshKey: 0,
    };
  },
  computed: {
    ...mapGetters(["userRole", "loggedUser"]),
  },
  mounted() {
    this.loadPreviousRating();
  },
  methods: {
    loadPreviousRating: function () {
      if (this.userRole == "Patient") {
        patientService
          .getPatientPharmacyRating(this.loggedUser.id, this.pharmacy.id)
          .then((response) => {
            this.pharmacyData.previousRating = response.data.rating;
            this.refreshKey++;
            return response.data.rating;
          });
        return null;
      }
    },
    redirect: function () {
      this.$router.push(this.route);
    },
    pharmacyAddress(pharmacy) {
      return `${pharmacy.street} ${pharmacy.streetNumber}, ${pharmacy.city}, ${pharmacy.zipCode}, ${pharmacy.country}`;
    },
    ratePharmacy: function (rating) {
      patientService
        .ratePharmacy(
          this.loggedUser.id,
          this.pharmacyData.id,
          Math.round(rating)
        )
        .then((response) => {
          makeToast(this, "Success", response.data.message, "success");
          this.loadData();
        })
        .catch((error) => {
          if (error.response)
            makeToast(this, "Error", error.response.data.message, "danger");
          this.loadData();
        });
    },
    loadData: function () {
      pharmacyService
        .get(this.pharmacyData.id)
        .then((response) => {
          let temp = response.data;
          temp.previousRating = this.loadPreviousRating();
          this.pharmacyData = temp;
          this.refreshKey++;
        })
        .catch((error) => {
          if (error.response)
            makeToast(this, "Error", error.response.data.message, "danger");
        });
    },
  },
};
</script>
<style scoped>
.link-card:hover {
  box-shadow: #0000005e 0 12px 26px;
  transform: translate(0px, -10px);
  cursor: pointer;
}
.link-card {
  transition: 0.5s ease all;
  border-radius: 1.5em;
  background: #eee;
}
.link-card img {
  border-radius: 10%;
  width: auto;
  max-height: 168.67px;
  object-fit: cover;
}
.pharmacy-rating {
  background: transparent;
}
</style>

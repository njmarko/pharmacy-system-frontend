    // v-bind:img-src="image"
<template>
  <b-card
    no-body
    img-top
    title-variant="card-title"
    class="mb-2 h-100 option-card"
  >
    <b-card-header class="mb-1">
      <h3>{{ this.stock.medicineName }}</h3>
    </b-card-header>
    <b-badge v-if="this.stock.quantity === 0" variant="warning"
      >Out of stock</b-badge
    >
    <b-card-body class="h-100 mb-0 p-0 d-flex flex-column">
      <b-card-text>
        <strong>Rating:</strong><br />
        <star-rating
          :read-only="true"
          :inline="true"
          :increment="0.01"
          :star-size="20"
          :rating="this.stock.medicineAverageGrade"
        />
        / 5
        <hr />
        <p>
          <strong>Current price:</strong><br />
          <span>{{ this.stock.currentPrice }} RSD</span>
          <b-badge v-if="stock.totalDiscount > 0" variant="warning"
            ><b>-{{ stock.totalDiscount }}%</b></b-badge
          >
          <br />
          <strong>Quantity:</strong><br />
          <span>{{ this.stock.quantity }}</span
          ><br />
        </p>
      </b-card-text>
    </b-card-body>
    <b-card-footer>
      <b-button-group>
        <b-button
          variant="info"
          v-on:click="showDetails"
          v-b-tooltip.hover
          title="Show medicine info"
        >
          <b-icon-question-circle-fill></b-icon-question-circle-fill>
        </b-button>
        <b-button
          v-if="userRole == 'Patient'"
          variant="success"
          v-b-modal="
            'modal-' + this.stock.pharmacyId + '-' + this.stock.medicineId
          "
          v-b-tooltip.hover
          title="Reserve medicine"
          ><b-icon-cart-check-fill></b-icon-cart-check-fill>
        </b-button>
      </b-button-group>
    </b-card-footer>
    <b-modal
      :id="'modal-' + this.stock.pharmacyId + '-' + this.stock.medicineId"
      :title="'Reservation from ' + this.stock.pharmacyName"
      @ok="handleOk"
    >
      <b-form v-on:submit.prevent="reserve">
        <b-form-group>
          <label for="example-datepicker">Choose pickup date</label>
          <b-form-datepicker
            required
            id="example-datepicker"
            v-model="drugReservationDTO.reservationDeadline"
            class="mb-2"
            :min="this.dayAfterTommorow"
            :state="drugReservationDTO.reservationDeadline != null"
          ></b-form-datepicker>
          <b-form-invalid-feedback>
            You must select a date.
          </b-form-invalid-feedback>
        </b-form-group>
        <b-form-group>
          <label for="amount-input">Choose amount</label>
          <b-form-input
            id="amount-input"
            required
            min="1"
            :state="validateQuantity"
            v-model="drugReservationDTO.quantity"
            type="number"
          ></b-form-input>
          <b-form-invalid-feedback>
            You must enter a positive number for quantity.
          </b-form-invalid-feedback>
        </b-form-group>
      </b-form>
    </b-modal>
    <MedicineDetailsModal ref="detailsModal" v-bind:stock="stock" />
  </b-card>
</template>

<script>
import { mapGetters } from "vuex";
import patientService from "../../service/PatientService";
import { makeToast } from "@/util/makeToast";
import StarRating from "vue-star-rating";
import MedicineDetailsModal from "./MedicineDetailsModal";

export default {
  props: ["stock", "image"],
  name: "MedicineStockCard",
  components: {
    StarRating,
    MedicineDetailsModal,
  },
  data() {
    return {
      drugReservationDTO: {
        quantity: 1,
        reservedAt: null,
        reservationDeadline: null,
        pharmacyId: this.stock.pharmacyId,
        medicineId: this.stock.medicineId,
      },
    };
  },
  computed: {
    ...mapGetters(["userRole"]),
    validateQuantity: function () {
      return (
        this.drugReservationDTO.quantity != null &&
        this.drugReservationDTO.quantity >= 1
      );
    },
    today: function () {
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      return today;
    },
    dayAfterTommorow: function () {
      let now = new Date();
      let dayAfterTommorow = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate() + 2
      );
      return dayAfterTommorow;
    },
  },
  methods: {
    showDetails: function () {
      this.$refs.detailsModal.show();
    },
    reserve: function () {
      if (
        this.validateQuantity ||
        this.drugReservationDTO.reservationDeadline != null
      ) {
        this.drugReservationDTO.reservedAt = new Date().toISOString();
        this.drugReservationDTO.reservationDeadline = new Date(
          this.drugReservationDTO.reservationDeadline
        ).toISOString();
        patientService
          .createDrugReservation(this.loggedUser().id, this.drugReservationDTO)
          .then((response) => {
            makeToast(this, "Success", response.data.message, "success");
            this.$nextTick(() => {
              this.$bvModal.hide(
                "modal-" + this.stock.pharmacyId + "-" + this.stock.medicineId
              );
            });
          })
          .catch((err) => {
            if (err.response) {
              makeToast(this, "Error", err.response.data.message, "danger");
            } else {
              makeToast(
                this,
                "Error",
                "An error occured with reservation.",
                "danger"
              );
            }
          });
      }
    },
    handleOk(bvModalEvt) {
      bvModalEvt.preventDefault();
      if (
        this.validateQuantity &&
        this.drugReservationDTO.reservationDeadline != null
      ) {
        this.reserve();
      }
    },
    ...mapGetters(["loggedUser"]),
  },
};
</script>

<style scoped>
.card-title {
  color: #002664;
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
}
</style>

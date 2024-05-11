<template>
  <b-card no-body title-variant="card-title" class="mb-2 h-100 option-card">
    <b-card-header>
      <h3>{{ medicine.pharmacyName }}</h3>
    </b-card-header>
    <b-card-body class="h-50 d-flex flex-column">
      <b-card-text>
        <p>
          <strong>Price: </strong>
          <span>{{ this.discountedPrice }} RSD</span>
        </p>
      </b-card-text>
    </b-card-body>
    <b-card-footer>
      <b-button
        variant="primary"
        v-b-modal="
          'modal-' + this.medicine.pharmacyId + '-' + this.medicine.medicineId
        "
        >Reserve</b-button
      >
    </b-card-footer>

    <b-modal
      :id="'modal-' + this.medicine.pharmacyId + '-' + this.medicine.medicineId"
      :title="'Reservation from ' + this.medicine.pharmacyName"
      header-text-variant="light"
      header-bg-variant="primary"
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
        <span >Total: </span>
        <span>{{drugReservationDTO.quantity * discountedPrice | round}}</span>
      </b-form>
    </b-modal>
  </b-card>
</template>



<script>
import patientService from "../../service/PatientService";
import { mapGetters } from "vuex";
import { makeToast } from "@/util/makeToast";

export default {
  data() {
    return {
      drugReservationDTO: {
        quantity: 1,
        reservedAt: null,
        reservationDeadline: null,
        pharmacyId: this.medicine.pharmacyId,
        medicineId: this.medicine.medicineId,
      },

    };
  },

  props: ["medicine", "discount"],  
  filters:{
     round(num) {
        var m = Number((Math.abs(num) * 100).toPrecision(15));
        return Math.round(m) / 100 * Math.sign(num);
}
  },
  methods: {
    reserve: function () {
      if (
        this.validateQuantity ||
        this.drugReservationDTO.reservationDeadline != null
      ) {
        this.drugReservationDTO.reservedAt = new Date().toISOString();
        this.drugReservationDTO.reservationDeadline = new Date(this.drugReservationDTO.reservationDeadline).toISOString(); 
        patientService
          .createDrugReservation(this.loggedUser().id, this.drugReservationDTO)
          .then((response) => {
            makeToast(this, "Success", response.data.message, "success");
                    this.$nextTick(() => {
          this.$bvModal.hide('modal-' + this.medicine.pharmacyId + '-' + this.medicine.medicineId);
        })
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
  computed: {
    discountedPrice(){
      let val = this.medicine.medicinePrice * ((100 - this.discount) / 100);
      var m = Number((Math.abs(val) * 100).toPrecision(15));
      return Math.round(m) / 100 * Math.sign(val);
      //return 0;
    },
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
      let dayAfterTommorow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 2); 
      return dayAfterTommorow;
    },
  },
};
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
}
</style>
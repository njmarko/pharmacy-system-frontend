    // v-bind:img-src="image"
<template>
  <b-card
    img-top
    title-variant="card-title"
    class="mb-2 h-100 option-card"
    style="padding: 0.5em"
    no-body
  >
    <b-card-title class="mb-1">
      {{ this.appointmentTitle }}
    </b-card-title>
    <b-card-body class="h-100 d-flex flex-column">
      <b-card-text>
        <p class="mb-auto" v-if="cardType == `pastAppointment`">
          <strong>Pharmacy: </strong
          ><span>{{ this.appointmentData.pharmacyName }}</span>
        </p>
        <hr v-if="cardType == `pastAppointment`" />
        <p>
          <strong>Price: </strong
          ><span>{{ this.appointmentData.price }} RSD</span><br />
        </p>
        <hr />
        <p v-if="cardType != 'pastAppointment'">
          <!--<b-badge variant="primary">Discount will be applied after appointment conclusion.</b-badge>-->
          <strong>Note: </strong> Discount will be applied after appointment conclusion.
        </p>
        <p class="m-auto">
          <strong>Date: </strong>
          <span>{{
            this.appointmentData.dateFrom | moment("DD.MM.YYYY.")
          }}</span
          ><br />
          <strong>Time: </strong>
          <span
            >{{ this.appointmentData.dateFrom | moment("HH:mm") }} -
            {{ this.appointmentData.dateTo | moment("HH:mm") }}</span
          ><br />
          <strong>Duration: </strong>
          <span>{{ this.appointmentData.duration | moment("HH:mm") }}h</span
          ><br />
        </p>
        <strong>Employee rating:</strong><br />
        <div
          v-if="this.userRole == 'Patient' && cardType == 'pastAppointment'"
          :key="this.appointmentData.employeePharmacyEmployeeAverageGrade"
        >
          <star-rating
            :read-only="false"
            :inline="true"
            :round-start-rating="false"
            :star-size="20"
            :rating="this.appointmentData.employeePharmacyEmployeeAverageGrade"
            :glow="10"
            :animate="true"
            :title="`Rate Employee`"
            :fixed-points="2"
            @rating-selected="rateEmployee"
            @mouseleave="
              this.appointmentData.employeePharmacyEmployeeAverageGrade
            "
          />
          <div
            v-if="
              this.userRole == 'Patient' && this.appointmentData.previousRating
            "
            style="margin-top: 10px; font-weight: bold"
          >
            You rated: {{ this.appointmentData.previousRating }} stars
          </div>
        </div>
        <div v-else>
          <star-rating
            :read-only="true"
            :inline="true"
            :increment="0.01"
            :star-size="20"
            :fixed-points="2"
            :rating="this.appointmentData.employeePharmacyEmployeeAverageGrade"
          />
          <div
            v-if="
              this.userRole == 'Patient' && this.appointmentData.previousRating
            "
            style="margin-top: 10px; font-weight: bold"
          >
            You rated: {{ this.appointmentData.previousRating }} stars
          </div>
        </div>
      </b-card-text>
    </b-card-body>
    <b-card-footer
      v-if="this.userRole == 'Patient' && cardType == `bookAppointment`"
    >
      <b-button
        v-if="cardType == `bookAppointment`"
        variant="primary"
        v-on:click="$emit('book-dermatologist-appointment', appointment)"
        v-b-tooltip.hover
        title="Schedule Appointment"
      >
        <b-icon-calendar-plus-fill></b-icon-calendar-plus-fill
      ></b-button>
    </b-card-footer>
    <b-card-footer
      v-else-if="
        this.userRole == 'Patient' && cardType == `scheduledAppointment`
      "
    >
      <b-button
        v-if="cardType == `scheduledAppointment`"
        variant="danger"
        v-on:click="$emit('cancel-appointment', appointment)"
        v-b-tooltip.hover
        title="Cancel Appointment"
      >
        <b-icon-calendar-plus-fill></b-icon-calendar-plus-fill
      ></b-button>
    </b-card-footer>
    <b-card-footer
      v-if="this.userRole == 'Patient' && cardType == `schedulePharmacist`"
    >
      <b-button
        v-if="cardType == `schedulePharmacist`"
        variant="primary"
        v-on:click="$emit('book-pharmacist-appointment', appointment)"
        v-b-tooltip.hover
        title="Schedule Appointment"
      >
        <b-icon-calendar-plus-fill></b-icon-calendar-plus-fill
      ></b-button>
    </b-card-footer>
    <b-card-footer
      v-if="this.userRole == 'Patient' && cardType == 'pastAppointment'"
    >
      <b-button
        variant="warning"
        v-b-tooltip.hover
        title="File a complaint"
        @click="showModal"
      >
        <b-icon-pencil></b-icon-pencil>
      </b-button>
    </b-card-footer>
    <b-modal
      :id="'modal-' + this.appointmentData.id"
      :title="'File a complaint against ' + this.appointmentTitle"
      hide-footer
      header-text-variant="light"
      header-bg-variant="primary"
      scrollable
    >
        <b-form-textarea
            id="input-8"
            v-model="content"
            placeholder="Enter complaint"
            rows="5"
            max-rows="5"
            no-resize
            class="text-area-field"
            :state="this.content.length <= 1000 && this.content !== ''"
            >   
        </b-form-textarea>
        <b-form-invalid-feedback>
          Complaint cannot be longer than 1000 characters and cannot be empty.
        </b-form-invalid-feedback>

      <b-button class="mt-3" block variant="primary" @click="fileComplaint"
        >Confirm</b-button
      >
    </b-modal>
  </b-card>
</template>

<script>
import { mapGetters } from "vuex";
import StarRating from "vue-star-rating";
import { makeToast } from "../../util/makeToast";
import pharmacyEmployeeService from "../../service/PharmacyEmployeeService";
import patientService from "../../service/PatientService";
import { eventBus } from "@/util/eventBus";

export default {
  props: ["appointment", "image", "cardType", "bus"],
  name: "AppointmentCard",
  data() {
    return {
      content: "",
      appointmentData: this.appointment,
    };
  },
  components: {
    StarRating,
  },
  created() {
    eventBus.$on("refreshEmployee", (employeeId) => {
      if (employeeId == this.appointmentData.employeePharmacyEmployeeId) {
        this.loadData();
      }
    });
  },
  computed: {
    ...mapGetters(["userRole", "loggedUser"]),
    appointmentTitle: function () {
      return `${this.appointmentData.employeeFirstName} ${this.appointmentData.employeeLastName}`;
    },
  },
  methods: {
    showModal() {
      this.$bvModal.show("modal-" + this.appointmentData.id);
    },
    loadData: function () {
      patientService
        .getAppointment(this.loggedUser.id, this.appointmentData.id)
        .then((response) => {
          this.appointmentData = response.data;
        })
        .catch((error) => {
          if (error.response && error.response.status != 500) {
            makeToast(this, "Error", error.response.data.message, "danger");
          }
        });
    },
    rateEmployee: function (rating) {
      patientService
        .rateEmployee(
          this.loggedUser.id,
          this.appointmentData.employeePharmacyEmployeeId,
          Math.round(rating),
          this.appointmentData.employeeType
        )
        .then((response) => {
          makeToast(this, "Success", response.data.message, "success");
          eventBus.$emit(
            "refreshEmployee",
            this.appointmentData.employeePharmacyEmployeeId
          );
        })
        .catch((error) => {
          if (error.response && error.response.status != 500) {
            makeToast(this, "Error", error.response.data.message, "danger");
          }
        });
    },
    fileComplaint() {
      if(this.content.length > 1000 || this.content === ''){
        makeToast(this, "Error", "Complaint cannot be longer than 1000 characters and cannot be empty.","danger")
      }
      else{
        pharmacyEmployeeService
                .fileComplaint(this.appointmentData.employeePharmacyEmployeeId, {
                  patientId: this.loggedUser.id,
                  content: this.content,
                })
                .then(() => {
                  makeToast(
                    this,
                    "Success",
                    "Complaint successfully filed.",
                    "success"
                  );
                  this.content = "";
                  this.$bvModal.hide("modal-" + this.appointmentData.id);

                })
                .catch((error) => {
                  if (error.response)
                    makeToast(this, "Error", error.response.data.message, "danger");
                });
      }
      
    },
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

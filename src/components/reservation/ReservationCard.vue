<template>
  <b-card
    title-variant="card-title"
    tag="article"
    class="mb-2 h-100 link-card"
    style="padding: 0.5em"
    no-body
  >
    <b-card-title>
      {{
        this.reservationData.medicineName + ` Id: ` + this.reservationData.id
      }}
    </b-card-title>
    <b-card-body class="h-100 d-flex flex-column">
      <b-card-text>
        <p>
          <strong>Quantity: </strong
          ><span>{{ this.reservationData.quantity }}</span
          ><br />
        </p>
        <hr />
        <p>
          <strong>Price: </strong
          ><span>{{ this.reservationData.price }} RSD</span><br />
        </p>
        <hr />
        <p>
          <strong>Reservation Deadline: </strong>
          <span>{{
            this.reservationData.reservationDeadline | moment("DD.MM.YYYY.")
          }}</span
          ><br />
        </p>
        <hr />
        <p>
          <strong>Pharmacy: </strong
          ><span>{{ this.reservationData.pharmacyName }}</span>
        </p>
        <div
          v-if="
            this.userRole == 'Patient' &&
            this.reservationData.status == 'PICKED'
          "
          :key="this.reservationData.rating"
        >
          <star-rating
            :read-only="false"
            :inline="true"
            :round-start-rating="false"
            :star-size="20"
            :rating="this.reservationData.rating"
            :glow="10"
            :animate="true"
            :title="`Rate Drug`"
            :fixed-points="2"
            @rating-selected="rateDrug"
            @mouseleave="this.reservationData.rating"
          />
          <div
            v-if="
              this.userRole == 'Patient' && this.reservationData.previousRating
            "
            style="margin-top: 10px; font-weight: bold"
          >
            You rated: {{ this.reservationData.previousRating }} stars
          </div>
        </div>
        <div v-else>
          <star-rating
            :read-only="true"
            :inline="true"
            :increment="0.01"
            :star-size="20"
            :fixed-points="2"
            :rating="this.reservationData.rating"
          />
          <div
            v-if="
              this.userRole == 'Patient' && this.reservationData.previousRating
            "
            style="margin-top: 10px; font-weight: bold"
          >
            You rated: {{ this.reservationData.previousRating }} stars
          </div>
        </div>
      </b-card-text>
    </b-card-body>
    <b-card-footer v-if="this.reservationData.status == `RESERVED`">
      <b-button-group>
        <b-button
          variant="danger"
          v-b-tooltip.hover
          title="Cancel Reservation"
          v-on:click="$emit('cancel-reservation', reservation)"
          ><b-icon-x-circle-fill></b-icon-x-circle-fill
        ></b-button>
      </b-button-group>
    </b-card-footer>
  </b-card>
</template>

<script>
import StarRating from "vue-star-rating";
import { makeToast } from "../../util/makeToast";
import { mapGetters } from "vuex";
import patientService from "../../service/PatientService";
import { eventBus } from "@/util/eventBus";

export default {
  name: "ReservationCard",
  props: ["reservation"],
  components: {
    StarRating,
  },
  data: function () {
    return {
      reservationData: this.reservation,
    };
  },
  created() {
    eventBus.$on("refreshDrugRating", (drugId) => {
      if (drugId == this.reservationData.drugId) {
        this.loadData();
      }
    });
  },
  mounted() {},
  computed: {
    ...mapGetters(["userRole", "loggedUser"]),
  },
  methods: {
    loadData: function () {
      patientService
        .getReservation(this.loggedUser.id, this.reservationData.id)
        .then((response) => {
          this.reservationData = response.data;
        })
        .catch((error) => {
          if (error.response && error.response.status != 500)
            makeToast(this, "Error", error.response.data.message, "danger");
        });
    },
    rateDrug: function (rating) {
      patientService
        .rateDrug(
          this.loggedUser.id,
          this.reservationData.drugId,
          Math.round(rating)
        )
        .then((response) => {
          makeToast(this, "Success", response.data.message, "success");
          eventBus.$emit("refreshDrugRating", this.reservationData.drugId);
        })
        .catch((error) => {
          if (error.response && error.response.status != 500)
            makeToast(this, "Error", error.response.data.message, "danger");
        });
    },
  },
};
</script>
<style scoped>
.card-title {
  color: #002664;
}
.link-card:hover {
  box-shadow: #0000005e 0 12px 26px;
  transform: translate(0px, -10px);
  /* cursor: pointer; */
}
.link-card {
  transition: 0.5s ease all;
  border-radius: 1.5em;
  background: #eee;
}

p,
h4 {
  margin-bottom: 0px;
}
</style>

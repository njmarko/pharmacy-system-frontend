<template>
  <div>
    <h1> Reservation </h1>
    <b-row class="mb-3">
      <b-col md="10">
        <b-form inline v-on:submit.prevent="search">
          <b-form-input
            v-model="queryParam.id"
            class="mr-2"
            placeholder="Enter reservation id"
            trim
          />
          <b-button type="submut" variant="primary">
            <b-icon-search></b-icon-search> Search</b-button
          >
        </b-form>
      </b-col>
    </b-row>
    <ReservationDetailView v-bind:reservation="reservation" v-on:issue-reservation="issueReservation"/>
    <br/>
</div>
</template>

<script>
import reservationService from "../../service/ReservationService";

import { makeToast } from "@/util/makeToast";

import ReservationDetailView from "./ReservationDetailView";

export default {
  name: "BasicReservationView",
  components: {
    ReservationDetailView,
  },
  data: function () {
    return {
      queryParam: {
        id: ""
      },
      reservation: {}
    };
  },
  methods: {
    search: function () {
       reservationService
        .getReservation(
          this.queryParam.id
        )
        .then((response) => {
          this.reservation = response.data;
        })
        .catch(() => {
          makeToast(this, "Info", "No reservation found.", "info");
          this.resetReservation();
        });
    },
    resetReservation : function () {
      this.reservation = {};
      this.queryParam.id = "";
      this.currentPage = 1;
    },
    issueReservation: function() {
      this.$confirm({
      title: "Issue reservaton",
      message: `Are you sure you want to issue medicines?`,
      button: {
        no: "No",
        yes: "Yes",
      },
      callback: (confirm) => {
        if (confirm) {
          reservationService
            .issueReservation(this.queryParam.id)
            .then(() => {
              makeToast(this, "Success", "Reservation successfully issued!", "success");
              this.resetReservation();
            })
            .catch((error) => {
              makeToast(this, "Error",  error.response.data.message, "danger");
              this.resetReservation();
            });
         }
        },
      });
    }
  }
};
</script>

<style scoped>
</style>

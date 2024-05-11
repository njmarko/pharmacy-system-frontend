
<template>
  <div>
    <h1>Drug Reservations</h1>
    <div v-if="pageReservations">
      <b-row align-v="center">
        <b-col lg="10" md="12">
          <b-form v-on:submit.prevent="onSearch">
            <b-row align-v="center">
              <b-col lg="3" md="12">
                <div class="form-label-group">
                  <b-form-select
                    v-model="drugSelectedStatus"
                    :options="drugStatusOptions"
                    v-on:change="loadPage"
                    id="view-select"
                  ></b-form-select>
                  <label for="view-select">Select drug status</label>
                </div>
              </b-col>
              <b-col lg="4" xs="12">
                <div class="form-label-group">
                  <b-form-input
                    v-model="queryParams.id"
                    placeholder="Enter reservation id"
                    trim
                    autofocus
                    id="inputId"
                  />
                  <label for="inputId">Enter reservation id</label>
                </div>
              </b-col>
              <b-col lg="3" xs="12">
                <b-button type="submit" variant="primary">
                  <b-icon-search></b-icon-search> Search</b-button
                >
              </b-col>
            </b-row>
          </b-form>
        </b-col>
        <b-col lg="2" md="12">
          <b-button v-b-toggle.collapse-1 variant="primary" class="float-right"
            ><b-icon-sliders></b-icon-sliders>Filter</b-button
          >
        </b-col>
        <b-col md="12">
          <b-collapse id="collapse-1" class="mt-2">
            <b-card>
              <b-form
                v-on:submit.prevent="onSearch"
                v-on:reset.prevent="onReset"
              >
                <b-row align-v="center">
                  <b-col lg="4" md="6">
                    <b-form-group id="input-group-4" class="mb-auto">
                      <div class="form-label-group">
                        <b-form-select
                          id="sort-crit"
                          v-model="queryParams.sortCriteria"
                          :options="critOptions"
                        ></b-form-select>
                        <label for="sort-crit">Sort Criteria</label>
                      </div>
                    </b-form-group>
                  </b-col>
                  <b-col lg="4" md="6">
                    <b-form-group id="input-group-5" class="mb-auto">
                      <div class="form-label-group">
                        <b-form-select
                          id="sort-dir"
                          v-model="queryParams.sortDirection"
                          :options="dirOptions"
                        ></b-form-select>
                        <label for="sort-dir">Sort Direction</label>
                      </div>
                    </b-form-group>
                  </b-col>

                  <b-col lg="4" md="12">
                    <b-button-group class="form-label-group">
                      <b-button type="submit" variant="primary">Apply</b-button>
                      <b-button type="reset" variant="warning">Cancel</b-button>
                    </b-button-group>
                  </b-col>
                </b-row>
              </b-form>
            </b-card>
          </b-collapse>
        </b-col>
      </b-row>

      <b-row class="row-spacing" v-for="(row, rowI) in numRows" :key="rowI">
        <b-col
          v-bind:lg="cardWidth"
          sm="12"
          v-for="(reservation, index) in pageReservations.content.slice(
            rowI * numCols,
            rowI * numCols + numCols
          )"
          :key="index"
        >
          <ReservationCard
            :key="reservation.id"
            v-bind:reservation="reservation"
            v-on:cancel-reservation="cancelReservation"
          />
        </b-col>
      </b-row>
      <h1 v-if="pageReservations.empty">No Reservations Found.</h1>
      <b-pagination
        v-model="page"
        :total-rows="pageReservations.totalElements"
        :per-page="size"
        first-number
        last-number
        align="center"
        v-on:input="loadPage"
      ></b-pagination>
    </div>
    <h1 v-else>No Reservations Found.</h1>
  </div>
</template>
<script>
import ReservationService from "@/service/ReservationService";
import ReservationCard from "@/components/reservation/ReservationCard";
import { mapGetters } from "vuex";
import { makeToast } from "@/util/makeToast";

export default {
  components: {
    ReservationCard,
  },
  props: {
    numCols: Number,
    numRows: Number,
  },
  data: function () {
    return {
      drugSelectedStatus: "Reserved",
      drugStatusOptions: [
        { value: "Reserved", text: "Reserved" },
        { value: "Picked", text: "Picked" },
      ],
      pageReservations: null,
      page: 1,
      queryParams: {
        id: null,
        sortCriteria: "reservationDeadline",
        sortDirection: "asc",
      },
      critOptions: [
        { value: undefined, text: "Select a Sort Criteria" },
        { value: "reservationDeadline", text: "Reservation Deadline" },
        { value: "id", text: "Reservation Id" },
        { value: "price", text: "Price" },
      ],
      dirOptions: [
        { value: null, text: "Select a Sort Direction" },
        { value: "asc", text: "Ascending" },
        { value: "desc", text: "Descending" },
      ],
    };
  },
  mounted() {
    this.loadPage();
  },
  computed: {
    size: function () {
      return this.numCols * this.numRows;
    },
    cardWidth: function () {
      return Math.round(12 / this.numCols);
    },
  },
  methods: {
    cancelReservation: function (reservation) {
      this.$confirm({
        title: "Cancel Reservation",
        message: `Are you sure you want to cancel ${reservation.itemsDTO[0].medicineName} Id: ${reservation.id}?`,
        button: {
          no: "No",
          yes: "Yes",
        },
        callback: (confirm) => {
          if (confirm) {
            ReservationService.cancelReservation(
              this.loggedUser().id,
              reservation.id
            )
              .then((response) => {
                if (response.status == 204) {
                  if (
                    this.pageReservations.content.length === 1 &&
                    this.page > 1
                  ) {
                    this.page -= 1;
                  }
                  this.loadPage();
                }
              })
              .catch((error) => {
                if (error.response) {
                  makeToast(
                    this,
                    "Error",
                    error.response.data.message,
                    "danger"
                  );
                }
              });
          }
        },
      });
    },

    loadPage: function () {
      if (this.drugSelectedStatus == "Reserved") {
        ReservationService.getAllForPatient(
          this.loggedUser().id,
          this.queryParams.id,
          this.page - 1,
          this.size,
          this.queryParams.sortCriteria,
          this.queryParams.sortDirection
        )
          .then((response) => {
            this.pageReservations = response.data;
          })
          .catch((error) => {
            if (error.response)
              makeToast(this, "Error", error.response.data.message, "danger");
          });
      } else if (this.drugSelectedStatus == "Picked") {
        ReservationService.getAllIssuedForPatient(
          this.loggedUser().id,
          this.queryParams.id,
          this.page - 1,
          this.size,
          this.queryParams.sortCriteria,
          this.queryParams.sortDirection
        )
          .then((response) => {
            this.pageReservations = response.data;
          })
          .catch((error) => {
            if (error.response)
              makeToast(this, "Error", error.response.data.message, "danger");
          });
      }
    },
    onSearch: function () {
      this.page = 1;
      this.loadPage();
    },
    onReset: function () {
      this.page = 1;
      this.queryParams.id = "";
      this.queryParams.sortDirection = null;
      this.queryParams.sortCriteria = null;
      this.loadPage();
    },
    ...mapGetters(["loggedUser"]),
  },
};
</script>
<style scoped>
.row-spacing {
  margin-top: 15px;
  margin-bottom: 15px;
}
</style>

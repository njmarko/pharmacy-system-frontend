<template>
  <div v-if="offerPage.content">
    <b-row align-v="center">
      <b-col lg="10" md="12">
        <b-form v-on:submit.prevent="search">
          <b-row align-v="center">
            <b-col lg="4" xs="12">
              <div class="form-label-group">
                <b-form-input
                  v-model="queryParams.name"
                  placeholder="Enter company name"
                  trim
                  autofocus
                  id="company-name-input"
                />
                <label for="company-name-input">Enter company name</label>
              </div>
            </b-col>
            <b-col lg="4" xs="12" class="text-left">
              <b-button type="submit" variant="primary">
                <b-icon-search></b-icon-search> Search</b-button
              >
            </b-col>
          </b-row>
        </b-form>
      </b-col>
      <b-col md="12" lg="2">
        <b-button v-b-toggle.collapse-1 variant="primary" class="float-right"
          ><b-icon-sliders></b-icon-sliders>Filter</b-button
        >
      </b-col>
      <b-col md="12">
        <b-collapse id="collapse-1" class="mt-2">
          <b-card>
            <b-form v-on:submit.prevent="filter" v-on:reset.prevent="reset">
              <b-row align-v="center">
                <b-col lg="4" md="6">
                  <b-form-group id="input-group-4" class="mb-auto">
                    <div class="form-label-group">
                      <b-form-select
                        id="sort-crit"
                        v-model="queryParams.sortCriteria"
                        :options="critOptions"
                      ></b-form-select>
                      <label for="sort-crit">Sort criteria</label>
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
                      <label for="sort-dir">Sort direction</label>
                    </div>
                  </b-form-group>
                </b-col>

                <b-col lg="4" md="4">
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
    <div v-if="offerPage.content.length != 0">
      <b-row class="row-spacing" v-for="(row, rowI) in numRows" :key="rowI">
        <b-col
          v-bind:lg="cardWidth"
          sm="12"
          v-for="(offer, index) in offerPage.content.slice(
            rowI * numCols,
            rowI * numCols + numCols
          )"
          :key="index"
        >
          <AdminOfferCard
            v-bind:offer="offer"
            v-bind:order="order"
            v-on:accept-offer="acceptOffer"
          />
        </b-col>
      </b-row>
      <b-pagination
        v-model="page"
        :total-rows="offerPage.totalElements"
        :per-page="size"
        first-number
        last-number
        align="center"
        v-on:input="fetchOffersPage"
      ></b-pagination>
    </div>
    <h2 v-else>No available offers found.</h2>
  </div>
  <h2 v-else>No available offers found.</h2>
</template>

<script>
import pharmacyService from "../../service/PharmacyService";
import { makeToast } from "../../util/makeToast";

import AdminOfferCard from "./AdminOfferCard";

export default {
  components: {
    AdminOfferCard,
  },
  props: ["order", "pharmacy", "numRows", "numCols"],
  data() {
    return {
      page: 1,
      offerPage: [],
      queryParams: {
        name: "",
        sortCriteria: null,
        sortDirection: null,
      },
      critOptions: [
        { value: undefined, text: "Select sort criteria" },
        { value: "supplier.company", text: "Company name" },
        { value: "totalPrice", text: "Total price" },
        { value: "deliveryDueDate", text: "Delivery due date" },
      ],
      dirOptions: [
        { value: null, text: "Select sort direction" },
        { value: "asc", text: "Ascending" },
        { value: "desc", text: "Descending" },
      ],
    };
  },
  mounted() {
    this.fetchOffersPage();
  },
  methods: {
    acceptOffer: function (offer) {
      this.$confirm({
        title: "Accept offer",
        message: `Are you sure you want to accept offer ${offer.id} from ${offer.supplierCompany}?`,
        button: {
          no: "No",
          yes: "Yes",
        },
        callback: (confirm) => {
          if (confirm) {
            pharmacyService
              .acceptOffer(this.pharmacy.id, this.order.id, offer.id)
              .then((response) => {
                if (response.status == 200) {
                  this.reset();
                  makeToast(
                    this,
                    "Offer accept",
                    "Offer has been accepted successfully and the medicine stock is updated. Email has been sent to suppliers to inform them about the status of their offer.",
                    "success"
                  );
                  this.$emit("accept-offer-grid");
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
    fetchOffersPage: function () {
      pharmacyService
        .getOrderOffers(
          this.pharmacy.id,
          this.order.id,
          this.page - 1,
          this.size,
          this.queryParams.name,
          this.queryParams.sortCriteria,
          this.queryParams.sortDirection
        )
        .then((response) => {
          this.offerPage = response.data;
        });
    },
    search: function () {
      this.page = 1;
      this.fetchOffersPage(); 
    },
    filter: function () {
      this.search();
    },
    reset: function () {
      this.queryParams.name = "";
      this.queryParams.sortDirection = null;
      this.queryParams.sortCriteria = null;
      this.filter();
    },
  },
  computed: {
    size: function () {
      return this.numCols * this.numRows;
    },
    cardWidth: function () {
      return Math.round(12 / this.numCols);
    },
  },
};
</script>

<style scoped>
.row-spacing {
  margin-top: 15px;
  margin-bottom: 15px;
}
</style>
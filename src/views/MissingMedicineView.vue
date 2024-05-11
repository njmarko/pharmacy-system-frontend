<template>
  <b-container v-if="pharmacy" id="pharmacy-container">
    <b-breadcrumb :items="this.breadCrumbItems"></b-breadcrumb>
    <b-row align-v="center">
      <b-col md="10">
        <b-form inline v-on:submit.prevent="search">
          <div class="form-label-group">
            <b-form-input
              v-model="queryParams.medicineName"
              class="mr-2"
              placeholder="Enter medicine name"
              trim
              id="medicine-name"
              autofocus
            />
            <label for="medicine-name">Enter medicine name</label>
          </div>
          <b-button type="submit" variant="primary">
            <b-icon-search></b-icon-search> Search</b-button
          >
        </b-form>
      </b-col>
    </b-row>
    <div v-if="logPage.content">
      <div v-if="logPage.content.length != 0">
        <b-row class="row-spacing" v-for="(row, rowI) in numRows" :key="rowI">
          <b-col
            v-bind:lg="cardWidth"
            sm="12"
            v-for="(l, index) in logPage.content.slice(
              rowI * numCols,
              rowI * numCols + numCols
            )"
            :key="index"
          >
            <MissingMedicineCard v-bind:log="l" :key="l.id" />
          </b-col>
        </b-row>
        <b-pagination
          v-model="page"
          :total-rows="logPage.totalElements"
          :per-page="size"
          v-on:input="fetchLogPage"
          first-number
          last-number
          align="center"
        ></b-pagination>
      </div>
      <h2 v-else>No missing medicines found.</h2>
    </div>
    <h1 v-else>No missing medicines found.</h1>
  </b-container>
</template>

<script>
import { mapGetters } from "vuex";
import pharmacyAdminService from "../service/PharmacyAdminService";
import pharmacyService from "../service/PharmacyService";

import MissingMedicineCard from "../components/medicine/MissingMedicineCard";

export default {
  name: "AdminMedicineStockView",
  components: {
    MissingMedicineCard,
  },
  data: function () {
    return {
      logPage: [],
      breadCrumbItems: [
        {
          text: "Admin panel",
          to: { name: "PharmacyAdminHome" },
        },
        {
          text: "Missing medicine log",
          active: true,
        },
      ],
      pharmacy: null,
      page: 1,
      numRows: 2,
      numCols: 4,
      queryParams: {
        medicineName: "",
      },
    };
  },
  mounted() {
    pharmacyAdminService.getMyPharmacy(this.loggedUser.id).then((response) => {
      this.pharmacy = response.data;
      this.fetchLogPage();
    });
  },
  methods: {
    search: function() {
      this.page = 1;
      this.fetchLogPage();
    },
    fetchLogPage: function () {
      pharmacyService
        .getMissingMedicineLog(this.pharmacy.id, this.page - 1, this.size, this.queryParams.medicineName)
        .then((response) => {
          this.logPage = response.data;
        });
    },
  },
  computed: {
    ...mapGetters(["loggedUser"]),
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
#pharmacy-container {
  background-color: white;
}
.row-spacing {
  margin-top: 15px;
  margin-bottom: 15px;
}
</style>

<template>
  <div>
    <!-- <h1>Add allergies</h1> -->
    <div v-if="pageAllergies">
      <b-row align-v="center">
        <b-col lg="10" md="12">
          <b-form v-on:submit.prevent="onSearch">
            <b-row align-v="center">
              <b-col lg="4" xs="12">
                <div class="form-label-group">
                  <b-form-input
                    v-model="queryParams.name"
                    placeholder="Enter medicine name"
                    trim
                    autofocus
                  />
                  <label for="name-input">Enter medicine name</label>
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
          <b-button v-b-toggle.collapse-2 variant="primary" class="float-right"
            ><b-icon-sliders></b-icon-sliders>Filter</b-button
          >
        </b-col>
        <b-col md="12">
          <b-collapse id="collapse-2" class="mt-2">
            <b-card>
              <b-form
                v-on:submit.prevent="onSearch"
                v-on:reset.prevent="onReset"
              >
                <b-row align-v="center">
                  <b-col lg="3" md="4" sm="12">
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
                  <b-col lg="3" md="4" sm="12">
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

                  <b-col md="4" sm="12">
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
          v-for="(medicine, index) in pageAllergies.content.slice(
            rowI * numCols,
            rowI * numCols + numCols
          )"
          :key="index"
        >
          <AllergyCard
            v-bind:medicine="medicine"
            :cardType="`nonAllergy`"
            v-on:add-allergy="addAllergy"
          />
        </b-col>
      </b-row>
      <h1 v-if="pageAllergies.empty">No Drugs Found.</h1>
      <b-pagination
        v-model="page"
        :total-rows="pageAllergies.totalElements"
        :per-page="size"
        first-number
        last-number
        align="center"
        v-on:input="loadPage"
      ></b-pagination>
    </div>
    <h1 v-else>No Drugs Found.</h1>
  </div>
</template>
<script>
import PatientService from "@/service/PatientService";
import AllergyCard from "@/components/patient/PatientAllergyCard";
import { mapGetters } from "vuex";
import { makeToast } from "@/util/makeToast";
import { eventBus } from "@/util/eventBus";

export default {
  name: "PatientNonAllergyOptions",
  components: {
    AllergyCard,
  },
  props: {
    numCols: Number,
    numRows: Number,
  },
  created() {
    eventBus.$on("allergy-removed", () => {
      this.loadPage();
    });
  },
  data: function () {
    return {
      pageAllergies: null,
      page: 1,
      queryParams: {
        name: null,
        sortCriteria: null,
        sortDirection: "asc",
      },
      critOptions: [
        { value: undefined, text: "Select a Sort Criteria" },
        { value: "name", text: "Medicine Name" },
        { value: "medicineType", text: "Medicine Type" },
        { value: "manufacturer", text: "Medicine Manufacturer" },
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
    addAllergy: function (medicine) {
      this.$confirm({
        title: "Add allergy",
        message: `Are you sure you want to add drug ${medicine.name} to allergies?`,
        button: {
          no: "No",
          yes: "Yes",
        },
        callback: (confirm) => {
          if (confirm) {
            PatientService.addAllergy(this.loggedUser().id, medicine.id)
              .then((response) => {
                if (response.status == 200) {
                  if (
                    this.pageAllergies.content.length === 1 &&
                    this.page > 1
                  ) {
                    this.page -= 1;
                  }
                  this.loadPage();
                  eventBus.$emit("allergy-added");
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
      PatientService.getNonAllergiesPatient(
        this.loggedUser().id,
        this.queryParams.name,
        this.page - 1,
        this.size,
        this.queryParams.sortCriteria,
        this.queryParams.sortDirection
      ).then((response) => {
        this.pageAllergies = response.data;
      });
    },
    onSearch: function () {
      this.page = 1;
      this.loadPage();
    },
    onReset: function () {
      this.page = 1;
      this.queryParams.name = "";
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



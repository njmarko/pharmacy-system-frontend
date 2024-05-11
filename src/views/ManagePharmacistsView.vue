<template>
  <b-container v-if="pharmacy" id="pharmacy-container">
    <div v-if="pharmacistsPage.content">
      <b-breadcrumb :items="this.breadCrumbItems"></b-breadcrumb>
      <b-row align-v="center">
        <b-col lg="8" md="12">
          <b-form v-on:submit.prevent="search">
            <b-row align-v="center">
              <b-col lg="4" xs="12">
                <div class="form-label-group">
                  <b-form-input
                    v-model="queryParams.firstName"
                    placeholder="Enter first name"
                    trim
                    autofocus
                    id="first-name-input"
                  />
                  <label for="first-name-input">Enter first name</label>
                </div>
              </b-col>
              <b-col lg="4" xs="12">
                <div class="form-label-group">
                  <b-form-input
                    v-model="queryParams.lastName"
                    placeholder="Enter lastName"
                    trim
                    id="last-name-input"
                  />
                  <label for="last-name-input">Enter last name</label>
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
        <b-col md="12" lg="4">
          <b-button-group class="form-label-group float-right">
            <b-button
              variant="success"
              v-on:click="$refs.registerPharmacistModal.show"
              ><b-icon-person-plus-fill></b-icon-person-plus-fill> Register
              pharmacist</b-button
            >
            <b-button v-b-toggle.collapse-1 variant="primary"
              ><b-icon-sliders></b-icon-sliders>Filter</b-button
            >
          </b-button-group>
        </b-col>
        <b-col md="12">
          <b-collapse id="collapse-1" class="mt-2">
            <b-card>
              <b-form v-on:submit.prevent="filter" v-on:reset.prevent="reset">
                <b-row align-v="center">
                  <b-col lg="4" md="6">
                    <b-form-group id="input-group-1" class="mb-auto">
                      <div class="form-label-group">
                        <b-form-input
                          v-model="queryParams.gradeLow"
                          id="grade-low-input"
                          type="number"
                          step="0.01"
                          min="0.00"
                          max="5.00"
                          :state="isValidGrade(queryParams.gradeLow)"
                          placeholder="Enter min grade"
                        />
                        <label for="grade-low-input">Enter min grade</label>
                      </div>
                    </b-form-group>
                  </b-col>
                  <b-col lg="4" md="6">
                    <b-form-group id="input-group-2" class="mb-auto">
                      <div class="form-label-group">
                        <b-form-input
                          v-model="queryParams.gradeHigh"
                          id="grade-high-input"
                          type="number"
                          step="0.01"
                          min="0.00"
                          max="5.00"
                          :state="isValidGrade(queryParams.gradeHigh)"
                          placeholder="Enter max grade"
                        />
                        <label for="grade-low-input">Enter max grade</label>
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
      <div v-if="pharmacistsPage.content.length != 0">
        <b-row class="row-spacing" v-for="(row, rowI) in numRows" :key="rowI">
          <b-col
            v-bind:lg="cardWidth"
            sm="12"
            v-for="(p, index) in pharmacistsPage.content.slice(
              rowI * numCols,
              rowI * numCols + numCols
            )"
            :key="index"
          >
            <AdminEmployeeCard
              v-bind:employee="p"
              v-on:fire-employee="firePharmacist"
              :key="p.id"
            />
          </b-col>
        </b-row>
        <b-pagination
          v-model="page"
          :total-rows="pharmacistsPage.totalElements"
          :per-page="size"
          v-on:input="fetchPharmacistsPage"
          first-number
          last-number
          align="center"
        ></b-pagination>
      </div>
      <h2 v-else>No pharmacists found.</h2>
    </div>
    <h1 v-else>No pharmacists found.</h1>
    <RregisterPharmacistModal
      :id="'register-pharmacist-modal'"
      v-bind:pharmacy="pharmacy"
      ref="registerPharmacistModal"
      v-on:pharmacist-registered="pharmacistRegistered"
    />
  </b-container>
</template>

<script>
import { mapGetters } from "vuex";
import { makeToast } from "../util/makeToast";
import pharmacyService from "../service/PharmacyService";
import pharmacyAdminService from "../service/PharmacyAdminService";
import RregisterPharmacistModal from "../components/employee/pharmacist/RegisterPharmacistModal";
import AdminEmployeeCard from "../components/employee/AdminEmployeeCard";

export default {
  name: "AdminPharmacistsView",
  components: {
    AdminEmployeeCard,
    RregisterPharmacistModal,
  },
  data: function () {
    return {
      pharmacy: null,
      breadCrumbItems: [],
      pharmacistsPage: [],
      numRows: 2,
      numCols: 4,
      page: 1,
      queryParams: {
        firstName: "",
        lastName: "",
        gradeLow: 0,
        gradeHigh: 5,
      },
    };
  },
  mounted() {
    pharmacyAdminService.getMyPharmacy(this.loggedUser.id).then((response) => {
      this.pharmacy = response.data;
      this.setupBreadCrumbItems();
      this.fetchPharmacistsPage();
    });
  },
  methods: {
    pharmacistRegistered: function () {
      this.queryParams.firstName = "";
      this.queryParams.lastName = "";
      this.reset();
    },
    setupBreadCrumbItems: function () {
      this.breadCrumbItems = [
        {
          text: "Admin panel",
          to: { name: "PharmacyAdminHome" },
        },
        {
          text: "Manage pharmacists",
          active: true,
        },
      ];
    },
    firePharmacist: function (pharmacist) {
      this.$confirm({
        title: "Fire pharmacist",
        message: `Are you sure you want to fire ${pharmacist.firstName} ${pharmacist.lastName}?`,
        button: {
          no: "No",
          yes: "Yes",
        },
        callback: (confirm) => {
          if (confirm) {
            pharmacyService
              .firePharmacist(this.pharmacy.id, pharmacist.id)
              .then((response) => {
                if (response.status == 204) {
                  if (
                    this.pharmacistsPage.content.length === 1 &&
                    this.page > 1
                  ) {
                    this.page -= 1;
                  }
                  this.fetchPharmacistsPage();
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
    fetchPharmacistsPage: function () {
      pharmacyService
        .getPharmacistst(
          this.pharmacy.id,
          this.page - 1,
          this.size,
          this.queryParams.firstName,
          this.queryParams.lastName,
          this.queryParams.gradeLow,
          this.queryParams.gradeHigh
        )
        .then((response) => {
          this.pharmacistsPage = response.data;
        });
    },
    search: function () {
      this.page = 1;
      this.fetchPharmacistsPage();
    },
    filter: function () {
      this.search();
    },
    reset: function () {
      this.queryParams.gradeLow = 0;
      this.queryParams.gradeHigh = 5;
      this.filter();
    },
    isValidGrade: function (grade) {
      return grade >= 0 && grade <= 5;
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

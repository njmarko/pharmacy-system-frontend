<template>
  <div>
    <h2 v-if="this.listType == `goToAppointments`">
      Choose Pharmacy to View Dermatologist Appointments
    </h2>
    <h2 v-else-if="this.listType == `goToPharmacists`">
      Choose Pharmacy to View Pharmacist Appointments
    </h2>
    <h1 v-else>Pharmacies</h1>
    <div v-if="pagePharmacy">
      <b-row align-v="center">
        <b-col lg="10" md="12">
          <b-form v-on:submit.prevent="onSearch">
            <b-row align-v="center">
              <b-col lg="3" xs="12">
                <div class="form-label-group">
                  <b-form-input
                    v-model="queryParams.name"
                    placeholder="Enter pharmacy name"
                    trim
                    autofocus
                    id="name-input"
                  />
                  <label for="name-input">Enter pharmacy name</label>
                </div>
              </b-col>
              <b-col lg="3" xs="12">
                <div class="form-label-group">
                  <b-form-input
                    v-model="queryParams.city"
                    placeholder="Enter city"
                    trim
                    id="city-input"
                  />
                  <label for="city-input">Enter city</label>
                </div>
              </b-col>
              <b-col v-if="this.listType == `goToPharmacists`" lg="3" xs="12">
                <div class="date-time-group">
                  <date-picker
                    type="datetime"
                    :clearable="false"
                    format="DD.MM.YYYY. HH:mm"
                    v-model="queryParams.dateTime"
                    :input-attr="{ required: 'true' }"
                    id="date-time-input"
                  >
                  </date-picker>
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
        <b-col md="12" lg="2">
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
                  <b-col lg="4" md="6">
                    <b-form-group id="input-group-3" class="mb-auto">
                      <div class="form-label-group">
                        <b-form-input
                          v-model="queryParams.distance"
                          id="distance-max-input"
                          type="number"
                          step="0.01"
                          min="0.00"
                          :state="isValidDistance(queryParams.distance)"
                          placeholder="Enter max distance (km)"
                        />
                        <label for="grade-low-input"
                          >Enter max distance (km)</label
                        >
                      </div>
                    </b-form-group>
                  </b-col>
                  <b-col lg="4" md="6">
                    <b-form-group id="input-group-4" class="mb-auto">
                      <div class="form-label-group">
                        <b-form-select
                          id="sort-crit"
                          v-model="queryParams.sortCriteria"
                          :options="critOptions"
                        ></b-form-select>
                        <label for="grade-low-input">Sort criteria</label>
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
                        <label for="grade-low-input">Sort direction</label>
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
      <b-row class="row-spacing" v-for="(row, rowI) in numRows" :key="rowI">
        <b-col
          v-bind:lg="cardWidth"
          sm="12"
          v-for="(pharmacy, index) in pagePharmacy.content.slice(
            rowI * numCols,
            rowI * numCols + numCols
          )"
          :key="index"
        >
          <PharmacyCard
            v-if="images.length > 0"
            v-bind:pharmacy="pharmacy"
            v-on:click.native="goToSpecifiedRoute(getRoute(pharmacy))"
            :image="images[(index + numCols * rowI) * (1 + rowI)].download_url"
            :cardType="listType"
            :key="pharmacy.id"
          />
        </b-col>
      </b-row>
      <h2 v-if="pagePharmacy.empty && listType == `goToPharmacists`">
        No pharmacies found with available pharmacist appointments at the
        specified date and time.
      </h2>
      <h1 v-else-if="pagePharmacy.empty">No pharmacies found.</h1>
      <b-pagination
        v-model="page"
        :total-rows="pagePharmacy.totalElements"
        :per-page="size"
        first-number
        last-number
        align="center"
        v-on:input="loadPage"
      ></b-pagination>
    </div>
    <h1 v-else>No pharmacies found.</h1>
  </div>
</template>
<script>
import pharmacyService from "@/service/PharmacyService";
import PharmacyCard from "@/components/pharmacy/PharmacyCard";
import DatePicker from "vue2-datepicker";
import { makeToast } from "@/util/makeToast";

export default {
  components: {
    PharmacyCard,
    DatePicker,
  },
  props: {
    numCols: Number,
    numRows: Number,
    imgWidth: Number,
    imgHeight: Number,
    imgBlur: Number,
    listType: {
      type: String,
      default: "goToPharmacy",
    },
  },
  data: function () {
    return {
      pagePharmacy: null,
      page: 1,
      queryParams: {
        name: null,
        city: null,
        gradeLow: 0.0,
        gradeHigh: 5.0,
        distance: null,
        userLatitude: null,
        userLongitude: null,
        sortCriteria: null,
        sortDirection: null,
        dateTime: new Date(),
      },
      critOptions: this.determineCritOptions,
      dirOptions: [
        { value: null, text: "Select a Sort Direction" },
        { value: "asc", text: "Ascending" },
        { value: "desc", text: "Descending" },
      ],
      images: [],
    };
  },
  mounted() {
    this.critOptions = this.determineCritOptions;
    this.getImages();
    this.loadPage();
  },
  computed: {
    size: function () {
      return this.numCols * this.numRows;
    },
    cardWidth: function () {
      return Math.round(12 / this.numCols);
    },
    determineCritOptions: function () {
      if (this.listType == `goToPharmacists`) {
        return [
          { value: undefined, text: "Select a Sort Criteria" },
          { value: "employee.pharmacy.name", text: "Name" },
          { value: "employee.pharmacy.averageGrade", text: "Rating" },
          {
            value: "employee.pharmacy.currentPharmacistAppointmentPrice",
            text: "Pharmacist Appointment Price",
          },
          {
            label: "Address sort criteria",
            options: [
              {
                value: "employee.pharmacy.location.address.street",
                text: "Street",
              },
              {
                value: "employee.pharmacy.location.address.city",
                text: "City",
              },
              {
                value: "employee.pharmacy.location.address.country",
                text: "Country",
              },
              {
                value: "employee.pharmacy.location.address.zipCode",
                text: "Zip Code",
              },
            ],
          },
        ];
      } else if (this.listType == `goToAppointments`) {
        return [
          { value: undefined, text: "Select a Sort Criteria" },
          { value: "name", text: "Name" },
          { value: "averageGrade", text: "Rating" },
          {
            value: "currentDermatologistAppointmentPrice",
            text: "Dermatologist Appointment Price",
          },
          {
            label: "Address sort criteria",
            options: [
              { value: "location.address.street", text: "Street" },
              { value: "location.address.city", text: "City" },
              { value: "location.address.country", text: "Country" },
              { value: "location.address.zipCode", text: "Zip Code" },
            ],
          },
        ];
      } else {
        return [
          { value: undefined, text: "Select a Sort Criteria" },
          { value: "name", text: "Name" },
          { value: "averageGrade", text: "Rating" },
          {
            value: "currentPharmacistAppointmentPrice",
            text: "Pharmacist Appointment Price",
          },
          {
            value: "currentDermatologistAppointmentPrice",
            text: "Dermatologist Appointment Price",
          },
          {
            label: "Address sort criteria",
            options: [
              { value: "location.address.street", text: "Street" },
              { value: "location.address.city", text: "City" },
              { value: "location.address.country", text: "Country" },
              { value: "location.address.zipCode", text: "Zip Code" },
            ],
          },
        ];
      }
    },
  },
  methods: {
    goToSpecifiedRoute(route) {
      this.$router.push(route);
    },
    getRoute: function (pharmacy) {
      if (this.listType == `goToPharmacy`) {
        return { name: "PharmacyHomePage", params: { id: pharmacy.id } };
      } else if (this.listType == `goToAppointments`) {
        return {
          name: "AppointmentsView",
          params: { id: pharmacy.id },
        };
      } else if (this.listType == `goToPharmacists`) {
        return {
          name: "SchedulePharmacistAppointmentView",
          params: { id: pharmacy.id },
          query: { dateTime: this.queryParams.dateTime.getTime() },
        };
      } else {
        return { name: "PharmacyHomePage", params: { id: pharmacy.id } };
      }
    },
    setPosition: function (position) {
      this.queryParams.userLatitude = position.coords.latitude;
      this.queryParams.userLongitude = position.coords.longitude;
    },
    getLocation: function () {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          this.setPosition,
          (error) => console.log(error),
          {
            enableHighAccuracy: true,
          }
        );
      }
    },
    loadPage: function () {
      if (this.listType == `goToPharmacists`) {
        this.getLocation();
        this.getImages();
        if (
          this.isValidGrade(this.queryParams.gradeLow) &&
          this.isValidGrade(this.queryParams.gradeHigh)
        ) {
          var tzoffset = new Date().getTimezoneOffset() * 60000; //offset in milliseconds
          var localISOTime = new Date(this.queryParams.dateTime - tzoffset)
            .toISOString()
            .slice(0, -1);
          pharmacyService
            .getPharmaciesWithAvailablePharmacistAppointments(
              this.queryParams.name,
              this.queryParams.city,
              this.queryParams.gradeLow,
              this.queryParams.gradeHigh,
              this.queryParams.userLatitude,
              this.queryParams.userLongitude,
              this.queryParams.distance,
              localISOTime,
              this.page - 1,
              this.size,
              this.queryParams.sortCriteria,
              this.queryParams.sortDirection
            )
            .then((response) => {
              this.pagePharmacy = response.data;
            })
            .catch((error) => {
              if (error.response) {
                makeToast(this, "Error", error.response.data.message, "danger");
              }
            });
        }
      } else {
        this.getLocation();
        this.getImages();
        if (
          this.isValidGrade(this.queryParams.gradeLow) &&
          this.isValidGrade(this.queryParams.gradeHigh)
        ) {
          pharmacyService
            .getAll(
              this.queryParams.name,
              this.queryParams.city,
              this.queryParams.gradeLow,
              this.queryParams.gradeHigh,
              this.queryParams.userLatitude,
              this.queryParams.userLongitude,
              this.queryParams.distance,
              this.page - 1,
              this.size,
              this.queryParams.sortCriteria,
              this.queryParams.sortDirection
            )
            .then((response) => {
              this.pagePharmacy = response.data;
            })
            .catch((error) => {
              if (error.response) {
                makeToast(this, "Error", error.response.data.message, "danger");
              }
            });
        }
      }
    },
    onSearch: function () {
      this.page = 1;
      this.loadPage();
    },
    onReset: function () {
      this.page = 1;
      this.queryParams.gradeLow = 0;
      this.queryParams.gradeHigh = 5;
      this.queryParams.userLatitude = null;
      this.queryParams.userLongitude = null;
      this.queryParams.distance = null;
      this.queryParams.sortDirection = null;
      this.queryParams.sortCriteria = null;
      this.queryParams.dateTime = new Date();
      this.loadPage();
    },
    isValidGrade: function (grade) {
      return grade >= 0 && grade <= 5;
    },
    isValidDistance: function (distance) {
      return distance >= 0;
    },
    getImages: function () {
      pharmacyService.getImages(this.page, this.size * 2).then((response) => {
        this.images = response.data;
        for (const image of this.images) {
          image.download_url =
            image.download_url.split("id/")[0] +
            "/id/" +
            image.id +
            "/" +
            this.imgWidth +
            "/" +
            this.imgHeight +
            ".webp" +
            (this.imgBlur == 0 ? "" : "/?blur=" + this.imgBlur);
        }
      });
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

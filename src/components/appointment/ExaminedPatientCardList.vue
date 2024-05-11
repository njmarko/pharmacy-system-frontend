<template>
  <div>
    <h1 style="margin-bottom:2%">Examined patients</h1>
    <div v-if="pageExamined">
      <b-row align-v="center">
        <b-col lg="10" md="12">
          <b-form inline v-on:submit.prevent="onSearch">
                <div class="form-label-group">
                  <b-form-input
                    v-model="queryParams.firstName"
                    placeholder="Patient first name"
                    class="mr-2"
                    trim
                    autofocus
                    id="first-name-input"
                  />
                  <label for="first-name-input">Patient first name</label>
                </div>
                <div class="form-label-group">
                  <b-form-input
                    v-model="queryParams.lastName"
                    placeholder="Patient last name"
                    class="mr-2"
                    trim
                    id="last-name-input"
                  />
                  <label for="last-name-input">Patient last name</label>
                </div>
                <b-button type="submit" variant="primary">
                  <b-icon-search></b-icon-search> Search</b-button
                >
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
                  <b-col class="col-lg-3 col-md-6 col-sm-12 col-12 text-center">
                      From date: <br/>
                      <span class="date-time-group">
                        <date-picker
                         style="margin:auto"
                          type="datetime"
                          :clearable="false"
                          format="DD.MM.YYYY. HH:mm"
                          v-model="queryParams.dateFrom"
                        >
                        </date-picker>
                      </span>
                  </b-col>
                  <b-col class="col-lg-3 col-md-6 col-sm-12 col-12 text-center">
                       To date: <br/>
                      <span class="date-time-group">
                        <date-picker
                         style="margin:auto"
                          type="datetime"
                          :clearable="false"
                          format="DD.MM.YYYY. HH:mm"
                          v-model="queryParams.dateTo"
                        >
                        </date-picker>
                      </span>
                  </b-col>
                  <b-col class="col-lg-6 d-none d-lg-block d-md-block">
                  </b-col>
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
      <b-row class="row-spacing" v-for="(row, rowI) in numRows" :key="rowI">
        <b-col class="col-lg-4 col-md-6"
          v-bind:lg="cardWidth"
          sm="12"
          v-for="(examined, index) in pageExamined.content.slice(
            rowI * numCols,
            rowI * numCols + numCols
          )"
          :key="index"
        >
          <ExaminedPatientCard :examinedPatient="examined" v-on:open-details="showDetails"/>
        </b-col>
      </b-row>
      <b-pagination
        v-model="page"
        :total-rows="pageExamined.totalElements"
        :per-page="size"
        first-number
        last-number
        align="center"
        v-on:input="loadPage"
      ></b-pagination>
    </div>
    <h1 v-else>No patients found.</h1>
    <ExaminedPatientDetailsModal ref="examinedDetails" :examinedPatient="chosenPatient"/>
  </div>
</template>
<script>
import appointmentService from "../../service/AppointmentService"
import ExaminedPatientCard from "./ExaminedPatientCard"
import ExaminedPatientDetailsModal from "./ExaminedPatientDetailsModal"
import DatePicker from "vue2-datepicker";
import { makeToast } from "@/util/makeToast";
import { mapGetters } from 'vuex'
import {
  getISODateString,
  getISOTimeString
} from "../../util/dateUtil";

export default {
  data: function () {
    return {
      pageExamined: null,
      chosenPatient: null,
      page: 1,
      numRows: 1,
      numCols: 3,
      queryParams: {
        firstName: null,
        lastName: null,
        dateFrom: null,
        dateTo: null,
        sortCriteria: null,
        sortDirection: null,
      },
      critOptions: this.determineCritOptions,
      dirOptions: [
        { value: null, text: "Select a Sort Direction" },
        { value: "asc", text: "Ascending" },
        { value: "desc", text: "Descending" },
      ]
    };
  },
  components: {
    ExaminedPatientCard,
    ExaminedPatientDetailsModal,
    DatePicker
  },
  mounted() {
    this.critOptions = this.determineCritOptions;
    this.loadPage();
  },
  computed: {
    size () {
      return this.numCols * this.numRows;
    },
    cardWidth () {
      return Math.round(12 / this.numCols);
    },
    determineCritOptions () {
        return [
            { value: undefined, text: "Select a Sort Criteria" },
            { value: "patient.firstName", text: "Patient first name" },
            { value: "patient.lastName", text: "Patient last name" },
            { value: "from", text: "Appointment start date" },
            { value: "price", text: "Appointment price" }
        ];
    },
     ...mapGetters(["loggedUser"])
  },
  methods: {
    loadPage () {
        let fromTime = null;
        if (this.queryParams.dateFrom !== null) {
            fromTime = `${getISODateString(this.queryParams.dateFrom)}T${getISOTimeString(this.queryParams.dateFrom)}`;
        }

        let toTime = null;
        if (this.queryParams.dateTo !== null) {
            toTime = `${getISODateString(this.queryParams.dateTo)}T${getISOTimeString(this.queryParams.dateTo)}`;
        }

        appointmentService
            .getAllExamined(this.loggedUser.id, this.queryParams.firstName, this.queryParams.lastName, fromTime, toTime,
             this.page - 1, this.size, this.queryParams.sortCriteria, this.queryParams.sortDirection)
            .then((response) => {
                this.pageExamined = response.data;
            })
            .catch((error) => {
                if (error.response) {
                makeToast(this, "Error", error.response.data.message, "danger");
            }
        });
    },
    onSearch () {
      this.page = 1;
      this.loadPage();
    },
    onReset () {
      this.page = 1;
      this.queryParams.firstName = null;
      this.queryParams.lastName = null;
      this.queryParams.dateFrom = null;
      this.queryParams.dateTo = null;
      this.loadPage();
    },
    showDetails(examinedPatient) {
      this.chosenPatient = examinedPatient;
      console.log(this.chosenPatient);
      this.$refs.examinedDetails.show();
    }
  }
};
</script>
<style scoped>
.row-spacing {
  margin-top: 15px;
  margin-bottom: 15px;
}

.col-xs-0, 
.col-sm-0,
.col-md-0{
  flex: 0 0 0;
  max-width: 0;
}
</style>
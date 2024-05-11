<template>
  <b-modal
    :id="id"
    title="Hire dermatologist"
    hide-footer
    header-text-variant="light"
    header-bg-variant="primary"
    size="lg"
  >
    <b-form v-on:submit.prevent="register">
      <b-row>
        <b-col lg="12" xs="12">
          <b-form-group id="input-group-11" class="mb-auto">
            <div class="form-label-group">
              <model-select
                :options="availableDermatologists"
                v-model="username"
                placeholder="Select dermatologist"
                :isError="!username"
              ></model-select>
            </div>
          </b-form-group>
        </b-col>
      </b-row>
      <b-row>
        <b-col lg="12" xs="12">
          <b-button v-b-toggle.collapse-11 variant="primary" block
            ><b-icon-calendar-check-fill></b-icon-calendar-check-fill> Working
            hours</b-button
          >
        </b-col>
      </b-row>
      <b-collapse id="collapse-11" class="mt-2">
        <b-form-row v-for="(workingDay, index) in workingDays" :key="index">
          <b-col>
            <b-form-checkbox
              :id="workingDay.day"
              v-model="workingDay.active"
              :name="workingDay.day"
            >
              <strong>{{ workingDay.day }}</strong>
            </b-form-checkbox>
          </b-col>
          <b-col>
            <date-picker
              type="time"
              :clearable="false"
              format="HH:mm"
              v-model="workingDay.fromHours"
              v-bind:disabled="!workingDay.active"
            ></date-picker>
          </b-col>
          <b-col style="text-align: center !important"> - </b-col>
          <b-col>
            <date-picker
              type="time"
              :clearable="false"
              format="HH:mm"
              v-model="workingDay.toHours"
              v-bind:disabled="!workingDay.active"
            ></date-picker>
          </b-col>
        </b-form-row>
      </b-collapse>
      <b-button class="mt-3" block type="submit" variant="success"
        >Hire dermatologist</b-button
      >
    </b-form>
    <b-button class="mt-3" v-on:click="hide" block variant="danger"
      >Close</b-button
    >
  </b-modal>
</template>

<script>
import DatePicker from "vue2-datepicker";
import { ModelSelect } from "vue-search-select";
import { makeToast } from "../../../util/makeToast";
import { getISOTimeString } from "../../../util/dateUtil";
import pharmacyService from "../../../service/PharmacyService";
import pharmacyEmployeeService from "../../../service/PharmacyEmployeeService";

export default {
  props: ["id", "pharmacy"],
  components: {
    ModelSelect,
    DatePicker,
  },
  data() {
    return {
      username: null,
      availableDermatologists: [{ value: null, text: "Select dermatologist" }],
      workingDays: [],
    };
  },
  mounted() {
    this.resetWorkingDays();
    pharmacyEmployeeService.getAllDermatologists().then((response) => {
      response.data.forEach((e) => {
        this.availableDermatologists.push({
          value: e.employeeUsername,
          text: `${e.employeeFirstName} ${e.employeeLastName} (@${e.employeeUsername})`,
        });
      });
    });
  },
  methods: {
    show: function () {
      this.$bvModal.show(this.id);
    },
    hide: function () {
      this.$bvModal.hide(this.id);
    },
    register: function () {
      const dermatologist = {
        dermatologistUsername: this.username,
        workingDays: this.workingDays
          .filter((wd) => wd.active)
          .map((wd) => {
            return {
              day: wd.day,
              fromHours: getISOTimeString(wd.fromHours),
              toHours: getISOTimeString(wd.toHours),
            };
          }),
      };
      if (dermatologist.workingDays.length == 0) {
        makeToast(
          this,
          "Error",
          "You need to specify at least one working day.",
          "danger"
        );
        return;
      }
      let invalidHours = false;
      dermatologist.workingDays.forEach((workingDay) => {
        if (workingDay.toHours <= workingDay.fromHours) {
          makeToast(
            this,
            `Invalid working hours for ${workingDay.day}`,
            "Start hours come after end hours.",
            "danger"
          );
          invalidHours = true;
          return;
        }
      });
      if (invalidHours) return;
      pharmacyService
        .hireDermatologist(this.pharmacy.id, dermatologist)
        .then((response) => {
          if (response.status == 201) {
            makeToast(
              this,
              "Success",
              "New dermatologist successfully hired.",
              "success"
            );
            this.resetForm();
            this.hide();
            this.$emit("dermatologist-hired");
          }
        })
        .catch((error) => {
          if (error.response) {
            makeToast(this, "Error", error.response.data.message, "danger");
          } else {
            makeToast(
              this,
              "Error",
              "An error has occured while trying to hire dermatologist.",
              "danger"
            );
          }
        });
    },
    resetForm: function () {
      this.username = null;
      this.resetWorkingDays();
    },
    resetWorkingDays: function () {
      this.workingDays = [
        {
          day: "MONDAY",
          fromHours: new Date(1970, 0, 1, 9, 0, 0),
          toHours: new Date(1970, 0, 1, 17, 0, 0),
          active: true,
        },
        {
          day: "TUESDAY",
          fromHours: new Date(1970, 0, 1, 9, 0, 0),
          toHours: new Date(1970, 0, 1, 17, 0, 0),
          active: true,
        },
        {
          day: "WEDNESDAY",
          fromHours: new Date(1970, 0, 1, 9, 0, 0),
          toHours: new Date(1970, 0, 1, 17, 0, 0),
          active: true,
        },
        {
          day: "THURSDAY",
          fromHours: new Date(1970, 0, 1, 9, 0, 0),
          toHours: new Date(1970, 0, 1, 17, 0, 0),
          active: true,
        },
        {
          day: "FRIDAY",
          fromHours: new Date(1970, 0, 1, 9, 0, 0),
          toHours: new Date(1970, 0, 1, 17, 0, 0),
          active: true,
        },
        {
          day: "SATURDAY",
          fromHours: new Date(1970, 0, 1, 9, 0, 0),
          toHours: new Date(1970, 0, 1, 17, 0, 0),
          active: false,
        },
        {
          day: "SUNDAY",
          fromHours: new Date(1970, 0, 1, 9, 0, 0),
          toHours: new Date(1970, 0, 1, 17, 0, 0),
          active: false,
        },
      ];
    },
  },
};
</script>

<style scoped>
</style>
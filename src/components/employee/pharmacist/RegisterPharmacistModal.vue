<template>
  <b-modal
    :id="id"
    title="Register pharmacist"
    hide-footer
    header-text-variant="light"
    header-bg-variant="primary"
    size="lg"
  >
    <b-form v-on:submit.prevent="register">
      <b-row>
        <b-col lg="6" xs="12">
          <b-form-group id="input-group-11" class="mb-auto">
            <div class="form-label-group">
              <b-form-input
                id="input-first-name"
                placeholder="Enter first name"
                v-model="firstName"
                required
                trim
                autofocus
              />
              <label for="input-first-name">Enter first name</label>
            </div>
          </b-form-group>
        </b-col>
        <b-col lg="6" xs="12">
          <b-form-group id="input-group-12" class="mb-auto">
            <div class="form-label-group">
              <b-form-input
                id="input-last-name"
                placeholder="Enter last name"
                v-model="lastName"
                required
                trim
              />
              <label for="input-last-name">Enter last name</label>
            </div>
          </b-form-group>
        </b-col>
      </b-row>
      <b-row>
        <b-col lg="6" xs="12">
          <b-form-group id="input-group-21" class="mb-auto">
            <div class="form-label-group">
              <b-form-input
                id="input-username"
                placeholder="Enter username"
                v-model="username"
                required
                trim
              />
              <label for="input-username">Enter username</label>
            </div>
          </b-form-group>
        </b-col>
        <b-col lg="6" xs="12">
          <b-form-group id="input-group-22" class="mb-auto">
            <div class="form-label-group">
              <b-form-input
                id="input-email"
                placeholder="Enter email"
                v-model="email"
                required
                trim
                type="email"
              />
              <label for="input-email">Enter email</label>
            </div>
          </b-form-group>
        </b-col>
      </b-row>
      <b-row>
        <b-col lg="6" xs="12">
          <b-form-group id="input-group-31" class="mb-auto">
            <div class="form-label-group">
              <b-form-input
                id="input-password"
                placeholder="Enter password"
                v-model="password"
                required
                trim
                type="password"
              />
              <label for="input-password">Enter password</label>
            </div>
          </b-form-group>
        </b-col>
        <b-col lg="6" xs="12">
          <b-form-group id="input-group-32" class="mb-auto">
            <div class="form-label-group">
              <b-form-input
                id="input-confirm-password"
                placeholder="Confirm password"
                v-model="confirmedPassword"
                required
                trim
                type="password"
                :state="checkPasswords"
              />
              <label for="input-confirm-password">Confirm password</label>
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
        >Register pharmacist</b-button
      >
    </b-form>
    <b-button class="mt-3" v-on:click="hide" block variant="danger"
      >Close</b-button
    >
  </b-modal>
</template>

<script>
import DatePicker from "vue2-datepicker";
import { makeToast } from "../../../util/makeToast";
import { getISOTimeString } from "../../../util/dateUtil";

import pharmacyService from "../../../service/PharmacyService";

export default {
  props: ["id", "pharmacy"],
  components: {
    DatePicker,
  },
  data() {
    return {
      confirmedPassword: "",
      firstName: "",
      lastName: "",
      username: "",
      password: "",
      email: "",
      workingDays: [],
    };
  },
  mounted() {
    this.resetWorkingDays();
  },
  methods: {
    show: function () {
      this.$bvModal.show(this.id);
    },
    hide: function () {
      this.$bvModal.hide(this.id);
    },
    register: function () {
      if (!this.checkPasswords) {
        return;
      }
      const pharmacist = {
        firstName: this.firstName,
        lastName: this.lastName,
        username: this.username,
        password: this.password,
        email: this.email,
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
      if (pharmacist.workingDays.length == 0) {
        makeToast(
          this,
          "Error",
          "You need to specify at least one working day.",
          "danger"
        );
        return;
      }
      let invalidHours = false;
      pharmacist.workingDays.forEach((workingDay) => {
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
        .registerPharmacist(this.pharmacy.id, pharmacist)
        .then((response) => {
          if (response.status == 201) {
            makeToast(
              this,
              "Success",
              "New pharmacist successfully registered.",
              "success"
            );
            this.resetForm();
            this.hide();
            this.$emit("pharmacist-registered");
          }
        })
        .catch((error) => {
          if (error.response) {
            makeToast(this, "Error", error.response.data.message, "danger");
          } else {
            makeToast(
              this,
              "Error",
              "An error has occured while trying to register pharmacist.",
              "danger"
            );
          }
        });
    },
    resetForm: function () {
      this.firstName = "";
      this.lastName = "";
      this.username = "";
      this.email = "";
      this.password = "";
      this.confirmedPassword = "";
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
  computed: {
    checkPasswords() {
      return this.password === this.confirmedPassword;
    },
  },
};
</script>

<style scoped>
</style>
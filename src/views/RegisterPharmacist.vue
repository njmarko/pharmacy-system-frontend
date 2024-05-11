<template>
  <div v-if="pharmacyId != -1">
    <b-container class="registration-header">
      <h2>Register pharmacist</h2>
    </b-container>
    <b-container fluid="sm" class="registration-container">
      <b-form v-on:submit.prevent="register">
        <b-form-row>
          <b-col>
            <label for="input-1">Username</label>
          </b-col>
          <b-col>
            <b-form-input
              id="input-1"
              v-model="username"
              type="text"
              placeholder="Enter  username"
              required
            ></b-form-input>
          </b-col>
          <b-col>
            <label for="input-2">Email</label>
          </b-col>
          <b-col>
            <b-form-input
              id="input-2"
              v-model="email"
              placeholder="Enter email"
              type="email"
              required
            >
            </b-form-input>
            <b-form-invalid-feedback>
              Emails is not valid.
            </b-form-invalid-feedback>
          </b-col>
        </b-form-row>
        <br />
        <b-form-row>
          <b-col>
            <label for="input-3">First name</label>
          </b-col>
          <b-col>
            <b-form-input
              id="input-3"
              v-model="firstName"
              type="text"
              placeholder="Enter first name"
              required
            ></b-form-input>
          </b-col>
          <b-col>
            <label for="input-4">Last name</label>
          </b-col>
          <b-col>
            <b-form-input
              id="input-4"
              v-model="lastName"
              placeholder="Enter last name"
              type="text"
              required
            >
            </b-form-input>
          </b-col>
        </b-form-row>
        <br />
        <b-form-row>
          <b-col>
            <label for="input-5">Password</label>
          </b-col>
          <b-col>
            <b-form-input
              id="input-5"
              v-model="password"
              placeholder="Enter password"
              type="password"
              required
            >
            </b-form-input>
            <b-form-invalid-feedback>
              Passwords can't be empty.
            </b-form-invalid-feedback>
          </b-col>
          <b-col>
            <label for="input-6">Confirm password</label>
          </b-col>
          <b-col>
            <b-form-input
              id="input-6"
              v-model="confirmedPassword"
              placeholder="Confirm password"
              type="password"
              :state="checkPasswords"
              required
            >
            </b-form-input>
            <b-form-invalid-feedback>
              Passwords do not match.
            </b-form-invalid-feedback>
          </b-col>
        </b-form-row>
        <br />
        <b-button
          v-b-toggle.collapse-1
          variant="primary"
          class="working-hours-btn"
          ><b-icon-calendar-check-fill></b-icon-calendar-check-fill> Working
          hours</b-button
        >
        <br />
        <b-collapse id="collapse-1" class="mt-2">
          <b-form-row v-for="(workingDay, index) in workingDays" :key="index">
            <b-col>
              <strong>{{ workingDay.day }}</strong>
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
            -
            <b-col>
              <date-picker
                type="time"
                :clearable="false"
                format="HH:mm"
                v-model="workingDay.toHours"
                v-bind:disabled="!workingDay.active"
              ></date-picker>
            </b-col>
            <b-col>
              <b-form-checkbox
                :id="workingDay.day"
                v-model="workingDay.active"
                :name="workingDay.day"
              >
                Pharmacist works on this day?
              </b-form-checkbox>
            </b-col>
          </b-form-row>
        </b-collapse>
        <br />
        <b-button type="submit" variant="success" class="register-btn"
          >Register pharmacist</b-button
        >
        <br />
      </b-form>
    </b-container>
  </div>
</template>

<script>
import DatePicker from "vue2-datepicker";
import { mapGetters } from "vuex";
import { makeToast } from "../util/makeToast";
import { getISOTimeString } from "../util/dateUtil";

import pharmacyService from "../service/PharmacyService";
import pharmacyAdminService from "../service/PharmacyAdminService";

export default {
  components: {
    DatePicker,
  },
  data() {
    return {
      pharmacyId: -1,
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
    pharmacyAdminService.getMyPharmacy(this.loggedUser.id).then((response) => {
      this.pharmacyId = response.data.id;
    });
  },
  methods: {
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
        .registerPharmacist(this.pharmacyId, pharmacist)
        .then((response) => {
          if (response.status == 201) {
            makeToast(
              this,
              "Success",
              "New pharmacist successfully registered.",
              "success"
            );
            this.resetForm();
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
    ...mapGetters(["loggedUser"]),
    checkPasswords() {
      return this.password === this.confirmedPassword;
    },
  },
};
</script>

<style scoped>
.registration-container {
  background-color: white;
  border-radius: 20px;
  margin-top: 2%;
  padding-top: 15px;
  padding-bottom: 10px;
  padding-right: 50px;
  box-shadow: #0000005e 0 12px 26px;
}
.registration-header {
  color: rgb(78, 69, 69);
  margin-top: 7%;
  font-family: Arial, Helvetica, sans-serif;
}
.register-btn,
.working-hours-btn {
  width: 92%;
  margin-left: 8%;
}
</style>>
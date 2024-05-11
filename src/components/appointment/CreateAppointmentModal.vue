<template>
  <b-modal
    id="create-appointment-modal"
    :title="title"
    hide-footer
    header-text-variant="light"
    header-bg-variant="primary"
    style="z-index: 99999999"
    size="md"
  >
    <b-row>
      <b-col lg="12" xs="12">
        <b-form-group id="input-group-11" class="mb-auto">
          <div class="date-label-group" style="text-align: center">
            <date-picker
              inline
              v-model="appointmentDate"
              :clearable="false"
              value-type="date"
              format="YYYY-MM-DD"
              :disabled-date="disabledIfDoesNotWork"
            ></date-picker>
          </div>
        </b-form-group>
      </b-col>
    </b-row>
    <b-row>
      <b-col
        ><date-picker
          type="time"
          :clearable="false"
          format="HH:mm"
          v-model="fromHours"
          :disabled-time="disabledIfOutOfWork"
          :disabled="!getWorkingDayForDate(this.appointmentDate)"
        ></date-picker>
      </b-col>
      <b-col
        ><date-picker
          type="time"
          :clearable="false"
          format="HH:mm"
          v-model="toHours"
          :disabled-time="disabledIfOutOfWork"
          :disabled="!getWorkingDayForDate(this.appointmentDate)"
        ></date-picker>
      </b-col>
    </b-row>
    <b-button
      class="mt-3"
      block
      variant="primary"
      v-on:click="createAppointment"
      >Create appointment</b-button
    >
    <b-button class="mt-3" v-on:click="hide" block>Close</b-button>
  </b-modal>
</template>

<script>
import {
  getToday,
  getISOTimeString,
  getISODateString,
  getDayOfWeek,
  getDateFromISOTimeString,
} from "../../util/dateUtil";
import DatePicker from "vue2-datepicker";
import { makeToast } from "../../util/makeToast";
import pharmacyService from "../../service/PharmacyService";

export default {
  props: ["pharmacy"],
  components: {
    DatePicker,
  },
  data() {
    return {
      currentEmployee: {},
      appointmentDate: getToday(),
      fromHours: getDateFromISOTimeString("10:00"),
      toHours: getDateFromISOTimeString("10:30"),
    };
  },
  methods: {
    createAppointment: function () {
      const fromTime = `${getISODateString(
        this.appointmentDate
      )}T${getISOTimeString(this.fromHours)}:00`;
      const toTime = `${getISODateString(
        this.appointmentDate
      )}T${getISOTimeString(this.toHours)}:00`;
      if (!this.validateAppointmentTime()) {
        return;
      }
      pharmacyService
        .createAvailableAppointment(this.pharmacy.id, {
          employeeId: this.currentEmployee.employeeId,
          fromTime: fromTime,
          toTime: toTime,
        })
        .then(() => {
          makeToast(
            this,
            "Success",
            `New appointment for ${this.currentEmployee.firstName} ${this.currentEmployee.lastName} created successfully.`,
            "success"
          );
          this.resetModal();
          this.hide();
          this.$emit("appointment-created");
        })
        .catch((error) => {
          if (error.response) {
            makeToast(this, "Error", error.response.data.message, "danger");
          } else {
            makeToast(
              this,
              "Error",
              "An error has occured while trying to create appointment.",
              "danger"
            );
          }
        });
    },
    validateAppointmentTime: function () {
      const fromDateObject = this.mergeDates(
        this.appointmentDate,
        this.fromHours
      );
      const toDateObject = this.mergeDates(this.appointmentDate, this.toHours);
      const now = new Date();
      if (fromDateObject < now) {
        makeToast(this, "Error", "From date is in the past.", "danger");
        return false;
      }
      if (toDateObject < now) {
        makeToast(this, "Error", "To date is in the past.", "danger");
        return false;
      }
      if (fromDateObject > toDateObject) {
        makeToast(this, "Error", "Time interval is reversed.", "danger");
        return false;
      }
      if (fromDateObject.getTime() == toDateObject.getTime()) {
        makeToast(
          this,
          "Error",
          "Appointment can't have duration of 0.",
          "danger"
        );
        return false;
      }
      return true;
    },
    mergeDates: function (date, time) {
      const dateObject = new Date(date.getTime());
      dateObject.setHours(time.getHours());
      dateObject.setMinutes(time.getMinutes());
      dateObject.setSeconds(time.getSeconds());
      dateObject.setMilliseconds(time.getMilliseconds());
      return dateObject;
    },
    resetModal: function () {
      this.appointmentDate = getToday();
      this.fromHours = getDateFromISOTimeString("10:00");
      this.toHours = getDateFromISOTimeString("10:30");
    },
    show: function (employeeId) {
      pharmacyService
        .getEmployeeDetails(this.pharmacy.id, employeeId)
        .then((response) => {
          this.currentEmployee = response.data;
          const workingDay = this.getWorkingDayForDate(getToday());
          if (workingDay) {
            this.fromHours = getDateFromISOTimeString(workingDay.fromHours);
            this.toHours = getDateFromISOTimeString(workingDay.fromHours);
            this.toHours.setMinutes(this.toHours.getMinutes() + 1);
          }
          this.$bvModal.show("create-appointment-modal");
        });
    },
    hide: function () {
      this.$bvModal.hide("create-appointment-modal");
      this.currentEmployee = {};
    },
    disabledIfDoesNotWork: function (date) {
      if (date < getToday()) {
        return true;
      }
      if (this.currentEmployee.workingHours) {
        const dayOfWeek = getDayOfWeek(date);
        return (
          this.currentEmployee.workingHours.filter((wd) => wd.day == dayOfWeek)
            .length == 0
        );
      } else {
        return false;
      }
    },
    disabledIfOutOfWork: function (date) {
      if (this.currentEmployee.workingHours) {
        const workingDay = this.getWorkingDayForDate(this.appointmentDate);
        if (workingDay) {
          return (
            date < getDateFromISOTimeString(workingDay.fromHours) ||
            date > getDateFromISOTimeString(workingDay.toHours)
          );
        } else {
          return false;
        }
      } else {
        return false;
      }
    },
    getWorkingDayForDate: function (date) {
      if (this.currentEmployee.workingHours) {
        return this.currentEmployee.workingHours.filter(
          (wd) => wd.day == getDayOfWeek(date)
        )[0];
      } else {
        return null;
      }
    },
  },
  computed: {
    title: function () {
      if (this.currentEmployee) {
        return `Create appointment for ${this.currentEmployee.firstName} ${this.currentEmployee.lastName}`;
      } else {
        return "Create appointment";
      }
    },
  },
};
</script>

<style scoped>
</style>
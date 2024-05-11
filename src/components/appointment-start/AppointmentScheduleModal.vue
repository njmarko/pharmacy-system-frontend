<template>
 <v-dialog
      v-model="showDialog"
      max-width="1200px"
      max-height="500px"
      persistent
    >

      <v-card style="height:100%; width:100%;">
           <v-toolbar
              color="#343a40"
              dark
            ><h3 class="mx-auto my-auto">Schedule appointment</h3></v-toolbar>
      <v-row>
        <v-col class="col-6">
          <div style="margin-top:40%">
            <hr style="width:90%; margin-left:auto; margin-right:auto"/>
            <b-form v-on:submit.prevent="createAppointment">
              <b-form-group style="text-align: center">
                <p>Select appointment date:</p>
                <date-picker
                  v-model="appointmentDate"
                  :clearable="false"
                  value-type="date"
                  format="YYYY-MM-DD"
                  :disabled-date="disabledIfOutOfWork"
                ></date-picker>
              </b-form-group>
              <hr style="width:75%; margin:auto"/>
              <b-form-group style="text-align: center">
                <b-form-row>
                  <b-col
                    >
                    <p>Select start time:</p>
                    <date-picker
                      type="time"
                      :clearable="false"
                      :editable="false"
                      format="HH:mm"
                      v-model="fromHours"
                      :disabled="getWorkingDayForDate(this.appointmentDate) === null"
                    ></date-picker>
                  </b-col>
                  <b-col
                    >
                    <p>Select end time:</p>
                    <date-picker
                      type="time"
                      :clearable="false"
                      format="HH:mm"
                      v-model="toHours"
                      :editable="false"
                      :disabled="getWorkingDayForDate(this.appointmentDate) === null"
                    ></date-picker>
                  </b-col>
                </b-form-row>
              </b-form-group>
            </b-form>
          <v-btn
            class="white--text"
            color="primary"
            @click="createAppointment"
          >
            Schedule
          </v-btn>
         <hr style="width:90%; margin-left:auto; margin-right:auto"/>
        </div>
        </v-col>
        <v-divider
          inset
          vertical
        ></v-divider>
        <v-col class="col-6">
           <div style="padding:1%">
            <BasicWorkingCalendarView 
            v-bind:appointments="appointments" 
            v-on:change-appointments="changeAppointments"
            :leaveDays="true"/>
          </div>
        </v-col>
      </v-row>
      <hr/>
        <v-card-actions>
          <v-spacer></v-spacer>
           <v-btn
            class="ma-2 white--text"
            color="blue-grey"
            @click="closeDialog"
          >
          Close
           </v-btn>
        </v-card-actions>
      </v-card>
  </v-dialog>
</template>

<script>
import DatePicker from "vue2-datepicker";
import { makeToast } from "../../util/makeToast";
import {mapGetters} from 'vuex'
import {
  getToday,
  getDateFromISOTimeString,
  getISODateString,
  getISOTimeString
} from "../../util/dateUtil";
import appointmentService from "../../service/AppointmentService"
import colors from 'vuetify/lib/util/colors'
import BasicWorkingCalendarView from "../workingCalendar/BasicWorkingCalendarView"

export default {
  props: ["patientId", "pharmacyId"],
  name: "AppointmentScheduleModal",
  components: {
      DatePicker,
      BasicWorkingCalendarView
  },
  data: function() {
      return {
        appointmentDate: getToday(),
        fromHours: getDateFromISOTimeString("09:00"),
        toHours: getDateFromISOTimeString("10:00"),
        workingDays: null,
        appointmentDates: null,
        showDialog: false,
        dateFrom: null,
        dateTo: null,
        leaveDays: [],
        appDates: [],
        appointments: []
      };
  },
  mounted () {
      this.fetchBusyDays();
  },
  computed: {
     ...mapGetters(["loggedUser"])
  },
  methods: {
    closeDialog() {
      this.resetModal();
      this.showDialog = false;
    },
    show() {
        this.showDialog = true;
    },
    fetchBusyDays() {
        appointmentService.getBusyDates(this.loggedUser.id, this.patientId, this.pharmacyId).then((response) => {
            this.workingDays = response.data.workingDays;
            this.appointmentDates = response.data.appointmentDates;
        })
    },
    disabledIfOutOfWork (date) {
      let newDate = new Date();
      newDate.setHours(0, 0, 0, 0);
      if (date < newDate) {
          return true;
      }

      let workingDay = this.getWorkingDayForDate(date);
      if (workingDay === null) {
        return true;
      }

      return false;
    },
    getWorkingDayForDate (date) {
        if (this.workingDays && this.workingDays.length > 0) {
            let filtered =  this.workingDays.filter(
            (wd) => wd.dayInWeek == date.getDay()
            );

            if (filtered.length > 0) {
                return filtered[0];
            }
        }

        return null;
    },
    resetModal () {
        this.appointmentDate = getToday();
        this.fromHours = getDateFromISOTimeString("09:00");
        this.toHours = getDateFromISOTimeString("10:00");
    },
    checkDoubleDateForErrors(dateFrom, dateTo) {
        let fromDate = Date.parse(dateFrom);
        let toDate = Date.parse(dateTo);

        for(let appointment of this.appointmentDates) {
          let startDate = Date.parse(appointment.from);
          let endDate = Date.parse(appointment.to);

          if (fromDate >= startDate && fromDate <= endDate) {
             makeToast(
              this,
              "Error",
              "From time is overlapping with appointment.",
              "danger"
            );
            return 1;
          }

          if (toDate >= startDate && toDate <= endDate) {
            makeToast(
              this,
              "Error",
              "End time is overlapping with appointment.",
              "danger"
            );
            return 1;
          }

          if (fromDate < startDate && toDate > endDate) {
            makeToast(
              this,
              "Error",
              "New appointment is overlapping with existing appointment.",
              "danger"
            );
            return 1;
          }
        }

        return 0;
    },
    checkForPastDates(fromTime, toTime) {
      let from = Date.parse(fromTime);
      let to = Date.parse(toTime);
      let today = new Date();

      if(from < today || to < today) {
          makeToast(
            this,
            "Error",
            "One or both of selected times are in the past.",
            "danger"
          );
          return 1;
      }

      return 0;
    },
    createAppointment(event) {
        if (this.toHours <= this.fromHours) {
            makeToast(
              this,
              "Error",
              "End time less or equal to start time.",
              "danger"
            );
            event.preventDefault();
            return;
        }
        let fromTime = `${getISODateString(this.appointmentDate)}T${getISOTimeString(this.fromHours)}:00`;
        let toTime = `${getISODateString(this.appointmentDate)}T${getISOTimeString(this.toHours)}:00`;

        let error = this.checkForPastDates(fromTime, toTime);
        if (error === 1) {
          event.preventDefault();
          return;
        }

        error = this.checkDoubleDateForErrors(fromTime, toTime);
        if (error === 1) {
            event.preventDefault();
            return;
        }

        appointmentService.scheduleEmployeeAppointment(this.loggedUser.id, fromTime, toTime, this.patientId, this.pharmacyId).then(() =>
        {
            makeToast(
                this,
                "Success",
                "Appointment successfully scheduled!",
                "success"
            );
            this.$emit('succ-scheduled');
            this.showDialog = false;
        }).catch((error) => {
          makeToast(
                this,
                "Error",
                error.response.data.message,
                "danger"
            );
        });
    },
    changeAppointments: function (dateFrom, dateTo) {
      this.dateFrom = dateFrom;
      this.dateTo = dateTo;
      this.getNewAppointments();
    },
    getNewAppointments: function () {
      appointmentService.getAllLeaveDates(this.loggedUser.id, this.dateFrom, this.dateTo).then((response) => {
        this.assignNewAppointments(response);
      });
    },
    assignNewAppointments(response) {
      let result = response.data;
      let new_appointments = [];
      let response_appointments = result.appointmentDates;
      let leave_days = result.leaveRequestDateDTos;

      this.leaveDays = leave_days;
      this.appDates = response_appointments;

      for (let appointment of response_appointments) {
        new_appointments.push({
          name: this.getName(appointment),
          start: new Date(appointment.dateFrom),
          end: new Date(appointment.dateTo),
          length: appointment.lengthInMinutes,
          patient: this.getPatientName(appointment),
          pharmacy: appointment.pharmacyName,
          color: this.getAppointmentColor(appointment),
          timed: true,
        });
      }

      for (let days of leave_days) {
        new_appointments.push({
          name: "Leave days - " + this.getLeaveStatus(days),
          start: new Date(days.dateFrom),
          end: new Date(days.dateTo),
          length: null,
          patient: null,
          pharmacy: null,
          status: this.getLeaveStatus(days),
          color: this.getLeaveColor(days),
          timed: true,
        });
      }

      this.appointments = new_appointments;
    },
    getAppointmentColor(appointment) {
       if (appointment.appointmentStatus === "AVAILABLE") {
         return colors['grey'].lighten1;;
       }
       
       return colors['blue'].base;
    },
    getLeaveStatus(days) {
       let status = "Pending";
       if (days.status === "APPROVED") {
         status = "Approved";
       }
       return status;
    },
    getLeaveColor(days) {
       if (days.status === "APPROVED") {
         return colors['green'].base;
       }

       return colors['amber'].lighten1;
    },
    getName(appointment) {
       let name = "Scheduled";
       if (appointment.appointmentStatus === "AVAILABLE") {
         name = "Available";
       }
       else if (appointment.appointmentStatus === "TOOK_PLACE") {
         name = "Took place";
       }

       return name;
    },
    getPatientName(appointment) {
      if (appointment.patientFirstName) {
        return appointment.patientFirstName + " " + appointment.patientLastName;
      }

      return null;
    }
  }
};
</script>

<style scoped>
 >>> .v-dialog {
  overflow-y:unset !important;
}
</style>
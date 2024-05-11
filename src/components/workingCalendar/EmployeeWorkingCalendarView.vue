<template>
  <div>
    <h1> Working calendar </h1>
    <br/>
    <b-row class="mb-3" v-if="isDermatologist()"  id="pharmacy-options">
        <b-col >
          <b-form-select v-model="pharmacyId" :options="pharmacyOptions" v-on:change="getNewAppointments"></b-form-select>
        </b-col>
    </b-row>
    <BasicWorkingCalendarView v-bind:appointments="appointments" v-on:change-appointments="changeAppointments"/>
    <br/>
</div>
</template>

<script>
import BasicWorkingCalendarView from "./BasicWorkingCalendarView"
import {mapGetters} from 'vuex'
import appointmentService from "../../service/AppointmentService"
import pharmacyEmployeeService from "../../service/PharmacyEmployeeService"
import colors from 'vuetify/lib/util/colors'
import { makeToast } from "../../util/makeToast"

export default {
  name: "EmployeeWorkingCalendarView",
  components: {
      BasicWorkingCalendarView,
  },
  data: function () {
    return {
      pharmacyName: '',
      appointments: [],
      pharmacyOptions: [],
      pharmacyId: -1,
      dateFrom: null,
      dateTo: null
    };
  },
  mounted(){
      pharmacyEmployeeService.getPharmacyList(this.loggedUser.id)
          .then(response=>{
              let pharmacies =  response.data;
              this.pharmacyOptions.push({value: -1, text:  "No pharmacy selected"});
              pharmacies.forEach(element=>{
                  this.pharmacyOptions.push({value: element.id, text:  element.name + ", " + element.street + " " + element.streetNumber + ", " + element.city});
              })
          })
          .catch(error=>{
              if(error.response)
                  makeToast(this, "Error", error.response.data.message, "danger");
          })
  },
  methods: {
    isDermatologist: function () {
      let role = this.userRole;
      return role === "Dermatologist";
    },
    changeAppointments: function (dateFrom, dateTo) {
      this.dateFrom = dateFrom;
      this.dateTo = dateTo;
      this.getNewAppointments();
    },
    getNewAppointments: function () {
      let role = this.userRole;
      if (role === "Dermatologist") {
        appointmentService.getAppointmentsForDermatologist(this.loggedUser.id, this.dateFrom, this.dateTo, this.pharmacyId).then((response) => {
          this.assignNewAppointments(response);
        });
      }
      else {
        appointmentService.getAppointmentsForPharmacist(this.loggedUser.id, this.dateFrom, this.dateTo).then((response) => {
          this.assignNewAppointments(response);
        });
      }
    },
    assignNewAppointments(response) {
      let new_appointments = [];
      let result = response.data;

      let response_appointments = result.appointmentDates;
      let leave_days = result.leaveRequestDateDTos;

      for (let appointment of response_appointments) {
        let name = this.getName(appointment);
        let color = this.getColor(appointment);
        new_appointments.push({
          name: name,
          start: new Date(appointment.dateFrom),
          end: new Date(appointment.dateTo),
          length: appointment.lengthInMinutes,
          patient: this.getPatient(appointment),
          pharmacy: appointment.pharmacyName,
          color: color,
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
    getLeaveStatus(days) {
       let status = "Pending";
       if (days.status === "APPROVED") {
         status = "Approved";
       }
       return status;
    },
    getLeaveColor(days) {
       if (days.status === "APPROVED") {
         return colors['green'].lighten1;
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
    getColor(appointment) {
      let color =  colors['green'].base;
      if (appointment.appointmentStatus === "AVAILABLE") {
        color =  colors['grey'].lighten1;
      }
      else if (appointment.appointmentStatus === "TOOK_PLACE") {
        color = colors['amber'].base;
      }

      return color;
    },
    getPatient(appointment) {
      if (appointment.appointmentStatus === "BOOKED" || appointment.appointmentStatus === "TOOK_PLACE") {
        return appointment.patientFirstName + " " + appointment.patientLastName;
      }

      return '';
    }
  },
  computed: { ...mapGetters(["userRole", "loggedUser"]) }
}
</script>

<style scoped>

#pharmacy-options{
  margin-right: auto;
  width: 50%;
}

</style>

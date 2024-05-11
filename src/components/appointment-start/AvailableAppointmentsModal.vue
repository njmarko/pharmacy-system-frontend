<template>
 <v-dialog
      v-model="showDialog"
      max-width="800px"
      persistent
    >

      <v-card style="height:100%; width:100%;">
           <v-toolbar
              color="#343a40"
              dark
            ><h3 class="mx-auto my-auto">Choose appointment</h3></v-toolbar>
            <div style="padding:1%">
                <BasicWorkingCalendarView 
                :scheduled="true"
                 v-bind:appointments="appointments" 
                 v-on:change-appointments="changeAppointments"
                 v-on:dermatologist-choosen="appointmentChosen"/>
            </div>
        <v-card-actions>
          <v-spacer></v-spacer>
           <v-btn
            class="ma-2 white--text"
            color="blue-grey"
            @click="showDialog = false"
          >
            Close
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
</template>

<script>
import {mapGetters} from 'vuex'
import appointmentService from "../../service/AppointmentService"
import colors from 'vuetify/lib/util/colors'
import BasicWorkingCalendarView from "../workingCalendar/BasicWorkingCalendarView"

export default {
  name: "AvailableAppointmentsModal",
  props:["patientId", "pharmacyId"],
  components: {
    BasicWorkingCalendarView
  },
  data: function() {
      return {
        appointments: [],
        dateFrom: null,
        dateTo: null,
        showDialog: false
      };
  },
  computed: {
     ...mapGetters(["loggedUser"])
  },
  methods: {
    show() {
        this.showDialog = true;
    },
    appointmentChosen(appointmentId) {
        this.$emit("appointment-chosen", appointmentId);
        this.showDialog = false;
    },
    changeAppointments: function (dateFrom, dateTo) {
        this.dateFrom = dateFrom;
        this.dateTo = dateTo;
        this.getNewAppointments();
    },
    getNewAppointments: function () {
        appointmentService.getAvailableDermatologistAppointments(this.loggedUser.id, this.dateFrom, this.dateTo, this.patientId, this.pharmacyId).then((response) => {
            this.assignNewAppointments(response);
        });
    },
    assignNewAppointments(response) {
      let new_appointments = [];
      let response_appointments = response.data;

      for (let appointment of response_appointments) {
        new_appointments.push({
          name: "Available",
          id: appointment.id,
          start: new Date(appointment.dateFrom),
          end: new Date(appointment.dateTo),
          length: appointment.lengthInMinutes,
          patient: "",
          pharmacy: appointment.pharmacyName,
          color: colors['green'].lighten1,
          timed: true,
        });
      }

      this.appointments = new_appointments;
    }
  }
};
</script>

<style scoped>
 >>> .v-dialog {
  overflow-y:unset !important;
}
</style>
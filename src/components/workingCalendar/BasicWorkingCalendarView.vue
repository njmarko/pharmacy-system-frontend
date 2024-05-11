<template>
  <div>
    <v-row class="fill-height">
      <v-col>
        <v-sheet height="64">
          <v-toolbar flat>
            <v-btn
              outlined
              class="mr-4"
              color="grey darken-2"
              @click="setToday"
            >
              Today
            </v-btn>
            <v-btn fab text small color="grey darken-2" @click="prev">
              <v-icon small> mdi-chevron-left </v-icon>
            </v-btn>
            <v-btn fab text small color="grey darken-2" @click="next">
              <v-icon small> mdi-chevron-right </v-icon>
            </v-btn>
            <v-toolbar-title v-if="displayType !== 'year' && $refs.calendar">
              {{ $refs.calendar.title }}
            </v-toolbar-title>
              <v-toolbar-title v-else>
              {{ currYear }}
            </v-toolbar-title>
            <v-spacer></v-spacer>
            <v-menu bottom right>
              <template v-slot:activator="{ on, attrs }">
                <v-btn outlined color="grey darken-2" v-bind="attrs" v-on="on">
                  <span>{{ typeToLabel[displayType] }}</span>
                  <v-icon right> mdi-menu-down </v-icon>
                </v-btn>
              </template>
              <v-list>
                <v-list-item @click="changeType('day')">
                  <v-list-item-title>Day</v-list-item-title>
                </v-list-item>
                <v-list-item @click="changeType('week')">
                  <v-list-item-title>Week</v-list-item-title>
                </v-list-item>
                <v-list-item @click="changeType('month')">
                  <v-list-item-title>Month</v-list-item-title>
                </v-list-item>
                <v-list-item v-if="scheduled === null && leaveDays === null" @click="changeType('year')">
                  <v-list-item-title>Year</v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>
          </v-toolbar>
        </v-sheet>
        <v-row v-if="displayType === 'year'">
          <v-col cols="12" v-for="(m,idx) in months" :key=idx>
            <v-sheet>
              <h3 class="text-center">
                {{ getMonthName(months[idx]) }}
              </h3>
              <v-calendar
                ref="calendar[m]"
                type="month"
                :start="m"
                :events="appointments"
                :event-color="getAppointmentColor"
                @click:event="showAppointment"
                @click:date="viewMonth"
              ></v-calendar>
            </v-sheet>
          </v-col>
        </v-row>
        <v-sheet height="600" v-else>
          <v-calendar
            ref="calendar"
            v-model="focus"
            color="primary"
            :events="appointments"
            :event-color="getAppointmentColor"
            :type="type"
            interval-height="80"
            @click:event="showAppointment"
            @click:date="viewDay"
            @change="updateRange"
          >
            <template v-slot:event="props">
              {{ props.event.name }}
              <br />
              {{ props.event.start | moment("HH.mm") }} -
              {{ props.event.end | moment("HH.mm") }}
            </template>
            ></v-calendar
          >
        </v-sheet>
      </v-col>
      <v-menu max-width="400px"
            v-model="selectedOpen"
            :close-on-content-click="false"
            :activator="selectedElement"
            offset-x
          >
            <v-card color="grey lighten-4" min-width="350px" flat>
              <v-toolbar :color="selectedAppointment.color" dark>
                <v-spacer />
                <v-toolbar-title
                  v-html="selectedAppointment.name"
                  style="align-text: center"
                ></v-toolbar-title>
                <v-spacer />
              </v-toolbar>
              <v-card-text>
                <div v-if="selectedAppointment.patient">
                  <strong style="align-self: left">Patient: </strong>
                  <span v-html="selectedAppointment.patient"></span>
                </div>
                <v-spacer />
                <div v-if="selectedAppointment.pharmacy">
                  <strong style="align-self: left">Pharmacy: </strong>
                  <span v-html="selectedAppointment.pharmacy"></span>
                </div>
                <v-spacer />
                <div v-if="selectedAppointment.length">
                  <strong  style="align-self: left">Start time: </strong>
                  <span>
                    {{ selectedAppointment.start | moment("DD.MM.YYYY. HH.mm") }}
                  </span>
                </div>
                <div v-else>
                  <strong  style="align-self: left">Start time: </strong>
                  <span>
                    {{ selectedAppointment.start | moment("DD.MM.YYYY.") }}
                  </span>
                </div>
                <v-spacer />
                <div v-if="selectedAppointment.length">
                    <strong style="align-self: left">Duration: </strong>
                    <span>{{ selectedAppointment.length }} minutes</span>
                </div>
                <div v-else>
                   <strong style="align-self: left">End time: </strong>
                  <span>
                    {{ selectedAppointment.end | moment("DD.MM.YYYY.") }}
                  </span>
                </div>
                <div v-if="!selectedAppointment.length">
                    <strong style="align-self: left">Status: </strong>
                    <span>{{ selectedAppointment.status }}</span>
                </div>
                <div v-if="!this.isPharmacyEmployee()">
                  <strong style="align-self: left">Price: </strong>
                  <span> {{ selectedAppointment.price }} RSD </span>
                </div>
                <div v-if="!this.isPharmacyEmployee()">
                  <v-spacer />
                  <strong style="align-self: left">Employee rating: </strong>
                  <v-rating
                    v-model="selectedAppointment.rating"
                    color="yellow darken-3"
                    background-color="grey darken-1"
                    empty-icon="$ratingFull"
                    half-increments
                    small
                    readonly
                  ></v-rating>
                </div>
              </v-card-text>
              <v-card-actions v-if="this.isPatient()" class="justify-center">
                <v-btn
                  color="primary"
                  v-if="this.calendarType == `availableAppointments`"
                  v-on:click="
                    $emit(
                      'schedule-appointment',
                      selectedAppointment.appointmentId
                    )
                  "
                  >Schedule appointment</v-btn
                >
                <v-btn
                  color="error"
                  v-else-if="this.calendarType == `scheduledAppointments`"
                  v-b-tooltip.hover
                  title="Cancel Appointment"
                  v-on:click="$emit('cancel-appointment', selectedAppointment)"
                >
                  <b-icon-calendar-x-fill></b-icon-calendar-x-fill>
                </v-btn>
              </v-card-actions>
              <v-card-actions v-if="scheduled !== null" class="justify-center">
                <v-btn
                  color="primary"
                   v-on:click="
                    $emit(
                      'dermatologist-choosen',
                      selectedAppointment.id
                    )
                  "
                  >Choose</v-btn>
              </v-card-actions>
            </v-card>
          </v-menu>
    </v-row>
    <br />
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { getISODateString } from "../../util/dateUtil";

export default {
  name: "BasicWorkingCalendarView",
  props: {
    appointments: Array,
    calendarType: {
      type: String,
      default: `availableAppointments`,
    },
    scheduled: {
      default: null
    },
    leaveDays: {
      default: null
    }
  },
  data: function () {
    return {
      focus: "",
      displayType: "month",
      type: "month",
      typeToLabel: {
        year: "Year",
        month: "Month",
        week: "Week",
        day: "Day",
      },
      selectedAppointment: {},
      selectedElement: null,
      selectedOpen: false,
      months: [],
      currYear: ""
    };
  },
  mounted() {
    this.initYearlyCalendar();
    this.$refs.calendar.checkChange();
  },
  methods: {
    viewMonth({ date }) {
      this.displayType = "month";
      this.type = "month";
      this.focus = date;
    },
    initYearlyCalendar() {
      let currentTime = new Date();
      this.currYear = currentTime.getFullYear();
      this.changeMonths();
    },
    changeMonths() {
      this.months = [];
      for (let month = 0; month <= 11; month++){
        this.months.push(getISODateString(new Date(this.currYear, month, 1)));
      }
    },
    getAppointmentsForYear() {
      var firstDay = new Date(this.currYear, 0, 1);
      var lastDay = new Date(this.currYear, 12, 0);

      let min = `${getISODateString(firstDay)}T00:00:00`;
      let max = `${getISODateString(lastDay)}T23:59:59`;
      this.$emit("change-appointments", min, max);
    },
    getMonthName(dtStr) {
        const date = new Date(dtStr)
        if (date.toString() !== 'Invalid Date')
            return date.toLocaleString('en-us', { month: 'long' })
        else
            return 'December'
    },
    changeType(type) {
      this.displayType = type;
      if (type !== 'year')
        this.type = type;
      else
        this.getAppointmentsForYear();
    },
    getAppointmentColor(appointment) {
      return appointment.color;
    },
    viewDay({ date }) {
      this.focus = date;
        if (this.type === "month") {
          this.type = "week";
          this.displayType = "week";
        }
        else {
          this.type = "day";
          this.displayType = "day";
        }
    },
    setToday() {
      if (this.displayType === 'year') {
        let currentTime = new Date();
        this.currYear = currentTime.getFullYear();
        this.changeMonths();
        this.getAppointmentsForYear();
      }
      else {
        this.focus = "";
      }
    },
    prev() {
      if (this.displayType === 'year') {
        this.currYear  = this.currYear - 1;
        this.changeMonths();
        this.getAppointmentsForYear();
      }
      else {
        this.$refs.calendar.prev();
      }
    },
    next() {
      if (this.displayType === 'year') {
        this.currYear  = this.currYear + 1;
        this.changeMonths();
        this.getAppointmentsForYear();
      }
      else {
        this.$refs.calendar.next();
      }
    },
    showAppointment({ nativeEvent, event }) {
      const open = () => {
        this.selectedAppointment = event;
        this.selectedElement = nativeEvent.target;
        setTimeout(() => {
          this.selectedOpen = true;
        }, 10);
      };
      if (this.selectedOpen) {
        this.selectedOpen = false;
        setTimeout(open, 10);
      } else {
        open();
      }
      nativeEvent.stopPropagation();
    },
    updateRange({ start, end }) {
      let min = `${start.date}T00:00:00`;
      let max = `${end.date}T23:59:59`;
      this.$emit("change-appointments", min, max);
    },
    isPharmacyEmployee() {
      return this.userRole == "Pharmacist" || this.userRole == "Dermatologist";
    },
    isPatient() {
      return this.userRole == "Patient";
    },
  },
  computed: {
    ...mapGetters(["userRole"]),
  },
};
</script>

<style scoped>
.v-event-timed {
  width: 100px;
}
</style>

<template>
  <div>
    <v-row class="fill-height">
      <v-col>
        <v-row>
          <v-col cols="4" v-for="(m,idx) in months" :key=idx>
            <v-sheet>
              <h3 class="text-center">
                {{ getMonthName(months[idx]) }}
              </h3>
              <v-calendar
                ref="calendar[m]"
                v-model="focus"
                :start="m"
                :type="type"
              ></v-calendar>
            </v-sheet>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
    <br />
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "YearlyWorkingCalendarView",
  props: {
    appointments: Array,
    calendarType: {
      type: String,
      default: `availableAppointments`,
    },
  },
  data: function () {
    return {
      focus: "",
      type: "month",
      typeDisplay: "month",
      typeToLabel: {
        year: "Year",
        month: "Month",
        week: "Week",
        day: "Day",
      },
      months: [
        '2020-01-01',
        '2020-02-01',
        '2020-03-01',
        '2020-04-01',
        '2020-05-01',
        '2020-06-01',
        '2020-07-01',
        '2020-08-01',
        '2020-09-01',
        '2020-10-01',
        '2020-11-01',
        '2020-12-01',
    ],
    selectedAppointment: {},
    selectedElement: null,
    selectedOpen: false,
    };
  },
  mounted() {
    this.$refs.calendar.checkChange();
  },
  methods: {
    getMonthName(dtStr) {
      const date = new Date(dtStr)
      if (date.toString() !== 'Invalid Date')
          return date.toLocaleString('en-us', { month: 'long' })
      else
          return 'December'
    },
    changeType(change) {
      this.typeDisplay = change;
      if (change !== 'year')
        this.type = change;

    },
    getAppointmentColor(appointment) {
      return appointment.color;
    },
    viewDay({ date }) {
      this.focus = date;
      if (this.isPharmacyEmployee()) {
        this.type = "week";
      } else {
        this.type = "day";
      }
    },
    setToday() {
      this.focus = "";
    },
    prev() {
      this.$refs.calendar.prev();
    },
    next() {
      this.$refs.calendar.next();
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

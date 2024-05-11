<template>
  <b-container id="calendar-container">
    <b-breadcrumb :items="this.breadCrumbItems"></b-breadcrumb>
    <EmployeeWorkingCalendarView />
  </b-container>
</template>

<script>
import EmployeeWorkingCalendarView from "../components/workingCalendar/EmployeeWorkingCalendarView"

import {mapGetters} from 'vuex'

export default {
  name: "WorkingCalendarView",
  components: {
    EmployeeWorkingCalendarView,
  },
  data: function () {
    return {
       breadCrumbItems: []
    };
  },
  mounted() {
    this.setupBreadcrumbItems();
  },
  methods : {
    setupBreadcrumbItems: function () {
      let role = this.userRole;
      this.breadCrumbItems = [
        {
          text: role + " panel",
          to: { name: "Home" }
        },
        {
          text: "Working calendar",
          active: true
        }
      ];
    }
  },
  computed: { ...mapGetters(["userRole"]) }
};
</script>

<style scoped>
#calendar-container {
  background-color: white;
}
</style>
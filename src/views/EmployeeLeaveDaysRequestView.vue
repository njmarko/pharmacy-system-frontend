<template>
  <b-container id="calendar-container">
    <b-breadcrumb :items="this.breadCrumbItems"></b-breadcrumb>
    <BasicLeaveDaysRequestView />
  </b-container>
</template>

<script>
import BasicLeaveDaysRequestView from "../components/leaveRequest/BasicLeaveDaysRequestView"

import {mapGetters} from 'vuex'

export default {
  name: "EmployeeLeaveDaysRequestView",
  components: {
    BasicLeaveDaysRequestView,
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
          text: "Leave days request",
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
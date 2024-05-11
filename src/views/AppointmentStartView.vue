<template>
  <b-container id="appointment-container">
    <b-breadcrumb :items="this.breadCrumbItems"></b-breadcrumb>
    <BasicAppointmentStartView />
  </b-container>
</template>

<script>
import BasicAppointmentStartView from "../components/appointment-start/BasicAppointmentStartView";
import {mapGetters} from 'vuex'

export default {
  name: "AppointmentStartView",
  components: {
    BasicAppointmentStartView,
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
          text: "Appointment",
          active: true
        }
      ];
    }
  },
  computed: { ...mapGetters(["userRole"]) }
};
</script>

<style scoped>
#appointment-container {
  background-color: white;
}
</style>
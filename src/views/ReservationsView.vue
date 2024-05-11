<template>
  <b-container id="patient-container">
    <b-breadcrumb :items="this.breadCrumbItems"></b-breadcrumb>
    <BasicReservationView />
  </b-container>
</template>

<script>
import BasicReservationView from "../components/reservation/BasicReservationView";
import {mapGetters} from 'vuex'

export default {
  name: "ReservationsView",
  components: {
    BasicReservationView,
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
          text: "Reservation",
          active: true
        }
      ];
    }
  },
  computed: { ...mapGetters(["userRole"]) }
};
</script>

<style scoped>
#patient-container {
  background-color: white;
}
</style>
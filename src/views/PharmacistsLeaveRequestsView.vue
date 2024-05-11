<template>
  <b-container v-if="pharmacy" id="pharmacy-container">
    <b-breadcrumb :items="this.breadCrumbItems"></b-breadcrumb>
    <h1>Leave days requests</h1>
    <LeaveRequestGridView v-bind:pharmacy="pharmacy" :numRows="2" :numCols="4" />
  </b-container>
  <h2 v-else>AAA</h2>
</template>

<script>
import { mapGetters } from "vuex";
import LeaveRequestGridView from "../components/leaveRequest/LeaveRequestGridView";

import pharmacyAdminService from "../service/PharmacyAdminService";

export default {
  components: {
    LeaveRequestGridView,
  },
  data() {
    return {
      pharmacy: null,
      breadCrumbItems: [
        {
          text: "Admin panel",
          to: { name: "PharmacyAdminHome" },
        },
        {
          text: "Leave days requests",
          active: true,
        },
      ],
    };
  },
  mounted() {
    pharmacyAdminService.getMyPharmacy(this.loggedUser.id).then((response) => {
      this.pharmacy = response.data;
    });
  },
  computed: {
    ...mapGetters(["loggedUser"]),
  },
};
</script>

<style scoped>
#pharmacy-container {
  background-color: white;
}
</style>
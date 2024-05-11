<template>
  <b-container id="pharmacy-container">
    <b-breadcrumb :items="this.breadCrumbItems"></b-breadcrumb>
    <h1>Leave days requests</h1>
    <LeaveRequestGridView :numRows="2" :numCols="4" viewType="sys-admin" />
  </b-container>
</template>

<script>
import LeaveRequestGridView from "../components/leaveRequest/LeaveRequestGridView";

export default {
  components: {
    LeaveRequestGridView,
  },
  data() {
    return {
      pharmacy: null,
      breadCrumbItems: [
        {
          text: "Sys admin panel",
          to: { name: "SysAdminHome" },
        },
        {
          text: "Leave days requests",
          active: true,
        },
      ],
    };
  },
  mounted() {
  },
};
</script>

<style scoped>
#pharmacy-container {
  background-color: white;
}
</style>
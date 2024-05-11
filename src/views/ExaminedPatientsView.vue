<template>
  <b-container id="homepage-container">
    <b-breadcrumb :items="this.breadCrumbItems"></b-breadcrumb>
    <ExaminedPatientCardList
     />
  </b-container>
</template>

<script>
import ExaminedPatientCardList from "../components/appointment/ExaminedPatientCardList";
import {mapGetters} from 'vuex'

export default {
  components: {
    ExaminedPatientCardList,
  },
  name: "ExaminedPatientsView",
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
          text: "Examined patients",
          active: true
        }
      ];
    }
  },
  computed: { ...mapGetters(["userRole"]) }
};
</script>
<style scoped>
#homepage-container {
  background-color: white;
}
</style>
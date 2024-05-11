<template>
  <b-container id="pharmacist-options">
    <h1><strong>Welcome {{ this.loggedUser.username }}</strong></h1>
    <hr />
    <b-breadcrumb :items="this.breadCrumbItems"></b-breadcrumb>
    <DermatologistOptions />
  </b-container>
  
</template>

<script>
import DermatologistOptions from "../components/employees/DermatologistOptions";
import {mapGetters} from 'vuex'

export default {
  name: "DermatologistHomePage",
  components: {
    DermatologistOptions
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
      this.breadCrumbItems = [
        {
          text: "Dermatologist panel",
          to: { name: "Home" },
          active: true,
        }
      ];
    },
  },
  computed: { ...mapGetters(["loggedUser"]) }
};
</script>

<style scoped>
#pharmacist-options {
  background-color: white;
}

.link-card:hover {
  box-shadow: #0000005e 0 12px 26px;
  transform: translate(0px, -10px);
}
.link-card {
  transition: 0.5s ease all;
  border-radius: 1.5em;
  background: #eee;
}
</style>
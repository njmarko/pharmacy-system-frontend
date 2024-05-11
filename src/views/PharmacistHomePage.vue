<template>
  <b-container id="pharmacist-options">
    <h1><strong>Welcome {{ this.loggedUser.username }}</strong></h1>
    <hr />
    <b-breadcrumb :items="this.breadCrumbItems"></b-breadcrumb>
    <PharmacistOptions />
  </b-container>
  
</template>

<script>
import PharmacistOptions from "../components/employees/PharmacistOptions";
import {mapGetters} from 'vuex'

export default {
  name: "PharmacistHomePage",
  components: {
    PharmacistOptions
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
          text: "Pharmacist panel",
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
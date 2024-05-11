<template>
  <b-container id="patient-container">
    <BasicPatientView />
  </b-container>
</template>

<script>
import BasicPatientView from "../components/patient/BasicPatientView";

export default {
  name: "PatientsView",
  components: {
    BasicPatientView,
  },
  data: function () {
    return {};
  }
};
</script>

<style scoped>
#patient-container {
  background-color: white;
}
</style>
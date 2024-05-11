<template>
  <b-container id="homepage-container">
    <br />
    <PatientsPastAppointmentsCardList
      :numCols="4"
      :numRows="2"
      :appointmentType="`Dermatologist`"
    />
  </b-container>
</template>

<script>
import PatientsPastAppointmentsCardList from "@/components/appointment/PatientsPastAppointmentsCardList";
export default {
  components: {
    PatientsPastAppointmentsCardList,
  },
  name: "PatientsPastDermatologistAppointmentsView",
};
</script>
<style scoped>
#homepage-container {
  background-color: white;
}
</style>



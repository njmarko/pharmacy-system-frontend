<template>
  <b-container id="homepage-container">
    <br />
    <PatientReservationCardList :numCols="4" :numRows="2"/>
  </b-container>
</template>

<script>
import PatientReservationCardList from "@/components/reservation/PatientReservationCardList";
export default {
  components: {
    PatientReservationCardList,
  },
  name: "PatientMedicineReservations",
};
</script>
<style scoped>
#homepage-container {
  background-color: white;
}
</style>


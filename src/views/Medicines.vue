<template>
  <b-container id="homepage-container">
    <br />
    <MedicineSearchAndFilter :numCols="4" :numRows="2"
     />
  </b-container>
</template>

<script>
import MedicineSearchAndFilter from "../components/medicine/MedicineSearchAndFilter";
export default {
  components: {
    MedicineSearchAndFilter,
  },
  name: "Medicines",
};
</script>
<style scoped>
#homepage-container {
  background-color: white;
}
</style>
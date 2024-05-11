<template>
  <b-container id="homepage-container">
    <br />
    <PharmacyCardList :numCols="4" :numRows="2"
    :imgWidth = "253"
    :imgHeight = "169"
    :imgBlur = "0"
     />
  </b-container>
</template>

<script>
import PharmacyCardList from "@/components/pharmacy/PharmacyCardList";
export default {
  components: {
    PharmacyCardList,
  },
  name: "Pharmacies",
};
</script>
<style scoped>
#homepage-container {
  background-color: white;
}
</style>
<template>
  <b-container id="supplier-options">
    <h2><b>Supplier</b></h2>
    <br/>
    <SupplierOptions />
  </b-container>
  
</template>

<script>
import SupplierOptions from "../components/supplier/SupplierOptions";
export default {
  name: "SupplierHomePage",
  components: {
    SupplierOptions
  },
  data: function () {
    return {
    };
  }
};
</script>

<style scoped>
#supplier-options {
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
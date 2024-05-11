<template>
  <b-container id="sys-admin-options">
    <h2><b>System Admin</b></h2>
    <br/>
    <SysAdminOptions />
  </b-container>
  
</template>

<script>
import SysAdminOptions from "../components/sysAdmin/SysAdminOptions";
export default {
  name: "SysAdminHomePage",
  components: {
    SysAdminOptions
  },
  data: function () {
    return {
    };
  }
};
</script>

<style scoped>
#sys-admin-options {
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
<template>
  <b-container id="patient-options">
    <h2>
      <b>Welcome {{ this.loggedUser().username }}</b>
    </h2>
    <br />
    <SupplierProfileOptions
    />
  </b-container>
</template>

<script>
import SupplierProfileOptions from "../components/supplier/SupplierProfileOptions";
import { mapGetters } from "vuex";

export default {
  components: {
    SupplierProfileOptions,
  },
  data: function () {
    return {};
  },
  mounted() {
    this.$router.push({ name: this.userProfilePage }).catch(() => {});
  },
  computed: {
    ...mapGetters(["userProfilePage"]),
  },
  methods: {
    ...mapGetters(["loggedUser"]),
  },
};
</script>

<style scoped>
#patient-options {
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


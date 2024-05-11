<template>
  <b-container id="user-options">
    <br />
    <UserOptions />
  </b-container>
</template>

<script>
// @ is an alias to /src
import UserOptions from "../components/patient/UnauthorizedUserOptions";
import {mapGetters} from 'vuex'

export default {
  name: "Home",
  components: {
    UserOptions
  },
   mounted() {
    this.$router.push({name: this.userHomePage}).catch(()=>{});
  },
  computed: {
    ...mapGetters([
      'userHomePage'
    ])
  }
};
</script>
<style scoped>
#user-options {
  background-color: white;
  min-height: 430px;
}

</style>

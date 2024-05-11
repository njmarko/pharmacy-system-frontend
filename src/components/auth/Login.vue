<template>
  <div>
    <b-container class="login-header">
      <h2>Login</h2>
    </b-container>
    <b-container fluid="sm" class="login-container">
      <b-form @submit.prevent="login">
        <div class="form-label-group">
          <b-form-input
            id="input-1"
            v-model="payload.username"
            type="text"
            required
            autofocus
            placeholder="Username"
          ></b-form-input>
          <label for="input-1">Username</label>
        </div>

        <div class="form-label-group">
          <b-form-input
            id="input-2"
            v-model="payload.password"
            type="password"
            required
            placeholder="Password"
          ></b-form-input>
          <label for="input-2">Password</label>
        </div>

        <b-button type="submit" variant="success" class="login-btn"
          >Log in</b-button
        >

        <p>
          Don't have an account?
          <router-link :to="{ name: 'Register' }">Register</router-link>
        </p>
      </b-form>
    </b-container>
  </div>
</template>


<script>
import userService from "@/service/UserService";
import { makeToast } from "@/util/makeToast";
import { mapActions } from "vuex";

export default {
  data() {
    return {
      payload: {
        username: "",
        password: "",
      },
    };
  },
  methods: {
    ...mapActions(["setUser"]),
    login() {
      userService
        .login(this.payload)
        .then((response) => {
          this.setUser(response.data);
          if (this.$route.query.redirect) {
            this.$router.push({ path: this.$route.query.redirect });
          } else {
            this.$router.push({ name: "Home" });
          }
        })
        .catch((error) => {
          if (error.response) {
            makeToast(this, "Error", "Incorrect login credentials.", "danger");
          }
        });
    },
  },
};
</script>

<style scoped>
.login-container {
  width: 80%  !important;
  background-color: white;
  border-radius: 20px;
  margin-top: 2%;
  padding-top: 15px;
  padding-bottom: 2px;
  box-shadow: #0000005e 0 12px 26px;
}

.login-header {
  color: rgb(78, 69, 69);
  margin-top: 7%;
  font-family: Arial, Helvetica, sans-serif;
}

.login-btn {
  margin-top: 5px;
  width: 98%;
  border-radius: 20px;
}
</style>
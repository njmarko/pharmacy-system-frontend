<template>
  <div>
    <b-container class="login-header">
      <h2>First time password change</h2>
    </b-container>
    <b-container fluid="sm" class="login-container">
      <b-form @submit.prevent="changePassword">
        <div class="form-label-group">
          <b-form-input
            id="input-1"
            v-model="payload.oldPassword"
            type="password"
            required
            autofocus
            placeholder="Old password"
          ></b-form-input>
          <label for="input-1">Old password</label>
        </div>

        <div class="form-label-group">
          <b-form-input
            id="input-2"
            v-model="payload.newPassword"
            type="password"
            required
            placeholder="New password"
          ></b-form-input>
          <label for="input-2">New password</label>
        </div>

        <div class="form-label-group">
          <b-form-input
            id="input-2"
            v-model="confirmedPassword"
            type="password"
            required
            placeholder="Confirm password"
          ></b-form-input>
          <label for="input-2">Confirm password</label>
        </div>

        <b-button type="submit" variant="success" class="login-btn"
          >Change password</b-button
        >

      </b-form>
    </b-container>
  </div>
</template>
<script>
import {mapGetters, mapActions} from 'vuex'
import {makeToast} from "../util/makeToast"
import userService from "../service/UserService"


export default {
    name: "ChangePasswordView",
    data() {
        return {
            confirmedPassword: '',
            payload: {
                oldPassword: '',
                newPassword: ''
            }
        }
    },
    mounted(){
        if(this.loggedUser().loggedIn)
            this.$router.go(-1);
    },
    methods: {
        changePassword(){
            if(this.confirmedPassword !== this.payload.newPassword){
                makeToast(this, "Error", "Passwords do not match.", "danger");
            }
            else{
                userService.firstPaswordChange(this.loggedUser().id, this.payload)
                    .then(()=>{
                        this.payload.oldPassword = '';
                        this.payload.newPassword = '';
                        this.setLoggedIn(true);
                        this.$router.push({name: this.userHomePage()}).catch(()=>{});
                    })
                    .catch(error=>{
                        if(error.response){
                            makeToast(this, "Error", error.response.data.message, "danger")
                        }
                        else{
                            makeToast(this,"Error", "An error occured", "danger");
                        }
                    })
                
            }
        },
        ...mapActions(["setLoggedIn"]),
        ...mapGetters(["loggedUser", "userHomePage"]),
        
    }
}
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
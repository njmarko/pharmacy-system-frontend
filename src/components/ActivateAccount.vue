<template>
    <b-container>
        <h1>{{message}}</h1>
        <div v-if="showLogin">
            Click <router-link :to="{name: 'Login'}">here</router-link> to log in.
        </div>
    </b-container>
    
</template>


<script>
import patientService from "../service/PatientService"

export default {
    name: "ActivateAccount",
    data() {
        return {
            message: '',
            showLogin: false
            
        }   
    },
    mounted(){
        patientService.activateAccount(this.$route.query.token)
            .then(response=>{
                this.message = response.data.message;
                this.showLogin = response.data.verified;
            })
    }
}
</script>
<template>
  <div>
    <b-container class="registration-header">
        <h2>Register</h2>
    </b-container>

    <b-container fluid="sm" class="registration-container">
        <b-form @submit.prevent="register">
       

            
            
            <div class="form-label-group">
                    <b-form-input
                    id="input-1"
                    v-model="payload.username"
                    type="text"
                    placeholder="Username"
                    required
                ></b-form-input>
                <label for="input-1">Username</label>
            </div>

            <div class="form-label-group">
                    <b-form-input
                        id="input-2"
                        v-model="payload.email"
                        placeholder="Email"
                        type="email"
                        required
                        >   
                    </b-form-input>
                    <label for="input-2">Email</label>
            </div>
            


            <div class="form-label-group">
                
                    <b-form-input
                    id="input-3"
                    v-model="payload.firstName"
                    type="text"
                    placeholder="First name"
                    required
                ></b-form-input>
                <label for="input-3">First name</label>

            </div>


            <div class="form-label-group">
                
                    <b-form-input
                        id="input-4"
                        v-model="payload.lastName"
                        placeholder="Last name"
                        type="text"
                        required
                        >   
                    </b-form-input>
                    <label for="input-4">Last name</label>
            </div>

            
            <div class="form-label-group">

                    <b-form-input
                        id="input-5"
                        v-model="payload.password"
                        placeholder="Password"
                        type="password"
                        required
                        >   
                    </b-form-input>
                    <label for="input-5">Password</label>
            </div>



            <div class="form-label-group">                
                    <b-form-input
                        id="input-6"
                        v-model="confirmedPassword"
                        placeholder="Confirm password"
                        type="password"
                        :state="payload.password === confirmedPassword && payload.password !== ''"
                        required
                        >   
                    </b-form-input>
                    <label for="input-6">Confirm password</label>
            </div>

            
                

            <div class="form-label-group">                
                    <b-form-input
                        id="input-7"
                        v-model="payload.phoneNumber"
                        placeholder="Phone number"
                        type="text"
                        required
                        >   
                    </b-form-input>
                    <label for="input-7">Phone number</label>
            </div>



            <div class="form-label-group">                
                    <b-form-input
                        id="input-8"
                        v-model="payload.address.street"
                        placeholder="Street"
                        type="text"
                        required
                        >   
                    </b-form-input>
                    <label for="input-8">Street</label>
            </div>
            


            
                
            <div class="form-label-group">

                    <b-form-input
                        id="input-9"
                        v-model="payload.address.streetNumber"
                        placeholder="Street number"
                        type="text"
                        required
                        >   
                    </b-form-input>
                    <label for="input-9">Street number</label>
            </div>


            <div class="form-label-group">

                    <b-form-input
                        id="input-10"
                        v-model="payload.address.zipCode"
                        placeholder="Zip code"
                        type="text"
                        required
                        >   
                    </b-form-input>
                    <label for="input-10">Zip code</label>
            </div>
            


            <div class="form-label-group">
                
                    <b-form-input
                        id="input-11"
                        v-model="payload.address.city"
                        placeholder="City"
                        type="text"
                        required
                        >   
                    </b-form-input>
                    <label for="input-11">City</label>

            </div>

            <div class="form-label-group">
                
                    <b-form-input
                        id="input-12"
                        v-model="payload.address.country"
                        placeholder="Country"
                        type="text"
                        required
                        >   
                    </b-form-input>
                    <label for="input-12">Country</label>
            </div>


         


            <b-button type="submit" variant="success" class="register-btn">Register</b-button>
            
            <br/>
            <p>Have an account? <router-link :to="{name: 'Login'}">Log in</router-link></p>

        </b-form>

        
    </b-container>
  </div>
</template>


<script>
import {makeToast} from '@/util/makeToast'
import patientService from '@/service/PatientService'

export default {
    name: "Register",
    data() {
        return {
            confirmedPassword: '',
            payload: {
                username: '',
                firstName: '',
                lastName: '',
                password: '',
                email: '',
                phoneNumber: '',
                address:{
                    street: '',
                    streetNumber: '',
                    city:'',
                    country: '',
                    zipCode: ''
                }
                
            }
        }
    },
    methods: {
        register(){
            if(this.payload.password !== this.confirmedPassword){
                makeToast(this, "Error", "Passwords don't match.", "danger");
            }
            else{

                patientService.registerPatient(this.payload)
                    .then(response=>{
                        this.confirmedPassword = ''
                        this.payload.username = ''
                        this.payload.firstName = ''
                        this.payload.lastName = ''
                        this.payload.password = ''
                        this.payload.email =  ''
                        this.payload.phoneNumber = ''
                        this.payload.address.street = ''
                        this.payload.address.streetNumber = ''
                        this.payload.address.city = ''
                        this.payload.address.country = ''
                        this.payload.address.zipCode = ''
                        makeToast(this, "Success", `Verification email has been sent to ${response.data.email}.`, "success")
                    })
                    .catch(error=>{
                        if(error.response){
                            makeToast(this, "Error", error.response.data.message, "danger")
                        }
                    })
            }
        },
    },
    computed: {
        checkPasswords(){
            return this.payload.password === this.confirmedPassword
        }
    }
}
</script>

<style scoped>
    .registration-container{
        width: 80%;
        background-color: white;
        border-radius: 20px;
        margin-top: 1%;
        padding-top: 15px;
        padding-bottom: 10px;
        padding-right: 50px;
        box-shadow: #0000005e 0 12px 26px;
    }

    .registration-header{
        color: rgb(78, 69, 69);
        margin-top: 1%;
        font-family: Arial, Helvetica, sans-serif;
    }

    .register-btn{
        width: 100%;
        margin-left: 1%;
        border-radius: 20px;
     }
</style>
<template>
  <div>
    <b-container class="registration-header">
        <h2>Register pharmacy admin</h2>
    </b-container>

    <b-container fluid="sm" class="registration-container">
        <b-form @submit.prevent="register">
       

                <div class="form-label-group">

                    <b-form-input
                    id="input-1"
                    v-model="payload.username"
                    type="text"
                    placeholder="Enter username"
                    required
                ></b-form-input>
                <label for="input-1">Username</label>
                </div>



                <div class="form-label-group">                
                    <b-form-input
                        id="input-2"
                        v-model="payload.email"
                        placeholder="Enter email"
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
                        placeholder="Enter first name"
                        required
                        >   
                    </b-form-input>
                    <label for="input-3">First name</label>
                </div>

                
                <div class="form-label-group">
                    <b-form-input
                    id="input-4"
                    v-model="payload.lastName"
                    type="text"
                    placeholder="Enter last name"
                    required
                ></b-form-input>
                <label for="input-4">Last name</label>
                </div>


                
                <div class="form-label-group">
                    <b-form-input
                        id="input-5"
                        v-model="payload.password"
                        placeholder="Enter password"
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

            
            <b-form-row>

                
                <b-col>
                    <b-form-group id="input-group-3" class="mb-auto">
                      <div class="form-label-group">
                        <model-select
                          :options="pharmacyOptions"
                          v-model="payload.pharmacyId"
                          placeholder="Select pharmacy"
                        ></model-select>
                      </div>
                    </b-form-group>
                </b-col>


            </b-form-row>
    
            <b-button type="submit" variant="success" class="register-btn">Register</b-button>
            
            <br/>

        </b-form>

        
    </b-container>
  </div>
</template>


<script>
import { ModelSelect } from 'vue-search-select' 
import pharmacyService from "../../service/PharmacyService"
import pharmacyAdminService from "../../service/PharmacyAdminService"
import { makeToast } from "../../util/makeToast"

export default {
    name: "RegisterPharmacyAdmin",
    components: { 
        ModelSelect
    },
    data() {
        return {
            confirmedPassword: '',
            payload: {
                firstName: '',
                lastName: '',
                username: '',
                password: '',
                email: '',
                pharmacyId: null
            },
            pharmacyOptions: [],
            allPharmacies: []
        }
    },
    computed: {
        checkPasswords(){
            return this.payload.password === this.confirmedPassword
        }
    },
    methods: {
        register(){
            if(this.payload.pharmacyId === null)
                makeToast(this, "Error", "Select a pharmacy.", "danger");
            else{
                if(this.payload.password !== this.confirmedPassword){
                    makeToast(this, "Error", "Passwords don't match.", "danger");
                }
                else{
                    pharmacyAdminService.registerPharmacyAdmin(this.payload)
                        .then(response=>{
                            makeToast(this, "Registration successful", `Successfully registered ${response.data.username}.`, "success");
                            this.payload.firstName = '';
                            this.payload.lastName = '';
                            this.payload.username = '';
                            this.payload.password = '';
                            this.payload.email = '';
                            this.payload.pharmacyId = null;
                            this.confirmedPassword = '';
                        })
                        .catch(error=>{
                            if(error.response)
                                makeToast(this, "Error", error.response.data.message, "danger");
                        })
                }
            }
        }
    },
    mounted(){
        pharmacyService.getPharmacyList()
            .then(response=>{
                this.allPharmacies = response.data;
                this.allPharmacies.forEach(element=>{
                    this.pharmacyOptions.push({value: element.id, text:  element.name + ", " + element.street + " " + element.streetNumber + ", " + element.city});
                
                })
            })
            .catch(error=>{
                if(error.response)
                    makeToast(this, "Error", error.response.data.message, "danger");
            })
    },
    
}
</script>


<style scoped>
    .registration-container{
        background-color: white;
        border-radius: 20px;
        margin-top: 2%;
        padding-top: 15px;
        padding-bottom: 10px;
        padding-right: 50px;
        box-shadow: #0000005e 0 12px 26px;
    }

    .registration-header{
        color: rgb(78, 69, 69);
        margin-top: 5%;
        font-family: Arial, Helvetica, sans-serif;
    }

    .register-btn{
        width: 100%;
        border-radius: 20px;
    }

    .dropdown{
        width: 48%;
        margin-left: 7%;
    }
    .ui.fluid.dropdown{
        width: 100%  !important;
        margin-left: 1%;
        border-radius: 20px;
    }
</style>
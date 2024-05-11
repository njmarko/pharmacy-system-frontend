<template>
  <div>
    <b-container class="registration-header">
        <h2>Register supplier</h2>
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
                ></b-form-input>
                <label for="input-3">First name</label>
            </div>

            <div class="form-label-group">                
                    <b-form-input
                        id="input-4"
                        v-model="payload.lastName"
                        placeholder="Enter last name"
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
                
            <div class="form-label-group">
                    <b-form-input
                        id="input-7"
                        v-model="payload.company"
                        placeholder="Enter company"
                        required
                        >   
                    </b-form-input>
                    <label for="input-7">Enter company</label>
            </div>

            <br/>
         
            <b-button type="submit" variant="success" class="register-btn">Register</b-button>
            

        </b-form>

        
    </b-container>
  </div>
</template>

<script>
import {makeToast} from '@/util/makeToast'
import supplierService from '@/service/SupplierService'

export default {
    name: "RegisterSupplier",
    data() {
        return {
            confirmedPassword: '',
            payload: {
                firstName: '',
                lastName: '',
                password: '',
                username: '',
                email: '',
                company: ''
            }
        }
    },
    computed: {
        checkPasswords(){
            return this.payload.password === this.confirmedPassword
        }

    },
    methods: {
        register(){
            if(this.payload.password !== this.confirmedPassword){
                makeToast(this, "Error", "Passwords don't match.", "danger");
            }
            else{
                supplierService.registerSupplier(this.payload)
                    .then(response=>{
                        makeToast(this, "Success", `Successfully registered ${response.data.username}.`, "success");
                        this.confirmedPassword = '';
                        this.payload.firstName = '';
                        this.payload.lastName = '';
                        this.payload.password = '';
                        this.payload.username = '';
                        this.payload.email = '';
                        this.payload.company = '';
                    })
                    .catch(error=>{
                        if(error.response){
                            makeToast(this, "Error", error.response.data.message, "danger");
                        }
                    })
            }
        }
    }
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
    
    
</style>
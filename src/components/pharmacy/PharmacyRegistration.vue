<template>
  <div>
    <b-container class="registration-header">
        <h2>Register pharmacy</h2>
    </b-container>

    <b-container class="registration-container">
        <b-form @submit.prevent="register">
       


            <div class="form-label-group">
                <b-form-input
                    id="input-1"
                    v-model="payload.name"
                    type="text"
                    placeholder="Enter name"
                    required
                ></b-form-input>
                    <label for="input-1">Name</label>
            </div>

            <div class="form-label-group">                
                    <b-form-input
                        id="input-2"
                        v-model="payload.description"
                        placeholder="Enter description"
                        type="text"
                        required
                        >   
                    </b-form-input>
                    <label for="input-2">Description</label>
            </div>


                
                <div class="form-label-group">                
                    <b-form-input
                        id="input-8"
                        v-model="payload.location.address.street"
                        placeholder="Enter street"
                        type="text"
                        required
                        >   
                    </b-form-input>
                    <label for="input-8">Street</label>
                </div>



                <div class="form-label-group">
                    <b-form-input
                        id="input-9"
                        v-model="payload.location.address.streetNumber"
                        placeholder="Enter street number"
                        type="text"
                        required
                        >   
                    </b-form-input>
                    <label for="input-9">Street number</label>
                </div>


                
                <div class="form-label-group">                
                    <b-form-input
                        id="input-11"
                        v-model="payload.location.address.city"
                        placeholder="Enter city"
                        type="text"
                        required
                        >   
                    </b-form-input>
                    <label for="input-11">City</label>
                </div>

                <div class="form-label-group"> 
                    <b-form-input
                        id="input-10"
                        v-model="payload.location.address.zipCode"
                        placeholder="Enter zip code"
                        type="text"
                        required
                        >   
                    </b-form-input>
                    <label for="input-10">Zip code</label>
                </div>


            
                <div class="form-label-group">            

                    <b-form-input
                        id="input-12"
                        v-model="payload.location.address.country"
                        placeholder="Enter country"
                        type="text"
                        class="country"
                        required
                        >   
                    </b-form-input>
                     <label for="input-12">Country</label>
               </div>
                
                <b-col>
                    <b-button  variant="info" class="float-right info-btn" @click="showInfo">
                        <b-icon icon="info-circle-fill" scale="1"></b-icon> 
                        Information                   
                    </b-button>
                
                </b-col>
                
                


                <LocationMap
                :clickable="true"
                :navigator="true"
                :longitude="this.payload.location.longitude"
                v-on:location-changed="updateLocation"
                :latitude="this.payload.location.latitude"
                v-b-tooltip.hover title="Click to select a location"
                />
            
            <br/>

            <b-button type="submit" variant="success" class="register-btn">Register</b-button>
            
                
            

        </b-form>

    </b-container>
    
     
         
  </div>
</template>

<script>
import LocationMap from '../openLayers/LocationMap'
import {makeToast} from '../../util/makeToast'
import pharmacyService from '../../service/PharmacyService'


export default {
    name: "PharmacyRegistration",
    components: {
        LocationMap
    }
    ,
    data() {
        return {
            locationChosen: false,
            showMap: false,
            payload: {
                name: '',
                description: '',
                location: {
                    latitude: 45.24768,
                    longitude: 19.83065,
                    address: {
                        country: '',
                        city: '',
                        street: '',
                        streetNumber: '',
                        zipCode: ''
                    }
                }
            }
        }
    },
    computed:{
        btnText(){
            if(this.showMap)
                return "Hide map";
            else
                return "Show map";
        }
    },
    methods: {
        register(){
            if(!this.locationChosen)
                makeToast(this, "Error", "You need to choose a location from the map.", "danger");
            else {
                    pharmacyService.registerPharmacy(this.payload)
                        .then(response=>{
                            makeToast(this, "Registration successful", `Successfully registered ${response.data.name}.` , "success");
                            this.payload.name = ''
                            this.payload.description = ''
                            this.payload.location.latitude = 45.24768
                            this.payload.location.longitude = 19.83065
                            this.payload.location.address.country = ''
                            this.payload.location.address.city = ''
                            this.payload.location.address.street = ''
                            this.payload.location.address.streetNumber = ''
                            this.payload.location.address.zipCode = ''
                        })
                        .catch(error=>{
                            if(error.response)
                                makeToast(this, "Error", error.response.data.message , "error");

                        })
                }
        },
        updateLocation(newLocation){
            this.locationChosen = true;
            this.payload.location = newLocation;
        },
        showInfo(){
            makeToast(this, "Working with map", "Click the map to select a location. Street number sometimes can't be loaded properly.", "info");
        },
        toggleMap(){
            this.showMap = !this.showMap;
        }
    }
}
</script>

<style scoped>
    .registration-container{
            background-color: white;
            border-radius: 20px;
            padding-top: 15px;
            padding-bottom: 10px;
            padding-right: 50px;
            box-shadow: #0000005e 0 12px 26px;
        }

    .registration-header{
        color: rgb(78, 69, 69);
        font-family: Arial, Helvetica, sans-serif;
    }

    .register-btn {
        width: 100%;
        border-radius: 20px;
    }

    .map{
        margin-top: 4%;
        margin-left: 1.8%;
        width: 97%;
        height: 300px;

    }
    
    .info-btn{
        width: 100%;
        border-radius: 20px;
    }
    
</style>
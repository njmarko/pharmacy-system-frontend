<template>
  <div>
    <b-container class="registration-header">
        <h2>Register medicine</h2>
    </b-container>

    <b-container fluid="sm" class="registration-container">
        <b-form @submit.prevent="register">
       
                <div class="form-label-group">
                    <b-form-input
                    id="input-1"
                    v-model="payload.code"
                    type="text"
                    placeholder="Enter code"
                    required
                ></b-form-input>
                    <label for="input-1">Code</label>
                </div>

                <div class="form-label-group">                
                    <b-form-input
                        id="input-2"
                        v-model="payload.name"
                        placeholder="Enter name"
                        type="text"
                        required
                        >   
                    </b-form-input>
                    <label for="input-2">Name</label>
                </div>       


                <div class="form-label-group">                
                    <b-form-input
                        id="input-6"
                        v-model="payload.manufacturer"
                        type="text"
                        placeholder="Enter manufacturer"
                        required
                        >   
                    </b-form-input>
                    <label for="input-6">Manufacturer</label>
                </div>


                <div class="form-label-group">                
                    <b-form-select
                    id="input-3"
                    v-model="payload.medicineShape"
                    :options="medicineShapeOptions"
                    required
                ></b-form-select>
                    <label for="input-3">Shape</label>
                </div>


                <div class="form-label-group">                
                    <b-form-select
                        id="input-4"
                        v-model="payload.medicineType"
                        :options="medicineTypeOptions"
                        required
                        >   
                    </b-form-select>
                    <label for="input-4">Type</label>
                </div>


                <div class="form-label-group">                
                    <b-form-select
                        id="input-7"
                        v-model="payload.issueOnRecipe"
                        :options="issueOnRecipeOptions"
                        required
                        >   
                    </b-form-select>
                    <label for="input-7">Issue on recipe</label>
                </div>


                <div class="form-label-group">
                    <b-form-input
                        id="input-5"
                        v-model="payload.composition"
                        placeholder="Enter composition"
                        rows="2"
                        max-rows="2"
                        required
                        >   
                    </b-form-input>
                    <label for="input-5">Composition</label>
                </div>


                <div class="form-label-group">
                    <b-form-input
                    id="input-10"
                    v-model="payload.points"
                    type="number"
                    required
                    min="0">
                        
                    </b-form-input>
                    <label for="input-10">Points</label>
                </div>

                <br/>
                    <!-- <b-form-group id="input-group-3" class="mb-auto"> -->
                        <label for="input-replacements">Medicine replacements</label>
                        <multi-select
                          :options="medicineReplacementOptions"
                          :selected-options="replacementObjects"
                          placeholder="Replacements"
                          @select="onSelect"
                          id="input-replacements"
                        ></multi-select>
                    <!-- </b-form-group> -->
                <br/>

                    <label for="input-8">Additional notes</label>
                    <b-form-textarea
                        id="input-8"
                        v-model="payload.additionalNotes"
                        placeholder="Enter additional notes"
                        rows="3"
                        max-rows="3"
                        no-resize
                        class="text-area-field"
                        >   
                    </b-form-textarea>
            <br/>
            <b-button type="submit" variant="success" class="register-btn">Register</b-button>
            
        </b-form>

        
    </b-container>
  </div>
</template>



<script>
import medicineService from '../../service/MedicineService'
import {makeToast} from '../../util/makeToast'
import { MultiSelect } from 'vue-search-select'

export default {
    name: "MedicineRegistration",
    components:{
        MultiSelect
    },
    data() {
        return {
            issueOnRecipeOptions: [
                {value: true, text: "Yes"},
                {value: false, text: "No"}
            ],
            medicineShapeOptions: [
                {value: "CAPSULE", text: "Capsule"},
                {value: "TABLET", text: "Tablet"},
                {value: "GREASE", text: "Grease"},
                {value: "PASTE", text: "Paste"},
                {value: "GEL", text: "Gel"},
                {value: "SYRUP", text: "Syrup"},
                {value: "SOLUTION", text: "Solution"},
                {value: "POWDER", text: "Powder"}
            ],
            medicineTypeOptions: [
                {value: "ANTIBIOTIC", text: "Antibiotic"},
                {value: "ANESTHETIC", text: "Anesthetic"},
                {value: "ANTIHISTAMINE", text: "Antihistamine"}
            ],
            replacementObjects: [],
            payload: {
                code: '',
                name: '',
                medicineShape: "CAPSULE",
                medicineType: "ANTIBIOTIC",
                composition: '',
                manufacturer: '',
                issueOnRecipe: true,
                additionalNotes: '',
                points: 0,
                replacements: []
            },
            medicineReplacementOptions: [],
            lastSelectItem: {}
        }
    },
    methods: {
        register(){
            this.replacementObjects.forEach((item)=>{
                this.payload.replacements.push(item.value);
            })
            medicineService.registerMedicine(this.payload)
                .then(response=>{
                    makeToast(this, "Success", `Successfully registered ${response.data.name}` , "success");
                    this.payload.code = ''
                    this.payload.name = ''
                    this.payload.medicineShape = "CAPSULE"
                    this.payload.medicineType = "ANTIBIOTIC"
                    this.payload.composition = ''
                    this.payload.manufacturer = ''
                    this.payload.issueOnRecipe = true
                    this.payload.additionalNotes = ''
                    this.payload.replacements = []
                    this.payload.points = 0
                    this.reset();
                })
                .catch(error=>{
                    if(error.response){
                        makeToast(this, "Error", error.response.data.message, "danger");
                    }
                })
        },
        onSelect(items, lastSelectItem){
            this.replacementObjects = items;
            this.lastSelectItem = lastSelectItem;
        },
        reset(){
            this.replacementObjects = []
        }
    },
    mounted(){
        medicineService.getAllMedicine()
            .then(response=>{
                response.data.forEach(element => {
                    this.medicineReplacementOptions.push({value: element.id, text: element.name})
                })
            })
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
        border-radius: 20px;
    }

    .dropdown-element{
         max-height: 100px;
        overflow-y: auto;
    }
    .dropdown{
        width: 100%;
    }

    .ui.fluid.dropdown{
        width: 100% !important;
        border-radius: 20px;
    }

    .text-area-field{
        border-radius: 20px;
    }
</style>
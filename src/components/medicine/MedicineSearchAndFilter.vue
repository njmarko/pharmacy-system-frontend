<template>
  <div>
    <h1>Drugs</h1>
    <div v-if="pageMedicine">
      <b-row class="mb-3 row-spacing">
        <b-col md="10">
          <b-form inline v-on:submit.prevent="onSearch">
            <div class="form-label-group">
              <b-form-input
                v-model="name"
                class="mr-2"
                placeholder="Enter medicine name"
                trim
                id="medicine-name"
                autofocus
              />
              <label for="medicine-name">Enter medicine name</label>
            </div>
            <b-button type="submit" variant="primary">
              <b-icon-search></b-icon-search> Search</b-button
            >
          </b-form>
        </b-col>
        <b-col md="2">
          <b-button v-b-toggle.collapse-1 variant="primary" class="float-right"
            ><b-icon-sliders></b-icon-sliders>Filter</b-button
          >
        </b-col>
        <b-col md="12">
          <b-collapse id="collapse-1" class="mt-2">
            <b-card>
              <b-form class="form-floating"
                inline
                v-on:submit.prevent="onSearch"
                v-on:reset.prevent="onReset"
              >
                <b-row>
                  <b-col lg="3" md="6">
                    <div class="form-label-group">
                        <b-form-input
                          v-model="lowGrade"
                          id="grade-low-input"
                          type="number"
                          step="0.01"
                          min="0.00"
                          max="5.00"
                          class="mr-2 form-control"
                        />
                      <label for="grade-low-input">Enter min grade </label>
                    </div>
                  </b-col>
                  <b-col lg="3" md="6">
                    <div class="form-label-group">
                      <b-form-input
                        v-model="highGrade"
                        id="grade-high-input"
                        type="number"
                        step="0.01"
                        min="0.00"
                        max="5.00"
                        class="mr-2"
                      />
                      <label for="grade-high-input">Enter max grade</label>
                    </div>
                  </b-col>
                  
                  <b-col lg="3" md="6">
                    <div class="form-label-group">
                      <b-form-select
                        v-model="medicineType"
                        id="medicine-type-input"
                        :options="medicineTypeOptions"
                      />
                    <label for="medicine-type-input">Medicine type</label>
                    </div>
                  </b-col>

                  <b-col lg="3" md="6">
                    <div class="form-label-group">
                      <b-form-select
                        v-model="issueOnRecipe"
                        id="issue-input"
                        class="mr-2"
                        :options="issueOnRecipeOptions"
                      />
                    <label for="issue-input">Purchase info</label>

                    </div>
                  </b-col>
                    <br/>
                    <br/>
                    <br/>
                  <b-col md="12">
                    <b-button type="submit" variant="primary" class="ml-auto"
                      >Apply</b-button
                    >
                    <b-button type="reset" variant="warning">Cancel</b-button>
                  </b-col>
                </b-row>
              </b-form>
            </b-card>
          </b-collapse>
        </b-col>
      </b-row>
      <b-row class="row-spacing" v-for="(row, rowI) in numRows" :key="rowI">
        <b-col
          v-bind:lg="cardWidth"
          sm="12"
          v-for="(medicine, index) in pageMedicine.content.slice(
            rowI * numCols,
            rowI * numCols + numCols
          )"
          :key="index"
        >
          
          <MedicineSearchResultCard :medicine="medicine" :key="medicine.id">
          </MedicineSearchResultCard>
        </b-col>
      </b-row>
      <h1 v-if="pageMedicine.empty">No drugs found.</h1>
      <b-pagination
        v-model="page"
        :total-rows="pageMedicine.totalElements"
        :per-page="size"
        first-number
        last-number
        align="center"
        v-on:input="load"
      ></b-pagination>
    </div>
    <h1 v-else>No drugs found.</h1>
  </div>
</template>


<script>
import medicineService from '../../service/MedicineService'
import MedicineSearchResultCard from '../medicine/MedineSearchResultCard'


export default {
    data() {
        return {
            pageMedicine: null,
            name: '',
            lowGrade: 0.0,
            highGrade: 5.0,
            issueOnRecipe: null,
            medicineType: null,
            page: 1,
            size: 8,
            cardWidth: 3,
            issueOnRecipeOptions: [
                {value: null, text: "-"},
                {value: true, text: "recipe is required"},
                {value: false, text: "recipe isn't needed"}
            ],
            medicineTypeOptions: [
              {value: null, text: "-"},
              {value: "ANTIBIOTIC", text:"Antibiotic"},
              {value: "ANESTHETIC", text: "Anesthetic"},
              {value: "ANTIHISTAMINE", text: "Antihistamine"}
            ]
        }
    },
    props: ['numRows', 'numCols'],
    components: {
        MedicineSearchResultCard
    },
    mounted(){
        this.load();
    },
    methods: {
        load(){
            medicineService.getAllMedicines(this.name, this.lowGrade, this.highGrade, this.issueOnRecipe, this.medicineType, this.page-1, this.size)
                .then(response=>{
                    this.pageMedicine = response.data;
                })
        },
        onSearch: function () {
            this.page = 1;
            this.load();
        },
    }
}
</script>

<style>
    .row-spacing {
     margin-top: 15px;
    margin-bottom: 15px;
}
</style>
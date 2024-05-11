<template>
  <b-container class="complaint-container">
    <h1>My recipes</h1>
    <div v-if="pageRecipes">
    <b-container>
        <b-row class="mb-3 row-spacing">
        <b-col md="10">
          <b-form inline v-on:submit.prevent="load">         
           <div class="form-label-group">
                    <b-form-select
                        v-model="sortDirection"
                        id="status-input"
                        class="mr-2"
                        :options="sortDirectionOptions"
                      />
            <label for="status-input">Date sorting</label>
           </div>
            <b-button type="submit" variant="primary">
              <b-icon-search></b-icon-search> Search</b-button>
            
          </b-form>
        </b-col>
       
      </b-row>
      <b-row class="row-spacing" v-for="(row, rowI) in numRows" :key="rowI">
        <b-col
          v-bind:lg="cardWidth"
          sm="12"
          v-for="(recipe, index) in pageRecipes.content.slice(
            rowI * numCols,
            rowI * numCols + numCols
          )"
          :key="index"
        >
          
          <RecipeCard :recipe="recipe" :key="recipe.recipeId">
          </RecipeCard>
        </b-col>
      </b-row>
    </b-container>
      <h1 v-if="pageRecipes.empty">No recipes found.</h1>
      <b-pagination
        v-model="page"
        :total-rows="pageRecipes.totalElements"
        :per-page="size"
        first-number
        last-number
        align="center"
        v-on:input="load"
      ></b-pagination>
    </div>
    <h1 v-else>No recipes found.</h1>
  </b-container>
</template>


<script>
import RecipeCard from "../components/recipe/RecipeCard"
import {mapGetters} from 'vuex'
import patientService from "../service/PatientService"


export default {
    name: "RecipesView",
    components: {
        RecipeCard
    },
    data() {
        return {
            numRows: 2,
            numCols: 4,
            cardWidth: 3,
            page: 1,
            size: 8,
            sortDirection: "asc",
            sortDirectionOptions: [
                {value: "desc", text: "Descending"},
                {value: "asc", text: "Ascending"}
            ],
            pageRecipes: null
        }
    },
    mounted(){
        this.load();
    },
    methods: {
        load(){
            patientService.getERecipes(this.loggedUser().id, this.page - 1, this.size, this.sortDirection)
                .then(response=>{
                    this.pageRecipes = response.data;
                })
        },
        ...mapGetters(["loggedUser"])
    }
}
</script>

<style scoped>

</style>
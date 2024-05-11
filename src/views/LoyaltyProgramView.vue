<template>
    <div>
      <h2>Loyalty program</h2>
    <b-tabs card
        active-nav-item-class="font-weight-bold"
        content-class="mt-3"
        fill>
      <b-tab title="Categories" lazy>
          <b-container class="category-container">
            <div v-if="pageCategories">
            <b-container>
                <b-row class="mb-3 row-spacing">
                <b-col md="10">
                  <b-form inline v-on:submit.prevent="load">  
                    <div class="form-label-group">
                        <b-form-select
                            v-model="sortCriteria"
                            id="sort-criteria"
                            class="mr-6"
                            :options="sortCriteriaOptions"
                              />
                        <label for="sort-criteria">Sorting criteria</label>
                  </div>       
                  <div class="form-label-group">
                            <b-form-select
                                v-model="sortDirection"
                                id="sort-dir"
                                class="mr-2"
                                :options="sortDirectionOptions"
                              />
                    <label for="sort-dir">Sorting direction</label>
                  </div>
                    <b-button type="submit" variant="primary" md="12">
                      <b-icon-sort-up></b-icon-sort-up> Sort</b-button>
                    
                        <b-button
                          variant="success"
                          class="add-btn"
                          @click="showCreateCategoryModal"
                          ><b-icon-bookmark-plus-fill></b-icon-bookmark-plus-fill> Add
                          category</b-button
                        >

                  </b-form>
                </b-col>
              
              </b-row>
              <b-row class="row-spacing" v-for="(row, rowI) in numRows" :key="rowI">
                <b-col
                  v-bind:lg="cardWidth"
                  sm="12"
                  v-for="(category, index) in pageCategories.content.slice(
                    rowI * numCols,
                    rowI * numCols + numCols
                  )"
                  :key="index"
                >
                  
                  <CategoryCard :category="category" :key="category.id">
                  </CategoryCard>
                </b-col>
              </b-row>
            </b-container>
              <h1 v-if="pageCategories.empty">No categories found.</h1>
              <b-pagination
                v-model="page"
                :total-rows="pageCategories.totalElements"
                :per-page="size"
                first-number
                last-number
                align="center"
                v-on:input="load"
              ></b-pagination>
            </div>
            <h1 v-else>No categories found.</h1>


            <b-modal
            id="create-category-modal"
            title="Create category"
            hide-footer
            header-text-variant="light"
            header-bg-variant="primary"
            scrollable>
                <input type="color" v-model="payload.color" class="form-control" id="color-input" v-b-tooltip.hover
                        title="Color">
                        <br/>

                        <div class="form-label-group">
                            <b-form-input
                            id="input-1"
                            v-model="payload.name"
                            placeholder="Category name"
                            type="text">
                            </b-form-input>
                            <label for="input-1">Category name</label>
                        </div>
                        <div class="form-label-group">
                            <b-form-input
                            id="input-2"
                            v-model="payload.points"
                            type="number"
                            min="1"
                            step="1"
                            placeholder="Points">
                            </b-form-input>
                            <label for="input-2">Points</label>
                        </div>
                        <div class="form-label-group">
                            <b-form-input
                            id="input-2"
                            v-model="payload.discount"
                            type="number"
                            min="1"
                            max="75"
                            step="1"
                            placeholder="Discount">
                            </b-form-input>
                            <label for="input-2">Discount</label>
                        </div>
                
                <br/>
                <b-button block variant="primary" @click="createCategory">Create category</b-button>


            </b-modal>
          </b-container>
      </b-tab>
      <b-tab title="Appointment points" lazy>
        <b-container v-if="pointsPayload">
            <div class="form-label-group">
                <b-form-input
                id="input-1"
                type="number"
                required
                autofocus
                min="0"
                v-model="pointsPayload.dermatologistPoints"
                placeholder="Dermatologist appointment points"
              ></b-form-input>
              <label for="input-1">Dermatologist appointment points</label>
            </div>

            <div class="form-label-group">
              <b-form-input
                id="input-2"
                type="number"
                required
                autofocus
                min="0"
                v-model="pointsPayload.pharmacistPoints"
                placeholder="Pharmacist appointment points"
              ></b-form-input>
              <label for="input-2">Pharmacist appointment points</label>
            </div>
            <b-button block variant="success" class="confirm-btn" :disabled="checkDisabled" @click="updateAppointmentPoints">Confirm</b-button>
        </b-container>
      </b-tab>
    </b-tabs>
    </div>
</template>

<script>
import CategoryCard from "../components/category/CategoryCard"
import categoryService from "../service/CategoryService"
import {eventBus} from "../util/eventBus"
import { makeToast } from '../util/makeToast'

export default {
    name: "LoyaltyProgramView",
    components: {
        CategoryCard
    },
    data() {
        return {
            sortCriteria: "points",
            sortDirection: "asc",
            sortCriteriaOptions: [
                {value: "points", text: "Points"},
                {value: "discount", text: "Discount"},
                {value: "name", text: "Name"}
            ],
            sortDirectionOptions: [
                {value: "asc", text: "Ascending"},
                {value: "desc", text: "Descending"}
            ],
            pageCategories: null,
            page: 1,
            size: 8,
            numRows: 2,
            numCols: 4,
            cardWidth: 3,
            payload: {
              color: '#000000',
              name: '',
              points: 0,
              discount: 0
            },
            pointsPayload: null,
            currentPoints: {
              dermatologistPoints: 0,
              pharmacistPoints: 0
            }
        }
    },
    mounted(){
        this.load();
        eventBus.$on("CATEGORY_LIST_CHANGED", ()=>{
            this.load();
        })
    },
    computed: {
      checkDisabled(){
        return this.currentPoints.dermatologistPoints == this.pointsPayload.dermatologistPoints && this.currentPoints.pharmacistPoints == this.pointsPayload.pharmacistPoints;
      }
    },
    methods: {
        load(){
            categoryService.getCategories(this.page - 1, this.size, this.sortCriteria, this.sortDirection)
                .then(response=>{
                    this.pageCategories = response.data;
                })
            categoryService.getAppointmentPoints()
              .then(response=>{
                this.currentPoints = response.data;
                this.pointsPayload = {...this.currentPoints};
              })
        },
        showCreateCategoryModal(){
          this.$bvModal.show("create-category-modal");
        },
        createCategory(){
            if(this.payload.name === '')
              makeToast(this, "Error", "Category name cannot be empty.", "danger");
            else{
                categoryService.createCategory(this.payload)
                  .then(()=>{
                    makeToast(this, "Success", `Category ${this.payload.name} successfully created.`, "success");
                    this.payload.color = "#000000";
                    this.payload.name = '';
                    this.payload.points = 0;
                    this.payload.discount = 0;
                    this.$bvModal.hide("create-category-modal");
                    this.load();
                  })
                  .catch(error=>{
                    if(error.response)
                      makeToast(this, "Error", error.response.data.message, "danger");
                  })
            }
        },
        updateAppointmentPoints(){
            categoryService.updateAppointmentPoints(this.pointsPayload)
              .then(response=>{
                this.currentPoints = response.data;
                this.pointsPayload = {...this.currentPoints};
                makeToast(this, "Success", "Points updated successfully.", "success");
              })
        }
    }
}
</script>


<style scoped>
    .category-container{
        background: white;
    }

    .add-btn{
      margin-left:5%;
    }

    .confirm-btn{
      border-radius: 20px;
    }
</style>
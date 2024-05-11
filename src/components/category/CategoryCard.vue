<template>
  <b-card
    no-body
    img-top
    title-variant="card-title"
    class="mb-2 h-100 option-card"
    :title="this.category.name"
  >
    <b-card-header :id="'header-'+this.category.id">
        <h3>{{this.category.name}} </h3>
    </b-card-header>
    <b-card-body class="h-100 d-flex flex-column">
      <b-card-text>
        
          <strong>Points: </strong><br />
          <span>{{ this.category.points}}</span>
          <br />
          <strong>Discount: </strong><br />
          <span>{{ this.category.discount }} %</span>          
          
      </b-card-text>
    </b-card-body>
    <b-card-footer>
          
          <b-button variant="warning" 
            v-b-tooltip.hover
            title="Edit category"
            @click="showEditCategoryModal"
            class="mb-2"
            :disabled="this.category.name === 'Default category'">
            <b-icon-pencil></b-icon-pencil>
            </b-button>
            
            <b-button variant="danger"
            v-b-tooltip.hover
            title="Delete category"
            class="mb-2"
            @click="deleteCategory"
            :disabled="this.category.name === 'Default category'">
            <b-icon-calendar-minus></b-icon-calendar-minus>
            </b-button>

    </b-card-footer>
    <b-modal
    :id="'modal-edit-category-' + this.category.id"
    :title="'Edit category ' + this.category.name"
       hide-footer
       header-text-variant="light"
       header-bg-variant="primary"
       scrollable
       class="order-modal">

                <input type="color" v-model="newColor" class="form-control" id="color-input" v-b-tooltip.hover
                title="Color">
                <br/>

                <div class="form-label-group">
                    <b-form-input
                    id="input-1"
                    v-model="newName"
                    placeholder="Category name"
                    type="text">
                    </b-form-input>
                    <label for="input-1">Category name</label>
                </div>
                <div class="form-label-group">
                    <b-form-input
                    id="input-2"
                    v-model="newPoints"
                    type="number"
                    min="0"
                    step="10"
                    placeholder="Points">
                    </b-form-input>
                    <label for="input-2">Points</label>
                </div>
                <div class="form-label-group">
                    <b-form-input
                    id="input-2"
                    v-model="newDiscount"
                    type="number"
                    min="1"
                    max="75"
                    step="1"
                    placeholder="Discount">
                    </b-form-input>
                    <label for="input-2">Discount</label>
                </div>
        
        <br/>
        <b-button block variant="primary" @click="updateCategory">Save changes</b-button>
    </b-modal>  

  </b-card>
</template>



<script>
import categoryService from "../../service/CategoryService"
import {eventBus} from "../../util/eventBus"
import {makeToast} from "../../util/makeToast"

export default {
    name: "CategoryCard",
    props: ["category"],
    data() {
        return {
            newName: '',
            newPoints: 0,
            newDiscount: 0,
            newColor: "#000000",
        }
    },
    mounted(){
      this.changeColor();
    }
    ,
    methods: {
      changeColor(){
        let style = document.querySelector("#header-" + this.category.id).style;
        
        style.backgroundColor = this.category.color;
        style.borderTopLeftRadius = "20px";
        style.borderTopRightRadius = "20px";
        style.color = "white";
        style.textShadow = "3px 2px 1px #000000";

      },
        showEditCategoryModal(){
            this.newName = this.category.name;
            this.newPoints = this.category.points;
            this.newDiscount = this.category.discount;
            this.newColor = this.category.color;
            this.$bvModal.show("modal-edit-category-" + this.category.id);
        },
        updateCategory(){
            categoryService.updateCategory(this.category.id, {
                name: this.newName,
                points: this.newPoints,
                discount: this.newDiscount,
                color: this.newColor
            })
            .then(()=>{
                this.$bvModal.hide("modal-edit-category-" + this.category.id);
                makeToast(this, "Success", `Category ${this.category.name} successfully updated.`, "success");
                this.category.points = this.newPoints;
                this.category.name = this.newName;
                this.category.discount = this.newDiscount;
                this.category.color = this.newColor;
                this.changeColor();
            })
            .catch(error=>{
              if(error.response)
                makeToast(this, "Error", error.response.data.message, "danger");
            })
        },
        deleteCategory(){
            this.$confirm({
              title: "Category deletion",
              message: `Are you sure you want to delete category ${this.category.name}?`,
              button: {
                no: "No",
                yes: "Yes",
              },
              callback: (confirm)=>{
                if(confirm){
                    categoryService.deleteCategory(this.category.id)
                    .then(()=>{
                        eventBus.$emit("CATEGORY_LIST_CHANGED");
                    })
                    .catch(error=>{
                        if(error.response)
                            makeToast(this, "Error", error.response.data.message, "danger");
                    })
                }
              }
            })

            
        }
    }
}
</script>

<style scoped>
    .card-title {
  color: #002664;
}

  .spacing{
    margin-top: 0 !important;
    margin-bottom: 0 !important;
  }

.option-card img {
  border-radius: 10%;
}
.option-card:hover {
  box-shadow: #0000005e 0 12px 26px;
  transform: translate(0px, -10px);
}
.option-card {
  transition: 0.5s ease all;
  border-radius: 1.5em;
  background: #eee;
  margin-bottom: 5px;
}
</style>
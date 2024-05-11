<template>
  <b-card
    no-body
    img-top
    title-variant="card-title"
    class="mb-2 h-100 option-card"
  >
    <b-card-header>
      <h3 class="card-header-title" @click="redirect">{{this.pharmacy.name}} </h3>
    </b-card-header>
    <b-card-footer>
          
          <b-button variant="danger" 
            @click="unsubscribe"
            class="mb-2">
            Unsubscribe
            </b-button>
    </b-card-footer>
  </b-card>
</template>


<script>
import pharmacyService from "../../service/PharmacyService"
import { mapGetters } from 'vuex'
import {eventBus} from "../../util/eventBus"

export default {
    data() {
        return {

        }
    },
    props: ["pharmacy"],
    methods: {
        unsubscribe(){
            //event.prevent();
            pharmacyService.unsubscribe(this.pharmacy.id, this.loggedUser().id)
                .then(()=>{
                    eventBus.$emit("SUBSCRIPTION_REMOVED");
                })
        },
        redirect(){
            this.$router.push({name: "PharmacyHomePage", params: { id: this.pharmacy.id}})
        },
        ...mapGetters(["loggedUser"])
    }

}
</script>

<style scoped>
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


.card-header-title:hover{
    cursor: pointer;
}

</style>
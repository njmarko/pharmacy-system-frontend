<template>
  <b-container class="complaint-container">
    <h1>{{text}}</h1>
    <div v-if="pageComplaints">
    <b-container>
      <b-row class="row-spacing" v-for="(row, rowI) in numRows" :key="rowI">
        <b-col
          v-bind:lg="cardWidth"
          sm="12"
          v-for="(complaint, index) in pageComplaints.content.slice(
            rowI * numCols,
            rowI * numCols + numCols
          )"
          :key="index"
        >
          
          <ComplaintCard :complaint="complaint" :showViewReply="showViewReply" :key="complaint.complaintId">
          </ComplaintCard>
        </b-col>
      </b-row>
    </b-container>
      <h1 v-if="pageComplaints.empty">No complaints found.</h1>
      <b-pagination
        v-model="page"
        :total-rows="pageComplaints.totalElements"
        :per-page="size"
        first-number
        last-number
        align="center"
        v-on:input="load"
      ></b-pagination>
    </div>
    <h1 v-else>No complaints found.</h1>
  </b-container>
</template>

<script>
import ComplaintCard from "../components/complaint/ComplaintCard"
import complaintService from "../service/ComplaintService"
import {mapGetters} from 'vuex'
import {eventBus} from "../util/eventBus"

export default {
    data() {
        return {
            page: 1,
            cardWidth: 3,
            pageComplaints: null,
            size: 8,
            numRows: 3,
            numCols: 4,
            text: ''
        }
    },
    components: {
        ComplaintCard
    },
    mounted(){
        this.load();
        eventBus.$on("REPLY-SENT", ()=>{
            this.load();

        })
    },
    computed: {
      showViewReply(){
        if(this.userRole() === "Patient")
          return true;
        else{
            let param = this.$route.query.answered;
            if(param === "no"){
              return false;
            }
            return true;

        }
      }
    },
    methods: {
        load(){
            if(this.userRole() === "Patient"){
                this.text = "My complaints";
                complaintService.getAllComplaints(this.loggedUser().id, this.page - 1, this.size)
                                .then(response=>{
                                    this.pageComplaints = response.data;
                })
            }
            else if(this.userRole() === "SysAdmin"){
                let param = this.$route.query.answered;
                if(param === "no"){
                  this.text = "Unanswered complaints";
                  complaintService.getUnansweredComplaints(this.page - 1, this.size)
                    .then(response=>{
                        this.pageComplaints = response.data;
                    })
                }
                else{
                  this.text = "My answered complaints";
                  complaintService.getAnsweredComplaintsForAdmin(this.page - 1, this.size, this.loggedUser().id)
                    .then(response=>{
                      this.pageComplaints = response.data;
                    })
                }
                
            }

            
        },
        ...mapGetters(["loggedUser", "userRole"])
    }
}
</script>


<style>
.row-spacing {
     margin-top: 15px;
    margin-bottom: 15px;
}

.complaint-container{
    background: white;
}
</style>
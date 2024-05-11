<template>
  <b-card
    no-body
    img-top
    title-variant="card-title"
    class="mb-2 h-100 option-card"
    :title="'Complaint ' + this.complaint.complaintId"
  >
    <b-card-header>
      <h3>{{this.complaint.complaintType}} Complaint </h3>
    </b-card-header>
    <b-card-body class="h-100 d-flex flex-column">
      <b-card-text>
          <b-badge :variant="badgeColor">{{this.badgeText}}</b-badge>
        <p>
          <strong>Date posted: </strong><br />
          <span>{{ this.complaint.datePosted | moment("DD.MM.YYYY. HH:mm")}}</span>
          <br />
          <strong>{{this.entityTitle}}: </strong><br />
          <span>{{ this.complaint.entity }}</span>
        </p>

          <hr>
          <strong>Content: </strong> <br/>
          <span>{{this.contentPreview}}</span>
          
      </b-card-text>
    </b-card-body>
    <b-card-footer>
          <b-button v-if="showViewReply" variant="primary" class="mb-2"  @click="showSeeReplyModal" v-b-tooltip.hover
              title="See answer"  :disabled="checkDisabled">
              <b-icon icon="question-circle-fill" aria-label="Help"></b-icon>
          </b-button>
          
          <b-button variant="warning" 
            v-else
            v-b-tooltip.hover
            title="Write a reply"
            @click="showWriteReplyModal"
            class="mb-2">
            <b-icon-pencil></b-icon-pencil>
            </b-button>
            
            <b-button variant="light"
            v-b-tooltip.hover
            title="Show full complaint content"
            class="mb-2"
            @click="showComplaintContent">
            <b-icon-search></b-icon-search>
            </b-button>

    </b-card-footer>
    <b-modal
    v-if="this.complaint.reply"
    :id="'modal-see-reply-' + this.complaint.complaintId"
    :title="'Complaint response'"
       hide-footer
       header-text-variant="light"
       header-bg-variant="primary"
       scrollable
       class="order-modal">
       <h5>
            {{this.complaint.reply.adminUsername}}
        <b-badge>
            {{this.complaint.reply.datePosted | moment("DD.MM.YYYY. HH:mm")}}
        </b-badge>
       </h5>
       <hr>
       {{this.complaint.reply.content}}
       
    </b-modal>  

    <b-modal
        :id="'modal-write-reply-' + this.complaint.complaintId"
        title="Write reply"
        hide-footer
        header-text-variant="light"
       header-bg-variant="primary"
       scrollable>
        <b-form-textarea
            id="input-8"
            v-model="content"
            placeholder="Enter reply"
            rows="5"
            max-rows="5"
            no-resize
            class="text-area-field"
            :state="this.content.length <= 1000 && this.content !== ''"
            >   
        </b-form-textarea>
        <b-form-invalid-feedback>
          Complaint reply cannot be longer than 1000 characters and cannot be empty.
        </b-form-invalid-feedback>
     <b-button class="mt-3" block variant="primary" @click="sendReply">Send</b-button>

    </b-modal>

    <b-modal
    :id="'modal-show-content-' + this.complaint.complaintId"
    title="Complaint content"
    hide-footer
    header-text-variant="light"
    header-bg-variant="primary"
    scrollable>
        {{this.complaint.title}}
    </b-modal>

  </b-card>
</template>


<script>
import { mapGetters } from 'vuex'
import complaintService from "../../service/ComplaintService"
import {eventBus} from "../../util/eventBus"
import {makeToast} from "../../util/makeToast"

export default {
    data() {
        return {
            content: ''
        }
    },
    computed: {
        entityTitle(){
            if(this.complaint.complaintType === "Employee")
                return "Employee name";
            else
                return "Pharmacy name";
        },
        badgeColor(){
            if(!this.complaint.reply)
                return "warning";
            else
                return "success";
        },
        badgeText(){
            if(!this.complaint.reply)
                return "Unanswered";
            else
                return "Answered";
        },
        checkDisabled(){
            if(!this.complaint.reply)
                return true;
            return false;
        },
        isPatient(){
            if(this.userRole() === "Patient")
                return true;
            else    
                return false;
        },
        contentPreview(){
            let index = Math.min(this.complaint.title.length, 22);
            let preview = this.complaint.title.slice(0, index);
            if(index !== this.complaint.title.length)
              preview += "...";
            return preview;
        }
    },
    methods: {
        showModal(modalName){
            this.$bvModal.show(modalName)
        },
        showWriteReplyModal(){

            this.$bvModal.show('modal-write-reply-'+this.complaint.complaintId);
        },
        showSeeReplyModal(){
            this.$bvModal.show('modal-see-reply-'+this.complaint.complaintId);

        },
        showComplaintContent(){
            this.$bvModal.show('modal-show-content-'+this.complaint.complaintId);

        },
        sendReply(){
          if(this.content.length > 1000 || this.content === ''){
            makeToast(this, "Error", "Complaint reply cannot be longer than 1000 characters and cannot be empty.", "danger");
          }
          else{
            complaintService.writeReply(this.complaint.complaintId, {
                content: this.content,
                adminId: this.loggedUser().id
            })
            .then(()=>{
                this.$bvModal.hide('modal-write-reply-'+this.complaint.complaintId);
                this.content = '';
                eventBus.$emit("REPLY-SENT");
                makeToast(this, "Success", "Reply successfully sent.", "success");

            })
            .catch(error=>{
              if(error.response)
                makeToast(this, "Error", error.response.data.message, "danger");
            })
          }
            
        },
        ...mapGetters(["userRole", "loggedUser"])
    },

    props: ["complaint", "showViewReply"]
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
<template>
   <b-modal
      ref="patientDetails"
      :size="modalSize"
      :header-bg-variant="headerBgVariant"
      :header-text-variant="headerTextVariant"
      :body-bg-variant="bodyBgVariant"
      :body-text-variant="bodyTextVariant"
      ok-only ok-variant="secondary" ok-title="Close"
    >
     <template #modal-header>
         <div class="mx-auto">
          <h3>{{patientName}}</h3>
         </div>
      </template>
      <b-container fluid v-if="examinedPatient">
        <div :style="divStyle">
          <b-row>
            <b-col  class="text-center">
              Date: <br/> <strong>{{ examinedPatient.from | moment("DD.MM.YYYY.") }}</strong>
            </b-col>
              <b-col  class="col-lg-6 col-md-6 col-sm-6 col-6 text-center">
              Price: <br/> <strong>{{ examinedPatient.price }} RSD</strong>
            </b-col>
          </b-row>
          <hr/>
          <b-row>
            <b-col class="col-lg-6 col-md-6 col-sm-6 col-6 text-center">
              From: <br/> <strong>{{ examinedPatient.from | moment("HH.mm A") }}</strong>
            </b-col>
            <b-col class="col-lg-6 col-md-6 col-sm-6 col-6 text-center">
              To: <br/>  <strong>{{ examinedPatient.to| moment("HH.mm A") }}</strong>
            </b-col>
          </b-row>
          <hr/>
          <b-row>
            <b-col class="text-center">
              <strong> Report: </strong> <br/> 
              <b-form-textarea
                id="textarea"
                v-model="examinedPatient.diagnostics"
                :disabled="true"
                no-resize
                rows="4"
                max-rows="4"
              ></b-form-textarea>
            </b-col>
          </b-row>
        </div>
        <div v-if="examinedPatient.medicines.length > 0"> 
            <hr/>
            <h4 class="text-center"> Prescribed medicines: </h4>
              <b-row class="row-spacing" v-for="(row, rowI) in numRows" :key="rowI">
                <b-col class='col-lg-6 col-md-8 col-sm-8 col-8 ml-auto mr-auto'
                v-for="p in slicedItems(rowI)"
                :key="p.id"
                >
                <PrescribedMedicineCard :medicine="p"/>

                </b-col>
            </b-row>
            <b-pagination v-if="examinedPatient.medicines.length > numRows * numCols"
                v-model="page"
                :total-rows="examinedPatient.medicines.length"
                :per-page="numRows * numCols"
                align="center"
            ></b-pagination>
        </div>
      </b-container>
    </b-modal>
</template>

<script>
import PrescribedMedicineCard from "./PrescribedMedicineCard"

export default {
  props: ["examinedPatient"],
  name: "ExaminedPatientDetailsModal",
  components: {
      PrescribedMedicineCard
  },
  data: function() {
      return {
        variants: ['primary', 'secondary', 'success', 'warning', 'danger', 'info', 'light', 'dark'],
        headerBgVariant: 'dark',
        headerTextVariant: 'light',
        bodyBgVariant: 'light',
        bodyTextVariant: 'dark',
        numRows: 1,
        numCols: 2,
        page: 1
      };
  },
  methods: {
    show() {
        this.$refs.patientDetails.show();
     },
    close() {
        this.$refs.patientDetails.hide();
    },
    slicedItems(rowI) {
      let indexFirst = ((this.page - 1) + rowI) * this.numCols;
      let indexLast =  ((this.page - 1) + rowI) * this.numCols  + this.numCols;
      let items = this.examinedPatient.medicines.slice(indexFirst, indexLast);
      return items;
    },
  },
  computed: {
    patientName () {
        return `${this.examinedPatient.patientFirstName} ${this.examinedPatient.patientLastName}`;
    },
    appointmentTime () {
        return `${this.examinedPatient.from} - ${this.examinedPatient.to}`;
    },
    modalSize () {
      if (this.examinedPatient !== null && this.examinedPatient.medicines.length > 0) {
        return "lg";
      }

      return "md";
    },
    divStyle () {
       if (this.examinedPatient !== null && this.examinedPatient.medicines.length > 0) {
        return "width:75%; margin:auto;";
      }

      return "";
    }
  }
};
</script>

<style scoped>
</style>
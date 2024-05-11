<template>
   <b-modal
      title="Modal Variants"
      ref="medicineInput"
      style="width:50%"
      centered 
      :header-bg-variant="headerBgVariant"
      :header-text-variant="headerTextVariant"
      :body-bg-variant="bodyBgVariant"
      :body-text-variant="bodyTextVariant"
      :footer-bg-variant="footerBgVariant"
      :footer-text-variant="footerTextVariant"
    >
     <template #modal-header>
         <div class="mx-auto">
          <h3>{{medicineToDefine.name}}</h3>
         </div>
      </template>
      <b-container fluid v-if="medicineToDefine">
        <b-row>
          <b-col class="text-center">
            Available quantity: <br/> <strong>{{medicineToDefine.quantity}}</strong>
          </b-col>
        </b-row>
        <hr/>
        <form ref="form" @submit.stop.prevent="handleSubmit">
        <b-form-group
          label="Quantity"
          label-for="quantity-input"
          type="number"
          :invalid-feedback="quantityMessage"
          :state="isQuantityValid"
        >
          <b-form-input
            id="quantity-input"
            v-model="quantity"
            @keypress="onlyNumber"
            :state="isQuantityValid"
            required
          ></b-form-input>
        </b-form-group>
         <b-form-group
          label="Therapy days"
          label-for="therapy-input"
          type="number"
          :invalid-feedback="therapyMessage"
          :state="isTherapyValid"
        >
          <b-form-input
            id="therapy-input"
            v-model="therapy"
            @keypress="onlyNumber"
            :state="isTherapyValid"
            required
          ></b-form-input>
        </b-form-group>
      </form>
      </b-container>

      <template #modal-footer>
        <div class="w-50" style="margin:auto">
            <b-button
            variant="success"
            size="md"
            class="float-left"
            :disabled="isQuantityValid !== null || isTherapyValid !== null"
            v-on:click="addMedicine"
          >
            Add
          </b-button>
          <b-button
            variant="primary"
            size="md"
            class="float-right"
            v-on:click="close"
          >
            Close
          </b-button>
        </div>
      </template>
    </b-modal>
</template>

<script>
export default {
  props: ["medicineToDefine"],
  name: "MedicineTherapyDefiningModal",
  data: function() {
      return {
        variants: ['primary', 'secondary', 'success', 'warning', 'danger', 'info', 'light', 'dark'],
        headerBgVariant: 'dark',
        headerTextVariant: 'light',
        bodyBgVariant: 'light',
        bodyTextVariant: 'dark',
        footerBgVariant: 'light',
        footerTextVariant: 'dark',
        quantity: 1,
        quantityMessage: '',
        therapy: 1,
        therapyMessage: ''

      };
  },
  methods: {
      show() {
        this.$refs.medicineInput.show();
      },
      close() {
        this.$refs.medicineInput.hide();
        this.resetValues();
      },
      resetValues() {
        this.quantity = 1;
        this.therapy = 1;
      },
      quantityValid() {
          if (this.quantity === null || this.quantity === '') {
              this.quantityMessage = "Quantity can not be empty!";
              return false;
          }

          if (this.quantity > this.medicineToDefine.quantity) {
              this.quantityMessage = "Quantity is greater than available quantity!";
              return false;
          }

          return null;

      },
      therapyValid() {
          if (this.therapy === null || this.therapy === '') {
              this.therapyMessage = "Therapy can not be empty!";
              return false;
          }

          return null;
      },
      onlyNumber($event) {
        let keyCode = ($event.keyCode ? $event.keyCode : $event.which);
        if (keyCode == 48 && ($event.target.selectionStart === 0)) {
           $event.preventDefault();
        }

        if (keyCode < 48 || keyCode > 57) { 
            $event.preventDefault();
        }
      },
      addMedicine() {
        this.$emit('medicine-added', this.medicineToDefine, this.quantity, this.therapy);
        this.close();
      }
  },
  computed: {
      isQuantityValid() {
        return this.quantityValid();
      },
      isTherapyValid() {
        return this.therapyValid();
      }
  }
};
</script>

<style scoped>
</style>
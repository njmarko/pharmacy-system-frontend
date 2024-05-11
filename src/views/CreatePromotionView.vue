<template>
  <b-container v-if="pharmacy" id="pharmacy-container">
    <b-card
      title="Create promotion"
      tag="article"
      class="mb-2 text-left"
      no-body
    >
      <b-card-title class="ml-2 mt-2">
        <h2>Create medicine promotion</h2>
      </b-card-title>
      <b-card-body>
        <b-form v-on:submit.prevent="createPromotion">
          <b-row>
            <b-col lg="12" xs="12">
              <b-form-group id="input-group-1" class="mb-2">
                <div class="date-time-group">
                  <date-picker
                    id="promotion-range-input"
                    type="date"
                    :clearable="false"
                    range
                    format="DD.MM.YYYY."
                    :disabled-date="disabledIfInvalidPromotionPeriod"
                    v-model="rangeDate"
                    placeholder="Select promotion period"
                  ></date-picker>
                </div>
              </b-form-group>
            </b-col>
          </b-row>
          <b-row>
            <b-col lg="12" xs="12">
              <b-form-group id="input-group-3" class="mb-2">
                <b-form-textarea
                  id="input-8"
                  v-model="promotion.content"
                  placeholder="Enter promotion text in free form. This content will be sent to subscribers via email once the order is created."
                  rows="5"
                  max-rows="5"
                  required
                  trim
                  no-resize
                  class="text-area-field my-rounded"
                  :state="promotion.content !== ''"
                >
                </b-form-textarea>
                <b-form-invalid-feedback>
                  Promotion content can't be empty.
                </b-form-invalid-feedback>
              </b-form-group>
            </b-col>
          </b-row>
        </b-form>
      </b-card-body>
      <b-card-footer>
        <b-button-group>
          <b-button
            variant="primary"
            size="sm"
            :disabled="!isValidPromotion"
            v-on:click="createPromotion"
            >Create promotion</b-button
          >
          <b-button size="sm" variant="danger" v-on:click="cancel"
            >Cancel</b-button
          >
        </b-button-group>
      </b-card-footer>
    </b-card>
    <b-breadcrumb :items="this.breadCrumbItems"></b-breadcrumb>
    <b-tabs content-class="mt-3" fill v-model="tabIndex">
      <b-tab title="Added medicines" lazy>
        <AddedMedicineGridView
          v-bind:promotion="promotion"
          v-on:remove-item-promotion="removeItemFromPromotion"
          v-on:edit-promotion-discount="editItemDiscount"
          :numRows="2"
          :numCols="4"
          ref="addedGrid"
        />
      </b-tab>
      <b-tab title="All medicines in stock" lazy active>
        <AvailbaleMedicineGridView
          v-bind:promotion="promotion"
          v-bind:pharmacy="pharmacy"
          v-on:add-item-promotion="addItemToPromotion"
          :numRows="2"
          :numCols="4"
          ref="availableGrid"
        />
      </b-tab>
    </b-tabs>
  </b-container>
  <h1 v-else>
    Ovo je nesto samo zato sto je Vue retardiran i nece da osvezi podatke kad se
    fetchuju u mounted
  </h1>
</template>

<script>
import { mapGetters } from "vuex";
import { makeToast } from "../util/makeToast";
import { getISODateString } from "../util/dateUtil";
import DatePicker from "vue2-datepicker";
import pharmacyService from "../service/PharmacyService";
import pharmacyAdminService from "../service/PharmacyAdminService";
import AvailbaleMedicineGridView from "../components/promotions/AvailableMedicineGridView";
import AddedMedicineGridView from "../components/promotions/AddedMedicineGridView";

export default {
  name: "CreatePromotionView",
  components: {
    DatePicker,
    AvailbaleMedicineGridView,
    AddedMedicineGridView,
  },
  data() {
    return {
      pharmacy: null,
      rangeDate: [new Date(), new Date()],
      promotion: {
        content: "",
        items: [],
      },
      tabIndex: 0,
      breadCrumbItems: [
        {
          text: "Admin panel",
          to: { name: "PharmacyAdminHome" },
        },
        {
          text: "Create promotion",
          active: true,
        },
      ],
    };
  },
  methods: {
    createPromotion: function () {
      const promotionData = {
        from: getISODateString(this.rangeDate[0]),
        to: getISODateString(this.rangeDate[0]),
        content: this.promotion.content,
        items: this.promotion.items.map((item) => {
          return { medicineId: item.id, discount: item.discount };
        }),
      };
      pharmacyService
        .createPromotion(this.pharmacy.id, promotionData)
        .then((response) => {
          if (response.status == 201) {
            makeToast(
              this,
              "Success",
              "Promotion created successfully. All subscribers are notified via email.",
              "success"
            );
            this.rangeDate = [new Date(), new Date()];
            this.promotion = { content: "", items: [] };
            if (this.tabIndex == 0) {
              this.$refs.addedGrid.reload();
            } else {
              this.$refs.availableGrid.reload();
            }
            this.tabIndex = 1;
          }
        })
        .catch((error) => {
          if (error.response) {
            makeToast(this, "Error", error.response.data.message, "danger");
          }
        });
    },
    cancel: function () {
      this.$confirm({
        title: "Discard changes",
        message: `Are you sure you want to discard changes made to current promotion?`,
        button: {
          no: "No",
          yes: "Yes",
        },
        callback: (confirm) => {
          if (confirm) {
            this.$router.push({ name: "Home" });
          }
        },
      });
    },
    addItemToPromotion: function (item, discount) {
      this.promotion.items.push({
        id: item.medicineId,
        discount: discount,
        item: item,
      });
      this.$refs.availableGrid.reload();
    },
    removeItemFromPromotion: function (removedItem) {
      this.promotion.items = this.promotion.items.filter(
        (item) => item.id != removedItem.id
      );
      this.$refs.addedGrid.reload();
    },
    editItemDiscount: function (item, discount) {
      item.discount = discount;
    },
    disabledIfInvalidPromotionPeriod: function (date, selection) {
      if (date < new Date(new Date().setHours(0, 0, 0, 0))) {
        return true;
      }
      if (selection.length == 1) {
        return date < selection[0];
      }
    },
  },
  mounted() {
    pharmacyAdminService.getMyPharmacy(this.loggedUser.id).then((response) => {
      this.pharmacy = response.data;
    });
  },
  computed: {
    ...mapGetters(["loggedUser"]),
    isValidPromotion: function () {
      return this.promotion.content != "" && this.promotion.items.length != 0;
    },
  },
};
</script>

<style scoped>
#pharmacy-container {
  background-color: white;
}

.my-rounded {
  border-radius: 20px;
}
</style>
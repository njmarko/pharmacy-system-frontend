<template>
  <b-container v-if="pharmacy" id="pharmacy-container">
    <div v-if="stocksPage.content">
      <b-breadcrumb :items="this.breadCrumbItems"></b-breadcrumb>
      <b-row align-v="center">
        <b-col lg="6" md="12">
          <b-form v-on:submit.prevent="search">
            <b-row align-v="center">
              <b-col lg="6" xs="12">
                <div class="form-label-group">
                  <b-form-input
                    v-model="medicineName"
                    placeholder="Enter medicine name"
                    trim
                    autofocus
                    id="medicine-name-input"
                  />
                  <label for="medicine-name-input">Enter medicine name</label>
                </div>
              </b-col>
              <b-col lg="4" xs="12">
                <b-button type="submit" variant="primary">
                  <b-icon-search></b-icon-search> Search</b-button
                >
              </b-col>
            </b-row>
          </b-form>
        </b-col>
        <b-col md="12" lg="6">
          <b-button-group class="form-label-group float-right">
            <b-button variant="success" v-on:click="showRegistrationModal"
              ><b-icon-plus-circle-fill></b-icon-plus-circle-fill> Register
              medicine</b-button
            >
            <b-button
              variant="info"
              v-on:click="$router.push({ name: 'MissingMedicineView' })"
              ><b-icon-cart-x-fill></b-icon-cart-x-fill> Missing
              medicines</b-button
            >
          </b-button-group>
        </b-col>
      </b-row>
      <div v-if="stocksPage.content.length != 0">
        <b-row class="row-spacing" v-for="(row, rowI) in numRows" :key="rowI">
          <b-col
            v-bind:lg="cardWidth"
            sm="12"
            v-for="(s, index) in stocksPage.content.slice(
              rowI * numCols,
              rowI * numCols + numCols
            )"
            :key="index"
          >
            <AdminMedicineStockCard
              v-bind:stock="s"
              v-on:remove-medicine="removeMedicine"
              v-on:update-price="updateMedicinePrice"
              :image="getMedicineImage(s)"
              :key="s.id"
            />
          </b-col>
        </b-row>
        <b-pagination
          v-model="page"
          :total-rows="stocksPage.totalElements"
          :per-page="size"
          v-on:input="fetchStocksPage"
          first-number
          last-number
          align="center"
        ></b-pagination>
      </div>
      <h2 v-else>No medicines found.</h2>
    </div>
    <h1 v-else>No medicines found.</h1>
    <b-modal
      :id="'medicine-registration-model'"
      :title="'Register medicine'"
      hide-footer
      header-text-variant="light"
      header-bg-variant="primary"
    >
      <b-form v-on:submit.prevent="registerMedicine">
        <b-row>
          <b-col lg="12" xs="12">
            <b-form-group id="input-group-1" class="mb-auto">
              <div class="form-label-group">
                <model-select
                  :options="availableMedicines"
                  v-model="medicine.medicineCode"
                  placeholder="Select a medicine"
                  id="medicine-code-input"
                  :isError="!medicine.medicineCode"
                ></model-select>
              </div>
            </b-form-group>
          </b-col>
        </b-row>
        <b-row>
          <b-col lg="12" xs="12">
            <b-form-group id="input-group-2" class="mb-auto">
              <div class="form-label-group">
                <b-form-input
                  v-model="medicine.price"
                  id="price-input"
                  type="number"
                  step="0.01"
                  min="0.00"
                  :state="medicine.price > 0"
                  placeholder="Enter medicine price"
                  required
                />
                <label for="price-input">Enter medicine price</label>
              </div>
            </b-form-group>
          </b-col>
        </b-row>
        <b-row>
          <b-col lg="12" xs="12">
            <b-form-group id="input-group-3" class="mb-auto">
              <div class="form-label-group">
                <b-form-input
                  v-model="medicine.quantity"
                  id="quantity-input"
                  type="number"
                  step="0.01"
                  min="0.00"
                  :state="medicine.quantity >= 0"
                  placeholder="Enter medicine quantity"
                  required
                />
                <label for="quantity-input">Enter medicine quantity</label>
              </div>
            </b-form-group>
          </b-col>
        </b-row>
        <b-button class="mt-3" block type="submit" variant="success" :disabled="!medicine.medicineCode"
          >Register medicine</b-button
        >
      </b-form>
      <b-button class="mt-3" v-on:click="hideModal" block variant="danger"
        >Close</b-button
      >
    </b-modal>
  </b-container>
</template>

<script>
import { mapGetters } from "vuex";
import { makeToast } from "../util/makeToast";
import pharmacyService from "../service/PharmacyService";
import pharmacyAdminService from "../service/PharmacyAdminService";
import medicineService from "../service/MedicineService";
import { ModelSelect } from "vue-search-select";
import AdminMedicineStockCard from "../components/medicine/AdminMedicineStockCard";

export default {
  name: "AdminMedicineStockView",
  components: {
    AdminMedicineStockCard,
    ModelSelect,
  },
  data: function () {
    return {
      stocksPage: [],
      breadCrumbItems: [
        {
          text: "Admin panel",
          to: { name: "PharmacyAdminHome" },
        },
        {
          text: "Medicine stocks",
          active: true,
        },
      ],
      pharmacy: null,
      page: 1,
      numRows: 2,
      numCols: 4,
      medicineName: "",
      medicine: {
        medicineCode: null,
        price: 200,
        quantity: 100,
      },
      availableMedicines: [{ value: null, text: "Please select a medicine" }],
    };
  },
  mounted() {
    pharmacyAdminService.getMyPharmacy(this.loggedUser.id).then((response) => {
      this.pharmacy = response.data;
      this.fetchStocksPage();
      medicineService.getAllMedicine().then((medicines) => {
        medicines.data.forEach((m) => {
          this.availableMedicines.push({
            value: m.medicineCode,
            text: `${m.name} (${m.medicineCode})`,
          });
        });
      });
    });
  },
  methods: {
    showRegistrationModal: function () {
      this.$bvModal.show("medicine-registration-model");
    },
    hideModal: function () {
      this.$bvModal.hide("medicine-registration-model");
    },
    getMedicineImage: function (stock) {
      return `https://via.placeholder.com/600x300/b3dce8/002664?text=${stock.medicineName}`;
    },
    fetchStocksPage: function () {
      pharmacyService
        .getAllMedicineStocks(
          this.pharmacy.id,
          this.page - 1,
          this.size,
          this.medicineName
        )
        .then((stocksResponse) => {
          this.stocksPage = stocksResponse.data;
        });
    },
    search: function () {
      this.page = 1;
      this.fetchStocksPage();
    },
    updateMedicinePrice: function (stock, newPrice) {
      pharmacyService
        .updateStock(this.pharmacy.id, stock.id, { newPrice: newPrice })
        .then((response) => {
          stock.currentPrice = response.data.currentPrice;
          makeToast(
            this,
            "Update successful",
            `Price of ${stock.medicineName} has been successfully updated to ${stock.currentPrice} RSD.`,
            "success"
          );
        })
        .catch((error) => {
          if (error.response) {
            makeToast(this, "Error", error.response.data.message, "danger");
          } else {
            makeToast(
              this,
              "Error",
              "An error has occured while trying to update medicine stock.",
              "danger"
            );
          }
        });
    },
    registerMedicine: function () {
      if (!this.medicine.medicineCode) {
        makeToast(this, "Error", "You have to select a medicine", "danger");
        return;
      }
      pharmacyService
        .registerMedicine(this.pharmacy.id, this.medicine)
        .then((response) => {
          if (response.status == 201) {
            this.medicineName = "";
            this.page = 1;
            this.medicine = {
              medicineCode: "",
              price: 200,
              quantity: 100,
            };
            this.fetchStocksPage();
            this.hideModal();
            makeToast(
              this,
              "Registration successful",
              `${response.data.medicineName} has been successfully registed.`,
              "success"
            );
          }
        })
        .catch((error) => {
          if (error.response) {
            makeToast(this, "Error", error.response.data.message, "danger");
          } else {
            makeToast(
              this,
              "Error",
              "An error has occured while trying to register medicine.",
              "danger"
            );
          }
        });
    },
    removeMedicine: function (stock) {
      this.$confirm({
        title: "Remove medicine",
        message: `Are you sure you want to remove ${stock.medicineName}?`,
        button: {
          no: "No",
          yes: "Yes",
        },
        callback: (confirm) => {
          if (confirm) {
            pharmacyService
              .removeMedicine(this.pharmacy.id, stock.id)
              .then((response) => {
                if (response.status == 204) {
                  if (this.stocksPage.content.length === 1 && this.page > 1) {
                    this.page -= 1;
                  }
                  this.fetchStocksPage();
                }
              })
              .catch((error) => {
                if (error.response) {
                  makeToast(
                    this,
                    "Error",
                    error.response.data.message,
                    "danger"
                  );
                } else {
                  makeToast(
                    this,
                    "Error",
                    "An error has occured while trying to remove medicine.",
                    "danger"
                  );
                }
              });
          }
        },
      });
    },
  },
  computed: {
    ...mapGetters(["loggedUser"]),
    size: function () {
      return this.numCols * this.numRows;
    },
    cardWidth: function () {
      return Math.round(12 / this.numCols);
    },
  },
};
</script>

<style scoped>
#pharmacy-container {
  background-color: white;
}
.row-spacing {
  margin-top: 15px;
  margin-bottom: 15px;
}
</style>

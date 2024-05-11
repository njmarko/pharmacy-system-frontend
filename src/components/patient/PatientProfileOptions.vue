<template>
  <div>
    <b-card no-body>
      <b-tabs
        card
        active-nav-item-class="font-weight-bold text-success"
        content-class="mt-3"
        fill
      >
        <b-tab title="Account" lazy>
          <b-card class="text-left">
            <b-card-title>
              Personal Info
              <b-button
                v-b-toggle="['collapse-1', 'collapse-2']"
                variant="link"
                class="float-right"
                ref="btnEditPersonalInfo"
                >Edit</b-button
              >
            </b-card-title>
            <b-collapse id="collapse-2" visible>
              <p>{{ this.user.firstName }} {{ this.user.lastName }}</p>
              <p>{{ this.user.phoneNumber }}</p>
            </b-collapse>
            <b-collapse id="collapse-1" class="mt-2">
              <b-card class="col-md-7">
                <b-form
                  v-on:submit.prevent="updateProfileInfo"
                  v-on:reset.prevent="resetProfileInfo"
                >
                  <b-form-group
                    label="First Name"
                    label-class="font-weight-bold"
                    label-for="input-firstName"
                  >
                    <b-form-input
                      id="input-firstName"
                      placeholder="Enter First Name"
                      type="text"
                      v-model="profileInfoDTO.firstName"
                    >
                    </b-form-input>
                  </b-form-group>

                  <b-form-group
                    label="Last Name"
                    label-class="font-weight-bold"
                    label-for="input-lastName"
                  >
                    <b-form-input
                      id="input-lastName"
                      placeholder="Enter Last Name"
                      type="text"
                      v-model="profileInfoDTO.lastName"
                    >
                    </b-form-input>
                  </b-form-group>
                  <b-form-group
                    label="Phone Number"
                    label-class="font-weight-bold"
                    label-for="input-phone"
                  >
                    <b-form-input
                      id="input-phone"
                      placeholder="Enter Phone Number"
                      type="text"
                      v-model="profileInfoDTO.phoneNumber"
                    >
                    </b-form-input>
                  </b-form-group>

                  <b-form-group>
                    <b-button type="submit" variant="primary" class="ml-auto"
                      >Save Changes</b-button
                    >
                    <b-button
                      type="reset"
                      variant="primary"
                      class="ml-auto float-right"
                      >Cancel</b-button
                    >
                  </b-form-group>
                </b-form>
              </b-card>
            </b-collapse>
          </b-card>

          <b-card class="text-left">
            <b-card-title>
              Address
              <b-button
                v-b-toggle="['collapse-3', 'collapse-4']"
                variant="link"
                class="float-right"
                ref="btnEditAddress"
                >Edit</b-button
              >
            </b-card-title>
            <b-collapse id="collapse-3" visible>
              <p>
                {{
                  this.user.street +
                  " " +
                  this.user.streetNumber +
                  ", " +
                  this.user.city +
                  ", " +
                  this.user.zipCode
                }}
              </p>
              <p>{{ this.user.country }}</p>
            </b-collapse>
            <b-collapse id="collapse-4" class="mt-2">
              <b-card class="col-md-7">
                <b-form
                  v-on:submit.prevent="updateAddress"
                  v-on:reset.prevent="resetAddress"
                >
                  <b-form-group
                    label="Country"
                    label-class="font-weight-bold"
                    label-for="input-country"
                  >
                    <b-form-input
                      id="input-country"
                      placeholder="Enter Country"
                      type="text"
                      v-model="addressDTO.country"
                    >
                    </b-form-input>
                  </b-form-group>

                  <b-form-group
                    label="City"
                    label-class="font-weight-bold"
                    label-for="input-city"
                  >
                    <b-form-input
                      id="input-city"
                      placeholder="Enter City"
                      type="text"
                      v-model="addressDTO.city"
                    >
                    </b-form-input>
                  </b-form-group>

                  <b-form-group
                    label="Street"
                    label-class="font-weight-bold"
                    label-for="input-street"
                  >
                    <b-form-input
                      id="input-street"
                      placeholder="Enter Street"
                      type="text"
                      v-model="addressDTO.street"
                    >
                    </b-form-input>
                  </b-form-group>

                  <b-form-group
                    label="Street Number"
                    label-class="font-weight-bold"
                    label-for="input-street-number"
                  >
                    <b-form-input
                      id="input-street-number"
                      placeholder="Enter Street Number"
                      type="text"
                      v-model="addressDTO.streetNumber"
                    >
                    </b-form-input>
                  </b-form-group>

                  <b-form-group
                    label="Zip Code"
                    label-class="font-weight-bold"
                    label-for="input-zip-code"
                  >
                    <b-form-input
                      id="input-zip-code"
                      placeholder="Enter Zip Code"
                      type="text"
                      v-model="addressDTO.zipCode"
                    >
                    </b-form-input>
                  </b-form-group>
                  <b-form-group>
                    <b-button type="submit" variant="primary" class="ml-auto"
                      >Save Changes</b-button
                    >
                    <b-button
                      type="reset"
                      variant="primary"
                      class="ml-auto float-right"
                      >Cancel</b-button
                    >
                  </b-form-group>
                </b-form>
              </b-card>
            </b-collapse>
          </b-card>

          <b-card class="text-left">
            <b-card-title> Account Info </b-card-title>
            <p>{{ this.user.username }}</p>
            <p>{{ this.user.email }}</p>
            <h5>Penalty points</h5>
            <b-progress
              v-bind:value="this.user.numPoints"
              :min="0"
              :max="3"
              show-progress
              variant="info"
            >
              <b-progress-bar
                v-bind:value="this.user.numPenalties"
                :label="`Penalty Points:${this.user.numPenalties}/${3}`"
              ></b-progress-bar>
            </b-progress>
          </b-card>

          <b-card class="text-left">
            <b-card-title>
              Password
              <b-button
                v-b-toggle="['collapse-5', 'collapse-6']"
                variant="link"
                class="float-right"
                >Edit</b-button
              >
            </b-card-title>
            <b-collapse id="collapse-5" visible>
              <p>••••••••</p>
            </b-collapse>
            <b-collapse id="collapse-6" class="mt-2">
              <b-card class="col-md-7">
                <b-form v-on:submit.prevent="updatePassword">
                  <b-form-group
                    label="Current Password"
                    label-class="font-weight-bold"
                    label-for="input-current-pw"
                  >
                    <b-form-input
                      id="input-current-pw"
                      placeholder="Enter Current Password"
                      type="password"
                      v-model="passwordDTO.oldPassword"
                      required
                      v-bind:state="this.passwordStatus"
                    >
                    </b-form-input>
                    <b-form-invalid-feedback>
                      {{ this.passwordError }}
                    </b-form-invalid-feedback>
                  </b-form-group>

                  <b-form-group
                    label="New Password"
                    label-class="font-weight-bold"
                    label-for="input-new-pw"
                  >
                    <b-form-input
                      id="input-new-pw"
                      placeholder="Enter New Password"
                      type="password"
                      v-model="passwordDTO.newPassword"
                      required
                    >
                    </b-form-input>
                  </b-form-group>

                  <b-form-group
                    label="Confirm Password"
                    label-class="font-weight-bold"
                    label-for="input-confirm-pw"
                  >
                    <b-form-input
                      id="input-confirm-pw"
                      placeholder="Enter Confirmation Password"
                      type="password"
                      v-model="passwordDTO.confirmPassword"
                      :state="checkPasswords"
                      required
                    >
                    </b-form-input>
                    <b-form-invalid-feedback>
                      Passwords do not match.
                    </b-form-invalid-feedback>
                  </b-form-group>

                  <b-form-group>
                    <b-button type="submit" variant="primary" class="ml-auto"
                      >Update Password</b-button
                    >
                    <b-button
                      type="reset"
                      v-b-toggle="['collapse-5', 'collapse-6']"
                      variant="primary"
                      class="ml-auto float-right"
                      >Cancel</b-button
                    >
                  </b-form-group>
                </b-form>
              </b-card>
            </b-collapse>
          </b-card>
        </b-tab>

        <b-tab title="Allergies" lazy>
          <b-card>
            <b-card-title>
              Patient Allergies
              <b-button
                v-b-toggle="['collapse-7', 'collapse-8']"
                variant="link"
                class="float-right"
                >Edit</b-button
              >
            </b-card-title>
            <b-collapse id="collapse-7" visible>
              <PatientAllergyOptions :numCols="4" :numRows="1" />
            </b-collapse>
            <b-collapse id="collapse-8" class="mt-2"> </b-collapse>
          </b-card>
          <b-card>
            <b-card-title>
              Add Allergies
              <b-button
                v-b-toggle="['collapse-9', 'collapse-10']"
                variant="link"
                class="float-right"
                >Edit</b-button
              >
            </b-card-title>
            <b-collapse id="collapse-9">
              <PatientNonAllergyOptions :numCols="4" :numRows="1" />
            </b-collapse>
            <b-collapse id="collapse-10" class="mt-2"> </b-collapse>
          </b-card>
        </b-tab>

        <b-tab title="Loyalty Program" lazy>
          <b-card class="text-left">
            <b-card-title> Current Category </b-card-title>
            <span>{{ this.user.patientCategoryName }}</span> 
            <br/>
            <input type="color" v-model="user.patientCategoryColor" readonly disabled class="color-input">
          </b-card>
          <b-card class="text-left">
            <b-card-title>Benefits</b-card-title>
            <p>{{this.user.patientCategoryDiscount}}% discount</p>
          </b-card>
          <b-card class="text-left">
            <b-card-title>Loyalty Points</b-card-title>
            <b-progress
              :value="this.user.numPoints"
              :min="0"
              :max="this.nextCategory.points"
              show-progress
              variant="info"
            >
              <b-progress-bar
                :value="this.user.numPoints"
                :label="`Loyalty Points:${this.user.numPoints} ${this.nextCategoryPoints} ${this.nextCategoryName}`"
              ></b-progress-bar>

            </b-progress>
          </b-card>
        </b-tab>
      </b-tabs>
    </b-card>
  </div>
</template>


<script>
import patientService from "@/service/PatientService";
import userService from "@/service/UserService";
import { makeToast } from "../../util/makeToast";
import PatientAllergyOptions from "@/components/patient/PatientAllergyOptions";
import PatientNonAllergyOptions from "@/components/patient/PatientNonAllergyOptions";

export default {
  name: "PatientProfileOptions",
  props: ["username", "userId"],
  components: {
    PatientAllergyOptions,
    PatientNonAllergyOptions,
  },
  data: function () {
    return {
      user: {},
      nextCategory: {},
      profileInfoDTO: {},
      addressDTO: {},
      defaultUserData: {},
      allergyFields: ["Drug Name"],
      passwordDTO: {
        oldPassword: null,
        newPassword: null,
        confirmPassword: null,
      },
      passwordError: null,
      passwordStatus: null,
    };
  },
  mounted() {
    patientService.getPatient(this.userId).then((response) => {
      this.user = { ...response.data };
      this.profileInfoDTO = {
        firstName: response.data.firstName,
        lastName: response.data.lastName,
        phoneNumber: response.data.phoneNumber,
      };
      this.addressDTO = {
        country: response.data.country,
        city: response.data.city,
        street: response.data.street,
        streetNumber: response.data.streetNumber,
        zipCode: response.data.zipCode,
      };
      this.defaultUserData = { ...response.data };

      patientService.getNextPatientCategory(this.userId)
        .then(response=>{
          this.nextCategory = response.data;
        })
    });
  },
  methods: {
    updateProfileInfo: function () {
      patientService
        .updateProfileInfo(this.userId, this.profileInfoDTO)
        .then((response) => {
          this.user = { ...response.data };
          this.defaultUserData = { ...response.data };
          this.profileInfoDTO = {
            firstName: response.data.firstName,
            lastName: response.data.lastName,
            phoneNumber: response.data.phoneNumber,
          };
          makeToast(this, "Success", `Personal info updated.`, "success");
        })
        .catch((err) => {
          if (err.response) {
            makeToast(this, "Error", err.response.data.message, "danger");
          } else {
            makeToast(
              this,
              "Error",
              "An error occured when updating personal info.",
              "danger"
            );
          }
        });
    },
    updateAddress: function () {
      patientService
        .updateProfileInfo(this.userId, this.addressDTO)
        .then((response) => {
          this.user = { ...response.data };
          this.defaultUserData = { ...response.data };
          this.addressDTO = {
            country: response.data.country,
            city: response.data.city,
            street: response.data.street,
            streetNumber: response.data.streetNumber,
            zipCode: response.data.zipCode,
          };
          makeToast(this, "Success", `Address info updated.`, "success");
        })
        .catch((err) => {
          if (err.response) {
            makeToast(this, "Error", err.response.data.message, "danger");
          } else {
            makeToast(
              this,
              "Error",
              "An error occured when updating address.",
              "danger"
            );
          }
        });
    },
    resetProfileInfo: function () {
      this.profileInfoDTO.firstName = this.defaultUserData.firstName;
      this.profileInfoDTO.lastName = this.defaultUserData.lastName;
      this.profileInfoDTO.phoneNumber = this.defaultUserData.phoneNumber;
      this.$refs.btnEditPersonalInfo.click();
    },
    resetAddress: function () {
      this.addressDTO.country = this.defaultUserData.country;
      this.addressDTO.city = this.defaultUserData.city;
      this.addressDTO.street = this.defaultUserData.street;
      this.addressDTO.streetNumber = this.defaultUserData.streetNumber;
      this.addressDTO.zipCode = this.defaultUserData.zipCode;
      this.$refs.btnEditAddress.click();
    },

    updatePassword: function () {
      if (!this.checkPasswords) {
        return;
      }
      userService
        .updatePassword(this.userId, this.passwordDTO)
        .then(() => {
          this.passwordError = null;
          this.passwordStatus = null;
          makeToast(this, "Success", `Password updated.`, "success");
        })
        .catch((err) => {
          if (err.response && err.response.status == 400) {
            this.passwordError = err.response.data.message;
            this.passwordStatus = false;
          } else if (err.response) {
            makeToast(this, "Error", err.response.data.message, "danger");
          } else {
            makeToast(
              this,
              "Error",
              "An error occured when updating password.",
              "danger"
            );
          }
        });
    },
  },
  computed: {
    checkPasswords() {
      if (!this.passwordDTO.newPassword) {
        return null;
      }
      return this.passwordDTO.newPassword === this.passwordDTO.confirmPassword;
    },
    nextCategoryPoints(){
      if(this.nextCategory.points !== undefined)
        return '/ ' + this.nextCategory.points + ' ';
      return ''
    },
    nextCategoryName(){
      if(this.nextCategory.name !== undefined)
        return this.nextCategory.name;
      return '';
    }
  },
};
</script>

<style scoped>
.color-input{
  border: solid 1px black;
}
</style>

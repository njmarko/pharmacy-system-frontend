<template>
  <div v-if="loaded">
    <b-card no-body>
      <b-card class="text-left">
        <b-card-title>
          <h3>Personal Info</h3>
          <b-button
            v-b-toggle="['collapse-1', 'collapse-2']"
            variant="link"
            class="float-right"
            ref="btnEditPersonalInfo"
            >Edit</b-button
          >
        </b-card-title>
        <b-collapse id="collapse-2" visible>
          <p>
            <strong>Full name: </strong>{{ this.employee.firstName }}
            {{ this.employee.lastName }}
          </p>
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
                  v-model="payload.firstName"
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
                  v-model="payload.lastName"
                >
                </b-form-input>
              </b-form-group>

              <b-form-group>
                <b-button type="submit" variant="primary" class="ml-auto"
                  >Save Changes</b-button
                >
                <b-button
                  type="reset"
                  class="ml-auto float-right"
                  >Cancel</b-button
                >
              </b-form-group>
            </b-form>
          </b-card>
        </b-collapse>
      </b-card>

      <b-card class="text-left">
        <b-card-title> <h3>Account Info</h3> 
        <star-rating
            :read-only="true"
            :inline="true"
            :increment="0.01"
            :star-size="25"
            :rating="averageGrade"
            :show-rating="false"
        /></b-card-title>
        <p><strong>Username: </strong>{{ this.employee.username }}</p>
        <p><strong>Email: </strong>{{ this.employee.email }}</p>
      </b-card>

      <b-card class="text-left">
        <b-card-title>
          <h3>Password</h3>
          <b-button
            v-b-toggle="['collapse-5', 'collapse-6']"
            variant="link"
            class="float-right"
            ref="btnChangePassword"
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
                >
                </b-form-input>
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
                  class="ml-auto float-right"
                  >Cancel</b-button
                >
              </b-form-group>
            </b-form>
          </b-card>
        </b-collapse>
      </b-card>
    </b-card>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { mapActions } from "vuex";
import pharmacyEmployeeService from "../../service/PharmacyEmployeeService";
import { makeToast } from "../../util/makeToast";
import userService from "../../service/UserService";
import StarRating from "vue-star-rating";

export default {
  data() {
    return {
      loaded: false,
      employee: {},
      averageGrade: 0,
      payload: {},
      passwordDTO: {
        oldPassword: null,
        newPassword: null,
        confirmPassword: null,
      },
      defaultPharmacyEmployeeData: {},
    };
  },
  components: {
    StarRating
  },
  mounted() {
      this.employee = {...this.loggedUser};
      pharmacyEmployeeService.getAverageGrade(this.loggedUser.id).then((response) => {
          this.averageGrade = response.data;
      });
      this.defaultPharmacyEmployeeData = {...this.loggedUser};
      this.payload = {...this.employee};
      this.loaded = true;
  },
  methods: {
    ...mapActions(["setLastAndFirstName"]),
    updateProfileInfo() {
      pharmacyEmployeeService
        .updateProfileInfo(this.loggedUser.id, this.payload)
        .then((response) => {
          this.employee = { ...response.data };
          this.setLastAndFirstName(response.data);
          this.defaultPharmacyEmployeeData = { ...response.data };
          this.payload = {
            firstName: response.data.firstName,
            lastName: response.data.lastName,
          };
          makeToast(this, "Success", `Personal info updated.`, "success");
          this.$refs.btnEditPersonalInfo.click();
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
    resetProfileInfo() {
      this.payload.firstName = this.defaultPharmacyEmployeeData.firstName;
      this.payload.lastName = this.defaultPharmacyEmployeeData.lastName;
      this.$refs.btnEditPersonalInfo.click();
    },
    updatePassword: function () {
      if (!this.checkPasswords) {
        return;
      }
      userService
        .updatePassword(this.loggedUser.id, this.passwordDTO)
        .then(() => {
          makeToast(this, "Success", `Password updated.`, "success");
          this.$refs.btnChangePassword.click();
        })
        .catch((err) => {
          if (err.response)
            makeToast(this, "Error", err.response.data.message, "danger");
        });
    },
  },
  computed: {
    ...mapGetters(["loggedUser"]),
    checkPasswords() {
      if (!this.passwordDTO.newPassword) {
        return null;
      }
      return this.passwordDTO.newPassword === this.passwordDTO.confirmPassword;
    },
  },
};
</script>
import Vue from "vue";
import Vuex from "vuex";
import createPersistedState from 'vuex-persistedstate';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    loggedUser: {},
    employeeAppointmentScheduled: false
  },
  mutations: {
    setUser(state, loggedUser) {
      state.loggedUser = loggedUser;
    },
    removeUser(state) {
      state.loggedUser = {};
    },
    setLoggedIn(state, loggedIn) {
      state.loggedUser.loggedIn = loggedIn;
    },
    setLastAndFirstName(state, payload) {
      state.loggedUser.firstName = payload.firstName;
      state.loggedUser.lastName = payload.lastName;
    },
    setEmployeeAppointmentScheduled(state, scheduled) {
      state.employeeAppointmentScheduled = scheduled;
    }
  },
  getters: {
    loggedUser(state) {
      return state.loggedUser;
    },
    employeeAppointmentScheduled(state) {
      return state.employeeAppointmentScheduled;
    },
    userHomePage(state, getters) {
      let homeRoute = 'Home';
      if (state.loggedUser.jwt) {
        let role = getters.userRole;
        if (role === "PharmacyAdmin") {
          homeRoute = role + "Home";
        }
        else {
          homeRoute = role + 'HomePage';
        }
      }

      return homeRoute;
    },
    userRole(state) {
      let role = "";
      if (state.loggedUser.jwt) {
        let authority = state.loggedUser.authorities[0];
        if (authority === "ROLE_SYSTEM_ADMIN") {
          role = 'SysAdmin';
        }
        else if (authority === "ROLE_PHARMACY_ADMIN") {
          role = 'PharmacyAdmin';
        }
        else if (authority === "ROLE_PHARMACIST") {
          role = 'Pharmacist';
        }
        else if (authority === "ROLE_DERMATOLOGIST") {
          role = 'Dermatologist';
        }
        else if (authority === "ROLE_PATIENT") {
          role = 'Patient';
        }
        else if (authority === "ROLE_SUPPLIER") {
          role = 'Supplier'
        }
      }

      return role;
    },
    userProfilePage(state) {
      let profileRoute = 'Home';
      if (state.loggedUser.jwt) {
        let role = state.loggedUser.authorities[0];
        if (role === "ROLE_PATIENT") {
          profileRoute = 'PatientProfile';
        }
        else if (role === "ROLE_SUPPLIER") {
          profileRoute = "SupplierProfile";
        }
        else if (role === "ROLE_PHARMACY_ADMIN") {
          profileRoute = "PharmacyAdminProfileView";
        }
        else if (role === "ROLE_PHARMACIST" || role === "ROLE_DERMATOLOGIST") {
          profileRoute = "PharmacyEmployeeProfileView";
        } 
      }
      return profileRoute;
    }
  },
  actions: {
    setLastAndFirstName(store, payload) {
      store.commit('setLastAndFirstName', payload);
    },
    setUser(store, payload) {
      store.commit('setUser', payload);
      store.commit('setEmployeeAppointmentScheduled', false);
    },
    removeUser(store) {
      store.commit('removeUser');
    },
    setLoggedIn(store, loggedIn) {
      store.commit('setLoggedIn', loggedIn);
    },
    setEmployeeAppointmentScheduled(store, scheduled) {
      store.commit('setEmployeeAppointmentScheduled', scheduled);
    }
  },
  modules: {},
  plugins: [createPersistedState()]
});

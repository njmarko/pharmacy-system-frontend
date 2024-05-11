import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";
import PharmacyHomePage from "../views/PharmacyHomePage";
import PharmacistView from "../views/PharmacistView";
import DermatologistsView from "../views/DermatologistsView";
import MedicineStockView from "../views/MedicineStockView";
import AppointmentsView from '../views/AppointmentsView';
import Register from "../components/auth/Register.vue";
import Pharmacies from "@/views/Pharmacies.vue";
import Login from "../components/auth/Login.vue";
import PatientProfile from "../views/PatientProfileView";
import SysAdminHomePage from '../views/SysAdminHomePage';
import PatientHomePage from '../views/PatientHomePage';
import RegisterDermatologist from '../components/auth/RegisterDermatologist';
import PharmacyAdminHome from '../views/PharmacyAdminHome';
import RegisterPharmacist from '../views/RegisterPharmacist';
import PharmacistHomePage from "../views/PharmacistHomePage"
import DermatologistHomePage from "../views/DermatologistHomePage"
import AdminMedicineStocksView from '../views/AdminMedicineStocksView';
import PatientsView from '../views/PatientsView';
import ManagePharmacistsView from '../views/ManagePharmacistsView';
import ManageDermatologistsView from '../views/ManageDermatologistsView';
import MedicineDetailedView from '../components/medicine/MedicineDetailedView'
import Medicines from '../views/Medicines'
import ReservationsView from '../views/ReservationsView'
import MedicineRegistration from '../components/medicine/MedicineRegistration'
import PharmacyRegistration from '../components/pharmacy/PharmacyRegistration'
import PatientMedicineReservations from "../views/PatientMedicineReservationsView"
import RegisterSupplier from "../components/auth/RegisterSupplier"
import ManageAppointmentPrice from '../views/ManageAppointmentPrice';
import MissingMedicineView from '../views/MissingMedicineView';
import RegisterPharmacyAdmin from "../components/auth/RegisterPharmacyAdmin"
import ActivateAccount from "../components/ActivateAccount"
import PastDermatologistAppointments from '../views/PatientPastDermatologistAppointmentsView';
import WorkingCalendarView from "../views/WorkingCalendarView";
import ManageAppointments from "../views/ManageAppointments";
import PatientAppointments from "../views/PatientAppointmentsView"
import ChoosePharmacy from "../views/ChoosePharmacyForAppointments"
import SupplierHomePage from "../views/SupplierHomePage"
import OrdersView from "../components/orders/OrdersView"
import AllDermatologistsView from '../views/AllDermatologistsView';
import AllPharmacistsView from '../views/AllPharmacistsView';
import OfferFilter from "../components/offers/OfferFilter"
import ManageOrders from '../views/ManageOrders';
import OrderDetailsView from '../views/OrderDetailsView';
import AppointmentStartView from "../views/AppointmentStartView"
import RegisterSysAdmin from "../components/auth/RegisterSysAdmin"
import PharmacistsLeaveRequestsView from '../views/PharmacistsLeaveRequestsView';
import DermatologistsLeaveRequestsView from '../views/DermatologistsLeaveRequestsView';
import SupplierProfile from "../views/SupplierProfileView"
import PharmacyQRCodeSearchView from "../views/PharmacyQRCodeSearchView"
import CreateOrderView from '../views/CreateOrderView';
import ChangePasswordView from "../views/ChangePasswordView";
import SchedulePharmacistAppointmentChoosePharmacy from "../views/PatientSchedulePharmacistAppointmentPharmaciesView";
import PharmacyAdminProfileView from '../views/PharmacyAdminProfileView';
import BusinessReportsView from '../views/BusinessReportsView';
import SchedulePharmacistAppointmentAppointmentsView from "../views/PatientSchedulePharmacistAppointmentAppointmentsView";
import ComplaintsView from "../views/ComplaintsView"
import PharmacyEmployeeProfileView from "../views/PharmacyEmployeeProfileView"
import ExaminedPatientsView from "../views/ExaminedPatientsView"
import PharmacySubscriptionView from "../views/PharmacySubscriptionView"
import RecipeView from "../views/RecipeView"
import CreatePromotionView from "../views/CreatePromotionView";
import EmployeeLeaveDaysRequestView from "../views/EmployeeLeaveDaysRequestView"
import LoyaltyProgramView from "../views/LoyaltyProgramView"

Vue.use(VueRouter);

const roles = {
  systemAdmin: 'ROLE_SYSTEM_ADMIN',
  pharmacyAdmin: 'ROLE_PHARMACY_ADMIN',
  patient: 'ROLE_PATIENT',
  pharmacist: 'ROLE_PHARMACIST',
  dermatologist: 'ROLE_DERMATOLOGIST',
  supplier: 'ROLE_SUPPLIER'
}

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
    meta: {
      authenticated: false,
    }
  },
  {
    path: "/dermatologists",
    name: "AllDermatologistsView",
    component: AllDermatologistsView,
    meta: {
      authenticated: true,
      authorities: [roles.patient]
    }
  },
  {
    path: "/pharmacists",
    name: "AllPharmacistsView",
    component: AllPharmacistsView,
    meta: {
      authenticated: true,
      authorities: [roles.patient]
    }
  },
  {
    path: "/pharmacies/:id",
    name: "PharmacyHomePage",
    component: PharmacyHomePage,
    meta: {
      authenticated: true,
    }
  },
  {
    path: "/appointment-start",
    name: "AppointmentStartView",
    component: AppointmentStartView,
    meta: {
      authenticated: true,
      authorities: [roles.dermatologist, roles.pharmacist]
    }
  },
  {
    path: "/leave-request",
    name: "EmployeeLeaveDaysRequestView",
    component: EmployeeLeaveDaysRequestView,
    meta: {
      authenticated: true,
      authorities: [roles.dermatologist, roles.pharmacist]
    }
  },
  {
    path: "/pharmacies/:id/pharmacists",
    name: "PharmacistView",
    component: PharmacistView,
    meta: {
      authenticated: true,
    }
  },
  {
    path: "/pharmacy-admin-panel",
    name: "PharmacyAdminHome",
    component: PharmacyAdminHome,
    meta: {
      authenticated: true,
      authorities: [roles.pharmacyAdmin]
    }
  },
  {
    path: "/medicine-stocks",
    name: "AdminMedicineStocksView",
    component: AdminMedicineStocksView,
    meta: {
      authenticated: true,
      authorities: [roles.pharmacyAdmin]
    }
  },
  {
    path: "/manage-pharmacists",
    name: "ManagePharmacistsView",
    component: ManagePharmacistsView,
    meta: {
      authenticated: true,
      authorities: [roles.pharmacyAdmin]
    }
  },
  {
    path: "/manage-dermatologists",
    name: "ManageDermatologistsView",
    component: ManageDermatologistsView,
    meta: {
      authenticated: true,
      authorities: [roles.pharmacyAdmin]
    }
  },
  {
    path: "/register-pharmacist",
    name: "RegisterPharmacist",
    component: RegisterPharmacist,
    meta: {
      authenticated: true,
      authorities: [roles.pharmacyAdmin]
    }
  },
  {
    path: "/appointment-price",
    name: "ManageAppointmentPrice",
    component: ManageAppointmentPrice,
    meta: {
      authenticated: true,
      authorities: [roles.pharmacyAdmin]
    }
  },
  {
    path: "/manage-appointments",
    name: "ManageAppointments",
    component: ManageAppointments,
    meta: {
      authenticated: true,
      authorities: [roles.pharmacyAdmin]
    }
  },
  {
    path: "/missing-medicines",
    name: "MissingMedicineView",
    component: MissingMedicineView,
    meta: {
      authenticated: true,
      authorities: [roles.pharmacyAdmin]
    }
  },
  {
    path: "/manage-orders",
    name: "ManageOrders",
    component: ManageOrders,
    meta: {
      authenticated: true,
      authorities: [roles.pharmacyAdmin]
    }
  },
  {
    path: "/orders/:id",
    name: "OrderDetailsView",
    component: OrderDetailsView,
    meta: {
      authenticated: true,
      authorities: [roles.pharmacyAdmin]
    }
  },
  {
    path: "/leave-requests",
    name: "PharmacistsLeaveRequestsView",
    component: PharmacistsLeaveRequestsView,
    meta: {
      authenticated: true,
      authorities: [roles.pharmacyAdmin]
    }
  },
  {
    path: "/create-order",
    name: "CreateOrderView",
    component: CreateOrderView,
    meta: {
      authenticated: true,
      authorities: [roles.pharmacyAdmin]
    }
  },
  {
    path: "/pharmacy-admin-profile",
    name: "PharmacyAdminProfileView",
    component: PharmacyAdminProfileView,
    meta: {
      authenticated: true,
      authorities: [roles.pharmacyAdmin]
    }
  },
  {
    path: "/create-promotion",
    name: "CreatePromotionView",
    component: CreatePromotionView,
    meta: {
      authenticated: true,
      authorities: [roles.pharmacyAdmin]
    }
  },
  {
    path: "/pharmacy-employee-profile",
    name: "PharmacyEmployeeProfileView",
    component: PharmacyEmployeeProfileView,
    meta: {
      authenticated: true,
      authorities: [roles.dermatologist, roles.pharmacist]
    }
  },
  {
    path: "/reports",
    name: "BusinessReportsView",
    component: BusinessReportsView,
    meta: {
      authenticated: true,
      authorities: [roles.pharmacyAdmin]
    }
  },
  {
    path: "/pharmacies/:id/dermatologists",
    name: "DermatologistsView",
    component: DermatologistsView,
    meta: {
      authenticated: true,
    }
  },
  {
    path: "/pharmacies/:id/appointments",
    name: "AppointmentsView",
    component: AppointmentsView,
    meta: {
      authenticated: true,
    }
  },
  {
    path: "/pharmacies/:id/pharmacist-appointments",
    name: "SchedulePharmacistAppointmentView",
    component: SchedulePharmacistAppointmentAppointmentsView,
    meta: {
      authenticated: true,
      authorities: [roles.patient]
    }
  },
  {
    path: "/pharmacies/:id/stocks",
    name: "MedicineStockView",
    component: MedicineStockView,
    meta: {
      authenticated: true,
    }
  },
  {
    path: "/examined-patients",
    name: "ExaminedPatientsView",
    component: ExaminedPatientsView,
    meta: {
      authenticated: true,
      authorities: [roles.pharmacist, roles.dermatologist]
    }
  },
  {
    path: "/pharmacist-home-page",
    name: "PharmacistHomePage",
    component: PharmacistHomePage,
    meta: {
      authenticated: true,
      authorities: [roles.pharmacist]
    }
  },
  {
    path: "/patient-home-page",
    name: "PatientHomePage",
    component: PatientHomePage,
    meta: {
      authenticated: true,
      authorities: [roles.patient]
    },
  },
  {
    path: "/supplier-home-page",
    name: "SupplierHomePage",
    component: SupplierHomePage,
    meta: {
      authenticated: true,
      authorities: [roles.supplier]
    }
  },
  {
    path: "/patient-medicine-reservations",
    name: "PatientMedicineReservations",
    component: PatientMedicineReservations,
    meta: {
      authenticated: true,
      authorities: [roles.patient]
    }
  },
  {
    path: "/past-dermatologist-appointments",
    name: "PatientsPastDermatologistAppointmentsView",
    component: PastDermatologistAppointments,
    meta: {
      authenticated: true,
      authorities: [roles.patient]
    }
  },
  {
    path: "/schedule-appointment-choose-pharmacy",
    name: "ChoosePharmacy",
    component: ChoosePharmacy,
    meta: {
      authenticated: true,
      authorities: [roles.patient]
    }
  },
  {
    path: "/patient-appointments",
    name: "PatientAppointmentsView",
    component: PatientAppointments,
    meta: {
      authenticated: true,
      authorities: [roles.patient]
    }
  },
  {
    path: "/patients",
    name: "Patients",
    component: PatientsView,
    meta: {
      authenticated: true,
      authorities: [roles.dermatologist, roles.pharmacist]
    }
  },
  {
    path: "/reservations-view",
    name: "ReservationsView",
    component: ReservationsView,
    meta: {
      authenticated: true,
      authorities: [roles.pharmacist]
    }
  },
  {
    path: "/working-calendar-view",
    name: "WorkingCalendarView",
    component: WorkingCalendarView,
    meta: {
      authenticated: true,
      authorities: [roles.dermatologist, roles.pharmacist]
    }
  },
  {
    path: "/dermatologist-home-page",
    name: "DermatologistHomePage",
    component: DermatologistHomePage,
    meta: {
      authenticated: true,
      authorities: [roles.dermatologist]
    }
  },
  {
    path: "/pharmacies",
    name: "Pharmacies",
    component: Pharmacies,
    meta: {
      authenticated: false,
    }
  },
  {
    path: "/schedule-pharmacist-appointment-choose-pharmacy",
    name: "SchedulePharmacistAppointmentChoosePharmacy",
    component: SchedulePharmacistAppointmentChoosePharmacy,
    meta: {
      authenticated: true,
      authorities: [roles.patient]
    }
  },
  {
    path: "/drugs",
    name: "Drugs",
    component: Medicines,
    meta: {
      authenticated: false,
    }
  },
  {
    path: "/login",
    name: "Login",
    component: Login,
    meta: {
      authenticated: false,
    }
  },
  {
    path: "/register",
    name: "Register",
    component: Register,
    meta: {
      authenticated: false,
    }
  },
  {
    path: "/profile",
    name: "PatientProfile",
    component: PatientProfile,
    meta: {
      authenticated: true
    }
  },
  {
    path: "/profile-supplier",
    name: "SupplierProfile",
    component: SupplierProfile,
    meta: {
      authenticated: true
    }
  },
  {
    path: "/sys-admin-home-page",
    name: "SysAdminHomePage",
    component: SysAdminHomePage,
    meta: {
      authenticated: true,
      authorities: [roles.systemAdmin]
    }
  },
  {
    path: "/register/dermatologist",
    name: "RegisterDermatologist",
    component: RegisterDermatologist,
    meta: {
      authenticated: true,
      authorities: [roles.systemAdmin]
    }
  },
  {
    path: "/drugs/:id",
    name: "MedicineDetailedView",
    component: MedicineDetailedView,
    meta: {
      authenticated: false
    }
  },
  {
    path: "/register/drug",
    name: "MedicineRegistration",
    component: MedicineRegistration,
    meta: {
      authenticated: true,
      authorities: [roles.systemAdmin]
    }

  },
  {
    path: "/register/pharmacy",
    name: "PharmacyRegistration",
    component: PharmacyRegistration,
    meta: {
      authenticated: true,
      authorities: [roles.systemAdmin]
    }

  },
  {
    path: "/register/supplier",
    name: "RegisterSupplier",
    component: RegisterSupplier,
    meta: {
      authenticated: true,
      authorities: [roles.systemAdmin]
    }
  },
  {
    path: "/register/pharmacy-admin",
    name: "RegisterPharmacyAdmin",
    component: RegisterPharmacyAdmin,
    meta: {
      authenticated: true,
      authorities: [roles.systemAdmin]
    }
  },
  {
    path: "/account-activation",
    name: "ActivateAccount",
    component: ActivateAccount,
    meta: {
      authenticated: false
    }
  },
  {
    path: "/orders-view",
    name: "OrdersView",
    component: OrdersView,
    meta: {
      authenticated: true,
      authorities: [roles.supplier]
    }
  },
  {
    path: "/offers",
    name: "OffersFilter",
    component: OfferFilter,
    meta: {
      authenticated: true,
      authorities: [roles.supplier]
    }
  },
  {
    path: "/register/sys-admin",
    name: "RegisterSysAdmin",
    component: RegisterSysAdmin,
    meta: {
      authenticated: true,
      authorities: [roles.systemAdmin]
    }
  },
  {
    path: "/dermatologists-leave-requests",
    name: "DermatologistsLeaveRequestsView",
    component: DermatologistsLeaveRequestsView,
    meta: {
      authenticated: true,
      authorities: [roles.systemAdmin]
    }
  },
  {
    path: "/qr-code-search",
    name: "PharmacyQRCodeSearchView",
    component: PharmacyQRCodeSearchView,
    meta: {
      authenticated: true,
      authorities: [roles.patient]
    }
  },
  {
    path: "/change-password-view",
    name: "ChangePasswordView",
    component: ChangePasswordView,
    meta: {
      authenticated: true,
      authorities: [roles.dermatologist, roles.pharmacist, roles.supplier, roles.systemAdmin]
    }
  },
  {
    path: "/complaints-view",
    name: "ComplaintsView",
    component: ComplaintsView,
    meta: {
      authenticated: true,
      authorities: [roles.patient, roles.systemAdmin]
    }
  },
  {
    path: "/subscriptions",
    name: "PharmacySubscriptionView",
    component: PharmacySubscriptionView,
    meta: {
      authenticated: true,
      authorities: [roles.patient]
    }
  },
  {
    path: "/e-recipes",
    name: "RecipeView",
    component: RecipeView,
    meta:{
      authenticated: true,
      authorities: [roles.patient]
    }
  },
  {
    path: "/loyalty-program",
    name: "LoyaltyProgramView",
    component: LoyaltyProgramView,
    meta: {
      authenticated: true,
      authorities: [roles.systemAdmin]
    }
  }
];

const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location, onResolve, onReject) {
  if (onResolve || onReject) return originalPush.call(this, location, onResolve, onReject)
  return originalPush.call(this, location).catch(err => err)
}

const router = new VueRouter({
  routes,
});

export default router;

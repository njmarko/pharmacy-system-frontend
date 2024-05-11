import axios from "axios";
import ServiceBase from "./ServiceBase";

class PatientService extends ServiceBase {
    constructor() {
        super();
    }

    getPatient(id) {
        return axios.get(`${this.basePath}/patients/` + id);
    }

    registerPatient(payload) {
        return axios.post(`${this.basePath}/patients`, payload);
    }

    getPatients(page, size, firstName, lastName) {
        return axios.get(`${this.basePath}/patients/allPatients`, {
            params: {
                page: page,
                size: size,
                firstName: firstName,
                lastName: lastName
            },
        });
    }

    createDrugReservation(id, drugReservationDTO) {
        return axios.post(`${this.basePath}/patients/` + id + "/medicine-reservations", drugReservationDTO);
    }

    updateProfileInfo(id, patientDTO) {
        return axios.put(`${this.basePath}/patients/` + id, patientDTO);
    }

    removeAllergy(id, medicineId) {
        return axios.delete(`${this.basePath}/patients/` + id + `/allergies/` + medicineId);
    }

    addAllergy(id, medicineId) {
        return axios.put(`${this.basePath}/patients/` + id + `/allergies/` + medicineId);
    }

    getAllergiesPatient(patientId, name, page, size, sortCriteria, sortDirection) {
        let sortcrit = "";
        if (sortCriteria) {
            if (!sortDirection) {
                sortDirection = "asc";
            }
            sortcrit = [sortCriteria, sortDirection].join();
        }
        return axios.get(`${this.basePath}/patients/` + patientId + `/allergies`,
            { params: { name: name, page: page, size: size, sort: sortcrit } });
    }

    getNonAllergiesPatient(patientId, name, page, size, sortCriteria, sortDirection) {
        let sortcrit = "";
        if (sortCriteria) {
            if (!sortDirection) {
                sortDirection = "asc";
            }
            sortcrit = [sortCriteria, sortDirection].join();
        }
        return axios.get(`${this.basePath}/patients/` + patientId + `/not-allergic-to`,
            { params: { name: name, page: page, size: size, sort: sortcrit } });
    }


    getScheduledDermatologistAppointmentsCalendar(id, dateFrom, dateTo) {
        return axios.get(`${this.basePath}/patients/${id}/scheduled-dermatologist-appointments/calendar`, {
            params: {
                from: dateFrom,
                to: dateTo
            }
        });
    }

    getScheduledPharmacistAppointmentsCalendar(id, dateFrom, dateTo) {
        return axios.get(`${this.basePath}/patients/${id}/scheduled-pharmacist-appointments/calendar`, {
            params: {
                from: dateFrom,
                to: dateTo
            }
        });
    }

    getAppointment(patientId, appointmentId) {
        return axios.get(`${this.basePath}/patients/${patientId}/appointments/${appointmentId}`);
    }

    getReservation(patientId, reservationId) {
        return axios.get(`${this.basePath}/patients/${patientId}/reservations/${reservationId}`);
    }

    getPatientPharmacyRating(patientId, pharmacyId) {
        return axios.get(`${this.basePath}/patients/${patientId}/pharmacies/${pharmacyId}/rating`);
    }

    rateEmployee(patientId, employeeId, rating, employeeType) {
        return axios.put(`${this.basePath}/patients/${patientId}/employees/${employeeId}/rating`, { rating: rating, employeeType: employeeType, });
    }

    rateDrug(patientId, drugId, rating) {
        return axios.put(`${this.basePath}/patients/${patientId}/drugs/${drugId}/rating`, { rating: rating, });
    }

    ratePharmacy(patientId, pharmacyId, rating) {
        return axios.put(`${this.basePath}/patients/${patientId}/pharmacies/${pharmacyId}/rating`, { rating: rating, });
    }

    bookDermatologistAppointment(patientId, appointmentId) {
        return axios.put(`${this.basePath}/patients/` + patientId + `/dermatologist-appointments/` + appointmentId);
    }

    bookPharmacistAppointment(patientId, appointmentId) {
        return axios.put(`${this.basePath}/patients/` + patientId + `/pharmacist-appointments/` + appointmentId);
    }

    cancelAppointment(patientId, appointmentId) {
        return axios.delete(`${this.basePath}/patients/` + patientId + `/appointments/` + appointmentId);
    }

    activateAccount(token) {
        return axios.get(`${this.basePath}/patients/activate?token=${token}`);
    }

    getPaginatedScheduledDermatologistAppointments(patientId, name, page, size, sortCriteria, sortDirection) {
        let sortcrit = "";
        if (sortCriteria) {
            if (!sortDirection) {
                sortDirection = "asc";
            }
            sortcrit = [sortCriteria, sortDirection].join();
        }
        return axios.get(`${this.basePath}/patients/` + patientId + `/scheduled-dermatologist-appointments`,
            { params: { name: name, page: page, size: size, sort: sortcrit } });
    }

    getPaginatedScheduledPharmacistAppointments(patientId, name, page, size, sortCriteria, sortDirection) {
        let sortcrit = "";
        if (sortCriteria) {
            if (!sortDirection) {
                sortDirection = "asc";
            }
            sortcrit = [sortCriteria, sortDirection].join();
        }
        return axios.get(`${this.basePath}/patients/` + patientId + `/scheduled-pharmacist-appointments`,
            { params: { name: name, page: page, size: size, sort: sortcrit } });
    }

    getPastDermatologistAppointments(patientId, name, page, size, sortCriteria, sortDirection) {
        let sortcrit = "";
        if (sortCriteria) {
            if (!sortDirection) {
                sortDirection = "asc";
            }
            sortcrit = [sortCriteria, sortDirection].join();
        }
        return axios.get(`${this.basePath}/patients/` + patientId + `/past-dermatologist-appointments`,
            { params: { name: name, page: page, size: size, sort: sortcrit } });
    }

    getPastPharmacistAppointments(patientId, name, page, size, sortCriteria, sortDirection) {
        let sortcrit = "";
        if (sortCriteria) {
            if (!sortDirection) {
                sortDirection = "asc";
            }
            sortcrit = [sortCriteria, sortDirection].join();
        }
        return axios.get(`${this.basePath}/patients/` + patientId + `/past-pharmacist-appointments`,
            { params: { name: name, page: page, size: size, sort: sortcrit } });
    }


    createRecipeReservation(patientId, payload) {
        return axios.post(`${this.basePath}/patients/${patientId}/e-recipe`, payload);
    }

    getSubscriptions(patientId){
        return axios.get(`${this.basePath}/patients/${patientId}/subscriptions`);
    }

    getERecipes(patientId, page, size, sortDir){
        return axios.get(`${this.basePath}/patients/${patientId}/e-recipes`, {
            params: {
                page: page,
                size: size,
                sort: `reservationDate,${sortDir}`
            }
        })
    }

    getRecipeMedicine(recipeId){
        return axios.get(`${this.basePath}/recipes/${recipeId}/items`);
    }

    getNextPatientCategory(patientId){
        return axios.get(`${this.basePath}/patients/${patientId}/next-category`);
    }

    getCurrentPatientCategory(patientId){
        return axios.get(`${this.basePath}/patients/${patientId}/current-category`);
    }
}

export default new PatientService();
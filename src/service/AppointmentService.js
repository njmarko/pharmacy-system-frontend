import ServiceBase from "./ServiceBase";
import axios from 'axios';


class AppointmentService extends ServiceBase {
  constructor() {
    super();
  }

  getAppointmentsForDermatologist(id, dateFrom, dateTo, pharmacyId) {
    return axios.get(`${this.basePath}/appointments/allDermatologistAppointments/` + id, {
      params: {
        dateFrom: dateFrom,
        dateTo: dateTo,
        pharmacyId: pharmacyId
      },
    });
  }

  getAppointmentsForPharmacist(id, dateFrom, dateTo) {
    return axios.get(`${this.basePath}/appointments/allPharmacistAppointments/` + id, {
      params: {
        dateFrom: dateFrom,
        dateTo: dateTo
      },
    });
  }

  getAvaiablePharmacistAppointmentsForPharmacyAtSpecifiedDateTime(pharmacyId, name, dateTime, page, size, sortCriteria, sortDirection) {
    let sortcrit = "";
    if (sortCriteria) {
      if (!sortDirection) {
        sortDirection = "asc";
      }
      sortcrit = [sortCriteria, sortDirection].join();
    }
    return axios.get(`${this.basePath}/pharmacies/` + pharmacyId + `/available-pharmacist-appointments-at-datetime`,
      { params: { name: name, dateTime: dateTime, page: page, size: size, sort: sortcrit } });
  }

  scheduleAvailableDermatologistAppointment(employeeId, appointmentId, patientId, pharmacyId) {
    return axios.put(`${this.basePath}/appointments/scheduleAvailableDermatologistAppointment/` + employeeId, {
      "patientId": patientId,
      "appointmentId": appointmentId,
      "pharmacyId" : pharmacyId
    });
  }

  getAllLeaveDates(employeeId, dateFrom, dateTo) {
    return axios.get(`${this.basePath}/appointments/leaveDates/` + employeeId,
    { params: { dateFrom: dateFrom, dateTo: dateTo } });
  }

  getAvailableDermatologistAppointments(employeeId, dateFrom, dateTo, patientId, pharmacyId) {
    return axios.get(`${this.basePath}/appointments/allAvailableDermatologistAppointments/` + employeeId,
      { params: { dateFrom: dateFrom, dateTo: dateTo, patientId: patientId, pharmacyId: pharmacyId } });
  }


  getAppointmentInProgress(id) {
    return axios.get(`${this.basePath}/appointments/beginAppointment/` + id);
  }

  getAllExamined(employeeId, firstName, lastName, from, to, page, size, sortCriteria, sortDirection) {
    let sortcrit = "";
    if (sortCriteria) {
      if (!sortDirection) {
        sortDirection = "asc";
      }
      sortcrit = [sortCriteria, sortDirection].join();
    }
    return axios.get(`${this.basePath}/appointments/allExamined/` + employeeId, {
      params: {
        firstName: firstName,
        lastName: lastName,
        from: from,
        to: to,
        page: page,
        size: size,
        sort: sortcrit
      }
    });
  }


  concludeAppointment(employeeId, reportText, pharmacyId, patientId, appointmentId, chosenMedicines) {
    return axios.post(`${this.basePath}/appointments/concludeAppointment/` + employeeId, {
      "reportText": reportText,
      "pharmacyId": pharmacyId,
      "patientId": patientId,
      "appointmentId": appointmentId,
      "medicineStocks": chosenMedicines
    });
  }

  patientNotShowedUp(id, patientId, appointmentId) {
    return axios.put(`${this.basePath}/appointments/patientNotShowedUp/` + id, {
      "patientId": patientId,
      "appointmentId": appointmentId
    });
  }

  getBusyDates(employeeId, patientId, pharmacyId) {
    return axios.get(`${this.basePath}/appointments/busyDates/` + employeeId, {
      params: {
        patientId: patientId,
        pharmacyId: pharmacyId
      },
    });
  }

  scheduleEmployeeAppointment(employeeId, fromTime, toTime, patientId, pharmacyId) {
    return axios.post(`${this.basePath}/appointments/scheduleEmployeeAppointment/` + employeeId, {
      "from": fromTime,
      "to": toTime,
      "patientId": patientId,
      "pharmacyId": pharmacyId
    });
  }

}

export default new AppointmentService();
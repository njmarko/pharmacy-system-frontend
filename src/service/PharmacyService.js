import ServiceBase from "./ServiceBase";
import axios from 'axios';

class PharmacyService extends ServiceBase {
  constructor() {
    super();
  }

  get(id) {
    return axios.get(`${this.basePath}/pharmacies/${id}`);
  }

  getAll(name, city, lowGrade, highGrade, userLatitude, userLongitude, distance, page, size, sortCriteria, sortDirection) {
    let sortcrit = "";
    if (sortCriteria) {
      if (!sortDirection) {
        sortDirection = "asc";
      }
      sortcrit = [sortCriteria, sortDirection].join();
    }
    return axios.get(`${this.basePath}/pharmacies`, {
      params: {
        name: name, city: city, gradeLow: lowGrade, gradeHigh: highGrade,
        userLatitude: userLatitude, userLongitude: userLongitude, distance: distance,
        page: page, size: size, sort: sortcrit
      }
    });
  }
  getPharmaciesWithAvailablePharmacistAppointments(name, city, lowGrade, highGrade, userLatitude,
    userLongitude, distance, dateTime, page, size, sortCriteria, sortDirection) {
    let sortcrit = "";
    if (sortCriteria) {
      if (!sortDirection) {
        sortDirection = "asc";
      }
      sortcrit = [sortCriteria, sortDirection].join();
    }
    return axios.get(`${this.basePath}/pharmacies/all-with-pharmacist-appointments-at-datetime`, {
      params: {
        name: name, city: city, gradeLow: lowGrade, gradeHigh: highGrade,
        userLatitude: userLatitude, userLongitude: userLongitude, distance: distance, dateTime: dateTime,
        page: page, size: size, sort: sortcrit
      }
    });
  }

  getPharmacistst(id, page, size, firstName, lastName, gradeLow, gradeHigh) {
    return axios.get(`${this.basePath}/pharmacies/${id}/pharmacists`, {
      params: {
        page: page,
        size: size,
        firstName: firstName,
        lastName: lastName,
        gradeLow: gradeLow,
        gradeHigh: gradeHigh,
      },
    });
  }

  getDermatologists(id, page, size, firstName, lastName, gradeLow, gradeHigh) {
    return axios.get(`${this.basePath}/pharmacies/${id}/dermatologists`, {
      params: {
        page: page,
        size: size,
        firstName: firstName,
        lastName: lastName,
        gradeLow: gradeLow,
        gradeHigh: gradeHigh,
      },
    });
  }

  getMedicineStocks(id, page, size) {
    return axios.get(`${this.basePath}/pharmacies/${id}/stocks/available`, {
      params: {
        page: page,
        size: size,
      },
    });
  }

  getAllMedicineStocks(id, page, size, medicineName) {
    return axios.get(`${this.basePath}/pharmacies/${id}/stocks`, {
      params: {
        page: page,
        size: size,
        name: medicineName
      },
    });
  }

  getAvailableDermatologistAppointments(id, dateFrom, dateTo) {
    return axios.get(`${this.basePath}/pharmacies/${id}/dermatologist-appointments/all`, {
      params: {
        from: dateFrom,
        to: dateTo
      }
    });
  }

  getPaginatedDermatologistAppointments(id, page, size, sortCriteria, sortDirection) {
    let sortcrit = "";
    if (sortCriteria) {
      if (!sortDirection) {
        sortDirection = "asc";
      }
      sortcrit = [sortCriteria, sortDirection].join();
    }
    return axios.get(`${this.basePath}/pharmacies/${id}/dermatologist-appointments`, {
      params: {
        page: page,
        size: size,
        sort: sortcrit
      }
    });
  }

  registerPharmacist(pharmacyId, pharmacist) {
    return axios.post(`${this.basePath}/pharmacies/${pharmacyId}/pharmacists`, pharmacist);
  }

  hireDermatologist(pharmacyId, dermatologist) {
    return axios.post(`${this.basePath}/pharmacies/${pharmacyId}/dermatologists`, dermatologist);
  }

  firePharmacist(pharmacyId, pharmacistId) {
    return axios.delete(`${this.basePath}/pharmacies/${pharmacyId}/pharmacists/${pharmacistId}`);
  }

  fireDermatologist(pharmacyId, dermatologistId) {
    return axios.delete(`${this.basePath}/pharmacies/${pharmacyId}/dermatologists/${dermatologistId}`);
  }

  registerMedicine(pharmacyId, medicine) {
    return axios.post(`${this.basePath}/pharmacies/${pharmacyId}/stocks`, medicine);
  }

  registerPharmacy(payload) {
    return axios.post(`${this.basePath}/pharmacies`, payload);
  }

  removeMedicine(pharmacyId, stockId) {
    return axios.delete(`${this.basePath}/pharmacies/${pharmacyId}/stocks/${stockId}`);
  }

  updateStock(pharmacyId, stockId, stockUpdate) {
    return axios.put(`${this.basePath}/pharmacies/${pharmacyId}/stocks/${stockId}`, stockUpdate);
  }

  updateAppointmentPrice(pharmacyId, updatedPrices) {
    return axios.put(`${this.basePath}/pharmacies/${pharmacyId}/appointments/price`, updatedPrices);
  }

  getMissingMedicineLog(pharmacyId, page, size, name) {
    return axios.get(`${this.basePath}/pharmacies/${pharmacyId}/missing-medicines`, {
      params: {
        page: page,
        size: size,
        name: name
      }
    });
  }
  getPharmacyList() {
    return axios.get(`${this.basePath}/pharmacies/all`);
  }

  createAvailableAppointment(pharmacyId, dto) {
    return axios.post(`${this.basePath}/pharmacies/${pharmacyId}/appointments`, dto);
  }

  getEmployeeDetails(pharmacyId, employeeId) {
    return axios.get(`${this.basePath}/pharmacies/${pharmacyId}/employees/${employeeId}`);
  }

  getAllPharmacyEmployees(pharmacyId) {
    return axios.get(`${this.basePath}/pharmacies/${pharmacyId}/employees/all`);
  }

  getEmployeeCalendar(pharmacyId, employeeId, dateFrom, dateTo) {
    return axios.get(`${this.basePath}/pharmacies/${pharmacyId}/employees/${employeeId}/calendar`, {
      params: {
        dateFrom: dateFrom,
        dateTo: dateTo
      }
    });
  }

  getOrders(pharmacyId, page, size, orderStatus) {
    return axios.get(`${this.basePath}/pharmacies/${pharmacyId}/orders`, {
      params: {
        page: page,
        size: size,
        status: orderStatus
      }
    });
  }

  getOrderDetails(pharmacyId, orderId) {
    return axios.get(`${this.basePath}/pharmacies/${pharmacyId}/orders/${orderId}`);
  }

  deleteOrder(pharmacyId, orderId) {
    return axios.delete(`${this.basePath}/pharmacies/${pharmacyId}/orders/${orderId}`);
  }

  getOrderOffers(pharmacyId, orderId, page, size, name, sort, dir) {
    let sortcrit = "";
    if (sort) {
      if (!dir) {
        dir = "asc";
      }
      sortcrit = [sort, dir].join();
    }
    return axios.get(`${this.basePath}/pharmacies/${pharmacyId}/orders/${orderId}/offers`, {
      params: {
        page: page,
        size: size,
        name: name,
        sort: sortcrit
      }
    });
  }

  acceptOffer(pharmacyId, orderId, offerId) {
    return axios.post(`${this.basePath}/pharmacies/${pharmacyId}/orders/${orderId}/offers/${offerId}/accept`);
  }

  getPendingPharmacistsLeaveRequestst(pharmacyId, page, size) {
    return axios.get(`${this.basePath}/pharmacies/${pharmacyId}/leave-days-requests`, {
      params: {
        page: page,
        size: size
      }
    });
  }

  respondToLeaveRequest(pharmacyId, requestId, response) {
    return axios.put(`${this.basePath}/pharmacies/${pharmacyId}/leave-days-requests/${requestId}`, response);
  }

  qrCodeSearch(payload, sortDirection, sortCriteria, page, size, patientId) {
    let ids = '';
    let quantities = '';
    let days = '';
    payload.forEach((item) => {
      ids += item.id + ",";
      quantities += item.amount + ",";
      days += item.therapyDays + ",";

    })
    ids = ids.slice(0, -1);
    quantities = quantities.slice(0, -1);
    days = days.slice(0, -1);
    return axios.get(`${this.basePath}/pharmacies/qr-code-search`, {
      params: {
        ids: ids,
        quantities: quantities,
        days: days,
        patientId: patientId,
        page: page,
        size: size,
        sortBy: sortCriteria + "," + sortDirection
      }
    });
  }

  getOrderItems(pharmacyId, orderId, name, page, size) {
    return axios.get(`${this.basePath}/pharmacies/${pharmacyId}/orders/${orderId}/items`, {
      params: {
        page: page,
        size: size,
        name: name
      }
    });
  }

  createOrder(pharmacyId, order) {
    return axios.post(`${this.basePath}/pharmacies/${pharmacyId}/orders`, order);
  }

  addOrderItem(pharmacyId, orderId, item) {
    return axios.post(`${this.basePath}/pharmacies/${pharmacyId}/orders/${orderId}/items`, item);
  }

  removeItem(pharmacyId, orderId, itemId) {
    return axios.delete(`${this.basePath}/pharmacies/${pharmacyId}/orders/${orderId}/items/${itemId}`);
  }

  isMedicineRegistered(pharmacyId, medicineId) {
    return axios.get(`${this.basePath}/pharmacies/${pharmacyId}/is-registered/${medicineId}`);
  }

  publishOrder(pharmacyId, orderId) {
    return axios.put(`${this.basePath}/pharmacies/${pharmacyId}/orders/${orderId}/publish`);
  }

  updateOrder(pharmacyId, orderId, dto) {
    return axios.put(`${this.basePath}/pharmacies/${pharmacyId}/orders/${orderId}`, dto);
  }

  updateOrderItem(pharmacyId, orderId, itemId, dto) {
    return axios.put(`${this.basePath}/pharmacies/${pharmacyId}/orders/${orderId}/items/${itemId}`, dto);
  }

  getAllStocks(pharmacyId) {
    return axios.get(`${this.basePath}/pharmacies/${pharmacyId}/stocks/all`);
  }

  fileComplaint(pharmacyId, payload) {
    return axios.post(`${this.basePath}/pharmacies/${pharmacyId}/complaints`, payload);
  }

  updatePharmacyDetails(pharmacyId, updated) {
    return axios.put(`${this.basePath}/pharmacies/${pharmacyId}`, updated);
  }
  checkSubscription(pharmacyId, patientId){
    return axios.get(`${this.basePath}/pharmacies/${pharmacyId}/subscriptions/${patientId}`);
  }

  subscribe(pharmacyId, patientId){
    return axios.post(`${this.basePath}/pharmacies/${pharmacyId}/subscriptions`, {"patientId": patientId});
  }

  unsubscribe(pharmacyId, patientId){
    return axios.delete(`${this.basePath}/pharmacies/${pharmacyId}/subscriptions/${patientId}`);
  }

  getStocksNotInPromotion(pharmacyId, name, medicineIds, page, size) {
    return axios.get(`${this.basePath}/pharmacies/${pharmacyId}/stocks/not-selected-in-promotion`, {
      params: {
        name: name,
        medicineIds: medicineIds.join(','),
        page: page,
        size: size
      }
    });
  }

  createPromotion(pharmacyId, promotion) {
    return axios.post(`${this.basePath}/pharmacies/${pharmacyId}/promotions`, promotion);
  }

}

export default new PharmacyService();

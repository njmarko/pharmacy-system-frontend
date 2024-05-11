import ServiceBase from "./ServiceBase";
import axios from 'axios';

class PharmacyEmployeeService extends ServiceBase {
  constructor() {
    super();
  }

  getPharmacyList(id) {
    return axios.get(`${this.basePath}/pharmacy-employees/all/` + id);
  }

  getDermatologists(page, size, pharmacyId, firstName, lastName, gradeLow, gradeHigh) {
    return axios.get(`${this.basePath}/pharmacy-employees/dermatologists`, {
      params: {
        page: page,
        size: size,
        pharmacyId: pharmacyId,
        firstName: firstName,
        lastName: lastName,
        gradeLow: gradeLow,
        gradeHigh: gradeHigh
      }
    });
  }

  getPharmacists(page, size, pharmacyId, firstName, lastName, gradeLow, gradeHigh) {
    return axios.get(`${this.basePath}/pharmacy-employees/pharmacists`, {
      params: {
        page: page,
        size: size,
        pharmacyId: pharmacyId,
        firstName: firstName,
        lastName: lastName,
        gradeLow: gradeLow,
        gradeHigh: gradeHigh
      }
    });
  }

  getAverageGrade(id) {
    return axios.get(`${this.basePath}/pharmacy-employees/averageGrade/${id}`);
  } 

  updateProfileInfo(id, payload) {
    return axios.put(`${this.basePath}/pharmacy-employees/${id}`, payload);
  }

  fileComplaint(employeeId, payload){
    return axios.post(`${this.basePath}/pharmacy-employees/${employeeId}/complaints`, payload);
  }

  getAllDermatologists() {
    return axios.get(`${this.basePath}/pharmacy-employees/dermatologists/all`);
  }

}

export default new PharmacyEmployeeService();
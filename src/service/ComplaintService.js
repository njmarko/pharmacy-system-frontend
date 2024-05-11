import ServiceBase from "./ServiceBase";
import axios from 'axios';


class ComplaintService extends ServiceBase {
  constructor() {
    super();
  }

  getAllComplaints(patientId, page, size){
      return axios.get(`${this.basePath}/patients/${patientId}/complaints`, {
          params: {
              page: page,
              size: size
          }
      })
  }

  getUnansweredComplaints(page, size){
    return axios.get(`${this.basePath}/complaints`, {
      params: {
        page: page,
        size: size
      }
    })
  }

  writeReply(complaintId, payload){
    return axios.post(`${this.basePath}/complaints/${complaintId}/replies`, payload);
  }

  getAnsweredComplaintsForAdmin(page, size, adminId){
    return axios.get(`${this.basePath}/system-admins/${adminId}/complaints`,{
      params: {
        page: page,
        size: size
      }
    });
  }
}

export default new ComplaintService();
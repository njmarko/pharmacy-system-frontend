import axios from "axios";
import ServiceBase from "./ServiceBase";

class SystemAdminService extends ServiceBase {
    constructor() {
        super();
    }

    registerSystemAdmin(payload){
        return axios.post(`${this.basePath}/system-admins`, payload);
    }

    
}

export default new SystemAdminService();
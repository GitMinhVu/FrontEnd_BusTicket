import {baseService} from "./BaseService";

export class AdminService extends baseService {
	login = (loginData) => {
		return this.post("auth/admin/login", loginData);
	};
}

export const adminService = new AdminService();

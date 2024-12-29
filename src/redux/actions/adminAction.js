import {adminService} from "../services/AdminService";
import {ADMIN_LOGIN, ADMIN_TOKEN} from "../../util/settings/config";

export const AdminLoginAction = (adminData) => {
	return async (dispatch) => {
		try {
			const result = await adminService.login(adminData);
			// Store admin token separately
			localStorage.setItem(ADMIN_TOKEN, result.data.token);
			localStorage.setItem(ADMIN_LOGIN, JSON.stringify(result.data));

			// Redirect based on admin type
			if (result.data.type === "ADMIN") {
				window.location.href = "/admin/user";
			} else {
				alert("Bạn không có quyền truy cập vào trang Admin!");
				window.location.href = "/";
			}
		} catch (error) {
			console.log(error);
			alert("Đăng nhập thất bại!");
		}
	};
};

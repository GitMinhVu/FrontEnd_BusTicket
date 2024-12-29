import React from "react";
import {Form, Input, Button, Card} from "antd";
import {UserOutlined, LockOutlined} from "@ant-design/icons";
import {useDispatch} from "react-redux";
import {useHistory} from "react-router-dom";
import {adminService} from "../../../redux/services/AdminService";

import {ADMIN_LOGIN, ADMIN_TOKEN} from "../../../util/settings/config";

export default function LoginAdmin() {
	const dispatch = useDispatch();
	const history = useHistory();

	const onFinish = async (values) => {
		try {
			const result = await adminService.login(values);

			if (result.data.type === "ADMIN") {
				localStorage.setItem(ADMIN_TOKEN, result.data.token);
				localStorage.setItem(ADMIN_LOGIN, JSON.stringify(result.data));
				history.push("/admin/user");
			} else {
				alert("Bạn không có quyền truy cập vào trang Admin!");
				history.push("/");
			}
		} catch (error) {
			alert("Tài khoản này không có quyền truy cập vào trang Admin!");
		}
	};
	// const onFinish = async (values) => {
	// 	try {
	// 		const result = await adminService.login(values);
	// 		// Store admin credentials separately
	// 		localStorage.setItem(ADMIN_TOKEN, result.data.token);
	// 		localStorage.setItem(ADMIN_LOGIN, JSON.stringify(result.data));

	// 		if (result.data.type === "ADMIN") {
	// 			history.push("/admin/user");
	// 		} else {
	// 			alert("Bạn không có quyền truy cập vào trang Admin!");
	// 			history.push("/");
	// 		}
	// 	} catch (error) {
	// 		console.log(error);
	// 		alert("Đăng nhập thất bại!");
	// 	}
	// };

	return (
		<div className="min-h-screen flex items-center justify-center bg-gray-100">
			<Card className="w-96 shadow-xl">
				<div className="text-center mb-8">
					<h1 className="text-2xl font-bold">Admin Login</h1>
					<img src="/images/original.png" alt="logo" className="mx-auto w-24 h-24 my-4" />
				</div>

				<Form name="admin_login" onFinish={onFinish}>
					<Form.Item name="email" rules={[{required: true, message: "Please input your email!"}]}>
						<Input prefix={<UserOutlined />} placeholder="Email" />
					</Form.Item>

					<Form.Item name="password" rules={[{required: true, message: "Please input your password!"}]}>
						<Input.Password prefix={<LockOutlined />} placeholder="Password" />
					</Form.Item>

					<Form.Item>
						<Button type="primary" htmlType="submit" className="w-full">
							Login
						</Button>
					</Form.Item>
				</Form>
			</Card>
		</div>
	);
}

// import React from "react";
// import {Form, Input, Button, Card} from "antd";
// import {UserOutlined, LockOutlined} from "@ant-design/icons";
// import {useDispatch} from "react-redux";
// import {useHistory} from "react-router-dom";
// import {AdminLoginAction} from "../../../redux/actions/adminActions";

// export default function LoginAdmin() {
// 	const dispatch = useDispatch();
// 	const history = useHistory();

// 	const onFinish = async (values) => {
// 		await dispatch(AdminLoginAction(values));

// 		// const adminLogin = JSON.parse(localStorage.getItem("ADMIN_LOGIN"));
// 		// if (adminLogin?.type === "ADMIN") {
// 		// 	history.push("/admin/user");
// 		// } else {
// 		// 	alert("Bạn không có quyền truy cập vào trang Admin!");
// 		// 	history.push("/");
// 		// }
// 	};

// 	return (
// 		<div className="min-h-screen flex items-center justify-center bg-gray-100">
// 			<Card className="w-96 shadow-xl">
// 				<div className="text-center mb-8">
// 					<h1 className="text-2xl font-bold">Admin Login</h1>
// 					<img src="/images/original.png" alt="logo" className="mx-auto w-24 h-24 my-4" />
// 				</div>

// 				<Form name="admin_login" onFinish={onFinish}>
// 					<Form.Item name="email" rules={[{required: true, message: "Please input your email!"}]}>
// 						<Input prefix={<UserOutlined />} placeholder="Email" />
// 					</Form.Item>

// 					<Form.Item name="password" rules={[{required: true, message: "Please input your password!"}]}>
// 						<Input.Password prefix={<LockOutlined />} placeholder="Password" />
// 					</Form.Item>

// 					<Form.Item>
// 						<Button type="primary" htmlType="submit" className="w-full">
// 							Login
// 						</Button>
// 					</Form.Item>
// 				</Form>
// 			</Card>
// 		</div>
// 	);
// }

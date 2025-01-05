import React, {useState} from "react";
import {Form, Input, Button, Checkbox, Modal, Row, Col} from "antd";
import {useFormik} from "formik";
import * as Yup from "yup";
import {useDispatch} from "react-redux";
import {LoginAction} from "../../redux/actions/UserAction";
import axios from "axios";

export default function Login(props) {
	const dispatch = useDispatch();
	const [isForgotPassword, setIsForgotPassword] = useState(false);
	const [email, setEmail] = useState("");
	const [verificationCode, setVerificationCode] = useState("");
	const [newPassword, setNewPassword] = useState("");
	const SignupSchema = Yup.object().shape({
		email: Yup.string().min(2, "Email quá ngắn!").max(50, "Password quá dài!").email("Email không hợp lệ").required("Vui lòng nhập email"),
		passWord: Yup.string().min(2, "Password quá ngắn!").max(50, "Password quá dài!").required("Vui lòng nhập password"),
	});
	const formik = useFormik({
		initialValues: {
			email: "",
			passWord: "",
		},
		validationSchema: SignupSchema,
		onSubmit: (values) => {
			let user = {
				email: values.email,
				password: values.passWord,
			};
			dispatch(LoginAction(user));
		},
	});

	// mail
	const handleForgotPassword = async () => {
		try {
			const response = await axios.post("http://localhost:7000/api/v1/users/forgot-password", {email});
			alert(response.data.message);
		} catch (error) {
			alert(error.response?.data?.message || "Something went wrong");
		}
	};

	const handleResetPassword = async () => {
		try {
			const response = await axios.post("http://localhost:7000/api/v1/users/reset-password", {
				email,
				code: verificationCode,
				newPassword,
			});
			alert(response.data.message);
			setIsForgotPassword(false);
		} catch (error) {
			alert(error.response?.data?.message || "Có lỗi xảy ra");
		}
	};

	return (
		<Form name="basic" autoComplete="off" onFinish={formik.handleSubmit} layout="horizontal" labelAlign="left" labelCol={{span: 4}} wrapperCol={{span: 20}}>
			<Form.Item label="Email" name="email">
				<Input onChange={(e) => formik.setFieldValue("email", e.target.value)} name="email" />
				<p className="text-red-500 text-xs italic mb-0">{formik.errors.email}</p>
			</Form.Item>

			<Form.Item label="Mật khẩu" name="passWord">
				<Input.Password onChange={(e) => formik.setFieldValue("passWord", e.target.value)} name="passWord" />
				<p className="text-red-500 text-xs italic mb-0">{formik.errors.passWord}</p>
			</Form.Item>
			<Form.Item name="remember" valuePropName="checked">
				<Row justify="space-between" align="middle">
					<Col>
						<Checkbox>Ghi nhớ</Checkbox>
					</Col>
					<Col style={{marginLeft: "auto"}}>
						<Button type="link" onClick={() => setIsForgotPassword(true)} style={{marginLeft: "70%"}}>
							Quên mật khẩu?
						</Button>
					</Col>
				</Row>
			</Form.Item>

			<Modal title="Quên mật khẩu" visible={isForgotPassword} onCancel={() => setIsForgotPassword(false)} footer={null}>
				<Form layout="vertical">
					<Form.Item label="Email">
						<Row gutter={8}>
							<Col span={16}>
								<Input value={email} onChange={(e) => setEmail(e.target.value)} />
							</Col>
							<Col span={8}>
								<Button type="primary" onClick={handleForgotPassword} block>
									Gửi mã xác nhận
								</Button>
							</Col>
						</Row>
					</Form.Item>
					<Form.Item label="Mã xác nhận">
						<Input value={verificationCode} onChange={(e) => setVerificationCode(e.target.value)} />
					</Form.Item>
					<Form.Item label="Mật khẩu mới">
						<Input.Password value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
					</Form.Item>
					<Button type="primary" onClick={handleResetPassword} block>
						Đặt lại mật khẩu
					</Button>
				</Form>
			</Modal>
			<Form.Item wrapperCol={{offset: 8, span: 8}}>
				<Button
					type="primary"
					htmlType="submit"
					onClick={() => {
						formik.handleSubmit();
						props.setModal(false);
					}}
				>
					Đăng nhập
				</Button>
			</Form.Item>
			<div>
				Bạn chưa có tài khoản?
				<button
					type="button"
					className="ant-btn ant-btn-link ant-btn-sm"
					onClick={() => {
						props.setToggle(!props.toggle);
					}}
				>
					<span>Đăng ký</span>
				</button>
			</div>
		</Form>
	);
}

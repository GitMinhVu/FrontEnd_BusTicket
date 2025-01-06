import React, {useEffect, useState} from "react";
import "../../Sass/css/user.css";
import {Breadcrumb, Card, Tabs, Avatar, Dropdown, Menu, Radio, Space, Form, Input, InputNumber, Button, Upload, message, DatePicker} from "antd";
import {HomeOutlined, UserOutlined, EditOutlined, EllipsisOutlined, SettingOutlined} from "@ant-design/icons";
import {useDispatch, useSelector} from "react-redux";
import {history} from "../../App";
import {TOKEN, USER_LOGIN} from "../../util/settings/config";
import * as Yup from "yup";
import {useFormik} from "formik";
import {PlusOutlined} from "@ant-design/icons";
import {UpdatelUserAction} from "../../redux/actions/UserAction";
import {updateUserAvatarAction} from "../../redux/actions/UserAction";
import {Modal} from "antd";
import {userService} from "../../redux/services/UserService";
import moment from "moment";
import {Select} from "antd";
const {Option} = Select;

export default function InfoManagement(props) {
	const dispatch = useDispatch();
	const [isEditModalVisible, setIsEditModalVisible] = useState(false);
	const [isPasswordModalVisible, setIsPasswordModalVisible] = useState(false);
	const [passwordForm] = Form.useForm();
	const [currentPassword, setCurrentPassword] = useState("");
	const [newPassword, setNewPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	// const [avatar, setAvatar] = useState(userLogin?.avatar || "https://storage.googleapis.com/fe-production/images/Auth/account-circle.svg");
	const {userLogin} = useSelector((state) => state.userReducer);
	const layout = {
		labelCol: {span: 24},
		wrapperCol: {span: 24},
	};
	useEffect(() => {}, [userLogin]);

	const onFinish = (values) => {
		console.log(values);
	};
	// Xử lý upload avatar
	// const handleAvatarChange = (info) => {
	// 	if (info.file.status === "done") {
	// 		formik.setFieldValue("avatar", info.file.response.url);
	// 	}
	// };
	const handleAvatarChange = (info) => {
		if (info.file.status === "done") {
			const formData = new FormData();
			formData.append("file", info.file.originFileObj); // Make sure field name matches backend expectation
			dispatch(updateUserAvatarAction(userLogin.id, formData));
		}
	};

	const SignupSchema = Yup.object().shape({
		email: Yup.string().min(2, "Email quá ngắn!").max(50, "Password quá dài!").email("Email không hợp lệ").required("Vui lòng nhập email"),
		name: Yup.string().min(2, "tên quá ngắn!").max(50, "tên quá dài!").required("Vui lòng nhập email"),
		passWord: Yup.string().min(2, "Password quá ngắn!"),
		phone: Yup.string()
			.required("Không được bỏ trống số điện thoại")
			.matches(/^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/, "Số điện thoại không hợp lệ"),
		gender: Yup.string().required("Vui lòng chọn giới tính").oneOf(["male", "female"], "Giới tính không hợp lệ"),

		dateOfBirth: Yup.date().required("Vui lòng chọn ngày sinh").max(new Date(), "Ngày sinh không thể trong tương lai").min(new Date(1900, 0, 1), "Ngày sinh không hợp lệ"),

		address: Yup.string().required("Vui lòng nhập địa chỉ").min(5, "Địa chỉ quá ngắn").max(200, "Địa chỉ quá dài"),
	});
	const formik = useFormik({
		enableReinitialize: true,
		initialValues: {
			name: userLogin.name,
			phone: userLogin.numberPhone,
			email: userLogin.email,
			passWord: userLogin.password,
			type: userLogin.type,
			dateOfBirth: userLogin.dateOfBirth,
			address: userLogin.address,
			gender: userLogin.gender,
			avatar: userLogin.avatar,
		},
		validationSchema: SignupSchema,
		onSubmit: (values) => {
			let user = {
				name: values.name,
				email: values.email,
				password: values.passWord,
				numberPhone: values.phone,
				avatar: values.avatar,
				type: values.type,
				dateOfBirth: values.dateOfBirth,
				address: values.address,
				gender: values.gender,
			};
			dispatch(UpdatelUserAction(user, userLogin.id));
		},
	});

	return (
		<div className="user">
			<div className="user-container">
				<div className="bread-cump">
					<Breadcrumb>
						<Breadcrumb.Item href="">
							<HomeOutlined />
						</Breadcrumb.Item>
						<Breadcrumb.Item href="">
							<UserOutlined />
							<span>Thông tin cá nhân</span>
						</Breadcrumb.Item>
					</Breadcrumb>
				</div>
				<div className="ticket_management">
					<div className="grid grid-cols-12 gap-5">
						<div className="col-span-4">
							<Card style={{width: "100%"}}>
								<div className="card-item">
									<a
										onClick={() => {
											history.push("/usermgt");
										}}
									>
										<img src="https://storage.googleapis.com/fe-production/images/Auth/account-circle.svg" alt="" width={24} height={16} />
										<span color="text" className="core__Text-sc-1c81tsc-1 kCMizM">
											Thông tin tài khoản
										</span>
									</a>
								</div>
								<div className="card-item">
									<a
										onClick={() => {
											history.push("/ticketmgt");
										}}
									>
										<img src="https://storage.googleapis.com/fe-production/images/ticket.svg" width={24} height={16} alt />
										<span color="text" className="core__Text-sc-1c81tsc-1 kCMizM">
											Vé của tôi
										</span>
									</a>
								</div>
								<div className="card-item">
									<a
										onClick={() => {
											history.push("/commentmgt");
										}}
									>
										<img src="https://storage.googleapis.com/fe-production/images/review.svg" width={24} height={16} alt />
										<span color="text" className="core__Text-sc-1c81tsc-1 kCMizM">
											Nhận xét của tôi
										</span>
									</a>
								</div>
								<div className="card-item">
									<a
										onClick={() => {
											Modal.confirm({
												title: "Xác nhận đăng xuất",
												content: "Bạn có chắc chắn muốn đăng xuất không?",
												okText: "Đăng xuất",
												cancelText: "Hủy",
												onOk: () => {
													message.loading("Đang đăng xuất...", 1.5).then(() => {
														localStorage.removeItem(USER_LOGIN);
														localStorage.removeItem(TOKEN);
														message.success("Đăng xuất thành công!");
														window.location.reload();
													});
												},
											});
										}}
									>
										<img src="https://storage.googleapis.com/fe-production/images/Auth/logout.svg" width={24} height={16} alt="" />
										<span color="text" className="core__Text-sc-1c81tsc-1 kCMizM">
											Đăng xuất
										</span>
									</a>
								</div>
							</Card>
						</div>
						<div className="col-span-8">
							<div className="title font-bold text-xl">Thông tin cá nhân</div>
							<Form {...layout} name="nest-messages">
								<div className="grid grid-cols-2 gap-4">
									<Form.Item label="Họ tên">
										<Input readOnly value={formik.values.name} />
									</Form.Item>

									<Form.Item label="Email">
										<Input readOnly value={formik.values.email} />
									</Form.Item>

									<Form.Item label="Số điện thoại">
										<Input readOnly value={formik.values.phone} />
									</Form.Item>

									<Form.Item label="Giới tính">
										<Input readOnly value={formik.values.gender === "male" ? "Nam" : "Nữ"} />
									</Form.Item>

									<Form.Item label="Ngày sinh">
										<DatePicker readOnly format="DD-MM-YYYY" value={moment(formik.values.dateOfBirth)} style={{width: "100%"}} />
									</Form.Item>

									<Form.Item label="Địa chỉ">
										<Input readOnly value={formik.values.address} />
									</Form.Item>
								</div>

								{/* <Form.Item label="Mật Khẩu" rules={[{required: true}]}>
									<Input.Password onChange={(e) => formik.setFieldValue("passWord", e.target.value)} name="passWord" value={formik.values.passWord} />
									<p className="text-red-500 text-xs italic mb-0">{formik.errors.passWord}</p>
								</Form.Item> */}
								<Form.Item style={{textAlign: "right"}}>
									<Space>
										<Button type="primary" onClick={() => setIsEditModalVisible(true)}>
											Chỉnh sửa thông tin
										</Button>
										<Button type="default" onClick={() => setIsPasswordModalVisible(true)}>
											Đổi mật khẩu
										</Button>
									</Space>
								</Form.Item>

								{/* Modal Chỉnh sửa thông tin */}
								<Modal
									title="Chỉnh sửa thông tin"
									visible={isEditModalVisible}
									onOk={() => {
										formik.handleSubmit();
										setIsEditModalVisible(false);
									}}
									onCancel={() => setIsEditModalVisible(false)}
								>
									<Form layout="vertical">
										<div className="grid grid-cols-2 gap-4">
											<div>
												<Form.Item label="Họ tên">
													<Input onChange={(e) => formik.setFieldValue("name", e.target.value)} value={formik.values.name} />
													<p className="text-red-500 text-xs italic">{formik.errors.name}</p>
												</Form.Item>

												<Form.Item label="Giới tính">
													<Select onChange={(value) => formik.setFieldValue("gender", value)} value={formik.values.gender}>
														<Option value="male">Nam</Option>
														<Option value="female">Nữ</Option>
													</Select>
													<p className="text-red-500 text-xs italic">{formik.errors.gender}</p>
												</Form.Item>

												<Form.Item label="Ngày sinh">
													<DatePicker onChange={(date) => formik.setFieldValue("dateOfBirth", date)} value={moment(formik.values.dateOfBirth)} format="DD-MM-YYYY" />
													<p className="text-red-500 text-xs italic">{formik.errors.dateOfBirth}</p>
												</Form.Item>
											</div>

											<div>
												<Form.Item label="Email">
													<Input onChange={(e) => formik.setFieldValue("email", e.target.value)} value={formik.values.email} />
													<p className="text-red-500 text-xs italic">{formik.errors.email}</p>
												</Form.Item>

												<Form.Item label="Số điện thoại">
													<Input onChange={(e) => formik.setFieldValue("phone", e.target.value)} value={formik.values.phone} />
													<p className="text-red-500 text-xs italic">{formik.errors.phone}</p>
												</Form.Item>

												<Form.Item label="Địa chỉ">
													<Input.TextArea onChange={(e) => formik.setFieldValue("address", e.target.value)} value={formik.values.address} rows={4} />
													<p className="text-red-500 text-xs italic">{formik.errors.address}</p>
												</Form.Item>
											</div>
										</div>
									</Form>
								</Modal>

								<Modal
									title="Đổi mật khẩu"
									visible={isPasswordModalVisible}
									onOk={() => {
										passwordForm.validateFields().then((values) => {
											if (values.newPassword !== values.confirmPassword) {
												message.error("Mật khẩu mới không khớp!");
												return;
											}
											dispatch(
												UpdatelUserAction(
													{
														...userLogin,
														password: values.newPassword,
													},
													userLogin.id
												)
											);

											setIsPasswordModalVisible(false);
											passwordForm.resetFields();
											message.success("Đổi mật khẩu thành công!");
										});
									}}
									onCancel={() => {
										setIsPasswordModalVisible(false);
										passwordForm.resetFields();
									}}
								>
									<Form form={passwordForm} layout="vertical">
										<Form.Item
											label="Mật khẩu hiện tại"
											name="currentPassword"
											rules={[
												{required: true, message: "Vui lòng nhập mật khẩu hiện tại!"},
												{
													validator: async (_, value) => {
														try {
															const result = await userService.login({
																email: userLogin.email,
																password: value,
															});
														} catch (error) {
															throw new Error("Mật khẩu hiện tại không đúng!");
														}
													},
												},
											]}
										>
											<Input.Password />
										</Form.Item>

										<Form.Item
											label="Mật khẩu mới"
											name="newPassword"
											rules={[
												{required: true, message: "Vui lòng nhập mật khẩu mới!"},
												{min: 6, message: "Mật khẩu phải có ít nhất 6 ký tự!"},
											]}
										>
											<Input.Password />
										</Form.Item>
										<Form.Item
											label="Xác nhận mật khẩu mới"
											name="confirmPassword"
											rules={[
												{required: true, message: "Vui lòng xác nhận mật khẩu mới!"},
												{min: 6, message: "Mật khẩu phải có ít nhất 6 ký tự!"},
											]}
										>
											<Input.Password />
										</Form.Item>
									</Form>
								</Modal>
							</Form>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

import React, {useEffect} from "react";
import {Form, Input, Button, Checkbox, Popconfirm, Select} from "antd";
import {useFormik} from "formik";
import * as Yup from "yup";
import {useDispatch, useSelector} from "react-redux";
import { useTranslation } from 'react-i18next';
import {getDetailUserAction, registerAction, UpdatelUserAction} from "../../redux/actions/UserAction";
import {CLOSE_NOFICATION, NOFICATION} from "../../redux/types/userTypes";
const {Option, OptGroup} = Select;

export default function EditUser(props) {
	const dispatch = useDispatch();
	const { t } = useTranslation();
	const {detailUser} = useSelector((state) => state.userReducer);
	useEffect(() => {
		dispatch(getDetailUserAction(props.id));
	}, [props.id]);
	const SignupSchema = Yup.object().shape({
		email: Yup.string().min(2,t("validationRules.email_min")).max(50, t("validationRules.password_max")).email(t("validationRules.email_invalid")).required(t("validationRules.email_required")),
		name: Yup.string().min(2, t("validationRules.name_min")).max(50, t("validationRules.name_max")).required(t("validationRules.name_required")),
		passWord: Yup.string().min(2, t("validationRules.password_min")).max(50, t("validationRules.password_max")).required(t("validationRules.password_required")),
		phone: Yup.string()
			.required(t("validationRules.phone_required"))
			.matches(/^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/,  t("validationRules.phone_invalid")),
	});
	const formik = useFormik({
		enableReinitialize: true,
		initialValues: {
			name: detailUser.name,
			phone: detailUser.numberPhone,
			email: detailUser.email,
			passWord: detailUser.password,
			type: detailUser.type,
		},
		validationSchema: SignupSchema,
		onSubmit: (values) => {
			let user = {
				name: values.name,
				email: values.email,
				password: values.passWord,
				numberPhone: values.phone,
				type: values.type,
			};
			dispatch(UpdatelUserAction(user, props.id));
		},
	});
	function handleChangeOpt(value) {
		formik.setFieldValue("type", value);
	}
	return (
		<>
			<Form name="basic" autoComplete="off">
				<Form.Item label={t("lable.name")} name="name">
					<Input onChange={(e) => formik.setFieldValue("name", e.target.value)} name="name" value={formik.values.name} />
					<p className="text-red-500 text-xs italic mb-0">{formik.errors.name}</p>
				</Form.Item>
				<Form.Item label={t("lable.phone")} name="phone">
					<Input onChange={(e) => formik.setFieldValue("phone", e.target.value)} name="phone" value={formik.values.phone} />
					<p className="text-red-500 text-xs italic mb-0">{formik.errors.phone}</p>
				</Form.Item>
				<Form.Item label={t("lable.email")} name="email">
					<Input onChange={(e) => formik.setFieldValue("email", e.target.value)} name="email" value={formik.values.email} />
					<p className="text-red-500 text-xs italic mb-0">{formik.errors.email}</p>
				</Form.Item>
				<Form.Item label={t("lable.password")} name="passWord">
					<Input.Password onChange={(e) => formik.setFieldValue("passWord", e.target.value)} name="passWord" value={formik.values.passWord} />
					<p className="text-red-500 text-xs italic mb-0">{formik.errors.passWord}</p>
				</Form.Item>

				<Select value={formik.values.type} style={{width: 200, marginBottom: 15}} onChange={handleChangeOpt}>
					<OptGroup label={t("placeholder.userType")}>
						<Option value="CLIENT">{t("navigation.user")}</Option>
						<Option value="ADMIN">{t("navigation.admin")}</Option>
					</OptGroup>
				</Select>

				<Form.Item wrapperCol={{offset: 8, span: 8}}>
					<Popconfirm
						placement="topLeft"
						title={t("messages.updateUser")}
						onConfirm={() => {
							formik.handleSubmit();
							// if (!formik.isValid) {
							// 	dispatch({
							// 		type: NOFICATION,
							// 		title: "error",
							// 		text: "Lỗi Cập Nhật, Vui lòng thử lại!",
							// 	});
							// } else {
							// 	props.setToggle(!props.toggle);
							// }
						}}
						okText={t("messageConfirm.confirm")}
						cancelText={t("messageConfirm.cancel")}
					>
						<Button type="primary" htmlType="submit">
						{t("messageConfirm.update")}
						</Button>
					</Popconfirm>
				</Form.Item>
			</Form>
		</>
	);
}

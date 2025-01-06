import React, {useEffect} from "react";
import {Form, Input, Button, Popconfirm, Select, DatePicker} from "antd";
import {useFormik} from "formik";
import * as Yup from "yup";
import {useDispatch, useSelector} from "react-redux";
import {useTranslation} from "react-i18next";
import {getDetailUserAction, UpdatelUserAction} from "../../redux/actions/UserAction";
import moment from "moment";
const {Option, OptGroup} = Select;

export default function EditUser(props) {
	const dispatch = useDispatch();
	const {t} = useTranslation();
	const {detailUser} = useSelector((state) => state.userReducer);

	useEffect(() => {
		dispatch(getDetailUserAction(props.id));
	}, [props.id]);

	useEffect(() => {
		if (detailUser) {
			console.log("Detail User received:", detailUser);
			formik.setValues({
				name: detailUser.name,
				dateOfBirth: moment(detailUser.dateOfBirth),
				gender: detailUser.gender,
				phone: detailUser.numberPhone,
				email: detailUser.email,
				passWord: detailUser.password,
				address: detailUser.address,
				type: detailUser.type,
			});
		}
	}, [detailUser]);

	const SignupSchema = Yup.object().shape({
		email: Yup.string().min(2, t("validationRules.email_min")).max(50, t("validationRules.password_max")).email(t("validationRules.email_invalid")).required(t("validationRules.email_required")),
		name: Yup.string().min(2, t("validationRules.name_min")).max(50, t("validationRules.name_max")).required(t("validationRules.name_required")),
		passWord: Yup.string().min(2, t("validationRules.password_min")).max(50, t("validationRules.password_max")).required(t("validationRules.password_required")),
		phone: Yup.string()
			.required(t("validationRules.phone_required"))
			.matches(/^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/, t("validationRules.phone_invalid")),
		address: Yup.string().min(2, t("validationRules.address_min")).max(50, t("validationRules.address_max")).required(t("validationRules.address_required")),
		gender: Yup.string().required(t("validationRules.gender_required")),
		dateOfBirth: Yup.date().required(t("validationRules.dateOfBirth_required")).max(moment().subtract(18, "years"), "Must be at least 18 years old").typeError("Invalid date"),
	});

	//debug
	useEffect(() => {
		console.log("Edit User Data:", formik.values);
	}, []);

	const formik = useFormik({
		enableReinitialize: true,
		initialValues: {
			name: "",
			dateOfBirth: null,
			gender: "",
			phone: "",
			email: "",
			passWord: "",
			address: "",
			type: "",
		},
		validationSchema: SignupSchema,
		onSubmit: (values) => {
			const user = {
				name: values.name,
				dateOfBirth: values.dateOfBirth,
				gender: values.gender,
				email: values.email,
				password: values.passWord,
				numberPhone: values.phone,
				address: values.address,
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
				<Form.Item label={t("lable.gender")} name="gender">
					<Select onChange={(value) => formik.setFieldValue("gender", value)} value={formik.values.gender}>
						<Option value="male">{t("gender.male")}</Option>
						<Option value="female">{t("gender.female")}</Option>
					</Select>
					<p className="text-red-500 text-xs italic mb-0">{formik.errors.gender}</p>
				</Form.Item>

				<Form.Item label={t("lable.dateOfBirth")} name="dateOfBirth">
					<DatePicker onChange={(date) => formik.setFieldValue("dateOfBirth", date)} value={formik.values.dateOfBirth} format="DD-MM-YYYY" />
					<p className="text-red-500 text-xs italic mb-0">{formik.errors.dateOfBirth}</p>
				</Form.Item>

				<Form.Item label={t("lable.address")} name="address">
					<Input.TextArea onChange={(e) => formik.setFieldValue("address", e.target.value)} value={formik.values.address} rows={4} />
					<p className="text-red-500 text-xs italic mb-0">{formik.errors.address}</p>
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

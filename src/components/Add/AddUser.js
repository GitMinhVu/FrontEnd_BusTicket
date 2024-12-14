import React, {useEffect} from "react";
import {Drawer, Form, Button, Col, Row, Input, Select, DatePicker, Space, TimePicker, Tag} from "antd";
import {useFormik} from "formik";
import * as Yup from "yup";
import {useDispatch, useSelector} from "react-redux";
import {getDetailTripPassengerAction, updateTripPassengerAction} from "../../redux/actions/tripAction";
import moment from "moment";
import _ from "lodash";
import {CLOSE_DRAWER} from "../../redux/types/DrawerTypes";
import {registerAction} from "../../redux/actions/UserAction";
import { useTranslation } from 'react-i18next';

const {Option} = Select;

export default function AddUser(props) {
	const { t } = useTranslation();
	const dispatch = useDispatch();
	const SignupSchema = Yup.object().shape({
		email: Yup.string().min(2, t("validationRules.email_min")).max(50, t("validationRules.password_max")).email(t("validationRules.email_invalid")).required(t("validationRules.email_required")),
		name: Yup.string().min(2, t("validationRules.name_min")).max(50,  t("validationRules.name_max")).required(t("validationRules.name_required")),
		passWord: Yup.string().min(2, t("validationRules.password_min")).max(50, t("validationRules.password_max")).required(t("validationRules.password_required")),
		phone: Yup.string()
			.required(t("validationRules.phone_required"))
			.matches(/^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/, t("validationRules.phone_invalid")),
		confirmPassword: Yup.string().oneOf([Yup.ref("passWord"), null], t("validationRules.confirm_password")),
	});
	const formik = useFormik({
		enableReinitialize: true,
		initialValues: {
			name: "",
			phone: "",
			email: "",
			passWord: "",
			confirmPassword: "",
			type: "",
		},
		validationSchema: SignupSchema,
		onSubmit: (values) => {
			console.log(values);
			let user = {
				name: values.name,
				email: values.email,
				password: values.passWord,
				numberPhone: values.phone,
				type: values.type,
			};
			dispatch(registerAction(user));
			dispatch({type: CLOSE_DRAWER});
		},
	});
	const handleChange = (name) => {
		return (e) => {
			formik.setFieldValue(name, e.target.value);
		};
	};
	const handleChangeSelect = (name) => {
		return (value) => {
			formik.setFieldValue(name, value);
		};
	};
	const handleChangeFile = (e) => {
		let file = e.target.files[0];

		formik.setFieldValue("file", file);
	};
	return (
		<Form layout="vertical" name="basic" autoComplete="off">
			<Row gutter={16}>
				<Col span={12}>
					<Form.Item label={t("lable.name")}>
						<Input placeholder={t("placeholder.pleaseEnterName")} name="name" onChange={handleChange("name")} />
						<p className="text-red-500 text-xs italic mb-0">{formik.errors.name}</p>
					</Form.Item>
				</Col>
				<Col span={12}>
					<Form.Item label={t("lable.email")}>
						<Input style={{width: "100%"}} name="email" onChange={handleChange("email")} />
						<p className="text-red-500 text-xs italic mb-0">{formik.errors.email}</p>
					</Form.Item>
				</Col>
			</Row>
			<Row gutter={16}>
				<Col span={12}>
					<Form.Item label={t("lable.authorities")}>
						<Select placeholder={t("placeholder.pleaseSelectType")} name="type" onChange={handleChangeSelect("type")}>
							<Option value="ADMIN">{t("navigation.admin")}</Option>
							<Option value="CLIENT">{t("navigation.user")}</Option>
						</Select>
					</Form.Item>
				</Col>
				<Col span={12}>
					<Form.Item label={t("lable.phone")}>
						<Input style={{width: "100%"}} name="numberPhone" onChange={handleChange("phone")} />
						<p className="text-red-500 text-xs italic mb-0">{formik.errors.phone}</p>
					</Form.Item>
				</Col>
			</Row>
			<Row gutter={16}>
				<Col span={12}>
					<Form.Item label={t("lable.password")}>
						<Input style={{width: "100%"}} type="password" name="passWord" onChange={handleChange("passWord")} />
						<p className="text-red-500 text-xs italic mb-0">{formik.errors.passWord}</p>
					</Form.Item>
				</Col>
				<Col span={12}>
					<Form.Item label={t("lable.confirmPass")}>
						<Input style={{width: "100%"}} type="password" value={formik.values.numberFloors} onChange={handleChange("confirmPassword")} />
						<p className="text-red-500 text-xs italic mb-0">{formik.errors.confirmPassword}</p>
					</Form.Item>
				</Col>
			</Row>
			<Form.Item>
				<Button
					type="primary"
					htmlType="submit"
					onClick={() => {
						formik.handleSubmit();
					}}
				>
					{t("button.update")}
				</Button>
			</Form.Item>
		</Form>
	);
}

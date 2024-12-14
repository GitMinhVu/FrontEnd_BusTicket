import React, {useEffect} from "react";
import {Drawer, Form, Button, Col, Row, Input, Select, DatePicker, Space, TimePicker, Tag} from "antd";
import {useFormik} from "formik";
import * as Yup from "yup";
import {useDispatch, useSelector} from "react-redux";
import {getDetailTripPassengerAction, updateTripPassengerAction} from "../../redux/actions/tripAction";
import {deletePassenger, getAllPassenger} from "../../redux/actions/passengerAction";

import moment from "moment";
import _ from "lodash";
import {CLOSE_DRAWER} from "../../redux/types/DrawerTypes";
import {createVehicleAction, getDetailVehicleAction, UpdateVehicleAction} from "../../redux/actions/vehicleAction";
const {Option} = Select;

export default function AddVehicle(props) {
	const {id} = props;
	const dispatch = useDispatch();

	const {listPassenger} = useSelector((state) => state.PassengerReducer);
	useEffect(() => {
		dispatch(getAllPassenger());
	}, []);

	const renderPassenger = () => {
		return listPassenger.map((item, index) => {
			return {label: `${item.name}`, value: item.id};
		});
	};
	const formik = useFormik({
		enableReinitialize: true,
		initialValues: {
			name: "",
			numberFloors: "",
			type: "",
			description: "",
			passengerCarId: "",
		},

		onSubmit: (values) => {
			console.log('Form values before submission:',values);
			if (!values.passengerCarId) {
				alert("Vui lòng chọn nhà xe!");
				return;
			}
			let vehicle = {
				name: values.name,
				type: values.type,
				numberFloors: values.numberFloors,
				description: values.description,
				passengerCarId: values.passengerCarId,
				
			};
			console.log('Action payload:', vehicle);

			dispatch(createVehicleAction(vehicle));
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
	return (
		<Form layout="vertical" name="basic" autoComplete="off" onFinish={formik.handleSubmit} requiredMark={true}>
			<Row gutter={16}>
				<Col span={12}>
					<Form.Item
						label="Tên Xe"
						rules={[
							{
								required: true,
								message: "Vui lòng tên xe!",
							},
						]}
					>
						<Input placeholder="Please enter passenger name" name="name" onChange={handleChange("name")} />
					</Form.Item>
				</Col>
				<Col span={12}>
					<Form.Item
						label="Số tầng"
						rules={[
							{
								required: true,
								message: "Thiếu Số Tầng!",
							},
						]}
					>
						<Input style={{width: "100%"}} type="number" min={1} max={2} name="numberFloors" onChange={handleChange("numberFloors")} />
					</Form.Item>
				</Col>
			</Row>
			<Row gutter={16}>
				<Col span={12}>
					<Form.Item
						label="Loại Xe"
						rules={[
							{
								required: true,
								message: "Thiếu Loại Xe!",
							},
						]}
					>
						<Select placeholder="Please select type" name="type" onChange={handleChangeSelect("type")}>
							<Option value="normal">Xe Thường</Option>
							<Option value="limouse">Xe Vip Limouse</Option>
						</Select>
					</Form.Item>
				</Col>
				<Col span={12}>
					<Form.Item
						label="Nhà Xe"
						rules={[
							{
								required: true,
								message: "Thiếu Nhà Xe!",
							},
						]}
					>
						<Select placeholder="Please select passenger" name="passengerCarId" onChange={handleChangeSelect("passengerCarId")} options={renderPassenger()} />
					</Form.Item>
				</Col>
			</Row>

			<Row gutter={16}>
				<Col span={24}>
					<Form.Item
						label="Mô Tả"
						rules={[
							{
								required: true,
								message: "please enter url description",
							},
						]}
					>
						<Input.TextArea rows={4} name="description" placeholder="please enter url description" onChange={handleChange("description")} />
					</Form.Item>
				</Col>
			</Row>
			<Form.Item>
				<Button
					type="primary"
					htmlType="submit"
					// onClick={() => {
					// 	formik.handleSubmit();
					// }}
				>
					Thêm Xe
				</Button>
			</Form.Item>
		</Form>
	);
}

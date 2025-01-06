import React, {Fragment, useEffect} from "react";
import {Layout, Menu, Breadcrumb, Table, Input, Space, Popconfirm, Tag, Divider, Button, message, Popover} from "antd";
import {useDispatch, useSelector} from "react-redux";
import {AudioOutlined, EditOutlined, SearchOutlined, DeleteOutlined, CalendarOutlined, FolderViewOutlined, CheckCircleOutlined, SyncOutlined, CloseCircleOutlined, ExclamationCircleOutlined, ClockCircleOutlined, MinusCircleOutlined} from "@ant-design/icons";
import {confirmTripPassengerAction, deleteTripPassengerAction, getDetailTripAction, getTripAction, getTripPassengerAction} from "../../redux/actions/tripAction";
import moment from "moment";
import {history} from "../../App";
import {Content} from "antd/lib/layout/layout";
import {SET_MODAL} from "../../redux/types/ModalTypes";
import Vehicle from "../../components/Vehicle/Vehicle";
import {OPEN_DRAWER} from "../../redux/types/DrawerTypes";
import EditTrip from "../../components/Edit/EditTrip";
import _ from "lodash";
import AdminDetailTicket from "../../components/AdminDetailTicKet/AdminDetailTicket";
import {useTranslation} from "react-i18next";

export default function AdminTripPassenger(props) {
	const dispatch = useDispatch();
	const {t} = useTranslation();
	const {id} = props.match.params;
	const {listTripPassenger, tripDetail} = useSelector((state) => state.TripReducer);
	console.log("file: AdminTripPassenger.js ~ line 19 ~ AdminTripPassenger ~ listTripPassenger", listTripPassenger);

	useEffect(() => {
		dispatch(getDetailTripAction(id));
		dispatch(getTripPassengerAction(id));
	}, [id]);
	let arrFilterDate = _.uniqBy(listTripPassenger, "startTime").map((item) => {
		return {value: item.startTime, text: item.startTime};
	});
	let arrFilterDateEnd = _.uniqBy(listTripPassenger, "endTime").map((item) => {
		return {value: item.endTime, text: item.endTime};
	});
	const renderStatus = (trip) => {
		if (trip.status === "depart") {
			return (
				<Tag icon={<ClockCircleOutlined spin />} color="default">
					{t("tripManagement.trippassenger.aboutToDepart")}
				</Tag>
			);
		} else if (trip.status === "progress") {
			return (
				<Tag icon={<SyncOutlined spin />} color="processing">
					{t("tripManagement.trippassenger.run")}
				</Tag>
			);
		} else if (trip.status === "cancel") {
			return (
				<Tag icon={<CloseCircleOutlined />} color="error">
					{t("tripManagement.trippassenger.canceled")}
				</Tag>
			);
		} else {
			return (
				<Tag icon={<CheckCircleOutlined />} color="success">
					{t("tripManagement.trippassenger.complete")}
				</Tag>
			);
		}
	};
	const renderButtonStatus = (trip) => {
		if (trip.status == "depart") {
			return (
				<>
					<Button
						type="primary"
						onClick={() => {
							dispatch(confirmTripPassengerAction(trip, "progress"));
						}}
					>
						<Tag icon={<SyncOutlined spin />} color="default">
							{t("tripManagement.trippassenger.run")}
						</Tag>
					</Button>
					<Button
						type="danger"
						onClick={() => {
							dispatch(confirmTripPassengerAction(trip, "cancel"));
						}}
					>
						<Tag icon={<CloseCircleOutlined spin />} color="error">
							{t("tripManagement.trippassenger.cancel")}
						</Tag>
					</Button>
					<Button
						type="primary"
						onClick={() => {
							dispatch(confirmTripPassengerAction(trip, "success"));
						}}
					>
						<Tag icon={<CheckCircleOutlined spin />} color="success">
							{t("tripManagement.trippassenger.complete")}
						</Tag>
					</Button>
				</>
			);
		} else if (trip.status === "progress") {
			return (
				<>
					<Button
						type="primary"
						onClick={() => {
							dispatch(confirmTripPassengerAction(trip, "success"));
						}}
					>
						<Tag icon={<CheckCircleOutlined spin />} color="success">
							{t("tripManagement.trippassenger.complete")}
						</Tag>
					</Button>
					<Button
						type="danger"
						onClick={() => {
							dispatch(confirmTripPassengerAction(trip, "cancel"));
						}}
					>
						<Tag icon={<CloseCircleOutlined spin />} color="error">
							{t("tripManagement.trippassenger.cancel")}
						</Tag>
					</Button>
				</>
			);
		} else if (trip.status === "cancel") {
			return (
				<Tag icon={<CloseCircleOutlined />} color="error">
					{t("tripManagement.trippassenger.canceled")}
				</Tag>
			);
		} else {
			return (
				<Tag icon={<CheckCircleOutlined />} color="success">
					{t("tripManagement.trippassenger.complete")}
				</Tag>
			);
		}
	};
	const columns = [
		{
			title: t("tripManagement.trippassenger.passenger"),
			render: (text, tripPassenger) => {
				return (
					<div>
						{tripPassenger.passenger.name} ({tripPassenger.passenger.description}){" "}
					</div>
				);
			},
		},
		{
			title: t("tripManagement.trippassenger.vehicle"),
			// specify the condition of filtering result
			// here is that finding the name started with `value`
			render: (text, trip) => {
				return (
					<div>
						<a
							// type="primary"
							onClick={() => {
								dispatch({
									type: SET_MODAL,
									title: `${t("tripManagement.trippassenger.diagram")} ${trip.vehicle.name}`,
									content: <Vehicle vehicle={trip.vehicle} />,
								});
							}}
							style={{cursor: "pointer"}}
						>
							{trip.vehicle.name}{" "}
						</a>
					</div>
				);
			},
		},
		{
			title: t("tripManagement.trippassenger.price"),
			render: (text, trip) => {
				return (
					<div
						style={{
							fontWeight: "500",
							color: "#1890ff",
						}}
					>
						{trip.passenger.price.toLocaleString("vi-VN")} VNĐ
					</div>
				);
			},
			defaultSortOrder: "descend",
			sorter: (a, b) => a.passenger.price - b.passenger.price,
		},
		{
			title: t("tripManagement.trippassenger.status"),
			render: (text, trip) => {
				return (
					<Popover content={renderButtonStatus(trip)} title="Xác nhận trạng thái">
						{renderStatus(trip)}
					</Popover>
				);
			},
		},
		{
			title: t("tripManagement.trippassenger.startTime"),
			dataIndex: "startTime",

			defaultSortOrder: "descend",
			sorter: (a, b) => {
				return a.startTime.localeCompare(b.startTime);
			},
			filters: arrFilterDate,
			onFilter: (value, record) => record.startTime.startsWith(value),
			filterSearch: true,
		},
		{
			title: t("tripManagement.trippassenger.endTime"),
			dataIndex: "endTime",

			defaultSortOrder: "descend",
			sorter: (a, b) => {
				return a.endTime.localeCompare(b.endTime);
			},
			filters: arrFilterDateEnd,
			onFilter: (value, record) => record.endTime.startsWith(value),
			filterSearch: true,
		},
		{
			title: t("tripManagement.trippassenger.bookedTickets"),

			render: (text, item) => {
				return (
					<Fragment>
						{/* { item.tripPassengerTicket.length } */}
						<Button
							type="primary"
							onClick={() => {
								dispatch({
									type: SET_MODAL,
									title: `${t("tripManagement.trippassenger.busTicketList")} ${item.passenger.name} ${t(t("tripManagement.trippassenger.atTheTime"))} ${item.startTime} ${t(t("tripManagement.trippassenger.to"))} ${tripDetail.from?.address}`,
									content: <AdminDetailTicket id={item.id} />,
									width: 1000,
								});
							}}
						>
							{t(t("tripManagement.trippassenger.ticketDetails"))}
						</Button>
					</Fragment>
				);
			},
		},
		{
			title: t("tripManagement.trippassenger.action"),
			render: (text, item) => {
				return (
					<Fragment>
						<div>
							<button
								className="mr-3"
								onClick={() => {
									dispatch({
										type: OPEN_DRAWER,
										title: t("tripManagement.mess.updateTrip"),
										content: <EditTrip idTripPassenger={item.id} soVe={item} />,
									});
								}}
							>
								<EditOutlined />
							</button>
							<Popconfirm
								placement="topLeft"
								title={t("tripManagement.mess.deleteAccount")}
								onConfirm={() => {
									if (item.status !== "cancel") {
										message.error(t("tripManagement.mess.noDelete"));
									} else {
										dispatch(deleteTripPassengerAction(item));
									}
								}}
								okText="Yes"
								cancelText="No"
							>
								<button className="text-red-700">
									<DeleteOutlined />
								</button>
							</Popconfirm>
						</div>
					</Fragment>
				);
			},
		},
	];
	return (
		<Content style={{margin: "0 16px"}}>
			<Breadcrumb style={{margin: "16px 0"}}>
				<Breadcrumb.Item>{t("navigation.admin")}</Breadcrumb.Item>
				<Breadcrumb.Item>{t("tripManagement.trip")}</Breadcrumb.Item>
				<Breadcrumb.Item>{t("tripManagement.trippassenger.trippassengers")}</Breadcrumb.Item>
			</Breadcrumb>
			<div className="site-layout-background" style={{padding: 24, minHeight: 360}}>
				<h1>
					{t("tripManagement.trippassenger.listOfTripsFrom")}
					{""} {tripDetail.from?.province} - {tripDetail.from?.address} {t("tripManagement.trippassenger.to")} {tripDetail.to?.province} - {tripDetail.to?.address} {t("tripManagement.trippassenger.fromDate")} {moment(tripDetail?.startTime).format("DD-MM-YYYY")}
				</h1>
				<Table columns={columns} dataSource={listTripPassenger} />
			</div>
		</Content>
	);
}

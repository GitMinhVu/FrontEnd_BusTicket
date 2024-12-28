import React, {useEffect, useState} from "react";
import {List, Avatar, Pagination, Table} from "antd";
import {useDispatch, useSelector} from "react-redux";
import {getAllTicketByTrip} from "../../redux/actions/ticketAction";
import {useTranslation} from "react-i18next";
import moment from "moment";

export default function AdminDetailTicket(props) {
	const dispatch = useDispatch();
	const {t} = useTranslation();
	const {listTicketTrip} = useSelector((state) => state.TicketReducer);
	console.log("listTicketTrip", listTicketTrip);
	useEffect(() => {
		dispatch(getAllTicketByTrip(props.id));
	}, [props.id]);
	const numEachPage = 5;

	const [minValue, setminValue] = useState(0);
	const [maxValue, setmaxValue] = useState(numEachPage);

	let dataReduce = listTicketTrip.slice(minValue, maxValue);
	const handleChange = (value) => {
		setminValue((value - 1) * numEachPage);
		setmaxValue(value * numEachPage);
	};
	const renderPoint = (ticket, typePoint) => {
		let point = ticket.ticketPointId.find((obj) => {
			return obj.typePoint == typePoint;
		});

		return (
			<span>
				{point?.timepointTicket?.point.name} - {point?.timepointTicket?.point.address}
			</span>
		);
	};

	const renderSeat = (ticket) => {
		return ticket.ticketSeatId.map((item, index) => {
			return (
				<div>
					{item?.seatofticket?.name}, {t("tripManagement.trippassenger.floor")} {item?.seatofticket?.floor}
				</div>
			);
		});
	};
	const columns = [
		{
			title: "Khách hàng",
			key: "user",
			render: (text, record) => (
				<div style={{display: "flex", alignItems: "center", gap: "10px"}}>
					<Avatar src={record.user.avatar} />
					<span>{record.user.name}</span>
				</div>
			),
		},
		{
			title: "Số diện thoại",
			dataIndex: ["user", "numberPhone"],
			key: "phone",
		},
		{
			title: "Số vé	",
			dataIndex: "id",
			key: "ticketNumber",
		},
		{
			title: "Thời gian đặt",
			key: "bookingTime",
			render: (text, record) => moment(record.createdAt).format("DD-MM-YYYY HH:mm:ss"),
		},
		{
			title: "Ghế",
			key: "seats",
			render: (text, record) => renderSeat(record),
		},
		{
			title: "Điểm đón",
			key: "pickup",
			render: (text, record) => renderPoint(record, "pickup"),
		},
		{
			title: "Điểm trả",
			key: "dropoff",
			render: (text, record) => renderPoint(record, "dropoff"),
		},
	];
	return (
		<div>
			<div className="text-xl">
				{t("tripManagement.trippassenger.totalNumberOfTickets")} :<span className="font-bold">{listTicketTrip.length}</span>
			</div>

			<Table
				columns={columns}
				dataSource={listTicketTrip}
				pagination={{
					pageSize: 5,
					total: listTicketTrip.length,
				}}
				rowKey="id"
			/>
		</div>
	);
}

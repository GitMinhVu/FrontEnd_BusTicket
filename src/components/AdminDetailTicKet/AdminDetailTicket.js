import React, {useEffect, useState} from "react";
import {List, Avatar, Pagination, Table, Button, Space} from "antd";
import {useDispatch, useSelector} from "react-redux";
import {getAllTicketByTrip} from "../../redux/actions/ticketAction";
import {useTranslation} from "react-i18next";
import * as XLSX from "xlsx";
import {DownloadOutlined, PrinterOutlined} from "@ant-design/icons";

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

	//export excel
	const exportToExcel = () => {
		const excelData = listTicketTrip.map((ticket) => ({
			"Tên khách hàng": ticket.user.name,
			"Số điện thoại": ticket.user.numberPhone,
			"Số vé": ticket.id,
			"Thời gian đặt": moment(ticket.createdAt).format("DD-MM-YYYY HH:mm:ss"),
			Ghế: ticket.ticketSeatId.map((item) => `${item?.seatofticket?.name}, Tầng ${item?.seatofticket?.floor}`).join("; "),
			"Điểm đón": ticket.ticketPointId.find((obj) => obj.typePoint === "pickup")?.timepointTicket?.point.name,
			"Điểm trả": ticket.ticketPointId.find((obj) => obj.typePoint === "dropoff")?.timepointTicket?.point.name,
		}));

		const ws = XLSX.utils.json_to_sheet(excelData);
		const wb = XLSX.utils.book_new();
		XLSX.utils.book_append_sheet(wb, ws, "Tickets");

		// Generate & Download Excel File
		XLSX.writeFile(wb, `Danh_sach_ve_${moment().format("DD-MM-YYYY")}.xlsx`);
	};

	//print
	const handlePrint = () => {
		const printContent = listTicketTrip
			.map(
				(ticket) => `
            Khách hàng: ${ticket.user.name}
            Số điện thoại: ${ticket.user.numberPhone}
            Số vé: ${ticket.id}
            Thời gian đặt: ${moment(ticket.createdAt).format("DD-MM-YYYY HH:mm:ss")}
            Ghế: ${ticket.ticketSeatId.map((item) => `${item?.seatofticket?.name}, Tầng ${item?.seatofticket?.floor}`).join("; ")}
            Điểm đón: ${ticket.ticketPointId.find((obj) => obj.typePoint === "pickup")?.timepointTicket?.point.name}
            Điểm trả: ${ticket.ticketPointId.find((obj) => obj.typePoint === "dropoff")?.timepointTicket?.point.name}
            ------------------------------
        `
			)
			.join("\n");

		const printWindow = window.open("", "", "height=600,width=800");
		printWindow.document.write("<html><head><title>Danh sách vé</title>");
		printWindow.document.write(`
            <style>
                body { font-family: Arial, sans-serif; }
                .header { text-align: center; margin-bottom: 20px; }
                .content { white-space: pre-line; }
            </style>
        `);
		printWindow.document.write("</head><body>");
		printWindow.document.write('<div class="header"><h1>Danh sách vé</h1></div>');
		printWindow.document.write(`<div class="content">${printContent}</div>`);
		printWindow.document.write("</body></html>");
		printWindow.document.close();
		printWindow.print();
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
			<div className="flex justify-between items-center mb-4">
				<div className="text-xl">
					{t("tripManagement.trippassenger.totalNumberOfTickets")} :<span className="font-bold">{listTicketTrip.length}</span>
				</div>
				<div className="flex gap-2">
					<Button type="primary" icon={<DownloadOutlined />} onClick={exportToExcel}>
						Xuất Excel
					</Button>
					<Button type="primary" icon={<PrinterOutlined />} onClick={handlePrint}>
						In danh sách
					</Button>
				</div>
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

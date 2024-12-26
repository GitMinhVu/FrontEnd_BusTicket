import React from "react";
import {Descriptions, Badge, Button, Space} from "antd";
import moment from "moment";
import * as XLSX from "xlsx";
import {FileExcelOutlined, PrinterOutlined} from "@ant-design/icons";
export default function DetailsTicket(props) {
	let {ticket} = props;

	const renderPoint = (typePoint) => {
		let point = ticket.ticketPointId.find((obj) => {
			return obj.typePoint == typePoint;
		});

		return (
			<span>
				{point?.timepointTicket?.point.name} - {point?.timepointTicket?.point.address}
			</span>
		);
	};
	const renderSeat = () => {
		return ticket.ticketSeatId.map((item, index) => {
			return (
				<div>
					{item?.seatofticket?.name}, tầng {item?.seatofticket?.floor}
				</div>
			);
		});
	};

	//print
	const handlePrint = () => {
		const printContent = window.open("", "_blank");
		printContent.document.write(`
		  <html>
			<head>
			  <title>Vé xe số ${ticket.id}</title>
			  <style>
				body { font-family: Arial, sans-serif; padding: 20px; }
				.header { text-align: center; font-size: 20px; font-weight: bold; margin-bottom: 20px; }
				.info-row { margin: 10px 0; }
				.label { font-weight: bold; min-width: 150px; display: inline-block; }
			  </style>
			</head>
			<body>
			  <div class="header">THÔNG TIN VÉ XE</div>
			  <div class="info-row"><span class="label">Mã Vé:</span> Vé số ${ticket.id}</div>
			  <div class="info-row"><span class="label">Trung tâm nhận vé:</span> ${ticket.tripPassengerTicket.trip.from.name}</div>
			  <div class="info-row"><span class="label">Họ tên:</span> ${ticket.user.name}</div>
			  <div class="info-row"><span class="label">Số điện thoại:</span> ${ticket.user.numberPhone}</div>
			  <div class="info-row"><span class="label">Thời gian đặt vé:</span> ${moment(ticket.createAt).format("DD-MM-YYYY hh:mm:ss")}</div>
			  <div class="info-row"><span class="label">Nhà xe:</span> ${ticket.tripPassengerTicket.passenger.name}</div>
			  <div class="info-row"><span class="label">Tên xe:</span> ${ticket.tripPassengerTicket.vehicle.name}</div>
			  <div class="info-row"><span class="label">Khởi hành:</span> ${moment(ticket.tripPassengerTicket.trip?.startTime).format("DD-MM-YYYY")} ${ticket.tripPassengerTicket.startTime}</div>
			  <div class="info-row"><span class="label">Kết thúc:</span> ${moment(ticket.tripPassengerTicket.trip?.endTime).format("DD-MM-YYYY")} ${ticket.tripPassengerTicket.endTime}</div>
			  <div class="info-row"><span class="label">Điểm đón:</span> ${ticket.ticketPointId.find((obj) => obj.typePoint === "dropoff")?.timepointTicket?.point.name} - ${ticket.ticketPointId.find((obj) => obj.typePoint === "dropoff")?.timepointTicket?.point.address}</div>
			  <div class="info-row"><span class="label">Điểm trả:</span> ${ticket.ticketPointId.find((obj) => obj.typePoint === "pickup")?.timepointTicket?.point.name} - ${ticket.ticketPointId.find((obj) => obj.typePoint === "pickup")?.timepointTicket?.point.address}</div>
			  <div class="info-row"><span class="label">Trạng thái vé:</span> ${ticket.status}</div>
			  <div class="info-row"><span class="label">Ghế đã đặt:</span> ${ticket.ticketSeatId.map((item) => `Ghế ${item?.seatofticket?.name}, tầng ${item?.seatofticket?.floor}`).join(", ")}</div>
			  <div class="info-row"><span class="label">Tổng tiền:</span> ${ticket.totalAmount?.toLocaleString()} VNĐ</div>
			  <div class="info-row"><span class="label">Lưu ý:</span> Mọi thủ tục vui lòng đến nhà xe thông tin trên vé. Nhà xe không chịu trách nhiệm</div>
			</body>
		  </html>
		`);
		printContent.document.close();
		printContent.focus();
		printContent.print();
		printContent.close();
	};

	//export excel
	const exportToExcel = () => {
		const dropoffPoint = ticket.ticketPointId.find((obj) => obj.typePoint === "dropoff");
		const pickupPoint = ticket.ticketPointId.find((obj) => obj.typePoint === "pickup");
		const seatInfo = ticket.ticketSeatId.map((item) => `Ghế ${item?.seatofticket?.name}, tầng ${item?.seatofticket?.floor}`).join(", ");
		// Create data in column format
		const ticketData = [
			["THÔNG TIN VÉ XE", ""],
			["Mã Vé", `Vé số ${ticket.id}`],
			["Trung tâm nhận vé", ticket.tripPassengerTicket.trip.from.name],
			["Họ tên", ticket.user.name],
			["Số điện thoại", ticket.user.numberPhone],
			["Thời gian đặt vé", moment(ticket.createAt).format("DD-MM-YYYY hh:mm:ss")],
			["Nhà xe", ticket.tripPassengerTicket.passenger.name],
			["Tên xe", ticket.tripPassengerTicket.vehicle.name],
			["Khởi hành", `${moment(ticket.tripPassengerTicket.trip?.startTime).format("DD-MM-YYYY")} ${ticket.tripPassengerTicket.startTime}`],
			["Kết thúc", `${moment(ticket.tripPassengerTicket.trip?.endTime).format("DD-MM-YYYY")} ${ticket.tripPassengerTicket.endTime}`],
			// ["Điểm đón", `${dropoffPoint?.timepointTicket?.point.name} - ${dropoffPoint?.timepointTicket?.point.address}`],
			// ["Điểm trả", `${pickupPoint?.timepointTicket?.point.name} - ${pickupPoint?.timepointTicket?.point.address}`],
			["Điểm đón", `${pickupPoint?.timepointTicket?.point.name} - ${pickupPoint?.timepointTicket?.point.address} `],
			["Điểm trả", `${dropoffPoint?.timepointTicket?.point.name} - ${dropoffPoint?.timepointTicket?.point.address}`],
			["Trạng thái vé", ticket.status],
			["Ghế đã đặt", seatInfo],
			["Tổng tiền", `${ticket.totalAmount?.toLocaleString()} VNĐ`],
			["Lưu ý", "Mọi thủ tục vui lòng đến nhà xe thông tin trên vé. Nhà xe không chịu trách nhiệm"],
		];

		const ws = XLSX.utils.aoa_to_sheet(ticketData);
		const wb = XLSX.utils.book_new();
		XLSX.utils.book_append_sheet(wb, ws, "Thông tin vé");

		// Set column widths
		ws["!cols"] = [{wch: 20}, {wch: 50}];

		// Style the header
		ws["A1"].s = {font: {bold: true, sz: 14}};

		XLSX.writeFile(wb, `Ve_xe_${ticket.id}.xlsx`);
	};
	// const exportToExcel = () => {
	// 	// Get pickup and dropoff points
	// 	const dropoffPoint = ticket.ticketPointId.find((obj) => obj.typePoint === "dropoff");
	// 	const pickupPoint = ticket.ticketPointId.find((obj) => obj.typePoint === "pickup");

	// 	// Get seat information
	// 	const seatInfo = ticket.ticketSeatId.map((item) => `Ghế ${item?.seatofticket?.name}, tầng ${item?.seatofticket?.floor}`).join(", ");

	// 	const ticketData = {
	// 		"Mã Vé": `Vé số ${ticket.id}`,
	// 		"Trung tâm nhận vé": ticket.tripPassengerTicket.trip.from.name,
	// 		"Họ tên": ticket.user.name,
	// 		"Số điện thoại": ticket.user.numberPhone,
	// 		"Thời gian đặt vé": moment(ticket.createAt).format("DD-MM-YYYY hh:mm:ss"),
	// 		"Nhà xe": ticket.tripPassengerTicket.passenger.name,
	// 		"Tên xe": ticket.tripPassengerTicket.vehicle.name,
	// 		"Khởi hành": `${moment(ticket.tripPassengerTicket.trip?.startTime).format("DD-MM-YYYY")} ${ticket.tripPassengerTicket.startTime}`,
	// 		"Kết thúc": `${moment(ticket.tripPassengerTicket.trip?.endTime).format("DD-MM-YYYY")} ${ticket.tripPassengerTicket.endTime}`,
	// 		"Điểm đón": `${dropoffPoint?.timepointTicket?.point.name} - ${dropoffPoint?.timepointTicket?.point.address}`,
	// 		"Điểm trả": `${pickupPoint?.timepointTicket?.point.name} - ${pickupPoint?.timepointTicket?.point.address}`,
	// 		"Trạng thái vé": ticket.status,
	// 		"Ghế đã đặt": seatInfo,
	// 		"Tổng tiền": `${ticket.totalAmount?.toLocaleString()} VNĐ`,
	// 		"Lưu ý": "Mọi thủ tục vui lòng đến nhà xe thông tin trên vé. Nhà xe không chịu trách nhiệm",
	// 	};

	// 	const ws = XLSX.utils.json_to_sheet([ticketData]);
	// 	const wb = XLSX.utils.book_new();
	// 	XLSX.utils.book_append_sheet(wb, ws, "Thông tin vé");

	// 	// Adjust column widths
	// 	const wscols = Object.keys(ticketData).map(() => ({wch: 30}));
	// 	ws["!cols"] = wscols;

	// 	XLSX.writeFile(wb, `Ve_xe_${ticket.id}.xlsx`);
	// };

	return (
		<div>
			<div style={{display: "flex", justifyContent: "flex-end"}}>
				<Space>
					<Button type="primary" icon={<PrinterOutlined />} onClick={handlePrint} style={{marginTop: "20px"}}>
						In vé
					</Button>
					<Button type="primary" icon={<FileExcelOutlined />} onClick={exportToExcel} style={{marginTop: "20px"}}>
						Xuất Excel
					</Button>
				</Space>
			</div>
			<Descriptions title="Thông tin vé" layout="vertical" bordered labelStyle={{fontWeight: "bold", fontSize: 16}} contentStyle={{fontSize: 12}}>
				<Descriptions.Item label="Mã Vé">Vé số {ticket.id}</Descriptions.Item>
				<Descriptions.Item label="Trung tâm nhận vé">{ticket.tripPassengerTicket.trip.from.name}</Descriptions.Item>
				<Descriptions.Item label="Họ tên">{ticket.user.name}</Descriptions.Item>
				<Descriptions.Item label="Số điện thoại người đặt">{ticket.user.numberPhone}</Descriptions.Item>
				<Descriptions.Item label="Thời gian đặt vé">{moment(ticket.createAt).format("DD-MM-YYYY hh:mm:ss")}</Descriptions.Item>
				<Descriptions.Item label="Nhà xe">{ticket.tripPassengerTicket.passenger.name}</Descriptions.Item>
				<Descriptions.Item label="Tên xe">{ticket.tripPassengerTicket.vehicle.name}</Descriptions.Item>
				<Descriptions.Item label="Hình ảnh xe">
					<div>
						{ticket.tripPassengerTicket.vehicle.vehicleOfImage.map((item, index) => {
							return <img src={item.link} alt="" width={60} height={50} />;
						})}
					</div>
				</Descriptions.Item>
				<Descriptions.Item label="Khởi hành (dự kiến)">
					{moment(ticket.tripPassengerTicket.trip?.startTime).format("DD-MM-YYYY")} {ticket.tripPassengerTicket.startTime}
				</Descriptions.Item>
				<Descriptions.Item label="Kết thúc (dự kiến)">
					{moment(ticket.tripPassengerTicket.trip?.endTime).format("DD-MM-YYYY")} {ticket.tripPassengerTicket.endTime}
				</Descriptions.Item>
				<Descriptions.Item label="Điểm đón">{renderPoint("pickup")}</Descriptions.Item>
				<Descriptions.Item label="Điểm trả">{renderPoint("dropoff")}</Descriptions.Item>
				<Descriptions.Item label="Trạng thái vé" span={3}>
					<Badge status="processing" text={ticket.status} />
				</Descriptions.Item>
				<Descriptions.Item label="Ghế đã đặt">{renderSeat()}</Descriptions.Item>
				<Descriptions.Item label="Tổng tiền">{ticket.totalAmount?.toLocaleString()} VNĐ</Descriptions.Item>
				<Descriptions.Item label="Lưu ý">Mọi thủ tục vui lòng đến nhà xe thông tin trên vé . Nhà xe không chịu trách nhiệm</Descriptions.Item>
			</Descriptions>
		</div>
	);
}

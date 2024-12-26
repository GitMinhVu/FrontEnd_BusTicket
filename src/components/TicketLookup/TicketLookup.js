import React, {useState} from "react";
import {Form, Input, Button, Card, message, Modal} from "antd";
import {SET_LOADING_BUTTON, HIDE_LOADING_BUTTON} from "../../redux/types/LoadingTypes";
import {useDispatch} from "react-redux";
import {ticketService} from "../../redux/services/ticketService";
import DetailsTicket from "../UserManagement/DetailsTicket";

export default function TicketLookup() {
	const [form] = Form.useForm();
	const [ticket, setTicket] = useState(null);
	const [isModalVisible, setIsModalVisible] = useState(false); // Thêm state cho Modal
	const dispatch = useDispatch();

	const onFinish = async (values) => {
		dispatch({type: SET_LOADING_BUTTON});
		try {
			const result = await ticketService.getDetailTicket(values.ticketNumber, values.phone);
			if (result.status === 200 && result.data) {
				// Kiểm tra dữ liệu trả về khớp với thông tin đã nhập
				const ticketData = result.data;
				if (ticketData.id === parseInt(values.ticketNumber, 10) && ticketData.user.numberPhone === values.phone) {
					setTicket(ticketData);
					setIsModalVisible(true);
					message.success("Tìm thấy thông tin vé!");
				} else {
					// Không khớp dữ liệu
					setTicket(null);
					message.error("Thông tin không khớp! Vui lòng kiểm tra lại số điện thoại và mã vé.");
				}
			} else {
				setTicket(null);
				message.error("Không tìm thấy vé với thông tin này!");
			}
		} catch (error) {
			console.log("API Error:", error);
			setTicket(null);
			message.error("Có lỗi xảy ra khi tra cứu vé!");
		} finally {
			dispatch({type: HIDE_LOADING_BUTTON});
		}
	};
	return (
		<div className="ticket-lookup-container" style={{padding: "50px 20px"}}>
			<Card title="Tra cứu vé" style={{maxWidth: 500, margin: "0 auto"}}>
				<Form form={form} layout="vertical" onFinish={onFinish}>
					<Form.Item
						name="phone"
						label="Số điện thoại"
						rules={[
							{required: true, message: "Vui lòng nhập số điện thoại!"},
							{pattern: /^[0-9]+$/, message: "Vui lòng chỉ nhập số!"},
							{max: 11, message: "Số điện thoại không được quá 11 số!"},
							{min: 10, message: "Số điện thoại phải có ít nhất 10 số!"},
						]}
					>
						<Input placeholder="Nhập số điện thoại (Bắt buộc)" maxLength={11} />
					</Form.Item>

					<Form.Item
						name="ticketNumber"
						label="Mã số vé"
						rules={[
							{required: true, message: "Vui lòng nhập mã số vé!"},
							{pattern: /^[0-9]+$/, message: "Vui lòng chỉ nhập số!"},
						]}
					>
						<Input placeholder="Nhập mã số vé" />
					</Form.Item>

					<Form.Item>
						<Button type="primary" htmlType="submit" block>
							Tra cứu
						</Button>
					</Form.Item>

					<div style={{marginTop: "10px", fontSize: "14px", color: "#666", textAlign: "center"}}>
						<p>Lưu ý: Trường hợp bạn không thể hủy vé qua mạng hoặc muốn đổi sang đơn hàng khác vui lòng liên hệ chúng tôi qua số điện thoại 09377750843 hoặc 1900969681</p>
					</div>
				</Form>
			</Card>
			{/* {ticket && (
				<div style={{marginTop: "20px"}}>
					<DetailsTicket ticket={ticket} />
				</div>
			)} */}
			<Modal visible={isModalVisible} onOk={() => setIsModalVisible(false)} onCancel={() => setIsModalVisible(false)} width={700}>
				{ticket && <DetailsTicket ticket={ticket} />}
			</Modal>
		</div>
	);
}

// import React, {useState} from "react";
// import {Form, Input, Button, Card, message} from "antd";
// import {ticketService} from "../../redux/services/ticketService";
// import {useDispatch} from "react-redux";

// export default function TicketLookup() {
// 	const [form] = Form.useForm();
// 	const [ticket, setTicket] = useState(null);

// 	const onFinish = async (values) => {
// 		try {
// 			const result = await ticketService.getDetailTicket(values.ticketNumber, values.phone);

// 			if (result.status === 200 && result.data) {
// 				// Kiểm tra dữ liệu trả về khớp với thông tin đã nhập
// 				const ticketData = result.data;
// 				if (ticketData.id === parseInt(values.ticketNumber, 10) && ticketData.user.numberPhone === values.phone) {
// 					setTicket(ticketData);
// 					message.success("Tìm thấy thông tin vé!");
// 				} else {
// 					// Không khớp dữ liệu
// 					setTicket(null);
// 					message.error("Thông tin không khớp! Vui lòng kiểm tra lại số điện thoại và mã vé.");
// 				}
// 			} else {
// 				setTicket(null);
// 				message.error("Không tìm thấy vé với thông tin này!");
// 			}
// 		} catch (error) {
// 			console.log("API Error:", error);
// 			setTicket(null);
// 			message.error("Có lỗi xảy ra khi tra cứu vé!");
// 		}
// 	};

// 	const renderTicketDetails = () => {
// 		if (!ticket) return null;

// 		const {id, status, totalAmount, tripPassengerTicket, user} = ticket;

// 		return (
// 			<Card title={`Thông tin vé #${id}`} style={{marginTop: 20}}>
// 				<p>
// 					<strong>Trạng thái:</strong> {status}
// 				</p>
// 				<p>
// 					<strong>Tổng tiền:</strong> {totalAmount.toLocaleString()} VND
// 				</p>
// 				<p>
// 					<strong>Thời gian chuyến:</strong> {tripPassengerTicket?.startTime} - {tripPassengerTicket?.endTime}
// 				</p>
// 				<p>
// 					<strong>Khách hàng:</strong> {user?.name} ({user?.email})
// 				</p>
// 				<p>
// 					<strong>Số điện thoại:</strong> {user?.numberPhone}
// 				</p>
// 			</Card>
// 		);
// 	};

// 	return (
// 		<div className="ticket-lookup-container" style={{padding: "50px 20px"}}>
// 			<Card title="Tra cứu vé" style={{maxWidth: 500, margin: "0 auto"}}>
// 				<Form form={form} layout="vertical" onFinish={onFinish}>
// 					<Form.Item
// 						name="phone"
// 						label="Số điện thoại"
// 						rules={[
// 							{required: true, message: "Vui lòng nhập số điện thoại!"},
// 							{pattern: /^[0-9]+$/, message: "Vui lòng chỉ nhập số!"},
// 						]}
// 					>
// 						<Input placeholder="Nhập số điện thoại (Bắt buộc)" />
// 					</Form.Item>

// 					<Form.Item
// 						name="ticketNumber"
// 						label="Mã số vé"
// 						rules={[
// 							{required: true, message: "Vui lòng nhập mã số vé!"},
// 							{pattern: /^[0-9]+$/, message: "Vui lòng chỉ nhập số!"},
// 						]}
// 					>
// 						<Input placeholder="Nhập mã số vé" />
// 					</Form.Item>

// 					<Form.Item>
// 						<Button type="primary" htmlType="submit" block>
// 							Tra cứu
// 						</Button>
// 					</Form.Item>
// 				</Form>
// 			</Card>
// 			{renderTicketDetails()}
// 		</div>
// 	);
// }

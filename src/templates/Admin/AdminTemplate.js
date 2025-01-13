import React, {Fragment, useState, useEffect} from "react";
import {Layout, Menu, Breadcrumb, Avatar, Dropdown, Badge} from "antd";
import {IdcardOutlined, PieChartOutlined, FileOutlined, TeamOutlined, UserOutlined, DownOutlined, CarOutlined, MoneyCollectOutlined, BellOutlined} from "@ant-design/icons";
import CarRentalIcon from "@mui/icons-material/CarRental";
import DepartureBoardIcon from "@mui/icons-material/DepartureBoard";
import DirectionsTransitIcon from "@mui/icons-material/DirectionsTransit";
import {Redirect, Route} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {history} from "../../App";
import {CHANGE_KEY} from "../../redux/types/AdminTypes";
import {TOKEN, USER_LOGIN, ADMIN_LOGIN, ADMIN_TOKEN} from "../../util/settings/config";
import {useTranslation} from "react-i18next";
import LanguageSwitcher from "../../components/LanguageSwitch/LanguageSwitch";
import ChatBox from "../../components/Chat/ChatBox";

import io from "socket.io-client";
import {notification} from "antd";
const {Header, Content, Footer, Sider} = Layout;
const {SubMenu} = Menu;

export default function AdminTemplate(props) {
	const {key} = useSelector((state) => state.AdminReducer);
	const {userLogin} = useSelector((state) => state.userReducer);
	const dispatch = useDispatch();
	const {Component, ...restProps} = props;
	const [collapsed, setCollapsed] = useState(false);
	const {t, i18n} = useTranslation();
	const adminData = JSON.parse(localStorage.getItem(ADMIN_LOGIN));
	const [notifications, setNotifications] = useState([]);

	const [chatMessages, setChatMessages] = useState({});
	const [activeChat, setActiveChat] = useState(null);
	const [socket, setSocket] = useState(null);

	useEffect(() => {
		const socket = io("http://localhost:7000");
		setSocket(socket);
		// Listen for both customer and admin messages
		socket.on("messageToAdmin", (data) => {
			setChatMessages((prev) => ({
				...prev,
				[data.userId]: [...(prev[data.userId] || []), data],
			}));
		});

		return () => socket.disconnect();
	}, []);

	const sendAdminMessage = (userId, message) => {
		const messageData = {
			userId,
			message,
			fromAdmin: true,
			timestamp: new Date(),
		};
		// Add to local state first
		setChatMessages((prev) => ({
			...prev,
			[userId]: [...(prev[userId] || []), messageData],
		}));
		// Then emit to socket
		socket.emit("adminMessage", messageData);
	};

	const changeCollapsed = () => {
		setCollapsed(!collapsed);
	};

	// // Kiểm tra đăng nhập admin
	// Change the userLogin selector
	const adminLogin = JSON.parse(localStorage.getItem(ADMIN_LOGIN));

	// Replace userLogin with adminLogin in the template
	<span className="text-xl">
		{t("admin.greeting")} , {adminLogin?.name}
	</span>;
	// if (!localStorage.getItem(ADMIN_LOGIN)) {
	// 	alert("Bạn không có quyền truy cập vào trang này!");
	// 	return <Redirect to="/admin/login" />;
	// }

	// const adminLogin = JSON.parse(localStorage.getItem(ADMIN_LOGIN));
	// if (adminLogin?.type !== "ADMIN") {
	// 	alert("Bạn không có quyền truy cập vào trang này!");
	// 	return <Redirect to="/" />;
	// }

	// Trong component
	// useEffect(() => {
	// 	const socket = io("http://localhost:7000");
	// 	socket.on("newTicketBooked", (data) => {
	// 		setNotifications((prev) => [...prev, data]);
	// 		notification.info({
	// 			message: "Đặt vé mới",
	// 			description: `Có đơn đặt vé mới #${data.ticketId}`,
	// 			placement: "topRight",
	// 		});
	// 	});
	// 	return () => socket.disconnect();
	// }, []);
	useEffect(() => {
		const socket = io("http://localhost:7000");

		socket.on("newTicketBooked", (data) => {
			setNotifications((prev) => [...prev, data]);
			notification.info({
				message: "Đặt vé mới",
				description: `Vừa có khách hàng đặt vé số #${data.ticketId}.`,
				placement: "topRight",
			});
		});

		return () => socket.disconnect();
	}, []);

	const notificationMenu = (
		<Menu>
			{notifications.map((notif, index) => (
				<Menu.Item
					key={index}
					onClick={() => {
						history.push("/admin/ticket");
						dispatch({
							type: CHANGE_KEY,
							key: "7",
						});
					}}
				>
					<Menu.Item key={index}>Đơn đặt vé số #{notif.ticketId}</Menu.Item>{" "}
				</Menu.Item>
			))}
			{notifications.length === 0 && <Menu.Item>Không có thông báo mới</Menu.Item>}
		</Menu>
	);

	// Cập nhật menu logout
	const menu = (
		<Menu>
			<Menu.Item
				key="0"
				onClick={() => {
					localStorage.removeItem(ADMIN_LOGIN);
					localStorage.removeItem(ADMIN_TOKEN);
					alert("Đăng xuất thành công!");
					history.push("/admin/login");
				}}
			>
				<a>{t("auth.logout")}</a>
			</Menu.Item>
		</Menu>
	);
	// if (!localStorage.getItem(USER_LOGIN)) {
	// 	alert("Bạn không có quyền truy cập vào trang này !");
	// 	return <Redirect to="/admin/login" />;
	// }

	// if (userLogin.type !== "ADMIN") {
	// 	alert("Bạn không có quyền truy cập vào trang này !");
	// 	return <Redirect to="/" />;
	// }
	return (
		<Route
			{...restProps}
			render={(propsRoute) => {
				return (
					<Fragment>
						<Layout style={{minHeight: "100vh"}}>
							<Sider
								collapsible
								collapsed={collapsed}
								onCollapse={changeCollapsed}
								style={{
									overflow: "auto",
									height: "100vh",
									position: "fixed",
									left: 0,
									top: 0,
									bottom: 0,
								}}
							>
								<div className="logo flex justify-center items-center mt-5">
									<img
										src="/images/original.png"
										alt="VietBus Logo"
										style={{
											width: "70%",
											marginBottom: "20px",
											borderRadius: "50%",
											aspectRatio: "1/1",
											objectFit: "cover",
										}}
									/>
								</div>
								<Menu theme="dark" defaultSelectedKeys={[{key}]} mode="inline">
									<Menu.Item
										key="1"
										icon={<UserOutlined />}
										onClick={() => {
											history.push("/admin/user");
											dispatch({
												type: CHANGE_KEY,
												key: "1",
											});
										}}
									>
										{t("Sidebar.userManagement")}
									</Menu.Item>
									<Menu.Item
										key="2"
										icon={<DepartureBoardIcon />}
										onClick={() => {
											history.push("/admin/trip");
											dispatch({
												type: CHANGE_KEY,
												key: "2",
											});
										}}
									>
										{t("Sidebar.tripManagement")}
									</Menu.Item>
									<Menu.Item
										key="3"
										icon={<DirectionsTransitIcon />}
										onClick={() => {
											history.push("/admin/passenger");
											dispatch({
												type: CHANGE_KEY,
												key: "3",
											});
										}}
									>
										{t("Sidebar.passengerManagement")}
									</Menu.Item>
									<Menu.Item
										key="4"
										icon={<CarOutlined />}
										onClick={() => {
											history.push("/admin/vehicle");
											dispatch({
												type: CHANGE_KEY,
												key: "4",
											});
										}}
									>
										{t("Sidebar.vehicleManagement")}
									</Menu.Item>

									<SubMenu key="sub2" icon={<MoneyCollectOutlined />} title={t("Sidebar.statistics")}>
										<Menu.Item
											key="5"
											onClick={() => {
												history.push("/admin/turnover");
											}}
										>
											{t("Sidebar.generalStatistics")}
										</Menu.Item>
									</SubMenu>
									<Menu.Item
										key="7"
										icon={<IdcardOutlined />}
										onClick={() => {
											history.push("/admin/ticket");
											dispatch({
												type: CHANGE_KEY,
												key: "4",
											});
										}}
									>
										{t("Sidebar.ticketManagement")}
									</Menu.Item>
									<Menu.Item
										key="8"
										icon={<CarRentalIcon />}
										onClick={() => {
											history.push("/admin/station");
										}}
									>
										{t("Sidebar.stationManagement")}
									</Menu.Item>
								</Menu>
							</Sider>
							<Layout className="site-layout" style={{marginLeft: collapsed ? 80 : 200}}>
								<Header className="site-layout-background flex justify-end" style={{padding: 0, background: "#fff"}}>
									<div className="flex items-center justify-between w-full px-5">
										<span className="font-bold text-xl">{t("admin.systemTitle")}</span>
										<div className="flex items-center gap-4">
											<LanguageSwitcher />
											<Dropdown overlay={notificationMenu} trigger={["click"]}>
												<Badge count={notifications.length} className="cursor-pointer">
													<BellOutlined style={{fontSize: "20px"}} />
												</Badge>
											</Dropdown>
											<Dropdown overlay={menu} trigger={["click"]} className="cursor-pointer">
												<div className="flex items-center">
													<Avatar style={{verticalAlign: "middle", background: "#7265e6", marginRight: 10}} size="large">
														{adminData?.email}
													</Avatar>
													<span className="text-xl">
														{t("admin.greeting")} , {adminData?.email}
													</span>
												</div>
											</Dropdown>
										</div>
									</div>
								</Header>
								<Component {...propsRoute} />
								<Footer style={{textAlign: "center"}}>Created 2024 To Minh Vu</Footer>
								<ChatBox isAdmin={true} />

								<div className="admin-chat">
									<div className="chat-users">
										{Object.keys(chatMessages).map((userId) => (
											<div onClick={() => setActiveChat(userId)}>User {userId}</div>
										))}
									</div>
									{activeChat && (
										<div className="chat-messages">
											{chatMessages[activeChat].map((msg, index) => (
												<div key={index}>{msg.message}</div>
											))}
										</div>
									)}
								</div>
							</Layout>
							<ChatBox isAdmin={true} />
						</Layout>
					</Fragment>
				);
			}}
		/>
	);
}

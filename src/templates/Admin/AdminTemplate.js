import React, {Fragment, useState} from "react";
import {Layout, Menu, Breadcrumb, Avatar, Dropdown} from "antd";
import {IdcardOutlined, PieChartOutlined, FileOutlined, TeamOutlined, UserOutlined, DownOutlined, CarOutlined, MoneyCollectOutlined} from "@ant-design/icons";
import CarRentalIcon from "@mui/icons-material/CarRental";
import DepartureBoardIcon from "@mui/icons-material/DepartureBoard";
import DirectionsTransitIcon from "@mui/icons-material/DirectionsTransit";
import {Redirect, Route} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {history} from "../../App";
import {CHANGE_KEY} from "../../redux/types/AdminTypes";
import {TOKEN, USER_LOGIN} from "../../util/settings/config";

const {Header, Content, Footer, Sider} = Layout;
const {SubMenu} = Menu;
export default function AdminTemplate(props) {
	const {key} = useSelector((state) => state.AdminReducer);
	const {userLogin} = useSelector((state) => state.userReducer);
	const dispatch = useDispatch();
	const {Component, ...restProps} = props;
	const [collapsed, setCollapsed] = useState(false);
	const changeCollapsed = () => {
		setCollapsed(!collapsed);
	};
	const menu = (
		<Menu>
			<Menu.Item
				key="0"
				onClick={() => {
					localStorage.removeItem(USER_LOGIN);
					localStorage.removeItem(TOKEN);
					window.location.reload();
				}}
			>
				<a>Đăng Xuất</a>
			</Menu.Item>
		</Menu>
	);
	// if (!localStorage.getItem(USER_LOGIN)) {
	// 	alert("Bạn không có quyền truy cập vào trang này !");
	// 	return <Redirect to="/" />;
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
							<Sider collapsible collapsed={collapsed} onCollapse={changeCollapsed}>
								<div className="logo flex justify-center items-center mt-5">
									{/* <span style={{color:"white"}}>VietBusTravel- Admin</span> */}
									{/* <img src="https://www.shutterstock.com/image-vector/big-black-bus-vector-image-600nw-2473900693.jpg" alt={123} className="mb-5" /> */}
									<img 
										src="/images/original.png" 
										alt="VietBus Logo" 
										style={{
											width: '70%',
											marginBottom: '20px',
											borderRadius: '50%', 
											aspectRatio:'1/1',
											objectFit:'cover'
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
										Quản Lý Người Dùng
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
										Quản Lý Chuyến Xe
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
										Quản Lý Nhà Xe
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
										Quản Lý Xe
									</Menu.Item>

									<SubMenu key="sub2" icon={<MoneyCollectOutlined />} title="Thống Kê">
										<Menu.Item
											key="5"
											onClick={() => {
												history.push("/admin/turnover");
											}}
										>
											Thống Kê Tổng Hợp
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
										Quản Lý Vé
									</Menu.Item>
									<Menu.Item
										key="8"
										icon={<CarRentalIcon />}
										onClick={() => {
											history.push("/admin/station");
										}}
									>
										Quản Lý Bến Xe
									</Menu.Item>
								</Menu>
							</Sider>
							<Layout className="site-layout">
								<Header className="site-layout-background flex justify-end" style={{padding: 0, background: "#fff"}}>
									<div className="flex items-center justify-between w-full px-5">
										<span className="font-bold text-xl">VietBus Travel🚍- Hệ Thống Quản Lý</span>
										<Dropdown overlay={menu} trigger={["click"]} className="cursor-pointer">
											<div className="flex items-center">
												<Avatar style={{verticalAlign: "middle", background: "#7265e6", marginRight: 10}} size="large">
													{userLogin?.name}
												</Avatar>
												<span className="text-xl">Xin chào , {userLogin?.name}</span>
											</div>
										</Dropdown>
									</div>
								</Header>
								<Component {...propsRoute} />

								<Footer style={{textAlign: "center"}}>Created 2024 To Minh Vu</Footer>
							</Layout>
						</Layout>
					</Fragment>
				);
			}}
		/>
	);
}

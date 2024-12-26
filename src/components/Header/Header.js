import React, {useState} from "react";
import {Button, Modal, Menu, Dropdown, message, Space, Tooltip, Popover} from "antd";
import {UserOutlined, DownOutlined} from "@ant-design/icons";
import _ from "lodash";
import "../../Sass/css/Header.css";
import Login from "../Login/Login";
import Register from "../Register/Register";
import {useSelector} from "react-redux";
import {TOKEN, USER_LOGIN} from "../../util/settings/config";
import MessengerCustomerChat from "react-messenger-customer-chat";
import {MessengerChat} from "react-messenger-chat-plugin";

import {history} from "../../App";

export default function Header() {
	const {userLogin} = useSelector((state) => state.userReducer);
	const [modal, setModal] = useState(false);
	const [toggle, setToggle] = useState(true);
	const menu = (
		<Menu>
			<Menu.Item key="1">
				<a
					onClick={() => {
						history.push("/usermgt");
					}}
				>
					<span>
						<img src="https://storage.googleapis.com/fe-production/images/Auth/account-circle.svg" width={16} height={16} alt className="mr-2" />
						<span style={{fontSize: 12}}>Thông tin tài khoản</span>
					</span>
				</a>
			</Menu.Item>
			<Menu.Item key="2">
				<a
					onClick={() => {
						history.push("/ticketmgt");
					}}
				>
					<span>
						<img src="https://storage.googleapis.com/fe-production/images/ticket.svg" width={16} height={16} alt className="mr-2" />

						<span style={{fontSize: 12}}>Vé của tôi</span>
					</span>
				</a>
			</Menu.Item>
			<Menu.Item key="3">
				<a
					onClick={() => {
						history.push("/commentmgt");
					}}
				>
					<span>
						<img src="https://storage.googleapis.com/fe-production/images/review.svg" width={16} height={16} alt className="mr-2" />
						<span style={{fontSize: 12}}>Nhận xét của tôi</span>
					</span>
				</a>
			</Menu.Item>
			<Menu.Item key="4">
				<a
					onClick={() => {
						localStorage.removeItem(USER_LOGIN);
						localStorage.removeItem(TOKEN);
						window.location.reload();
					}}
				>
					<span>
						<img src="https://storage.googleapis.com/fe-production/images/Auth/logout.svg" width={16} height={16} alt className="mr-2" />
						<span style={{fontSize: 12}}>Đăng xuất</span>
					</span>
				</a>
			</Menu.Item>
		</Menu>
	);
	const renderAccount = () => {
		if (_.isEmpty(userLogin)) {
			return (
				<Button className="btn_login" type="primary" shape="round" size={"small"} onClick={() => setModal(true)}>
					<img src="https://storage.googleapis.com/fe-production/images/Auth/account-circle-fill.svg" alt height={16} width={16} />
					Đăng nhập
				</Button>
			);
		}
		return (
			<Dropdown overlay={menu}>
				<Button className="btn_login" type="primary" shape="round" size={"small"}>
					<img src="https://storage.googleapis.com/fe-production/images/Auth/account-circle-fill.svg" alt height={16} width={16} />
					<DownOutlined />
				</Button>
			</Dropdown>
		);
	};

	return (
		<div className="header-container">
			<div className="header">
				<div className="grid grid-cols-8 d-flex items-center">
					<div className="header_right text-3xl col-span-2">
						<div className="logo">
							<a
								onClick={() => {
									history.push("/");
								}}
							>
								{/* <img src="https://storage.googleapis.com/fe-production/icon_vxr_full.svg" alt={123} className="mb-5" /> */}
								{/* <img src="./images/original.png" alt={123} className="mb-5" style={{width: 100}}/> */}
								<h1 className="text-2xl flex items-center" style={{width: 200}}>
									<span>VietBus Travel🚍</span>
									{/* <img src="./images/original.png" style={{width:100}} alt="logo" /> */}
								</h1>
							</a>
						</div>
					</div>
					<div className="header_left col-span-6">
						<ul>
							<li>
								<a href="https://vexere.com/vi-VN/xe-limousine" target="_blank" rel="noreferrer">
									Xe limousine
								</a>
							</li>

							<li>
								<a href="#partner">Đối tác</a>
							</li>
							<li>
								<a href="#station">Bến Xe</a>
							</li>
							<li>
								<a href="#news">Ưu đãi</a>
							</li>
							<li>
								<a
									onClick={() => {
										history.push("/ticketLookup");
									}}
								>
									Tra cứu vé
								</a>
							</li>
							<li className="hotline">
								<Popover placement="bottom" title="Số Điện Thoại Tổng Đài" content={"0937750843"} trigger="click">
									<a href="#">
										<img src="https://storage.googleapis.com/fe-production/svgIcon/hotline-icon.svg" alt className="object-cover" />
										Hotline
									</a>
								</Popover>
							</li>
							<li className="login flex items-center">
								{renderAccount()}
								<Modal title={toggle ? "Đăng nhập" : "Đăng ký"} centered visible={modal} onOk={() => setModal(false)} onCancel={() => setModal(false)} className="flex justify-center items-center" footer={null}>
									{toggle ? <Login toggle={toggle} setToggle={setToggle} setModal={setModal} /> : <Register toggle={toggle} setToggle={setToggle} />}
								</Modal>
							</li>
						</ul>
					</div>
				</div>
			</div>
			<MessengerChat
				pageId="100006352638655"
				language="sv_SE"
				themeColor={"#000000"}
				bottomSpacing={300}
				loggedInGreeting="loggedInGreeting"
				loggedOutGreeting="loggedOutGreeting"
				greetingDialogDisplay={"show"}
				debugMode={true}
				onMessengerShow={() => {
					console.log("onMessengerShow");
				}}
				onMessengerHide={() => {
					console.log("onMessengerHide");
				}}
				onMessengerDialogShow={() => {
					console.log("onMessengerDialogShow");
				}}
				onMessengerDialogHide={() => {
					console.log("onMessengerDialogHide");
				}}
				onMessengerMounted={() => {
					console.log("onMessengerMounted");
				}}
				onMessengerLoad={() => {
					console.log("onMessengerLoad");
				}}
			/>
		</div>
	);
}

import React, {Fragment, useEffect, useState} from "react";
import {Layout, Menu, Breadcrumb, Table, Input, Space, Popconfirm, Button} from "antd";
import {useDispatch, useSelector} from "react-redux";
import {deleteUserAction, getUserAction} from "../../redux/actions/UserAction";
import {AudioOutlined, EditOutlined, SearchOutlined, DeleteOutlined, CalendarOutlined, UserAddOutlined} from "@ant-design/icons";
import {SET_MODAL} from "../../redux/types/ModalTypes";
import EditUser from "../../components/Edit/EditUser";
import {OPEN_DRAWER} from "../../redux/types/DrawerTypes";
import AddUser from "../../components/Add/AddUser";
import {useTranslation} from "react-i18next";
import moment from "moment";

const {Header, Content, Footer, Sider} = Layout;
const {Search} = Input;

export default function AdminUser() {
	const {t} = useTranslation();
	const dispatch = useDispatch();
	const {listUser} = useSelector((state) => state.userReducer);
	console.log("file: AdminUser.js ~ line 17 ~ AdminUser ~ listUser", listUser);
	let arrFilterPhone = listUser.map((item) => {
		return {value: item.numberPhone, text: item.numberPhone};
	});
	useEffect(() => {
		dispatch(getUserAction());
	}, []);
	const columns = [
		{
			title: t("lable.name"),
			dataIndex: "name",
			// specify the condition of filtering result
			// here is that finding the name started with `value`
			onFilter: (value, record) => record.name.indexOf(value) === 0,
			sorter: (a, b) => a.name.length - b.name.length,
			sortDirections: ["descend"],
		},
		{
			title: t("lable.dateOfBirth"),
			dataIndex: "dateOfBirth",
			sorter: (a, b) => a.dateOfBirth.length - b.dateOfBirth.length,
			sortDirections: ["descend"],
			render: (text) => moment(text).format("DD-MM-YYYY"),
		},
		{
			title: t("lable.gender"),
			dataIndex: "gender",
			sorter: (a, b) => a.gender.length - b.gender.length,
			sortDirections: ["descend"],
			render: (text) => (text === "male" ? "Nam" : "Nữ"),
		},
		{
			title: t("lable.email"),
			dataIndex: "email",
			defaultSortOrder: "descend",
			sorter: (a, b) => a.age - b.age,
		},
		{
			title: t("lable.phone"),
			dataIndex: "numberPhone",
			filters: arrFilterPhone,
			onFilter: (value, record) => record.numberPhone.startsWith(value),
			filterSearch: true,
		},
		{
			title: t("lable.address"),
			dataIndex: "address",
			sorter: (a, b) => a.address.length - b.address.length,
			sortDirections: ["descend"],
		},
		{
			title: t("lable.authorities"),
			dataIndex: "type",
			filters: [
				{
					text: "Quản lý",
					value: "ADMIN",
				},
				{
					text: "Người dùng",
					value: "CLIENT",
				},
			],
			onFilter: (value, record) => record.type.startsWith(value),
			filterSearch: true,
			render: (text) => (text === "ADMIN" ? "Quản lý" : "Người dùng"),
		},
		{
			title: t("lable.action"),

			render: (text, item) => {
				return (
					<Fragment>
						<div>
							<button
								className="mr-3"
								onClick={() => {
									console.log("Edit clicked for id:", item.id);
									dispatch({
										type: SET_MODAL,
										title: t("button.editUser"),
										content: <EditUser id={item.id} />,
										width: 600,
									});
								}}
							>
								<EditOutlined />
							</button>
							<Popconfirm
								placement="topLeft"
								title={t("messages.deleteAccount")}
								onConfirm={() => {
									dispatch(deleteUserAction(item.id, item.name));
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

	function onChange(pagination, filters, sorter, extra) {
		console.log("params", pagination, filters, sorter, extra);
	}

	const [searchText, setSearchText] = useState("");

	const onSearch = (value) => {
		setSearchText(value);
	};

	const filteredUsers = listUser.filter((user) => user.name.toLowerCase().includes(searchText.toLowerCase()));

	return (
		<Content style={{margin: "0 16px"}}>
			<Breadcrumb style={{margin: "16px 0"}}>
				<Breadcrumb.Item>{t("navigation.admin")}</Breadcrumb.Item>
				<Breadcrumb.Item>{t("navigation.user")}</Breadcrumb.Item>
			</Breadcrumb>
			<div className="site-layout-background" style={{padding: 12, minHeight: 360}}>
				<div style={{display: "flex", gap: "16px", marginBottom: 16, justifyContent: "space-between"}}>
					<Space size="middle">
						<Input placeholder={t("Search.searchByUsername")} prefix={<SearchOutlined />} allowClear onSearch={onSearch} onChange={(e) => setSearchText(e.target.value)} style={{width: 400}} />
					</Space>
					{/* <Search
						placeholder="Tìm kiếm theo tên người dùng"
						allowClear
						prefix={<SearchOutlined />}
						size="large"
						enterButton={false}
						onSearch={onSearch}
						onChange={(e) => setSearchText(e.target.value)}
						style={{ width: 400 }}
					/> */}
					<Button
						type="primary"
						onClick={() => {
							dispatch({
								type: OPEN_DRAWER,
								title: t("button.AddUser"),
								content: <AddUser />,
							});
						}}
						style={{display: "flex", alignItems: "center"}}
					>
						<UserAddOutlined />
						{t("button.AddUser")}
					</Button>
				</div>
				<Table columns={columns} dataSource={filteredUsers} onChange={onChange} />
			</div>
		</Content>
	);
}

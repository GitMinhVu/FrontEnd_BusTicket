import React, {Fragment, useEffect, useState} from "react";
import {Layout, Menu, Breadcrumb, Table, Input, Space, Popconfirm, Button} from "antd";
import {useDispatch, useSelector} from "react-redux";
import {deleteUserAction, getUserAction} from "../../redux/actions/UserAction";
import {AudioOutlined, EditOutlined, SearchOutlined, DeleteOutlined, CalendarOutlined, UserAddOutlined} from "@ant-design/icons";
import {SET_MODAL} from "../../redux/types/ModalTypes";
import EditUser from "../../components/Edit/EditUser";
import {OPEN_DRAWER} from "../../redux/types/DrawerTypes";
import AddUser from "../../components/Add/AddUser";

const {Header, Content, Footer, Sider} = Layout;
const {Search} = Input;

export default function AdminUser() {
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
			title: "Name",
			dataIndex: "name",

			// specify the condition of filtering result
			// here is that finding the name started with `value`
			onFilter: (value, record) => record.name.indexOf(value) === 0,
			sorter: (a, b) => a.name.length - b.name.length,
			sortDirections: ["descend"],
		},
		{
			title: "Email",
			dataIndex: "email",
			defaultSortOrder: "descend",
			sorter: (a, b) => a.age - b.age,
		},
		{
			title: "Phone",
			dataIndex: "numberPhone",
			filters: arrFilterPhone,
			onFilter: (value, record) => record.numberPhone.startsWith(value),
			filterSearch: true,
		},
		{
			title: "Type",
			dataIndex: "type",
			filters: [
				{
					text: "Admin",
					value: "ADMIN",
				},
				{
					text: "Client",
					value: "CLIENT",
				},
			],
			onFilter: (value, record) => record.type.startsWith(value),
			filterSearch: true,
		},
		{
			title: "Action",

			render: (text, item) => {
				return (
					<Fragment>
						<div>
							<button
								className="mr-3"
								onClick={() => {
									dispatch({
										type: SET_MODAL,
										title: "EDIT USER",
										content: <EditUser id={item.id} />,
										width: 600,
									});
								}}
							>
								<EditOutlined />
							</button>
							<Popconfirm
								placement="topLeft"
								title={"Bạn có muốn xóa tài khoản này"}
								onConfirm={() => {
									dispatch(deleteUserAction(item.id));
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

	const filteredUsers = listUser.filter(user =>
		user.name.toLowerCase().includes(searchText.toLowerCase())
	);

	return (
		<Content style={{margin: "0 16px"}}>
			<Breadcrumb style={{margin: "16px 0"}}>
				<Breadcrumb.Item>Admin</Breadcrumb.Item>
				<Breadcrumb.Item>User</Breadcrumb.Item>
			</Breadcrumb>
			<div className="site-layout-background" style={{padding: 12, minHeight: 360}}>
				<div style={{ display: 'flex', gap: '16px', marginBottom: 16, justifyContent: 'space-between' }}>
					<Space size="middle">
					<Input
						placeholder="Tìm kiếm theo tên người dùng"
						prefix={<SearchOutlined />}
						allowClear
						onSearch={onSearch}
						onChange={(e) => setSearchText(e.target.value)}
						style={{ width: 400 }}/>
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
								title: "Thêm Người Dùng",
								content: <AddUser />,
							});
						}}
						style={{ display: 'flex', alignItems: 'center' }}
					>
						<UserAddOutlined />
						Thêm Người Dùng
					</Button>
				</div>
				<Table columns={columns} dataSource={filteredUsers} onChange={onChange} />
			</div>
		</Content>
	);
}

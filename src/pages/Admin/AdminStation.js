import React, {Fragment, useEffect, useState} from "react";
import {Layout, Menu, Breadcrumb, Image, Table, Statistic, Button, Rate, Popconfirm, Input, Space} from "antd";
import {useDispatch, useSelector} from "react-redux";
import {AudioOutlined, EditOutlined, SearchOutlined, DeleteOutlined, CalendarOutlined, FolderViewOutlined, CarOutlined} from "@ant-design/icons";
import {OPEN_DRAWER} from "../../redux/types/DrawerTypes";
import {ADMIN_LOGIN} from "../../util/settings/config";
import DirectionsRailwayFilledIcon from "@mui/icons-material/DirectionsRailwayFilled";
import {getListStationAction, deleteStationAction} from "../../redux/actions/stationAction";
import EditStation from "../../components/Edit/EditStation";
import {SET_MODAL} from "../../redux/types/ModalTypes";
import PointStation from "../../components/PointStation.js/PointStation";
import AddBusinessIcon from "@mui/icons-material/AddBusiness";
import AddStation from "../../components/Add/AddStation";
const {Header, Content, Footer, Sider} = Layout;

export default function AdminStation() {
	const dispatch = useDispatch();
	const {listStation} = useSelector((state) => state.StationReducer);
	const [searchName, setSearchName] = useState("");
	const [searchProvince, setSearchProvince] = useState("");

	const handleSearchName = (e) => {
		setSearchName(e.target.value);
	};

	const handleSearchProvince = (e) => {
		setSearchProvince(e.target.value);
	};

	const filteredStations = listStation.filter((station) => {
		const nameMatch = station.name.toLowerCase().includes(searchName.toLowerCase());
		const provinceMatch = station.province.toLowerCase().includes(searchProvince.toLowerCase());
		return nameMatch && provinceMatch;
	});

	useEffect(() => {
		const token = localStorage.getItem(ADMIN_LOGIN);
		console.log("Admin token:", token);
		dispatch(getListStationAction());
	}, []);

	useEffect(() => {
		dispatch(getListStationAction());
	}, []);

	const columns = [
		{
			title: "Tên",
			dataIndex: "name",
			onFilter: (value, record) => record.name.indexOf(value) === 0,
			sorter: (a, b) => a.name?.length - b.name?.length,
			sortDirections: ["descend"],
		},
		{
			title: "Địa chỉ",
			dataIndex: "address",
			onFilter: (value, record) => record.address.indexOf(value) === 0,
			sorter: (a, b) => a.address?.length - b.address?.length,
			sortDirections: ["descend"],
		},
		{
			title: "Thành phố / Tỉnh",
			dataIndex: "province",
			onFilter: (value, record) => record.address.indexOf(value) === 0,
			sorter: (a, b) => a.address?.length - b.address?.length,
			sortDirections: ["descend"],
		},
		{
			title: "Các điểm đón / trả",
			render: (text, station) => {
				return (
					<div style={{padding: "8px 0"}}>
						<Button
							type="primary"
							onClick={() => {
								dispatch({
									type: SET_MODAL,
									title: `Điểm đón / trả của bến xe ${station.name}`,
									content: <PointStation id={station.id} />,
									width: 900,
								});
							}}
							style={{
								display: "flex",
								alignItems: "center",
								gap: "6px",
								borderRadius: "8px",
								padding: "8px 16px",
								background: "linear-gradient(90deg, #1890ff 0%, #096dd9 100%)",
								boxShadow: "0 2px 4px rgba(24,144,255,0.2)",
								transition: "all 0.3s ease",
							}}
							className="hover:opacity-90"
						>
							<DirectionsRailwayFilledIcon style={{fontSize: "18px"}} />
							<span
								style={{
									fontWeight: "500",
									letterSpacing: "0.3px",
								}}
							>
								Xem điểm
							</span>
						</Button>
					</div>
				);
			},
		},
		{
			title: "Action",
			render: (text, item) => {
				return (
					<Fragment>
						<div className="flex justify-between">
							<button
								className="mr-3"
								onClick={() => {
									dispatch({
										type: OPEN_DRAWER,
										title: "Cập nhật Bến Xe",
										content: <EditStation id={item.id} />,
									});
								}}
							>
								<EditOutlined />
							</button>
							<Popconfirm
								placement="topLeft"
								title={"Bạn có muốn xóa  xe này"}
								onConfirm={() => {
									dispatch(deleteStationAction(item.id));
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
				<Breadcrumb.Item>Admin</Breadcrumb.Item>
				<Breadcrumb.Item>Station</Breadcrumb.Item>
			</Breadcrumb>
			<div className="site-layout-background" style={{padding: 24, minHeight: 360}}>
				<h1>Danh sách bến xe</h1>
				<div
					style={{
						display: "flex",
						justifyContent: "space-between",
						alignItems: "center",
						marginBottom: 16,
					}}
				>
					<Space size="middle">
						<Input placeholder="Tìm kiếm theo tên bến xe" allowClear prefix={<SearchOutlined />} value={searchName} onChange={handleSearchName} style={{width: 250}} />
						<Input placeholder="Tìm kiếm theo tỉnh/thành phố" allowClear prefix={<SearchOutlined />} value={searchProvince} onChange={handleSearchProvince} style={{width: 250}} />
					</Space>
					<Button
						type="primary"
						onClick={() => {
							dispatch({
								type: OPEN_DRAWER,
								title: "Thêm Bến Xe",
								content: <AddStation />,
							});
						}}
						style={{display: "flex", alignItems: "center"}}
					>
						<AddBusinessIcon className="mr-2" style={{marginRight: 8}} />
						Thêm Bến Xe
					</Button>
				</div>
				<Table
					columns={columns}
					dataSource={filteredStations}
					pagination={{
						pageSize: 6,
						total: filteredStations.length,
						showTotal: (total) => `Tổng ${total} bến xe`,
						showSizeChanger: false,
					}}
				/>
			</div>
		</Content>
	);
}

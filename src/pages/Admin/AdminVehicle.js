import React, {Fragment, useEffect, useState} from "react";
import {Layout, Menu, Breadcrumb, Image, Space, Tag, Table, Button, Rate, Popconfirm, Input} from "antd";
import {useDispatch, useSelector} from "react-redux";
import _ from "lodash";
import {EditOutlined, SearchOutlined, DeleteOutlined, EyeOutlined} from "@ant-design/icons";
import LocalCarWashIcon from "@mui/icons-material/LocalCarWash";
import {SET_MODAL} from "../../redux/types/ModalTypes";
import {OPEN_DRAWER} from "../../redux/types/DrawerTypes";
import {DeleteVehicleAction, getAllVehicleAction} from "../../redux/actions/vehicleAction";
import EditVehicle from "../../components/Edit/EditVehicle";
import ImageVehicle from "../../components/Vehicle/ImageVehicle";
import DirectionsBusIcon from "@mui/icons-material/DirectionsBus";
import DetailSeatVehicle from "../../components/Vehicle/DetailSeatVehicle";
import AddVehicle from "../../components/Add/AddVehicle";
const {Content} = Layout;
export default function AdminVehicle() {
	const dispatch = useDispatch();
	const {listVehicle} = useSelector((state) => state.vehicleReducer);
	useEffect(() => {
		dispatch(getAllVehicleAction());
	}, []);
	let arrFilterName = listVehicle.map((item) => {
		return {value: item.name, text: item.name};
	});
	let arrFilterType = _.uniqBy(listVehicle, "type").map((item) => {
		return {value: item.type, text: item.type};
	});
	let arrFilterPassenger = _.uniqBy(listVehicle, "passengerCarId").map((item) => {
		return {value: item.passengerCarId, text: item.passengerCar?.name};
	});
	const columns = [
		{
			title: "Tên xe",
			dataIndex: "name",
			sorter: (a, b) => a.name?.length - b.name?.length,
			sortDirections: ["descend"],
			filters: arrFilterName,
			onFilter: (value, record) => record.name.startsWith(value),
			filterSearch: true,
		},
		{
			title: "Loại Xe",
			render: (text, vehicle) => {
				return <Tag color={vehicle.type === "limouse" ? "gold" : "blue"}>{vehicle.type === "limouse" ? "Xe Limouse Vip" : "Xe Thường"}</Tag>;
			},
		},
		{
			title: "Hình Ảnh & Thông tin",
			render: (text, vehicle) => {
				return (
					<Space>
						<Image width={100} src={vehicle.vehicleOfImage[0]?.link} />
						<div>
							<div>Nhà xe: {vehicle.passengerCar?.name}</div>
							<div>Số tầng: {vehicle.numberFloors}</div>
							<div>Số ghế: {vehicle.seatVehicle?.length}</div>
							<Space>
								<Button
									type="primary"
									size="small"
									onClick={() => {
										dispatch({
											type: SET_MODAL,
											title: "Cập Nhật Ghế Xe",
											content: <DetailSeatVehicle id={vehicle.id} />,
											width: 1000,
										});
									}}
								>
									Quản lý ghế
								</Button>
								<Button
									type="default"
									size="small"
									icon={<EyeOutlined />}
									onClick={() => {
										dispatch({
											type: SET_MODAL,
											title: "Cập Nhật Ảnh Xe",
											content: <ImageVehicle id={vehicle.id} />,
											width: 1000,
										});
									}}
								>
									Quản lý ảnh
								</Button>
							</Space>
						</div>
					</Space>
				);
			},
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
										type: OPEN_DRAWER,
										title: "Cập nhật Xe",
										content: <EditVehicle id={item.id} />,
									});
								}}
							>
								<EditOutlined />
							</button>
							<Popconfirm
								placement="topLeft"
								title={"Bạn có muốn xóa xe này"}
								onConfirm={() => {
									dispatch(DeleteVehicleAction(item.id));
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

	// const columns = [
	// 	{
	// 		title: "Tên xe",
	// 		dataIndex: "name",
	// 		sorter: (a, b) => a.name?.length - b.name?.length,
	// 		sortDirections: ["descend"],
	// 		filters: arrFilterName,
	// 		onFilter: (value, record) => record.name.startsWith(value),
	// 		filterSearch: true,
	// 	},
	// 	{
	// 		title: "Loại Xe",
	// 		render: (text, vehicle) => {
	// 			return <Tag color={vehicle.type === "limouse" ? "gold" : "blue"}>{vehicle.type === "limouse" ? "Xe Limouse Vip" : "Xe Thường"}</Tag>;
	// 		},
	// 	},
	// 	{
	// 		title: "Hình Ảnh & Thông tin",
	// 		render: (text, vehicle) => {
	// 			return (
	// 				<Space>
	// 					<Image width={100} src={vehicle.vehicleOfImage[0]?.link} />
	// 					<div>
	// 						<div>Số ghế: {vehicle.seatVehicle?.length}</div>
	// 						<div>Số tầng: {vehicle.numberFloors}</div>
	// 						<div>{vehicle.passengerCar?.name}</div>
	// 					</div>
	// 				</Space>
	// 			);
	// 		},
	// 	},
	// 	{
	// 		title: "Action",
	// 		render: (text, item) => {
	// 			return (
	// 				<Fragment>
	// 					<div>
	// 						<button
	// 							className="mr-3"
	// 							onClick={() => {
	// 								dispatch({
	// 									type: OPEN_DRAWER,
	// 									title: "Cập nhật Xe",
	// 									content: <EditVehicle id={item.id} />,
	// 								});
	// 							}}
	// 						>
	// 							<EditOutlined />
	// 						</button>
	// 						<Popconfirm
	// 							placement="topLeft"
	// 							title={"Bạn có muốn xóa  xe này"}
	// 							onConfirm={() => {
	// 								dispatch(DeleteVehicleAction(item.id));
	// 							}}
	// 							okText="Yes"
	// 							cancelText="No"
	// 						>
	// 							<button className="text-red-700">
	// 								<DeleteOutlined />
	// 							</button>
	// 						</Popconfirm>
	// 					</div>
	// 				</Fragment>
	// 			);
	// 		},
	// 	},
	// ];

	// const columns = [
	// 	{
	// 		title: "Tên xe",
	// 		dataIndex: "name",
	// 		sorter: (a, b) => a.name?.length - b.name?.length,
	// 		sortDirections: ["descend"],
	// 		filters: arrFilterName,
	// 		onFilter: (value, record) => record.name.startsWith(value),
	// 		filterSearch: true,
	// 	},
	// 	{
	// 		title: "Mô Tả",
	// 		dataIndex: "description",
	// 		onFilter: (value, record) => record.description.indexOf(value) === 0,
	// 		sorter: (a, b) => a.description?.length - b.description?.length,
	// 		sortDirections: ["descend"],
	// 	},

	// 	{
	// 		title: "Loại Xe",
	// 		render: (text, vehicle) => {
	// 			return <div>{vehicle.type == "limouse" ? "Xe Limouse Vip" : "Xe Thường"}</div>;
	// 		},
	// 		filters: arrFilterType,
	// 		onFilter: (value, record) => record.type.startsWith(value),
	// 		filterSearch: true,
	// 	},
	// 	{
	// 		title: "Hình Ảnh",
	// 		render: (text, vehicle) => {
	// 			return (
	// 				<div style={{display: "flex", alignItems: "center"}}>
	// 					{" "}
	// 					{/* Thêm style này */}
	// 					{vehicle.vehicleOfImage.map((item, index) => {
	// 						return <Image preview={{visible: vehicle.visible}} width={75} height={60} style={{borderRadius: "50%"}} src={item.link} key={index} />;
	// 					})}
	// 					<Button
	// 						type="link"
	// 						icon={<EyeOutlined />}
	// 						onClick={() => {
	// 							dispatch({
	// 								type: SET_MODAL,
	// 								title: "Cập Nhật Ảnh Xe",
	// 								content: <ImageVehicle id={vehicle.id} />,
	// 								width: 1000,
	// 							});
	// 						}}
	// 					/>
	// 				</div>
	// 			);
	// 		},
	// 	},
	// 	{
	// 		title: "Số Tầng",
	// 		dataIndex: "numberFloors",
	// 		sorter: (a, b) => a.name.numberFloors - b.name.numberFloors,
	// 		sortDirections: ["descend"],
	// 	},
	// 	{
	// 		title: "Số Ghế",
	// 		render: (text, vehicle) => {
	// 			return (
	// 				<div className="text-xl font-bold">
	// 					{vehicle.seatVehicle?.length}
	// 					<Button
	// 						type="primary"
	// 						onClick={() => {
	// 							dispatch({
	// 								type: SET_MODAL,
	// 								title: "Cập Nhật Ghế Xe",
	// 								content: <DetailSeatVehicle id={vehicle.id} />,
	// 								width: 1000,
	// 							});
	// 						}}
	// 					>
	// 						Xem Chi Tiết
	// 					</Button>
	// 				</div>
	// 			);
	// 		},
	// 		sorter: (a, b) => a.seatVehicle?.length - b.seatVehicle?.length,
	// 		sortDirections: ["descend"],
	// 	},
	// 	{
	// 		title: "Nhà Xe",
	// 		render: (text, vehicle) => {
	// 			return (
	// 				<div style={{cursor: "not-allowed"}}>
	// 					<DirectionsBusIcon />
	// 					{vehicle.passengerCar?.name}
	// 				</div>
	// 			);
	// 		},
	// 		filters: arrFilterPassenger,
	// 		onFilter: (value, record) => record.passengerCarId === value,
	// 		filterSearch: true,
	// 	},
	// 	{
	// 		title: "Action",
	// 		render: (text, item) => {
	// 			return (
	// 				<Fragment>
	// 					<div>
	// 						<button
	// 							className="mr-3"
	// 							onClick={() => {
	// 								dispatch({
	// 									type: OPEN_DRAWER,
	// 									title: "Cập nhật Xe",
	// 									content: <EditVehicle id={item.id} />,
	// 								});
	// 							}}
	// 						>
	// 							<EditOutlined />
	// 						</button>
	// 						<Popconfirm
	// 							placement="topLeft"
	// 							title={"Bạn có muốn xóa  xe này"}
	// 							onConfirm={() => {
	// 								dispatch(DeleteVehicleAction(item.id));
	// 							}}
	// 							okText="Yes"
	// 							cancelText="No"
	// 						>
	// 							<button className="text-red-700">
	// 								<DeleteOutlined />
	// 							</button>
	// 						</Popconfirm>
	// 					</div>
	// 				</Fragment>
	// 			);
	// 		},
	// 	},
	// ];
	const [searchText, setSearchText] = useState("");
	const handleSearch = (e) => {
		setSearchText(e.target.value);
	};
	const filteredVehicles = listVehicle.filter((vehicle) => vehicle.name.toLowerCase().includes(searchText.toLowerCase()));
	return (
		<Content style={{margin: "0 16px"}}>
			<Breadcrumb style={{margin: "16px 0"}}>
				<Breadcrumb.Item>Admin</Breadcrumb.Item>
				<Breadcrumb.Item>Vehicle</Breadcrumb.Item>
			</Breadcrumb>
			<div className="site-layout-background" style={{padding: 24, minHeight: 360}}>
				<h1>Danh sách xe</h1>

				<div style={{display: "flex", gap: "16px", marginBottom: 16, justifyContent: "space-between"}}>
					<Input placeholder="Tìm kiếm theo tên xe" allowClear prefix={<SearchOutlined />} value={searchText} onChange={handleSearch} style={{width: 300}} />
					<Button
						type="primary"
						onClick={() => {
							dispatch({
								type: OPEN_DRAWER,
								title: "Thêm nhà xe",
								content: <AddVehicle />,
							});
						}}
						style={{display: "flex", alignItems: "center"}}
					>
						<LocalCarWashIcon style={{marginRight: 8}} />
						Thêm Xe
					</Button>
				</div>
				<Table
					columns={columns}
					dataSource={filteredVehicles}
					pagination={{
						pageSize: 5,
						total: filteredVehicles.length,
						showTotal: (total) => `Tổng ${total} xe`,
						showSizeChanger: false,
					}}
				/>
			</div>
		</Content>
	);
}

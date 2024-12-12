import React, {Fragment, useEffect, useState} from "react";
import {Layout, Menu, Breadcrumb, Table, Input, Space, Popconfirm, Button} from "antd";
import {useDispatch, useSelector} from "react-redux";
import {AudioOutlined, EditOutlined, SearchOutlined, DeleteOutlined, HistoryOutlined, FolderViewOutlined} from "@ant-design/icons";
import {getDetailTripAction, getTripAction} from "../../redux/actions/tripAction";
import DirectionsRailwayFilledIcon from "@mui/icons-material/DirectionsRailwayFilled";
import moment from "moment";
import _ from "lodash";
import {history} from "../../App";
const {Header, Content, Footer, Sider} = Layout;
export default function AdminTrip() {
	const dispatch = useDispatch();
	const {listTrip} = useSelector((state) => state.TripReducer);
	console.log(listTrip);
	useEffect(() => {
		dispatch(getTripAction());
	}, []);
	let arrFilterDate = _.uniqBy(listTrip, "startTime").map((item) => {
		return {value: item.startTime, text: moment(item.startTime).format("DD-MM-YYYY")};
	});
	let arrFilterFrom = _.uniqBy(listTrip, "fromStation").map((item) => {
		return {value: item.fromStation, text: `${item.from.name} - ${item.from.province}`};
	});
	let arrFilterTo = _.uniqBy(listTrip, "toStation").map((item) => {
		return {value: item.toStation, text: `${item.to.name} - ${item.to.province}`};
	});
	console.log("file: AdminTrip.js ~ line 23 ~ AdminTrip ~ arrFilterTo", arrFilterTo);
	console.log("file: AdminTrip.js ~ line 22 ~ AdminTrip ~ arrFilterFrom", arrFilterFrom);
	const columns = [
		{
			title: "Nơi Bắt Đầu",

			// specify the condition of filtering result
			// here is that finding the name started with `value`
			render: (text, trip) => {
				return (
					<div>
						{trip.from.province} - {trip.from.address}
					</div>
				);
			},
			filters: arrFilterFrom,
			onFilter: (value, record) => record.fromStation == value,
			filterSearch: true,
		},
		{
			title: "Nơi Đến",

			// specify the condition of filtering result
			// here is that finding the name started with `value`
			render: (text, trip) => {
				return (
					<div>
						{trip.to.province} - {trip.to.address}
					</div>
				);
			},
			filters: arrFilterTo,
			onFilter: (value, record) => record.toStation == value,
			filterSearch: true,
		},

		{
			title: "Ngày bắt đầu",
			dataIndex: "startTime",
			render: (text, trip) => {
				return <div>{moment(trip.startTime).format("DD-MM-YYYY")}</div>;
			},
			defaultSortOrder: "descend",
			sorter: (a, b) => a.startTime - b.startTime,
			filters: arrFilterDate,
			onFilter: (value, record) => record.startTime.startsWith(value),
			filterSearch: true,
		},
		{
			title: "Danh Sách Chuyến Đi Chi Tiết",

			render: (text, item) => {
				return (
					<Fragment>
						<div className="text-center">
							<Button
								type="primary"
								className="mr-3"
								onClick={() => {
									history.push(`/admin/trip/tripPassenger/${item.id}`);
								}}
							>
								<DirectionsRailwayFilledIcon />
							</Button>
						</div>
					</Fragment>
				);
			},
		},
	];
	const [searchFrom, setSearchFrom] = useState("");
	const [searchTo, setSearchTo] = useState("");
	const handleSearchFrom = (e) => {
		setSearchFrom(e.target.value);
	};
	const handleSearchTo = (e) => {
		setSearchTo(e.target.value);
	};
	const filteredTrips = listTrip.filter(trip => {
		const fromMatch = trip.from.province.toLowerCase().includes(searchFrom.toLowerCase()) ||
						 trip.from.address.toLowerCase().includes(searchFrom.toLowerCase());
		const toMatch = trip.to.province.toLowerCase().includes(searchTo.toLowerCase()) ||
					   trip.to.address.toLowerCase().includes(searchTo.toLowerCase());
		return fromMatch && toMatch;
	});
	return (
		<Content style={{margin: "0 16px"}}>
			<Breadcrumb style={{margin: "16px 0"}}>
				<Breadcrumb.Item>Admin</Breadcrumb.Item>
				<Breadcrumb.Item>Trip</Breadcrumb.Item>
			</Breadcrumb>
			<div className="site-layout-background" style={{padding: 24, minHeight: 360}}>
				<h1>Danh sách các chuyến đi</h1>
				<div style={{ 
					display: 'flex', 
					justifyContent: 'space-between',
					alignItems: 'center',
					marginBottom: 16 
				}}>
					<Space size="middle">
						<Input
							placeholder="Tìm kiếm điểm đi"
							prefix={<SearchOutlined />}
							value={searchFrom}
							onChange={handleSearchFrom}
							style={{ width: 200 }}
						/>
						<Input
							placeholder="Tìm kiếm điểm đến"
							prefix={<SearchOutlined />}
							value={searchTo}
							onChange={handleSearchTo}
							style={{ width: 200 }}
						/>
					</Space>
					<Button
						type="primary"
						className="mb-3"
						onClick={() => {
							history.push("/admin/addtrip");
						}}
					>
						<HistoryOutlined />
						Thêm Chuyến Đi
					</Button>
				</div>
				<Table columns={columns} dataSource={filteredTrips} />
			</div>
		</Content>
	);
}

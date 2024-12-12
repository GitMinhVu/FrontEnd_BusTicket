import React, {useEffect, useState} from "react";
import {Card, Button, Checkbox, Slider, Input, Rate} from "antd";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import RemoveIcon from "@mui/icons-material/Remove";
import Remove from "@mui/icons-material/Remove";
import {useDispatch, useSelector} from "react-redux";
import {FILTER_TRIPPASSENGER_TIME} from "../../redux/types/TripTypes";
import {FilterTimeTripPassengerAction, FilterPriceTripPassengerAction, FilterTypeTripPassengerAction, getTripPassengerAction, FilterBlankTripPassengerAction, FilterPassengerTripPassengerAction, getTripPassenger2Action, FilterSeatTripPassengerAction, FilterRateTripPassengerAction} from "../../redux/actions/tripAction";
import _ from "lodash";
import {CANCEL_SORT_TIME, SET_SORT_TIME} from "../../redux/types/BookingTypes";
const {Search} = Input;

export default function FilterTrips(props) {
	const dispatch = useDispatch();
	let {listTripPassenger, listTripPassenger2} = useSelector((state) => state.BookingReducer);
	let arrFilterPassenger = _.uniqBy(listTripPassenger2, "passengerId");
	useEffect(() => {
		dispatch(getTripPassenger2Action(props.id));
	}, []);
	const [minmax, setMinMax] = useState([0, 5000000]);
	const [gheTrong, setGheTrong] = useState(1);
	const [btnActive, setBtnActive] = useState({
		activeObject: null,
		objects: [
			{id: 1, filterTime: "00:00 - 06:00", time: "Sáng sớm", timeStart: "00:00:00", timeEnd: "06:00:00"},
			{id: 2, filterTime: "06:01 - 12:00", time: "Buổi sáng", timeStart: "06:01:00", timeEnd: "12:00:00"},
			{id: 3, filterTime: "12:01 - 18:00", time: "Buổi chiều", timeStart: "12:01:00", timeEnd: "18:00:00"},
			{id: 4, filterTime: "18:01 - 23:59", time: "Buổi tối", timeStart: "18:01:00", timeEnd: "23:59:00"},
		],
	});
	const renderPassenger = () => {
		return arrFilterPassenger.map((item) => {
			return (
				<Checkbox
					onChange={(e) => {
						if (e.target.checked) {
							dispatch(FilterPassengerTripPassengerAction(item.passengerId));
						} else {
							dispatch(getTripPassengerAction(props.id));
						}
					}}
				>
					{item.passenger.name}
				</Checkbox>
			);
		});
	};
	function toggleActive(index) {
		if (btnActive.objects[index] === btnActive.activeObject) {
			setBtnActive({...btnActive, activeObject: null});
			dispatch({
				type: CANCEL_SORT_TIME,
			});
		} else {
			setBtnActive({...btnActive, activeObject: btnActive.objects[index]});
			dispatch({
				type: SET_SORT_TIME,
			});
		}
	}
	function toggleActiveStyle(index) {
		if (btnActive.objects[index] === btnActive.activeObject) {
			return "active-filterTime";
		} else {
			return "";
		}
	}

	return (
		<div className="filter_trip">
			<div style={{display: "block"}}>
				<span className="grLeft-label-left font-bold text-xl">Bộ lọc tìm kiếm</span>
			</div>
			<Card style={{width: 300}}>
				<div classname="list_time">
					<div className="Times__Contain0101er-sc-1ny42po-0 gTjoUi filter-times-container groupStyle">
						<p className="base__Body02Highlight-sc-1tvbuqk-15 cACxVN filter-name labelStyle font-bold">Giờ đi</p>
						<div className="time_filter">
							{btnActive.objects.map((element, index) => {
								return (
									<Button
										key={index}
										className={toggleActiveStyle(index)}
										onClick={() => {
											toggleActive(index);
											let timeFilter = {
												tripId: props.id,
												timeStart: element.timeStart,
												timeEnd: element.timeEnd,
											};
											dispatch(FilterTimeTripPassengerAction(timeFilter));
										}}
									>
										<p className="option-label">{element.time}</p>
										<p className="option-value">{element.filterTime}</p>
									</Button>
								);
							})}
						</div>
					</div>
				</div>
				<div className="list_condition">
					<p className="base__Body02Highlight-sc-1tvbuqk-15 cACxVN filter-name labelStyle font-bold">Tiêu chí phổ biến</p>
					<Checkbox
						onChange={(e) => {
							console.log(e);
							if (e.target.checked) {
								dispatch({
									type: SET_SORT_TIME,
								});
								let type = "Xác nhận tức thì";
								dispatch(FilterTypeTripPassengerAction(type));
							} else {
								dispatch(getTripPassengerAction(props.id));
							}
						}}
					>
						Xác nhận tức thì{" "}
						<svg className="Criteria__ConfirmSVG-sc-15ldjkf-0 eUrUgE" width={18} height={14} viewBox="0 0 18 14" fill="none" xmlns="http://www.w3.org/2000/svg">
							<path fillRule="evenodd" clipRule="evenodd" d="M17.332 2v3.333c-.916 0-1.666.75-1.666 1.667s.75 1.667 1.666 1.667V12c0 .917-.75 1.667-1.666 1.667H2.332c-.916 0-1.666-.75-1.666-1.667V8.667c.925 0 1.666-.75 1.666-1.667S1.591 5.333.674 5.333V2A1.66 1.66 0 0 1 2.332.333h13.334c.916 0 1.666.742 1.666 1.667zM8.01 11.344a.3.3 0 0 0 .558.193l.397-.696c.49-.859 1.355-2.372 2.597-4.539.115-.244 0-.343-.208-.343H9.525l.469-3.303a.3.3 0 0 0-.558-.192C8.842 3.51 8.314 4.436 7.853 5.245c-.549.963-1.003 1.76-1.36 2.39l-.001.003c-.026.037-.281.404.163.404h1.823l-.469 3.302z" fill="#27AE60" />
						</svg>
					</Checkbox>
					<span className="filter-item-description">Nhà xe sẽ nhận được thông tin ngay khi bạn hoàn tất các bước đặt vé</span>
					<Checkbox
						onChange={(e) => {
							console.log(e);
							if (e.target.checked) {
								dispatch({
									type: SET_SORT_TIME,
								});
								let type = "Không cần thanh toán trước";
								dispatch(FilterTypeTripPassengerAction(type));
							} else {
								dispatch(getTripPassengerAction(props.id));
							}
						}}
					>
						Không cần thanh toán trước
					</Checkbox>
					<span className="filter-item-description">Chuyến có thể thanh toán tại văn phòng nhà xe hoặc khi lên xe</span>
				</div>
				<div className="filter_price">
					<p className="base__Body02Highlight-sc-1tvbuqk-15 cACxVN filter-name labelStyle font-bold">Giá vé</p>
					<Slider
						range={{draggableTrack: true}}
						step={50000}
						min={0}
						max={5000000}
						defaultValue={minmax}
						onChange={(e) => {
							let markers = [...minmax];
							markers[0] = e[0];
							markers[1] = e[1];
							setMinMax(markers);
						}}
						onAfterChange={(e) => {
							if (e[0] > e[1]) {
								dispatch(getTripPassengerAction(props.id));
							} else {
								dispatch(FilterPriceTripPassengerAction(e));
							}
						}}
					/>
					<div className="flex justify-between">
						<div class="value-left value-info">{minmax[0].toLocaleString()} đ</div>
						<div class="value-right value-info">{minmax[1].toLocaleString()} đ</div>
					</div>
				</div>
				<div className="filter_seat">
					<p className="base__Body02Highlight-sc-1tvbuqk-15 cACxVN filter-name labelStyle font-bold">Chọn vị trí ghế</p>
					<div className="flex justify-between">
						<p class="base__Body02-sc-1tvbuqk-14 VqdXU color--darkness">Số ghế trống</p>
						<div className="QuantityInput__Container-sc-5ap7dx-0 bcpLGl quantity-input Filter_AvailableSeats flex items-center justify-center">
							<button
								disabled={gheTrong > 1 ? false : true}
								type="button"
								className="ant-btn QuantityInput__RoundButton-sc-5ap7dx-1 jHictt"
								onClick={() => {
									setGheTrong(gheTrong - 1);
									if (listTripPassenger.length > 0) {
										dispatch(FilterBlankTripPassengerAction(gheTrong));
									} else {
										dispatch(getTripPassengerAction(props.id));
									}
								}}
							>
								<Remove />
							</button>
							<div className="quantity-value mx-5 text-sm font-bold">
								<p className="base__SubHeadline-sc-1tvbuqk-8 jsMKgN color--darkness mb-0">{gheTrong}</p>
							</div>
							<button
								type="button"
								className="ant-btn QuantityInput__RoundButton-sc-5ap7dx-1 jHictt"
								onClick={() => {
									setGheTrong(gheTrong + 1);
									if (listTripPassenger.length > 0) {
										dispatch(FilterBlankTripPassengerAction(gheTrong));
									} else {
										dispatch(getTripPassengerAction(props.id));
									}
								}}
							>
								<AddCircleIcon />
							</button>
						</div>
					</div>

					{/* //Nhà xe */}
					<div className="filter_passenger mt-5">
						<p className="base__Body02Highlight-sc-1tvbuqk-15 cACxVN filter-name labelStyle font-bold">Nhà xe</p>
						<div className="mt-3 overflow-y-auto filer-passenger flex flex-col" style={{maxHeight: "100px"}}>
							{renderPassenger()}
						</div>
					</div>

					<div className="filter_typeseat mt-5">
						<p className="base__Body02Highlight-sc-1tvbuqk-15 cACxVN filter-name labelStyle font-bold">Loại ghế / giường</p>
						<div className="mt-3 filer-passenger">
							<Checkbox
								onChange={(e) => {
									if (e.target.checked) {
										dispatch(FilterSeatTripPassengerAction("seat"));
									} else {
										dispatch(getTripPassengerAction(props.id));
									}
								}}
							>
								Ghế ngồi
							</Checkbox>
							<Checkbox
								onChange={(e) => {
									if (e.target.checked) {
										dispatch(FilterSeatTripPassengerAction("bed"));
									} else {
										dispatch(getTripPassengerAction(props.id));
									}
								}}
							>
								Giường nằm
							</Checkbox>
						</div>
					</div>
				</div>
				<div className="filter_vote">
					<p className="base__Body02Highlight-sc-1tvbuqk-15 cACxVN filter-name labelStyle font-bold">Đánh giá</p>
					<Rate
						allowHalf
						defaultValue={2.5}
						onChange={(e) => {
							if (listTripPassenger.length > 0) {
								dispatch(FilterRateTripPassengerAction(e));
							} else {
								dispatch(getTripPassengerAction(props.id));
							}
						}}
					/>
				</div>
			</Card>
		</div>
	);
}

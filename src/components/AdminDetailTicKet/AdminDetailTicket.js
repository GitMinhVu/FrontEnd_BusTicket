import React, {useEffect, useState} from "react";
import {List, Avatar, Pagination} from "antd";
import {useDispatch, useSelector} from "react-redux";
import {getAllTicketByTrip} from "../../redux/actions/ticketAction";
import { useTranslation } from 'react-i18next'; 
import moment from "moment";

export default function AdminDetailTicket(props) {
	const dispatch = useDispatch();
	const { t } = useTranslation();
	const {listTicketTrip} = useSelector((state) => state.TicketReducer);
	console.log("listTicketTrip", listTicketTrip);
	useEffect(() => {
		dispatch(getAllTicketByTrip(props.id));
	}, [props.id]);
	const [minValue, setminValue] = useState(0);
	const [maxValue, setmaxValue] = useState(1);
	const numEachPage = 4;

	let dataReduce = listTicketTrip.slice(minValue, maxValue);
	const handleChange = (value) => {
		setminValue((value - 1) * numEachPage);
		setmaxValue(value * numEachPage);
	};
	const renderPoint = (ticket, typePoint) => {
		let point = ticket.ticketPointId.find((obj) => {
			return obj.typePoint == typePoint;
		});

		return (
			<span>
				{point?.timepointTicket?.point.name} - {point?.timepointTicket?.point.address}
			</span>
		);
	};
	const renderSeat = (ticket) => {
		return ticket.ticketSeatId.map((item, index) => {
			return (
				<div>
					{item?.seatofticket?.name}, {t("tripManagement.trippassenger.floor")} {item?.seatofticket?.floor}
				</div>
			);
		});
	};
	return (
		<div>
			<div className="text-xl">
			{t("tripManagement.trippassenger.totalNumberOfTickets")} : <span className="font-bold">{listTicketTrip.length}</span>
			</div>
			<List
				itemLayout="horizontal"
				dataSource={dataReduce}
				renderItem={(item) => (
					<List.Item>
						<List.Item.Meta
							avatar={<Avatar src={item.user.avatar} />}
							title={
								<a>
									{item.user.name} - {t("tripManagement.trippassenger.phone")}: {item.user.numberPhone} - {t("tripManagement.trippassenger.ticketNumber")}: {item.id}
								</a>
							}
							description={
								<div className="flex justify-around">
									<p className="font-semibold">{t("tripManagement.trippassenger.booked")}: {moment(item.createdAt).format("DD-MM-YYYY HH:mm:ss")}</p>
									<p className="font-bold">{t("tripManagement.trippassenger.numberOfSeats")}: {renderSeat(item)} </p>
									<p className="font-bold">{t("tripManagement.trippassenger.pickUpPoint")}: ({renderPoint(item, "pickup")})</p>
									<p className="font-bold">{t("tripManagement.trippassenger.dropoff")}: ({renderPoint(item, "dropoff")})</p>
								</div>
							}
						/>
					</List.Item>
				)}
			/>
			<div className="flex justify-end mt-3">
				<Pagination
					defaultCurrent={2}
					defaultPageSize={numEachPage} //default size of page
					onChange={handleChange}
					total={10} //total number of card data available
				/>
			</div>
		</div>
	);
}

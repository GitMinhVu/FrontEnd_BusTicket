import React, {useState, useEffect} from "react";
import {Button, Input, Card, Badge, Avatar} from "antd";
import io from "socket.io-client";
import {MessageOutlined, UserOutlined, SendOutlined} from "@ant-design/icons";

import "./ChatBox.css";

const ChatBox = ({isAdmin = false}) => {
	const [socket, setSocket] = useState(null);
	const [messages, setMessages] = useState(() => {
		const savedMessages = localStorage.getItem("chatMessages");
		return savedMessages ? JSON.parse(savedMessages) : [];
	});
	const [inputMessage, setInputMessage] = useState("");
	const [isVisible, setIsVisible] = useState(false);
	const [unreadCount, setUnreadCount] = useState(0);

	useEffect(() => {
		const newSocket = io("http://localhost:7000", {
			transports: ["websocket"],
		});

		setSocket(newSocket);

		const eventName = isAdmin ? "messageToAdmin" : "messageToCustomer";

		const messageHandler = (msg) => {
			setMessages((prev) => [...prev, msg]);
			if (!isVisible) {
				setUnreadCount((prev) => prev + 1);
			}
		};

		newSocket.on(eventName, messageHandler);

		return () => {
			newSocket.off(eventName);
			newSocket.disconnect();
		};
	}, [isAdmin, isVisible]);

	const handleIconClick = () => {
		setIsVisible(!isVisible);
	};

	useEffect(() => {
		localStorage.setItem("chatMessages", JSON.stringify(messages));
	}, [messages]);

	const sendMessage = () => {
		if (inputMessage.trim()) {
			const messageData = {
				message: inputMessage,
				isAdmin: isAdmin,
				timestamp: new Date(),
			};
			setMessages((prev) => [...prev, messageData]);
			socket.emit(isAdmin ? "adminMessage" : "customerMessage", messageData);
			setInputMessage("");
		}
	};
	const deleteMessage = (index) => {
		const newMessages = messages.filter((_, i) => i !== index);
		setMessages(newMessages);
		localStorage.setItem("chatMessages", JSON.stringify(newMessages));
	};
	useEffect(() => {
		if (isVisible) {
			setUnreadCount(0);
		}
	}, [isVisible]);
	return (
		<div className="chat-container">
			<Badge count={unreadCount}>
				<div className="chat-icon" onClick={handleIconClick}>
					<MessageOutlined style={{fontSize: "24px"}} />
				</div>
			</Badge>

			<Card className={`chat-box ${isVisible ? "visible" : ""}`} title="Chat Support">
				<div className="messages-container">
					{messages.map((msg, i) => (
						<div key={i} className={`message-wrapper ${(msg.isAdmin && isAdmin) || (!msg.isAdmin && !isAdmin) ? "sent" : "received"}`}>
							<div className="message-bubble">
								{msg.message}{" "}
								<span className="delete-btn" onClick={() => deleteMessage(i)}>
									×
								</span>
							</div>
						</div>
					))}
				</div>
				<div className="input-area">
					<Input value={inputMessage} onChange={(e) => setInputMessage(e.target.value)} onPressEnter={sendMessage} placeholder="Type a message..." suffix={<SendOutlined onClick={sendMessage} style={{cursor: "pointer", color: "#1890ff"}} />} />
				</div>
			</Card>
		</div>
	);
};

export default ChatBox;

import { useEffect } from "react";
import { io } from "socket.io-client";
const Chat = () => {
	useEffect(() => {
		const socket = io(import.meta.env.VITE_API_URI);
		// client-side
		socket.on("connect", () => {
			console.log(socket.id); // x8WIv7-mJelg7on_ALbx
			socket.emit("hello", "world"); // gui su kien hello den server voi gia tri la world
		});

		//tat tab
		socket.on("disconnect", () => {
			console.log("disconnect" + socket.id); // undefined
		});

		//ngat ket noi khi sang trang khac
		return () => {
			socket.disconnect();
		};
	}, []);
	return <div>Chat</div>;
};

export default Chat;

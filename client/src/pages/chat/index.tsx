import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import socket from "@/utils/socket";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";

interface User {
	_id: string;
	name: string;
	email: string;
	date_of_birth: Date;
	password: string;
	created_at: Date;
	updated_at: Date;
	email_verify_token: string;
	forgot_password_token: string;
	verify: number;
	filePath: string;
	bio: string;
	location: string;
	website: string;
	username: string;
	avatar: string;
	cover_photo: string;
	tweeter_circle: string[];
}

const Chat = () => {
	const [value, setValue] = useState("");
	const [messages, setMessages] = useState([]);

	useEffect(() => {
		const proflie: User = JSON.parse(localStorage.getItem("profile")!);

		// client-side
		socket.auth = {
			_id: proflie?._id,
		};
		socket.connect();

		//nhan su kien tu server, chi nguoi dung co id duoc gui tu server moi nhan duoc
		socket.on("receive private message", (data) => {
			setMessages((prev) => [...prev, data.content] as any);
		});

		//ngat ket noi khi sang trang khac
		return () => {
			socket.disconnect();
		};
	}, []);

	const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setValue("");
		//gui di su kien
		socket.emit("private message", {
			content: value,
			to: {
				_id: "6755ace700e5dc08a6cb44d9",
			},
		});
	};

	return (
		<div className="flex h-screen flex-col items-center justify-center p-5">
			<div className="mb-5">
				{messages?.map((message: any) => (
					<div key={uuidv4()}>
						<p>{message}</p>
					</div>
				))}
			</div>
			<form onSubmit={handleSubmit} className="w-full">
				<div className="flex justify-center gap-2">
					<Input
						type="text"
						onChange={(e: ChangeEvent<HTMLInputElement>) =>
							setValue(e?.target.value)
						}
						value={value}
						className="w-1/2"
					/>
					<Button type="submit">Send</Button>
				</div>
			</form>
		</div>
	);
};

export default Chat;

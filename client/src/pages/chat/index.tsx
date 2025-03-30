import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import socket from "@/utils/socket";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";

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

	useEffect(() => {
		const proflie: User = JSON.parse(localStorage.getItem("profile")!);
		console.log(proflie);

		// client-side
		socket.auth = {
			_id: proflie?._id,
		};
		socket.connect();

		//ngat ket noi khi sang trang khac
		return () => {
			socket.disconnect();
		};
	}, []);

	const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setValue("");
	};

	return (
		<div className="flex h-screen items-center justify-center p-5">
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

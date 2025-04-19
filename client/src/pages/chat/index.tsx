import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import socket from "@/utils/socket";
import {
	type ChangeEvent,
	type FormEvent,
	useEffect,
	useState,
	useRef,
} from "react";
import { v4 as uuidv4 } from "uuid";
import { ArrowLeft, MoreHorizontal, ImageIcon, Send } from "lucide-react";
import { Link } from "react-router-dom";
import http from "@/utils/http";
import { ISuccessResponseApi } from "@/types/utils.type";

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

interface Message {
	content: string;
	isSender: boolean;
	timestamp?: Date;
}

interface Conversation {
	_id: string;
	receiver_id: string;
	sender_id: string;
	updated_at: string; // ISO datetime string
	created_at: string; // ISO datetime string
	content: string;
}

interface ConversationResponse {
	conversations: Conversation[];
	total: number;
	limit: string; // nếu luôn là số, nên để kiểu number
	page: string; // nếu luôn là số, nên để kiểu number
	totalPage: number;
}

const Chat = () => {
	const usernames = ["trunglvbhust574", "Phongtt"];
	const [value, setValue] = useState("");
	const [messages, setMessages] = useState<Message[]>([]);
	const [recipient, setRecipient] = useState<User>();
	const messagesEndRef = useRef<HTMLDivElement>(null);
	const profile: User = JSON.parse(localStorage.getItem("profile")!);
	const [page, setPage] = useState(1);
	const [limit, setLimit] = useState(100);

	//for socket
	useEffect(() => {
		// client-side
		socket.auth = {
			_id: profile?._id,
		};
		socket.connect();

		// Receive private messages, chỉ có người nhận có socket_id trùng với socket_id server gửi lên mới nhận đc
		socket.on("receive private message", (data) => {
			console.log(data);
			setMessages(
				(prev) =>
					[
						...prev,
						{
							...data,
							isSender: false,
							timestamp: new Date(),
						},
					] as Message[]
			);
		});

		// Disconnect when navigating away
		return () => {
			socket.disconnect();
		};
	}, []);

	useEffect(() => {
		if (recipient?._id) {
			http.get<ISuccessResponseApi<ConversationResponse>>(
				"conversation/receiver/" + recipient?._id,
				{
					params: {
						page: page,
						limit: limit,
					},
				}
			).then((res) => {
				const { conversations } = res.data?.result;
				const prevConversations = conversations.map((conversation) => {
					return {
						content: conversation.content,
						isSender: conversation.sender_id === profile?._id,
						timestamp: new Date(conversation.updated_at),
					};
				});
				setMessages([...prevConversations] as Message[]);
			});
		}
	}, [recipient?._id]);

	// useEffect(() => {
	// 	// Scroll to bottom when messages change
	// 	scrollToBottom();
	// }, [messages]);

	const scrollToBottom = () => {
		messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
	};

	const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		if (!value.trim()) return;

		setValue("");
		// Send event
		socket.emit("private message", {
			content: value,
			from: {
				_id: profile?._id,
			},
			to: {
				_id: recipient?._id!,
			},
		});

		setMessages(
			(prev) =>
				[
					...prev,
					{
						content: value,
						isSender: true,
						timestamp: new Date(),
					},
				] as Message[]
		);
		scrollToBottom();
	};

	const formatTime = (date?: Date) => {
		if (!date) return "";
		return new Date(date).toLocaleTimeString([], {
			hour: "2-digit",
			minute: "2-digit",
		});
	};

	const getProfileByUserName = (username: string) => {
		http.post<ISuccessResponseApi<User>>("/users/profile", {
			username: username,
		}).then((res) => {
			setRecipient(res.data?.result);
			alert(`Chatting with ${username}`);
		});
	};

	return (
		<div className="flex h-screen flex-col bg-white">
			<div className="flex">
				{usernames.map((username) => (
					<div
						onClick={() => getProfileByUserName(username)}
						key={username}
						className="flex items-center border-b border-gray-200 px-4 py-3 hover:bg-gray-100"
					>
						<div className="mr-3 h-10 w-10 overflow-hidden rounded-full">
							<img
								src="/placeholder.svg?height=40&width=40"
								alt={username}
								className="h-full w-full object-cover"
							/>
						</div>
						<div>
							<h2 className="font-bold text-gray-900">
								{username}
							</h2>
						</div>
					</div>
				))}
			</div>
			<header className="flex items-center border-b border-gray-200 px-4 py-3">
				<Link to="/" className="mr-4">
					<ArrowLeft className="h-5 w-5 text-gray-700" />
				</Link>
				<div className="flex flex-1 items-center">
					<div className="mr-3 h-10 w-10 overflow-hidden rounded-full">
						<img
							src={recipient?.avatar}
							alt={recipient?.name}
							className="h-full w-full object-cover"
						/>
					</div>
					<div>
						<h2 className="font-bold text-gray-900">
							{recipient?.name}
						</h2>
						<p className="text-sm text-gray-500">
							@{recipient?.username}
						</p>
					</div>
				</div>
				<button className="rounded-full p-2 hover:bg-gray-100">
					<MoreHorizontal className="h-5 w-5 text-gray-700" />
				</button>
			</header>

			{/* Messages */}
			<div className="flex-1 space-y-3 overflow-y-auto p-4">
				{messages.length === 0 ? (
					<div className="flex h-full flex-col items-center justify-center text-gray-500">
						<p className="text-center">No messages yet</p>
						<p className="text-center text-sm">
							Send a message to start the conversation
						</p>
					</div>
				) : (
					messages.map((message: Message) => (
						<div
							key={uuidv4()}
							className={`flex ${
								message.isSender
									? "justify-end"
									: "justify-start"
							}`}
						>
							<div
								className={`max-w-[70%] rounded-2xl px-4 py-2 ${
									message.isSender
										? "rounded-tr-none bg-blue-500 text-white"
										: "rounded-tl-none bg-gray-100 text-gray-900"
								}`}
							>
								<p className="break-words">{message.content}</p>
								<p
									className={`mt-1 text-xs ${
										message.isSender
											? "text-blue-100"
											: "text-gray-500"
									}`}
								>
									{formatTime(message.timestamp)}
								</p>
							</div>
						</div>
					))
				)}
				<div ref={messagesEndRef} />
			</div>

			{/* Input */}
			<div className="border-t border-gray-200 p-3">
				<form
					onSubmit={handleSubmit}
					className="flex items-center gap-2"
				>
					<button
						type="button"
						className="rounded-full p-2 text-blue-500 hover:bg-gray-100"
					>
						<ImageIcon className="h-5 w-5" />
					</button>
					<Input
						type="text"
						placeholder="Start a new message"
						onChange={(e: ChangeEvent<HTMLInputElement>) =>
							setValue(e.target.value)
						}
						value={value}
						className="flex-1 rounded-full border-gray-200 text-black focus-visible:ring-blue-500 focus-visible:ring-offset-0"
					/>
					<Button
						type="submit"
						size="icon"
						className={`rounded-full ${
							value.trim()
								? "bg-blue-500 hover:bg-blue-600"
								: "bg-blue-300"
						}`}
						disabled={!value.trim()}
					>
						<Send className="h-4 w-4" />
					</Button>
				</form>
			</div>
		</div>
	);
};

export default Chat;

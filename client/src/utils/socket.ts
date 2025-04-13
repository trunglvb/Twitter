import { io } from "socket.io-client";
const socket = io(import.meta.env.VITE_API_URI, { autoConnect: false });

export default socket;

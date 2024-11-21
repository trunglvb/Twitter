import { Button } from "@/components/ui/button";
import { useEffect } from "react";
import {
	Link,
	useNavigate,
	useParams,
	useSearchParams,
} from "react-router-dom";

export default function Home() {
	const navigate = useNavigate();
	const getGoolgeAuthUrl = () => {
		const { VITE_GOOGLE_CLIENT_ID, VITE_REDIRECT_URI } = import.meta.env;
		const url = "https://accounts.google.com/o/oauth2/v2/auth";
		const query = {
			client_id: VITE_GOOGLE_CLIENT_ID,
			redirect_uri: VITE_REDIRECT_URI,
			response_type: "code",
			scope: [
				"https://www.googleapis.com/auth/userinfo.profile",
				"https://www.googleapis.com/auth/userinfo.email",
			].join(" "),
			prompt: "consent",
		};
		const queryString = new URLSearchParams(query).toString();
		return `${url}?${queryString}`;
	};

	const url = getGoolgeAuthUrl();

	const [params] = useSearchParams();
	useEffect(() => {
		//get access_token va refresh_token tu param
		//luu vao local storage
		// navigate ve home
		const access_token = params.get("access_token")!;
		const refresh_token = params.get("refresh_token")!;
		if (access_token && refresh_token) {
			localStorage.setItem("access_token", params.get("access_token")!);
			localStorage.setItem("refresh_token", params.get("refresh_token")!);
			navigate("/");
		}
	}, [params]);
	return (
		<div>
			<Button>
				<Link to={url}>Login Google</Link>
			</Button>
		</div>
	);
}

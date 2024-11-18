import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export default function Home() {
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
	return (
		<div>
			<Button>
				<Link to={url}>Login Google</Link>
			</Button>
		</div>
	);
}

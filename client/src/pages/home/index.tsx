import { Button } from "@/components/ui/button";
import { useEffect } from "react";
import {
	Link,
	useNavigate,
	useParams,
	useSearchParams,
} from "react-router-dom";

export default function Home() {
	return (
		<div>
			{/* <Button>
				<Link to={url}>Login Google</Link>
			</Button> */}
			<video controls width={300}>
				<source src="http://localhost:4000/static/video-stream/33699eaf6980bd7f101018700.MP4"></source>
			</video>
		</div>
	);
}

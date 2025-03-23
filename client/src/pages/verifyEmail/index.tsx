import useQueryParams from "@/hooks/useQueryParams";
import http from "@/utils/http";
import { useEffect } from "react";

const VerifyEmail = () => {
	const params = useQueryParams();
	console.log(params);

	useEffect(() => {
		const { token } = params;
		if (token) {
			http.post("/users/verify-email", {
				email_verify_token: token,
			}).then((res) => {
				console.log(res);
				alert("Verify Success");
				//update localstorage access_token va refresgh_token
				//navigate ve home
			});
		}
	}, [params.token]);
	return <div>Verify Email</div>;
};

export default VerifyEmail;

import { Link, useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { loginAccount } from "@/apis/auth.api";
import {
	saveAccessTokenToLocalStorage,
	saveProfileToLocalStorage,
	saveRefreshTokenToLocalStorage,
} from "@/utils/auth";

const Login = () => {
	const navigate = useNavigate();
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");

	const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		loginAccount({ email, password }).then((res) => {
			saveAccessTokenToLocalStorage(res.data.result.accessToken);
			saveRefreshTokenToLocalStorage(res.data.result.refreshToken);
			saveProfileToLocalStorage(res.data.result.user);
			navigate("/");
		});
	};

	return (
		<div className="bg-orange">
			<div className="container">
				<div className="grid grid-cols-1 py-12 lg:grid-cols-5 lg:py-32 lg:pr-10">
					<div className="lg:col-span-2 lg:col-start-4">
						<form
							className="rounded p-10 shadow-sm"
							onSubmit={onSubmit}
							noValidate
						>
							<div className="text-2xl">Đăng nhập</div>
							<Input
								type="email"
								className="mt-8"
								placeholder="Email"
								name="email"
								onChange={(e) => setEmail(e.target.value)}
							/>
							<Input
								type="password"
								className="mt-1"
								placeholder="Password"
								name="password"
								autoComplete="on"
								onChange={(e) => setPassword(e.target.value)}
							/>
							<div className="mt-3">
								<Button
									type="submit"
									className="px-2- w-full bg-red-500 py-4 text-center text-sm uppercase text-white hover:bg-red-600"
								>
									Đăng nhập
								</Button>
							</div>
						</form>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Login;

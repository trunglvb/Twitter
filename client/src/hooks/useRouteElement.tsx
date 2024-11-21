import path from "@/constants/path";
import MainLayout from "@/layouts";
import Home from "@/pages/home";

import { useRoutes } from "react-router-dom";

const useRouteElement = () => {
	const routeElement = useRoutes([
		{
			index: true,
			path: path.home,
			element: (
				<MainLayout>
					<Home />
				</MainLayout>
			),
		},
		{
			index: true,
			path: path.googleLogin,
			element: (
				<MainLayout>
					<Home />
				</MainLayout>
			),
		},
	]);
	return routeElement;
};

export default useRouteElement;

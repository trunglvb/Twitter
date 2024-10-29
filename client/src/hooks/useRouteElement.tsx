import path from "@/constants/path";
import MainLayout from "@/layouts";

import { useRoutes } from "react-router-dom";

const useRouteElement = () => {
	const routeElement = useRoutes([
		{
			index: true,
			path: path.home,
			element: <MainLayout></MainLayout>,
		},
	]);
	return routeElement;
};

export default useRouteElement;

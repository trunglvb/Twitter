import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { sideBarNavs } from "@/constants/navs";
import logo from "@/assets/logo.webp";

const LeftNav = () => {
	return (
		<>
			<button className="mb-4">
				<img
					src={logo}
					alt="logo"
					className="ml-2 h-10 w-10 bg-black"
				/>
			</button>
			<div className="flex flex-col gap-4 overflow-auto py-2">
				<div className="grid gap-6">
					{sideBarNavs?.map((item) => {
						const isActive = location?.pathname.includes(
							item?.path
						);
						return (
							<NavLink
								key={item.title}
								to={`${item?.path}`}
								className={() =>
									cn(
										buttonVariants({
											variant: "ghost",
											size: "sm",
										}),
										isActive
											? "justify-start text-sm text-primary"
											: "justify-start text-sm"
									)
								}
							>
								<item.icon className="mr-5 h-7 w-7" />
								<span className="text-lg">{item.title}</span>
							</NavLink>
						);
					})}
				</div>
			</div>
		</>
	);
};

export default LeftNav;

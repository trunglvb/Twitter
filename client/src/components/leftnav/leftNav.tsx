import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button, buttonVariants } from "@/components/ui/button";
import { sideBarNavs } from "@/constants/navs";
import logo from "@/assets/logo.webp";
import UserDropdown from "./footerLeftNav";

const LeftNav = () => {
	return (
		<div className="flex h-screen flex-col">
			<button className="mb-4 pt-2">
				<img
					src={logo}
					alt="logo"
					className="ml-2 h-10 w-10 bg-black"
				/>
			</button>
			<div className="flex flex-col gap-4 overflow-auto py-2">
				<div className="grid gap-7">
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
								<span className="text-xl">{item.title}</span>
							</NavLink>
						);
					})}
				</div>
			</div>
			<div className="mt-5">
				<Button className="w-full text-lg" size={"lg"}>
					Post
				</Button>
			</div>
			<div className="mb-4 mt-auto">
				<UserDropdown />
			</div>
		</div>
	);
};

export default LeftNav;

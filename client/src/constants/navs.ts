import {
	Search,
	Home,
	Bell,
	Mail,
	CircleSlash,
	User,
	CircleEllipsis,
} from "lucide-react";

export const sideBarNavs = [
	{
		title: "Home",
		icon: Home,
		path: "/",
		variant: "ghost",
	},
	{
		title: "Explore",
		icon: Search,
		path: "/explore",
		variant: "ghost",
	},
	{
		title: "Notifications",
		icon: Bell,
		path: "/notifications",
		variant: "ghost",
	},
	{
		title: "Messages",
		icon: Mail,
		path: "/messages",
		variant: "ghost",
	},
	{
		title: "Grok",
		icon: CircleSlash,
		path: "/grok",
		variant: "ghost",
	},
	{
		title: "Profile",
		icon: User,
		path: "/profile",
		variant: "ghost",
	},
	{
		title: "More",
		icon: CircleEllipsis,
		path: "/more",
		variant: "ghost",
	},
];

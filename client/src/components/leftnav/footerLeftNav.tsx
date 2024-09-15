import {
	DropdownMenu,
	DropdownMenuTrigger,
	DropdownMenuContent,
	DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

function UserDropdown() {
	return (
		<div className="flex items-center">
			{/* User Avatar */}
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button variant="ghost" className="w-full">
						<Avatar className="h-8 w-8">
							<AvatarImage
								src="https://github.com/shadcn.png"
								alt="@shadcn"
							/>
							<AvatarFallback>CN</AvatarFallback>
						</Avatar>
						<span className="ml-2 font-medium">Trung Lê</span>
						<span className="ml-auto">...</span>
					</Button>
				</DropdownMenuTrigger>

				<DropdownMenuContent align="start">
					<DropdownMenuItem>Add an existing account</DropdownMenuItem>
					<DropdownMenuItem>Log out @l664056</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
		</div>
	);
}

export default UserDropdown;

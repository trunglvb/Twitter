import LeftNav from "@/components/leftnav";
import TreeSelectExample from "@/pages/home/treeSelect";

const MainLayout = () => {
	return (
		<div className="h-screen">
			<div className="m-auto flex h-full max-w-[1325px]">
				<div className="grid flex-1 grid-cols-9">
					<div className="border-root col-span-2 h-full border-r">
						<div className="pr-4">
							<div>
								<LeftNav />
							</div>
						</div>
					</div>
					<div className="col-span-7">
						<div className="grid grid-cols-7">
							<div className="col-span-4">
								<TreeSelectExample />
							</div>
							<div className="col-span-3">3</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default MainLayout;

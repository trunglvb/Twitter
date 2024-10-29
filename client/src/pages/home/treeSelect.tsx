import * as React from "react";
import { ChevronRight, ChevronDown } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";

interface TreeNode {
	id: string;
	label: string;
	children?: TreeNode[];
}

interface TreeSelectProps {
	data: TreeNode[];
	onSelect: (selectedIds: string[]) => void;
}

function TreeSelectItem({
	node,
	level,
	expanded,
	selected,
	onToggle,
	onSelect,
}: {
	node: TreeNode;
	level: number;
	expanded: Record<string, boolean>;
	selected: Record<string, boolean>;
	onToggle: (id: string) => void;
	onSelect: (id: string, isSelected: boolean) => void;
}) {
	const hasChildren = node.children && node.children.length > 0;
	const isSelected = selected[node.id];
	const allChildrenSelected =
		hasChildren && node?.children?.every((child) => selected[child.id]);

	const handleSelect = (checked: boolean) => {
		onSelect(node.id, checked);
	};

	return (
		<div className="ml-4">
			<div className="flex items-center space-x-2">
				{hasChildren ? (
					<Button
						variant="ghost"
						size="icon"
						className="h-6 w-6"
						onClick={() => onToggle(node.id)}
					>
						{expanded[node.id] ? (
							<ChevronDown className="h-4 w-4" />
						) : (
							<ChevronRight className="h-4 w-4" />
						)}
					</Button>
				) : (
					<div className="w-6" />
				)}
				<Checkbox
					id={node.id}
					checked={isSelected || allChildrenSelected}
					onCheckedChange={handleSelect}
				/>
				<label
					htmlFor={node.id}
					className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
				>
					{node.label}
				</label>
			</div>
			{hasChildren && expanded[node.id] && (
				<div className="mt-1">
					{node?.children?.map((child) => (
						<TreeSelectItem
							key={child.id}
							node={child}
							level={level + 1}
							expanded={expanded}
							selected={selected}
							onToggle={onToggle}
							onSelect={onSelect}
						/>
					))}
				</div>
			)}
		</div>
	);
}

export function TreeSelect({ data, onSelect }: TreeSelectProps) {
	const [expanded, setExpanded] = React.useState<Record<string, boolean>>({});
	const [selected, setSelected] = React.useState<Record<string, boolean>>({});

	const toggleExpand = (id: string) => {
		setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
	};

	const toggleSelect = (id: string, isSelected: boolean) => {
		const updateSelected = (
			nodes: TreeNode[],
			updates: Record<string, boolean>
		) => {
			for (const node of nodes) {
				updates[node.id] = isSelected;
				if (node.children) {
					updateSelected(node.children, updates);
				}
			}
		};

		const findAndUpdateParents = (
			nodes: TreeNode[],
			updates: Record<string, boolean>
		) => {
			for (const node of nodes) {
				if (node.children) {
					const allChildrenSelected = node.children.every(
						(child) => updates[child.id] ?? selected[child.id]
					);
					updates[node.id] = allChildrenSelected;
					findAndUpdateParents(node.children, updates);
				}
			}
		};

		setSelected((prev) => {
			const updates: Record<string, boolean> = { [id]: isSelected };
			const nodeToUpdate = findNodeById(data, id);
			if (nodeToUpdate && nodeToUpdate.children) {
				updateSelected(nodeToUpdate.children, updates);
			}
			findAndUpdateParents(data, updates);
			const newSelected = { ...prev, ...updates };
			onSelect(
				Object.keys(newSelected).filter((key) => newSelected[key])
			);
			return newSelected;
		});
	};

	const findNodeById = (nodes: TreeNode[], id: string): TreeNode | null => {
		for (const node of nodes) {
			if (node.id === id) return node;
			if (node.children) {
				const found = findNodeById(node.children, id);
				if (found) return found;
			}
		}
		return null;
	};

	return (
		<ScrollArea className="h-[300px] w-[300px] rounded-md border">
			<div className="p-4">
				{data.map((node) => (
					<TreeSelectItem
						key={node.id}
						node={node}
						level={0}
						expanded={expanded}
						selected={selected}
						onToggle={toggleExpand}
						onSelect={toggleSelect}
					/>
				))}
			</div>
		</ScrollArea>
	);
}

// Example usage
const exampleData: TreeNode[] = [
	{
		id: "1",
		label: "Electronics",
		children: [
			{
				id: "1-1",
				label: "Smartphones",
				children: [
					{ id: "1-1-1", label: "iPhone" },
					{ id: "1-1-2", label: "Samsung" },
					{ id: "1-1-3", label: "Google Pixel" },
				],
			},
			{
				id: "1-2",
				label: "Laptops",
				children: [
					{ id: "1-2-1", label: "MacBook" },
					{ id: "1-2-2", label: "Dell XPS" },
					{ id: "1-2-3", label: "Lenovo ThinkPad" },
				],
			},
		],
	},
	{
		id: "2",
		label: "Clothing",
		children: [
			{ id: "2-1", label: "Shirts" },
			{ id: "2-2", label: "Pants" },
			{ id: "2-3", label: "Shoes" },
		],
	},
];

export default function TreeSelectExample() {
	const handleSelect = (selectedIds: string[]) => {
		console.log("Selected IDs:", selectedIds);
	};

	return (
		<div className="p-4">
			<h1 className="mb-4 text-2xl font-bold">Tree Select Example</h1>
			<TreeSelect data={exampleData} onSelect={handleSelect} />
		</div>
	);
}

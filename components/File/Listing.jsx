import { Fragment, useState, useEffect } from "react";
import { Classes, Icon, Tree } from "@blueprintjs/core";
import Loading from "../Loader";

export default function Listing({ data }) {
	const [treeData, setTreeData] = useState([]);
	const [isLoading, setLoading] = useState(false);

	useEffect(() => {
		if (data && data.data && data.data.shares) {
			setTreeData([]);
			data.data.shares.map((ga, i) => {
				setTreeData((treeData) => [
					...treeData,
					{
						id: i,
						label: ga.name,
						icon: "folder-close",
						className: "dark:text-white",
						hasCaret: ga.isdir,
						isExpanded: false,
						childNodes: [],
						path: ga.path,
					},
				]);
			});
		}
	}, [data]);

	return (
		<Fragment>
			{data.success ? (
				<Tree
					contents={treeData}
					className={Classes.ELEVATION_0}
					onNodeExpand={async (node, levels) => {
						//Change the isExpaned value of the node
						setLoading(true);
						var temp = [...treeData];
						var child = temp[levels[0]];

						levels.map((ga, i) => {
							if (i > 0) {
								child = child.childNodes[ga];
							}
							child.isExpanded = true;
						});
						//Fetch the nested nodes
						const fet = await fetch(
							`/api/synology/list?path=${decodeURIComponent(node.path)}`
						);
						const data = await fet.json();
						//If data exists
						if (data.success) {
							if (data.data.files && data.data) {
								data.data.files.map((ga, i) => {
									child.childNodes.push({
										id: `${node.id}${i}`,
										label: ga.name,
										icon: ga.isdir ? "folder-close" : "document",
										// secondaryLabel: ga.isdir ? null : (
										// 	<Icon
										// 		icon="floppy-disk"
										// 		className="dark:text-white cursor-pointer"
										// 		onClick={async () => {
										// 			const data = await fetch(
										// 				`/api/synology/download?path=${encodeURIComponent(
										// 					`["${ga.path}"]`
										// 				)}`
										// 			);
										// 			const blob = await data.blob();
										// 			var fileBlob = new Blob([blob], {
										// 				type: blob.type,
										// 			});
										// 			var fileURL = URL.createObjectURL(fileBlob);

										// 			const link = document.createElement("a");
										// 			link.target = "_blank";
										// 			link.href = fileURL;
										// 			// link.download = file;

										// 			// Append to html link element page
										// 			document.body.appendChild(link);

										// 			// Start download
										// 			link.click();

										// 			// Clean up and remove the link
										// 			link.parentNode.removeChild(link);
										// 		}}
										// 	></Icon>
										// ),
										className: "dark:text-white",
										hasCaret: ga.isdir,
										isExpanded: false,
										path: ga.path,
										childNodes: [],
									});
								});
							}
						}
						setTreeData(temp);
						setLoading(false);
					}}
					onNodeCollapse={(node, levels) => {
						var temp = [...treeData];
						var child = temp[levels[0]];
						levels.map((ga, i) => {
							if (i > 0) {
								child = child.childNodes[ga];
							}
						});
						child.isExpanded = false;
						child.childNodes = [];
						setTreeData(temp);
					}}
					onNodeClick={(nodeData, _nodePath, e) => {
						// treeData.find((node) => node.id === nodeData.id).isExpanded =
						// 	!nodeData.isExpanded;

						console.log(treeData.length);
					}}
					onNodeDoubleClick={async (nodeData, _nodePath, e) => {
						setLoading(true);
						const data = await fetch(
							`/api/synology/download?path=${encodeURIComponent(
								`["${nodeData.path}"]`
							)}`
						);
						const blob = await data.blob();
						var fileBlob = new Blob([blob], {
							type: blob.type,
						});
						var fileURL = URL.createObjectURL(fileBlob);
						window.open(fileURL, "_blank");
						setLoading(false);
					}}
				/>
			) : (
				<div className="flex flex-col items-center justify-center h-96 w-full overflow-hidden">
					{JSON.stringify(data)}
				</div>
			)}
			<Loading show={isLoading} />
		</Fragment>
	);
}

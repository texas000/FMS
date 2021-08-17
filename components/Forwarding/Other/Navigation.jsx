import {
	Alignment,
	Navbar,
	NavbarDivider,
	NavbarGroup,
	NavbarHeading,
} from "@blueprintjs/core";

export const Navigation = ({ menu, setMenu, Reference }) => (
	<Navbar
		fixedToTop={false}
		className="my-1 shadow dark:bg-gray-700 dark:text-white"
		style={{ zIndex: 0 }}
	>
		<NavbarGroup align={Alignment.LEFT}>
			<NavbarHeading>{Reference}</NavbarHeading>
			<NavbarDivider className="dark:text-white" />
			<button
				className={` hover:bg-gray-200 rounded p-2 mr-1 ${
					menu === 1
						? "text-blue-500 dark:text-blue-300"
						: "text-gray-500 dark:text-white"
				}`}
				onClick={() => setMenu(1)}
			>
				<i className="fa mx-1 fa-ship"></i>
				<span className="sr-only ml-1 sm:not-sr-only">Master</span>
			</button>
			<button
				className={` hover:bg-gray-200 rounded p-2 mr-1 ${
					menu === 3
						? "text-blue-500 dark:text-blue-300"
						: "text-gray-500 dark:text-white"
				}`}
				onClick={() => setMenu(3)}
			>
				<i className="fa mx-1 fa-dashboard"></i>
				<span className="sr-only ml-1 sm:not-sr-only">Summary</span>
			</button>
			<button
				className={` hover:bg-gray-200 rounded p-2 mr-1 ${
					menu === 4
						? "text-blue-500 dark:text-blue-300"
						: "text-gray-500 dark:text-white"
				}`}
				onClick={() => setMenu(4)}
			>
				<i className="fa mx-1 fa-folder"></i>
				<span className="sr-only ml-1 sm:not-sr-only">File</span>
			</button>
			{/* <Button
				icon="confirm"
				text="Request"
				small={true}
				minimal={true}
				intent={menu === 5 ? "primary" : "none"}
				onClick={() => setMenu(5)}
			/> */}
		</NavbarGroup>
	</Navbar>
);
export default Navigation;

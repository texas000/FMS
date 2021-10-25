export default function search(props) {
	return (
		<div className="flex flex-col min-h-screen overflow-hidden">
			<section
				className="w-full h-screen px-3 antialiased bg-white lg:px-6 bg-no-repeat bg-auto bg-bottom"
				style={{ backgroundImage: "url(/image/home.png)" }}
			>
				<div className="mx-auto max-w-7xl">
					<nav
						className="flex items-center w-full h-24 select-none"
						x-data="{ showMenu: false }"
					>
						<div className="relative flex flex-wrap items-center justify-between w-full h-24 mx-auto font-medium md:justify-center">
							<a href="#_" className="w-1/4 py-4 pl-6 pr-4 md:pl-4 md:py-0">
								<span className="p-1 text-xl font-black leading-none text-blue-600 select-none">
									<span>JW</span>
								</span>
							</a>
							<div className="mt-4 fixed top-0 left-0 z-40 items-center hidden w-full h-full p-3 text-xl bg-gray-900 bg-opacity-50 md:text-sm lg:text-base md:w-3/4 md:bg-transparent md:p-0 md:relative md:flex">
								<div className="flex-col w-full h-full overflow-hidden bg-white rounded-lg select-none md:bg-transparent md:rounded-none md:relative md:flex md:flex-row md:overflow-auto">
									<div className="flex flex-col items-center justify-center w-full h-full mt-12 text-center text-blue-600 md:text-blue-600 md:w-2/3 md:mt-0 md:flex-row md:items-center">
										<a
											href="#"
											className="inline-block px-4 py-2 mx-2 font-medium text-left md:px-0 hover:text-indigo-600 md:hover:text-white lg:mx-3 md:text-center"
										>
											Home
										</a>
										<a
											href="#"
											className="inline-block px-4 py-2 mx-2 font-medium text-left md:px-0 hover:text-indigo-600 md:hover:text-white lg:mx-3 md:text-center"
										>
											Features
										</a>
										<a
											href="#"
											className="inline-block px-4 py-2 mx-2 font-medium text-left md:px-0 hover:text-indigo-600 md:hover:text-white lg:mx-3 md:text-center"
										>
											Blog
										</a>
										<a
											href="#"
											className="inline-block px-4 py-2 mx-2 font-medium text-left md:px-0 hover:text-indigo-600 md:hover:text-white lg:mx-3 md:text-center"
										>
											Contact
										</a>
									</div>
									<div className="flex flex-col items-center justify-end w-full h-full md:w-1/3 md:flex-row md:py-0">
										<a
											href="#_"
											className="inline-flex items-center justify-center px-4 py-2 mr-1 text-base font-medium leading-6 text-blue-600 whitespace-no-wrap transition duration-150 ease-in-out bg-white border border-transparent rounded-full hover:bg-white focus:outline-none focus:border-blue-700 focus:shadow-indigo-800 active:bg-blue-700 hover:no-underline"
										>
											Dashbaord
										</a>
									</div>
								</div>
							</div>
							<div className="absolute right-0 z-50 flex flex-col items-end w-10 h-10 p-2 mr-4 rounded-full cursor-pointer md:hidden hover:bg-gray-900 hover:bg-opacity-10">
								<svg
									className="w-6 h-6"
									x-show="!showMenu"
									fill="none"
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth="2"
									viewBox="0 0 24 24"
									stroke="currentColor"
									x-cloak=""
								>
									<path d="M4 6h16M4 12h16M4 18h16"></path>
								</svg>
								<svg
									className="w-6 h-6"
									x-show="showMenu"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
									xmlns="http://www.w3.org/2000/svg"
									x-cloak=""
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth="2"
										d="M6 18L18 6M6 6l12 12"
									></path>
								</svg>
							</div>
						</div>
					</nav>
					<div className="container py-32 mx-auto text-center sm:px-4">
						<h1 className="text-4xl font-extrabold leading-10 tracking-tight text-blue-600 sm:text-5xl sm:leading-none md:text-6xl xl:text-7xl">
							<span className="block">Adding Values to</span>{" "}
							<span className="relative inline-block mt-3 text-transparent text-blue-600">
								Your Cargo
							</span>
						</h1>
						<div className="max-w-lg mx-auto mt-6 text-sm text-center text-blue-500 md:mt-12 sm:text-base md:max-w-xl md:text-lg xl:text-xl">
							If you are ready to change the way you design websites, then
							you'll want to use our block builder to make it fun and easy!
						</div>
						<div className="relative flex items-center max-w-md mx-auto mt-12 overflow-hidden text-center rounded-full">
							<input
								type="text"
								name="email"
								placeholder="Container Number"
								className="w-full h-12 px-6 py-2 font-medium text-indigo-600 focus:outline-none"
							/>
							<span className="relative top-0 right-0 block">
								<button
									type="button"
									className="inline-flex items-center w-32 h-12 px-8 text-base font-bold leading-6 text-white transition duration-150 ease-in-out bg-indigo-400 hover:bg-indigo-700 focus:outline-none active:bg-indigo-700"
								>
									Track
								</button>
							</span>
						</div>
						<div className="mt-8 text-sm text-white font-semibold">
							By signing up, you agree to our terms and services.
						</div>
					</div>
				</div>
			</section>

			<section className="py-20 bg-white">
				<div className="container max-w-6xl mx-auto">
					<h2 className="text-4xl font-bold tracking-tight text-center">
						Our Services
					</h2>
					<p className="mt-2 text-lg text-center text-gray-600">
						Check out our list of awesome features below.
					</p>
					<div className="grid grid-cols-4 gap-8 mt-10 sm:grid-cols-8 lg:grid-cols-12 sm:px-8 xl:px-0">
						<div className="relative flex flex-col items-center justify-between col-span-4 px-8 py-12 space-y-4 overflow-hidden bg-gray-100 sm:rounded-xl">
							<div className="p-3 text-white bg-indigo-600 rounded-full">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									className="w-8 h-8 "
									viewBox="0 0 24 24"
									strokeWidth="1.5"
									stroke="currentColor"
									fill="none"
									strokeLinecap="round"
									strokeLinejoin="round"
								>
									<path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
									<path d="M14 3v4a1 1 0 0 0 1 1h4"></path>
									<path d="M5 8v-3a2 2 0 0 1 2 -2h7l5 5v11a2 2 0 0 1 -2 2h-5"></path>
									<circle cx="6" cy="14" r="3"></circle>
									<path d="M4.5 17l-1.5 5l3 -1.5l3 1.5l-1.5 -5"></path>
								</svg>
							</div>
							<h4 className="text-xl font-medium text-gray-700">
								Ocean Shipment
							</h4>
							<p className="text-base text-center text-gray-500">
								Each of our plan will provide you and your team with
								certifications.
							</p>
						</div>

						<div className="flex flex-col items-center justify-between col-span-4 px-8 py-12 space-y-4 bg-gray-100 sm:rounded-xl">
							<div className="p-3 text-white bg-indigo-600 rounded-full">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									className="w-8 h-8 "
									viewBox="0 0 24 24"
									strokeWidth="1.5"
									stroke="currentColor"
									fill="none"
									strokeLinecap="round"
									strokeLinejoin="round"
								>
									<path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
									<path d="M18 8a3 3 0 0 1 0 6"></path>
									<path d="M10 8v11a1 1 0 0 1 -1 1h-1a1 1 0 0 1 -1 -1v-5"></path>
									<path d="M12 8h0l4.524 -3.77a0.9 .9 0 0 1 1.476 .692v12.156a0.9 .9 0 0 1 -1.476 .692l-4.524 -3.77h-8a1 1 0 0 1 -1 -1v-4a1 1 0 0 1 1 -1h8"></path>
								</svg>
							</div>
							<h4 className="text-xl font-medium text-gray-700">
								Air Shipment
							</h4>
							<p className="text-base text-center text-gray-500">
								Send out notifications to all your customers to keep them
								engaged.
							</p>
						</div>

						<div className="flex flex-col items-center justify-between col-span-4 px-8 py-12 space-y-4 bg-gray-100 sm:rounded-xl">
							<div className="p-3 text-white bg-indigo-600 rounded-full">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									className="w-8 h-8 "
									viewBox="0 0 24 24"
									strokeWidth="1.5"
									stroke="currentColor"
									fill="none"
									strokeLinecap="round"
									strokeLinejoin="round"
								>
									<path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
									<polyline points="12 3 20 7.5 20 16.5 12 21 4 16.5 4 7.5 12 3"></polyline>
									<line x1="12" y1="12" x2="20" y2="7.5"></line>
									<line x1="12" y1="12" x2="12" y2="21"></line>
									<line x1="12" y1="12" x2="4" y2="7.5"></line>
									<line x1="16" y1="5.25" x2="8" y2="9.75"></line>
								</svg>
							</div>
							<h4 className="text-xl font-medium text-gray-700">Warehouse</h4>
							<p className="text-base text-center text-gray-500">
								High-quality bundles of awesome tools to help you out.
							</p>
						</div>

						{/* <div className="flex flex-col items-center justify-between col-span-4 px-8 py-12 space-y-4 bg-gray-100 sm:rounded-xl">
                <div className="p-3 text-white bg-indigo-600 rounded-full">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 " viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><path d="M8 9l3 3l-3 3"></path><line x1="13" y1="15" x2="16" y2="15"></line><rect x="3" y="4" width="18" height="16" rx="2"></rect></svg>
                </div>
                <h4 className="text-xl font-medium text-gray-700">Developer Tools</h4>
                <p className="text-base text-center text-gray-500">Developer tools to help grow your application and keep it up-to-date.</p>
            </div>

            <div className="flex flex-col items-center justify-between col-span-4 px-8 py-12 space-y-4 bg-gray-100 sm:rounded-xl">
                <div className="p-3 text-white bg-indigo-600 rounded-full">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 " viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><line x1="9.5" y1="11" x2="9.51" y2="11"></line><line x1="14.5" y1="11" x2="14.51" y2="11"></line><path d="M9.5 15a3.5 3.5 0 0 0 5 0"></path><path d="M7 5h1v-2h8v2h1a3 3 0 0 1 3 3v9a3 3 0 0 1 -3 3v1h-10v-1a3 3 0 0 1 -3 -3v-9a3 3 0 0 1 3 -3"></path></svg>
                </div>
                <h4 className="text-xl font-medium text-gray-700">Building Blocks</h4>
                <p className="text-base text-center text-gray-500">The right kind of building blocks to take your company to the next level.</p>
            </div>

            <div className="flex flex-col items-center justify-between col-span-4 px-8 py-12 space-y-4 bg-gray-100 sm:rounded-xl">
                <div className="p-3 text-white bg-indigo-600 rounded-full">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 " viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><line x1="15" y1="5" x2="15" y2="7"></line><line x1="15" y1="11" x2="15" y2="13"></line><line x1="15" y1="17" x2="15" y2="19"></line><path d="M5 5h14a2 2 0 0 1 2 2v3a2 2 0 0 0 0 4v3a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2v-3a2 2 0 0 0 0 -4v-3a2 2 0 0 1 2 -2"></path></svg>
                </div>
                <h4 className="text-xl font-medium text-gray-700">Coupons</h4>
                <p className="text-base text-center text-gray-500">Coupons system to provide special offers and discounts for your app.</p>
            </div> */}
					</div>
				</div>
			</section>

			<section className="py-20 bg-gray-50">
				<div className="container items-center max-w-6xl px-10 mx-auto sm:px-20 md:px-32 lg:px-16">
					<div className="flex flex-wrap items-center -mx-3">
						<div className="order-1 w-full px-3 lg:w-1/2 lg:order-0">
							<div className="w-full lg:max-w-md">
								<h2 className="mb-4 text-3xl font-bold leading-tight tracking-tight sm:text-4xl font-heading">
									COVERING THE ENTIRE BLUE OCEAN WITH YEARS OF EXPERIENCE AND
									KNOWLEDGE
								</h2>
								<p className="mb-4 font-medium tracking-tight text-gray-400 xl:mb-6">
									As a licensed Ocean Transportation and world-class Non-Vessel
									Operating Common Carrier (NVOCC), James Worldwide provides
									full ocean freight services to create the most highly
									adaptable, reliable and customizable solutions in the
									industry.
								</p>
								<ul>
									<li className="flex items-center py-2 space-x-4 xl:py-3">
										<svg
											className="w-8 h-8 text-pink-500"
											fill="none"
											stroke="currentColor"
											viewBox="0 0 24 24"
											xmlns="http://www.w3.org/2000/svg"
										>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth="2"
												d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z"
											></path>
										</svg>
										<span className="font-medium text-gray-500">
											Faster Processing and Delivery
										</span>
									</li>
									<li className="flex items-center py-2 space-x-4 xl:py-3">
										<svg
											className="w-8 h-8 text-yellow-500"
											fill="none"
											stroke="currentColor"
											viewBox="0 0 24 24"
											xmlns="http://www.w3.org/2000/svg"
										>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth="2"
												d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
											></path>
										</svg>
										<span className="font-medium text-gray-500">
											Door to Door Service
										</span>
									</li>
									<li className="flex items-center py-2 space-x-4 xl:py-3">
										<svg
											className="w-8 h-8 text-green-500"
											fill="none"
											stroke="currentColor"
											viewBox="0 0 24 24"
											xmlns="http://www.w3.org/2000/svg"
										>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth="2"
												d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
											></path>
										</svg>
										<span className="font-medium text-gray-500">
											Customs Clearance
										</span>
									</li>
								</ul>
							</div>
						</div>
						<div className="w-full px-3 mb-12 lg:w-1/2 order-0 lg:order-1 lg:mb-0">
							<img
								className="mx-auto sm:max-w-sm lg:max-w-full shadow-lg rounded-sm"
								src="/image/ocean.jpg"
								alt="feature image"
							/>
						</div>
					</div>
				</div>
			</section>

			<section className="py-20 bg-white">
				<div className="container items-center max-w-6xl px-10 mx-auto sm:px-20 md:px-32 lg:px-16">
					<div className="flex flex-wrap items-center -mx-3">
						<div className="w-full px-3 mb-12 lg:w-1/2 order-0 lg:order-1 lg:mb-0">
							<img
								className="mx-auto sm:max-w-sm lg:max-w-full shadow-lg rounded-sm"
								src="/image/air.jpg"
								alt="feature image"
							/>
						</div>
						<div className="order-1 w-full px-3 lg:w-1/2 lg:order-0">
							<div className="w-full lg:max-w-md">
								<h2 className="mb-4 text-3xl font-bold leading-tight tracking-tight sm:text-4xl font-heading">
									FAST, ACCURATE, AND RELIABLE SERVICE TO MEET YOUR AIR CARGO’S
									SPECIAL NEEDS
								</h2>
								<p className="mb-4 font-medium tracking-tight text-gray-400 xl:mb-6">
									As an International Air Transport Association (IATA) agent for
									all major airlines, James Worldwide provides a complete
									solutions of air logistics for shipments around the globe and
									for a wide variety of commodities and industries.
								</p>
								<ul>
									<li className="flex items-center py-2 space-x-4 xl:py-3">
										<svg
											className="w-8 h-8 text-pink-500"
											fill="none"
											stroke="currentColor"
											viewBox="0 0 24 24"
											xmlns="http://www.w3.org/2000/svg"
										>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth="2"
												d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z"
											></path>
										</svg>
										<span className="font-medium text-gray-500">
											Faster Processing and Delivery
										</span>
									</li>
									<li className="flex items-center py-2 space-x-4 xl:py-3">
										<svg
											className="w-8 h-8 text-yellow-500"
											fill="none"
											stroke="currentColor"
											viewBox="0 0 24 24"
											xmlns="http://www.w3.org/2000/svg"
										>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth="2"
												d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
											></path>
										</svg>
										<span className="font-medium text-gray-500">
											Pick Up, Packing, Palletizing, and Warehousing
										</span>
									</li>
									<li className="flex items-center py-2 space-x-4 xl:py-3">
										<svg
											className="w-8 h-8 text-green-500"
											fill="none"
											stroke="currentColor"
											viewBox="0 0 24 24"
											xmlns="http://www.w3.org/2000/svg"
										>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth="2"
												d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
											></path>
										</svg>
										<span className="font-medium text-gray-500">
											Customs Clearance
										</span>
									</li>
								</ul>
							</div>
						</div>
					</div>
				</div>
			</section>

			<section className="py-20 bg-gray-50">
				<div className="container items-center max-w-6xl px-10 mx-auto sm:px-20 md:px-32 lg:px-16">
					<div className="flex flex-wrap items-center -mx-3">
						<div className="order-1 w-full px-3 lg:w-1/2 lg:order-0">
							<div className="w-full lg:max-w-md">
								<h2 className="mb-4 text-3xl font-bold leading-tight tracking-tight sm:text-4xl font-heading">
									A STRATEGIC SUPPLY CHAIN PARTNER WITH SPECIALTIES IN
									WAREHOUSING, TRANSPORTATION, AND DISTRIBUTION
								</h2>
								<p className="mb-4 font-medium tracking-tight text-gray-400 xl:mb-6">
									As James Worldwide, a strategic supply chain partner who
									fulfills the role of 3PL, we manage and customize the entire
									supply chain, from warehousing, transportation, and
									distribution in multi-regional or local solutions throughout
									the United States.
								</p>
								<ul>
									<li className="flex items-center py-2 space-x-4 xl:py-3">
										<svg
											className="w-8 h-8 text-pink-500"
											fill="none"
											stroke="currentColor"
											viewBox="0 0 24 24"
											xmlns="http://www.w3.org/2000/svg"
										>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth="2"
												d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z"
											></path>
										</svg>
										<span className="font-medium text-gray-500">
											Advanced Warehouse Management System
										</span>
									</li>
									<li className="flex items-center py-2 space-x-4 xl:py-3">
										<svg
											className="w-8 h-8 text-yellow-500"
											fill="none"
											stroke="currentColor"
											viewBox="0 0 24 24"
											xmlns="http://www.w3.org/2000/svg"
										>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth="2"
												d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
											></path>
										</svg>
										<span className="font-medium text-gray-500">
											Specialized Product Storage and Handling
										</span>
									</li>
									<li className="flex items-center py-2 space-x-4 xl:py-3">
										<svg
											className="w-8 h-8 text-green-500"
											fill="none"
											stroke="currentColor"
											viewBox="0 0 24 24"
											xmlns="http://www.w3.org/2000/svg"
										>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth="2"
												d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
											></path>
										</svg>
										<span className="font-medium text-gray-500">
											Affordable Pricing
										</span>
									</li>
								</ul>
							</div>
						</div>
						<div className="w-full px-3 mb-12 lg:w-1/2 order-0 lg:order-1 lg:mb-0">
							<img
								className="mx-auto sm:max-w-sm lg:max-w-full shadow-lg rounded-sm"
								src="/image/warehouse.jpg"
								alt="feature image"
							/>
						</div>
					</div>
				</div>
			</section>

			<section className="text-gray-700 bg-white body-font">
				<div className="container flex flex-col items-center px-8 py-8 mx-auto max-w-7xl sm:flex-row">
					<a
						href="#_"
						className="mt-4 text-xl font-black leading-none text-gray-900 select-none logo hover:no-underline py-0"
					>
						JW
					</a>
					<p className="mt-4 text-sm text-gray-500 sm:ml-4 sm:pl-4 sm:border-l sm:border-gray-200 sm:mt-0">
						© 2021 JAMES WORLDWIDE INC.
					</p>
					<span className="inline-flex justify-center mt-4 space-x-5 sm:ml-auto sm:mt-0 sm:justify-start">
						<a href="#" className="text-gray-400 hover:text-gray-500">
							<span className="sr-only">Facebook</span>
							<svg
								className="w-6 h-6"
								fill="currentColor"
								viewBox="0 0 24 24"
								aria-hidden="true"
							>
								<path
									fillRule="evenodd"
									d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
									clipRule="evenodd"
								></path>
							</svg>
						</a>

						<a href="#" className="text-gray-400 hover:text-gray-500">
							<span className="sr-only">Instagram</span>
							<svg
								className="w-6 h-6"
								fill="currentColor"
								viewBox="0 0 24 24"
								aria-hidden="true"
							>
								<path
									fillRule="evenodd"
									d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
									clipRule="evenodd"
								></path>
							</svg>
						</a>

						<a href="#" className="text-gray-400 hover:text-gray-500">
							<span className="sr-only">Twitter</span>
							<svg
								className="w-6 h-6"
								fill="currentColor"
								viewBox="0 0 24 24"
								aria-hidden="true"
							>
								<path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"></path>
							</svg>
						</a>

						<a href="#" className="text-gray-400 hover:text-gray-500">
							<span className="sr-only">GitHub</span>
							<svg
								className="w-6 h-6"
								fill="currentColor"
								viewBox="0 0 24 24"
								aria-hidden="true"
							>
								<path
									fillRule="evenodd"
									d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
									clipRule="evenodd"
								></path>
							</svg>
						</a>

						<a href="#" className="text-gray-400 hover:text-gray-500">
							<span className="sr-only">Dribbble</span>
							<svg
								className="w-6 h-6"
								fill="currentColor"
								viewBox="0 0 24 24"
								aria-hidden="true"
							>
								<path
									fillRule="evenodd"
									d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10c5.51 0 10-4.48 10-10S17.51 2 12 2zm6.605 4.61a8.502 8.502 0 011.93 5.314c-.281-.054-3.101-.629-5.943-.271-.065-.141-.12-.293-.184-.445a25.416 25.416 0 00-.564-1.236c3.145-1.28 4.577-3.124 4.761-3.362zM12 3.475c2.17 0 4.154.813 5.662 2.148-.152.216-1.443 1.941-4.48 3.08-1.399-2.57-2.95-4.675-3.189-5A8.687 8.687 0 0112 3.475zm-3.633.803a53.896 53.896 0 013.167 4.935c-3.992 1.063-7.517 1.04-7.896 1.04a8.581 8.581 0 014.729-5.975zM3.453 12.01v-.26c.37.01 4.512.065 8.775-1.215.25.477.477.965.694 1.453-.109.033-.228.065-.336.098-4.404 1.42-6.747 5.303-6.942 5.629a8.522 8.522 0 01-2.19-5.705zM12 20.547a8.482 8.482 0 01-5.239-1.8c.152-.315 1.888-3.656 6.703-5.337.022-.01.033-.01.054-.022a35.318 35.318 0 011.823 6.475 8.4 8.4 0 01-3.341.684zm4.761-1.465c-.086-.52-.542-3.015-1.659-6.084 2.679-.423 5.022.271 5.314.369a8.468 8.468 0 01-3.655 5.715z"
									clipRule="evenodd"
								></path>
							</svg>
						</a>
					</span>
				</div>
			</section>
		</div>
	);
}

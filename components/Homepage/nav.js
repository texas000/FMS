import { useRouter } from "next/router";
import Link from "next/link";
import React from "react";

const Navs = () => {
	const [navtoggle, setnavtoggle] = React.useState(false);
	const router = useRouter();
	return (
		<nav
			className="navbar navbar-expand-lg fixed-top bg-transparent text-uppercase"
			id="mainNav"
			style={{ borderBottom: "1px solid #CBCBCB", position: "absolute" }}
		>
			<div className="container">
				<Link href="/" replace>
					<a className="navbar-brand js-scroll-trigger text-white">
						<img
							className="mx-auto d-block"
							width="170px"
							height="auto"
							src="./image/logo-sm-white.png"
						></img>
					</a>
				</Link>

				<button
					className={`navbar-toggler navbar-toggler-right text-uppercase font-weight-bold bg-trasnparent text-white border rounded ${
						navtoggle && "collapsed"
					}`}
					onClick={() => setnavtoggle(!navtoggle)}
					type="button"
					data-toggle="collapse"
					data-target="#navbarResponsive"
					aria-controls="navbarResponsive"
					aria-expanded={navtoggle ? "true" : "false"}
					aria-label="Toggle navigation"
				>
					Menu
					<i className="fa fa-bars ml-2"></i>
				</button>
				<div
					className={`collapse navbar-collapse ${navtoggle && "show"}`}
					id="navbarResponsive"
				>
					<ul className="navbar-nav ml-auto">
						<li className="nav-item mx-0 mx-lg-1">
							<Link href="/about" replace>
								<a className="nav-link py-3 px-0 px-lg-3 rounded js-scroll-trigger text-white">
									About
								</a>
							</Link>
						</li>
						<li className="nav-item mx-0 mx-lg-1">
							<Link href="/service" replace>
								<a className="nav-link py-3 px-0 px-lg-3 rounded js-scroll-trigger text-white">
									Service
								</a>
							</Link>
						</li>
						<li className="nav-item mx-0 mx-lg-1">
							<a
								className="nav-link py-3 px-0 px-lg-3 rounded js-scroll-trigger text-white"
								href="#"
								onClick={() => router.push("/shipment")}
							>
								Shipment
							</a>
						</li>
						<li className="nav-item mx-0 mx-lg-1">
							<a
								className="nav-link py-3 px-0 px-lg-3 rounded js-scroll-trigger text-white"
								href="#"
								onClick={() => router.push("/warehouse")}
							>
								Warehouse
							</a>
						</li>
						<li className="nav-item mx-0 mx-lg-1">
							<a
								className="nav-link py-3 px-0 px-lg-3 rounded js-scroll-trigger text-white"
								href="#"
								onClick={() => router.push("/branch")}
							>
								Branch
							</a>
						</li>
						<li className="nav-item mx-0 mx-lg-1">
							<a
								className="nav-link py-3 px-0 px-lg-3 rounded js-scroll-trigger text-white"
								href="#"
								onClick={() => router.push("/forwarding")}
							>
								Dashboard
							</a>
						</li>
					</ul>
				</div>
			</div>
		</nav>
	);
};

export default Navs;

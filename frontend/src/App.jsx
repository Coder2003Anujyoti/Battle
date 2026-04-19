import React,{useEffect} from "react";
import { MdWarningAmber } from "react-icons/md"
import { HashRouter as Router,Routes,Route
,Navigate,Outlet} from "react-router-dom";
import {isMobile,isTablet,isDesktop} from "react-device-detect";
import Home from "./components/Home"
import Page from "./components/Page"
import Auction from "./components/Auction"
import Play from "./components/Play.jsx"
const Game = () => <h1>Game Page</h1>;
const Results = () => <h1>Results Page</h1>;
const Blocked = () => {
return (
<div className="flex justify-center items-center my-40 px-4">
<div className="bg-black shadow-2xl rounded-2xl p-8 max-w-md w-full text-center border border-yellow-400">
<MdWarningAmber className="text-6xl text-yellow-500 mx-auto mb-4" />
<h2 className="text-2xl font-bold text-white mb-2"> Access Restricted </h2>
<p className="text-white">
This page is only available on{" "}
<span className="font-semibold text-sky-500">mobile devices</span>.</p></div></div>
  );
};
const ProtectedLayout = () => {
  const width = window.innerWidth;
  const isTooSmall = width < 320;
  const isTooLarge = width > 768;
  const allowed = isMobile &&!isTablet &&
  !isDesktop && !isTooSmall && !isTooLarge;
  if (!allowed) {
    return <Navigate to="/blocked" replace />;
  }
  return <Outlet />;
};
export default function App() {
useEffect(() => {
  document.body.style.backgroundColor = "#0ea5e9";
}, []);
  return (
<div class="no-scrollbar overflow-auto">
<Router>
<Routes>
<Route path="/blocked" element={<Blocked />} />
<Route element={<ProtectedLayout />}>
<Route path="/" element={<Home />} />
<Route path="/page" element={<Page />} />
<Route path="/auction" element={<Auction />} />
<Route path="/play" element={<Play />} />
<Route path="/results" element={<Results />} />
</Route>
</Routes>
</Router>
</div>
  );
}
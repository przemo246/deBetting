import { useState, useEffect } from "react";
import { Outlet, NavLink } from "react-router-dom";
import { useLocation } from "react-router-dom";

import { MdHome, MdAttachMoney, MdList, MdChangeCircle } from "react-icons/md";

import { Header } from "@/fatures/layout/components/Header";
import logo from "@/assets/img/logo.png";

const paths = ["Dashboard", "Matches", "Bets", "Mint"];
const iconSize = "1.5em";

function handleActiveClass({ isActive }: { isActive: boolean }): string {
  const baseStyles =
    "flex items-center px-5 py-3 rounded-2xl hover:bg-white hover:text-secondary transition-[background-color]";
  return isActive ? `bg-white text-secondary ${baseStyles}` : baseStyles;
}

export const Layout = () => {
  const [title, setTitle] = useState("");
  const location = useLocation();

  useEffect(() => {
    const { pathname } = location;

    if (pathname === "/") {
      setTitle("Dashboard");
    } else if (paths.includes(pathname[1].toUpperCase() + pathname.slice(2))) {
      setTitle(pathname[1].toUpperCase() + pathname.slice(2));
    } else {
      setTitle("Not Found");
    }
  }, [location]);

  return (
    <div className="bg-primary px-20 py-11 min-h-screen font-poppins text-base font-light">
      <div className="max-w-screen-2xl mx-auto my-0 flex">
        <nav className="bg-secondary rounded-2xl px-16 py-20 flex flex-col items-center min-h-screen">
          <img src={logo} alt="" className="w-28 mb-24" />
          <ul className="text-white">
            <li className="mb-9">
              <NavLink className={handleActiveClass} to="/" end>
                <MdHome size={iconSize} className="mr-2" />
                Dashboard
              </NavLink>
            </li>
            <li className="mb-9">
              <NavLink className={handleActiveClass} to="/matches">
                <MdList size={iconSize} className="mr-2" />
                Matches
              </NavLink>
            </li>
            <li className="mb-9">
              <NavLink className={handleActiveClass} to="/bets">
                <MdAttachMoney size={iconSize} className="mr-2" />
                Bets
              </NavLink>
            </li>
            <li className="mb-9">
              <NavLink className={handleActiveClass} to="/mint">
                <MdChangeCircle size={iconSize} className="mr-2" />
                Mint
              </NavLink>
            </li>
          </ul>
        </nav>
        <main className="w-full pt-10 ml-10">
          <Header title={title} />
          <Outlet />
        </main>
      </div>
    </div>
  );
};

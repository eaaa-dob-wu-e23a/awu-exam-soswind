import { NavLink } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";

export default function Navbar() {
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <nav
      className={`flex items-center justify-between p-4 ${isDarkMode ? "bg-dark text-light" : "bg-light-navbg text-dark"}`}
    >
      <div className="flex items-center justify-start">
        <NavLink to="/">
          <img src="exam-logo.png" alt="logo" className="h-8 w-auto mr-4" />{" "}
          {/* Logo til venstre */}
        </NavLink>{" "}
      </div>
      <div className="flex items-center justify-end">
        <NavLink
          to="/events"
          className="font-semibold text-lg hover:text-gray-500"
        >
          Events
        </NavLink>
        <NavLink
          to="/signin"
          className="font-semibold text-lg ml-4 hover:text-gray-500"
        >
          Log ind
        </NavLink>
        <NavLink
          to="/signup"
          className="font-semibold text-lg ml-4 hover:text-gray-500"
        >
          Opret bruger
        </NavLink>
      </div>

      <div className="flex items-center">
        <input
          id="darkModeToggle"
          type="checkbox"
          className="hidden"
          checked={isDarkMode}
          onChange={toggleTheme}
        />
        <label
          htmlFor="darkModeToggle"
          className="flex items-center cursor-pointer"
        >
          <div className="relative w-8 h-4 bg-gray-400 rounded-full shadow-inner">
            <div
              className={`dot absolute left-0 top-0 w-4 h-4 bg-white rounded-full shadow transition-transform duration-200 ease-in-out ${isDarkMode ? "transform translate-x-full" : ""}`}
            ></div>
          </div>
        </label>
        <div className="ml-3 text-gray-700 font-medium"></div>
      </div>
    </nav>
  );
}

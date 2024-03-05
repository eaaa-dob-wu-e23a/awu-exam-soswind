import { NavLink } from "react-router-dom";


export default function Navbar() {
    return (
      <nav className="flex items-center justify-between p-4 bg-white-800">
        <div className="flex items-center justify-start">
        <NavLink to="/">
          <img src="exam-logo.png" alt="logo" className="h-8 w-auto mr-4" /> {/* Logo til venstre */}
        </NavLink>        </div>
        <div className="flex items-center justify-end">
          <NavLink to="#" className="font-semibold text-lg text-gray-800 hover:text-gray-500">Events</NavLink>
          <NavLink to="/signin" className="font-semibold text-lg ml-4 text-gray-800 hover:text-gray-500">Log ind</NavLink>
          <NavLink to="/signup" className="font-semibold text-lg ml-4 text-gray-800 hover:text-gray-500">Opret bruger</NavLink>
        </div>
      </nav>
    );
  }
  
  
  
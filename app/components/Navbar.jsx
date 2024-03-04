export default function Navbar() {
    return (
      <nav className="flex items-center justify-between p-4 bg-white-800">
        <div className="flex items-center justify-start">
          <img src="exam-logo.png" alt="logo" className="h-8 w-auto mr-4" /> {/* Logo til venstre */}
        </div>
        <div className="flex items-center justify-end">
          <a href="#" className="font-semibold text-lg text-gray-800 hover:text-gray-300">Events</a>
          <a href="#" className="font-semibold text-lg ml-4 text-gray-800 hover:text-gray-300">Profil</a>
        </div>
      </nav>
    );
  }
  
  
  
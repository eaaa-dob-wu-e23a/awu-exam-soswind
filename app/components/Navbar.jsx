export default function Navbar() {
    return (
      <nav className="flex items-center justify-between p-4 bg-white-800">
        <div className="flex items-center justify-start">
        <a href="/">
          <img src="exam-logo.png" alt="logo" className="h-8 w-auto mr-4" /> {/* Logo til venstre */}
        </a>        </div>
        <div className="flex items-center justify-end">
          <a href="#" className="font-semibold text-lg text-gray-800 hover:text-gray-500">Events</a>
          <a href="/profile" className="font-semibold text-lg ml-4 text-gray-800 hover:text-gray-500">Profil</a>
          <a href="/signin" className="font-semibold text-lg ml-4 text-gray-800 hover:text-gray-500">Log ind</a>
          <a href="/signup" className="font-semibold text-lg ml-4 text-gray-800 hover:text-gray-500">Opret bruger</a>
        </div>
      </nav>
    );
  }
  
  
  
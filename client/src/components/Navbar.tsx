import { Link, useLocation, useNavigate } from "react-router-dom";

const Navbar = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const navLinks = [
    { name: "Dashboard", path: "/", icon: "📊" },
    { name: "Inventory", path: "/inventory", icon: "📦" }, 
    { name: "Transactions", path: "/transactions", icon: "💳" },
    { name: "Reports", path: "/reports", icon: "📈" },
  ];

  const handleLogout = () => {
    // Add logout logic later
    navigate("/login");
  };

  return (
    <nav className="bg-gradient-to-r from-blue-800 to-blue-600 text-white px-6 py-4 shadow-lg">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2">
          <span className="text-2xl">🛒</span>
          <span className="font-bold text-xl">DriftShift</span>
        </Link>

        {/* Navigation Links */}
        <div className="hidden md:flex space-x-8">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`flex items-center space-x-1 transition-all hover:text-blue-200 ${
                pathname === link.path ? "font-bold text-white" : "text-blue-100"
              }`}
            >
              <span>{link.icon}</span>
              <span>{link.name}</span>
            </Link>
          ))}
        </div>

        {/* Logout (Desktop) */}
        <button 
          onClick={handleLogout}
          className="hidden md:flex items-center space-x-1 bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg transition-colors"
        >
          <span>🔒</span>
          <span>Logout</span>
        </button>

        {/* Mobile Menu Button */}
        <button className="md:hidden text-2xl">☰</button>
      </div>

      {/* Mobile Menu (Optional) */}
      {/* {isMobileMenuOpen && (...)} */}
    </nav>
  );
};

export default Navbar;
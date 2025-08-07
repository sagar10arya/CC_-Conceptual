import React, { useState, useEffect } from "react";
import { Container, Logo, Badge } from "../index"; 
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import logoCC from "../../assets/logoCC.png";
import { logout } from "../../store/authSlice.js";
import { LogoutBtn } from "../index.js";
import ThemeToggle from "../ThemeToggle.jsx";

function Header() {

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false); // Track scroll 
  
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  useEffect(() => {   // closing dropdown on outside click
    const handleClickOutside = (e) => {
      if (!e.target.closest(".user-menu")) setIsUserMenuOpen(false);
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);


  const authStatus = useSelector((state) => state.auth.isAuthenticated);
  // console.log("AuthStatus::   ",authStatus);

  const user = useSelector((state) => state.auth.user);
  // console.log("Logged in user:", user);

  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // Add scroll listener
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavClick = (slug) => {
    // console.log("Navigating to:", slug);
    if (location.pathname === slug) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      navigate(slug);
    }
    setIsMobileMenuOpen(false); // Close menu after navigation
  };

  const navItems = [
    { name: "Home", slug: "/", active: true },
    { name: "Gallery", slug: "/gallery", active: true },
    { name: "Courses", slug: "/courses", active: true, badge: "Soon" },
    { name: "Study Material", slug: "/study-material", active: true },
    { name: "Test Series", slug: "/test-series", active: true, badge: "Soon" },
  ];

  const authItems = [
    { name: "Login", slug: "/login", active: !authStatus },
    { name: "Join Us", slug: "/signup", active: !authStatus },
  ];

  return (
    <header
      className={`py-2 fixed top-0 w-full z-10 transition-colors duration-300 ${
        isScrolled
          ? "bg-gradient-to-r from-gray-400 to-gray-600 dark:from-gray-700 dark:to-gray-900 shadow-lg"
          : "bg-transparent dark:bg-transparent"
      }`}
    >
      <Container>
        <nav className="flex items-center justify-between px-4 md:px-2">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/" onClick={() => handleNavClick("/")}>
              <Logo
                imageSrc={logoCC}
                altText="Conceptual Classes Logo"
                className="w-14 md:w-16 lg:w-24 md:h-14 lg:h-16"
              />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <ul className="md:flex hidden items-center justify-center space-x-8 cursor-pointer">
            {navItems.map(
              (item) =>
                item.active && (
                  <li key={item.name} className="relative">
                    <Link
                      onClick={() => handleNavClick(item.slug)}
                      to={item.slug}
                      className={`${
                        location.pathname === item.slug
                          ? "text-red-600 dark:text-red-400 font-extrabold"
                          : isScrolled
                            ? "text-gray-300 dark:text-gray-300"
                            : "text-black dark:text-white"
                      } font-medium hover:opacity-100 opacity-80 transition-opacity`}
                    >
                      {item.name}
                    </Link>
                    {item.badge && <Badge text={item.badge} />}
                  </li>
                )
            )}
          </ul>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {authStatus ? (
              <div className="relative user-menu">
                {/* User Avatar Circle */}
                <div className="flex items-center gap-2">
                  {/* Text portion */}
                  <span className="hidden sm:inline text-gray-700 dark:text-white">
                    Hi, {user?.fullName?.split(" ")[0] || "User"}
                  </span>

                  {/* Avatar circle */}
                  <div
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="w-10 h-10 rounded-full bg-gray-700 text-white flex items-center justify-center cursor-pointer"
                  >
                    {user?.fullName?.[0]?.toUpperCase() || "U"}
                  </div>
                </div>

                {/* Dropdown */}
                {isUserMenuOpen && (
                  <ul className="absolute right-0 mt-2 w-40 bg-white dark:bg-gray-800 shadow-md rounded-md text-gray-800 dark:text-gray-200 z-30">
                    <li className="px-4 py-2 border-b border-gray-200 dark:border-gray-700 text-xs font-semibold text-gray-500 dark:text-gray-400">
                      {user?.role?.toUpperCase()}
                    </li>
                    <li>
                      <Link
                        to="/profile"
                        className="block px-4 py-2 hover:bg-gray-100"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        Profile
                      </Link>
                    </li>
                    <li>
                      <button
                        onClick={() => {
                          dispatch(logout());
                          setIsUserMenuOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 hover:bg-gray-100"
                      >
                        Logout
                      </button>
                    </li>
                  </ul>
                )}
              </div>
            ) : (
              authItems.map(
                (item) =>
                  item.active && (
                    <ul key={item.name}>
                      <button
                        onClick={() => handleNavClick(item.slug)}
                        className="px-6 py-2 text-sm font-semibold rounded-full bg-gray-500 hover:bg-gray-700 text-white shadow-md transition-transform hover:scale-105"
                      >
                        {item.name}
                      </button>
                    </ul>
                  )
              )
            )}
            {(user?.role === "admin" || user?.role === "superadmin") && (
              <ul>
                <button
                  onClick={() =>
                    window.open(
                      user?.role === "superadmin" ? "/admin" : "/admin",
                      "_blank"
                    )
                  }
                  className={`text-white font-medium rounded-3xl text-sm px-5 py-2.5 ${
                    user?.role === "superadmin"
                      ? "bg-purple-700 hover:bg-purple-800"
                      : "bg-gray-700 hover:bg-gray-900"
                  }`}
                >
                  {user?.role === "superadmin" ? "Super Admin" : "Admin"}
                </button>
              </ul>
            )}
            <ThemeToggle />
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="text-gray-800 dark:text-gray-200 hover:text-gray-900 focus:outline-none text-3xl"
            >
              &#8801;
            </button>
          </div>
        </nav>

        {/* Drawer */}
        <div
          className={`fixed top-0 right-0 h-full w-3/4 max-w-sm bg-gradient-to-br from-gray-700 via-gray-800 to-gray-900 shadow-lg transform ${
            isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
          } transition-transform duration-300 z-20`}
        >
          <div className="p-6">
            <button
              className="text-white text-2xl absolute top-4 right-4"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              &times;
            </button>
            <ul className="flex flex-col space-y-4 mt-10">
              {navItems.map(
                (item) =>
                  item.active && (
                    <li key={item.name}>
                      <Link
                        onClick={() => handleNavClick(item.slug)}
                        to={item.slug}
                        className="text-white font-semibold hover:text-gray-300 transition"
                      >
                        {item.name}
                      </Link>
                    </li>
                  )
              )}
              {user?.role === "admin" || user?.role === "superadmin" ? (
                <li>
                  <button
                    onClick={() =>
                      handleNavClick(
                        user?.role === "superadmin" ? "/admin" : "/admin"
                      )
                    }
                    className={`text-white font-semibold ${
                      user?.role === "superadmin"
                        ? "hover:text-purple-400"
                        : "hover:text-yellow-400"
                    }`}
                  >
                    {user?.role === "superadmin"
                      ? "Super Admin Dashboard"
                      : "Admin Dashboard"}
                  </button>
                </li>
              ) : null}

              {authStatus ? (
                <li className="relative group">
                  <div className="flex items-center gap-2">
                    <span className="text-white">
                      Hi, {user?.fullName?.split(" ")[0] || "User"}
                    </span>
                    <div
                      onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                      className="w-10 h-10 rounded-full bg-gray-700 text-white flex items-center justify-center cursor-pointer"
                    >
                      {user?.fullName?.[0]?.toUpperCase() || "U"}
                    </div>
                  </div>
                  <ul className="absolute right-0 mt-2 w-40 bg-white shadow-md rounded-md text-gray-800 opacity-0 group-hover:opacity-100 group-hover:translate-y-0 transition duration-200 translate-y-1 z-20">
                    <li>
                      <Link
                        to="/complete-profile"
                        className="block px-4 py-2 hover:bg-gray-100"
                      >
                        Profile
                      </Link>
                    </li>
                    <li>
                      <button
                        onClick={() => dispatch(logout())}
                        className="w-full text-left px-4 py-2 hover:bg-gray-100"
                      >
                        Logout
                      </button>
                    </li>
                  </ul>
                </li>
              ) : (
                authItems.map(
                  (item) =>
                    item.active && (
                      <li key={item.name}>
                        <button
                          onClick={() => handleNavClick(item.slug)}
                          className="px-6 py-2 text-sm font-semibold rounded-full bg-gray-500 hover:bg-gray-700 text-white shadow-md transition-transform hover:scale-105"
                        >
                          {item.name}
                        </button>
                      </li>
                    )
                )
              )}
              <ThemeToggle />
            </ul>
          </div>
        </div>

        {/* Overlay */}
        {isMobileMenuOpen && (
          <div
            onClick={() => setIsMobileMenuOpen(false)}
            className="fixed inset-0 bg-black opacity-50 z-10"
          ></div>
        )}
      </Container>
    </header>
  );
}

export default Header;

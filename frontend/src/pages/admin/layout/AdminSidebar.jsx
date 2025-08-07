import React from "react";
import { NavLink } from "react-router-dom";

const sidebarLinks = [
  { name: "Dashboard", path: "/admin", icon: "🏠" },
  { name: "Gallery", path: "/admin/gallery", icon: "🖼" },
  { name: "Courses", path: "/admin/courses", icon: "📚" },
  { name: "Announcements", path: "/admin/announcements", icon: "📢" },
];

const AdminSidebar = ({ onClose }) => {
  return (
    <div className="h-full flex flex-col justify-between p-5 text-white">
      {/* Top */}
      <div>
        <div className="text-2xl font-bold mb-6 flex items-center justify-between">
          Admin Panel
          <button onClick={onClose} className="lg:hidden text-xl">
            ✕
          </button>
        </div>

        <nav className="space-y-2">
          {sidebarLinks.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              onClick={onClose}
              className={({ isActive }) =>
                `block py-2 px-4 rounded-lg transition duration-200 ${
                  isActive
                    ? "bg-indigo-600 text-white font-medium"
                    : "text-gray-300 hover:bg-gray-700"
                }`
              }
            >
              <span className="mr-2">{link.icon}</span>
              {link.name}
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Footer (optional admin info or version) */}
      <div className="text-xs text-gray-400 text-center mt-10">
        &copy; {new Date().getFullYear()} Conceptual Admin
      </div>
    </div>
  );
};

export default AdminSidebar;

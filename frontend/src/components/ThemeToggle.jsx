import { FaSun, FaMoon } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import { toggleTheme } from "../store/themeSlice";
import { useEffect } from "react";

export default function ThemeToggle() {
  const theme = useSelector((state) => state.theme.mode);
  const dispatch = useDispatch();

  // Sync with system preference on first load
  useEffect(() => {
    if (!localStorage.getItem("theme")) {
      const prefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)"
      ).matches;
      if (prefersDark) dispatch(toggleTheme());
    }
  }, [dispatch]);

  return (
    <button
      onClick={() => dispatch(toggleTheme())}
      className="p-2 rounded-full focus:outline-none hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
      aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
    >
      {theme === "light" ? (
        <FaMoon className="w-5 h-5 text-gray-700" />
      ) : (
        <FaSun className="w-5 h-5 text-yellow-300" />
      )}
    </button>
  );
}
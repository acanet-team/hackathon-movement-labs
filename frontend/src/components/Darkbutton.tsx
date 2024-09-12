/* eslint-disable */
import React, { useEffect, useState } from "react";
type ThemeMode = "theme-light" | "theme-dark";
const DarkMode = () => {
  let clickedClass = "clicked";
  const [theme, setTheme] = useState<ThemeMode>("theme-light");

  useEffect(() => {
    localStorage.setItem("theme", "theme-light");
    setTheme(localStorage.getItem("theme") as ThemeMode);
  }, []);

  useEffect(() => {
    document.body.classList.add(theme);
  }, [theme]);

  const dispatchEvent = (detail: string) => {
    const event = new CustomEvent("themeChange", { detail: detail });
    window.dispatchEvent(event);
  };

  const manipulateThemeClasses = (e: any, curTheme: string, newTheme: string) => {
    document.body.classList.replace(curTheme, newTheme);
    const el = e.target.closest(".theme-btn");
    el.classList.remove(clickedClass);
    setTheme(newTheme as ThemeMode);
    localStorage.setItem("theme", newTheme);
    // Dispatch event
    dispatchEvent(newTheme);
  }

  const switchTheme = (e: any) => {
    if (theme === "theme-dark") {
      manipulateThemeClasses(e, "theme-dark", "theme-light");
    } else {
      manipulateThemeClasses(e, "theme-light", "theme-dark");
    }
  };

  return (
    <span
      className={`theme-btn pointer p-2 text-center ms-3 menu-icon chat-active-btn ${theme === "theme-light" ? clickedClass : ""}`}
      onClick={(e) => switchTheme(e)}
      style={{ cursor: "pointer" }}
    >
      <i className="feather-moon text-current font-xl"></i>
    </span>
  );
};

export default DarkMode;

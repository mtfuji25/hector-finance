import { useEffect, useState } from "react";

type Theme = "dark" | "light";

export const useDarkMode = (): [Theme, () => void] => {
  const [theme, setTheme] = useState<Theme>("dark");
  const setMode = (mode: Theme) => {
    window.localStorage.setItem("theme", mode);
    setTheme(mode);

    if (mode === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };
  const themeToggler = () => {
    console.log("hit");
    theme === "light" ? setMode("dark") : setMode("light");
  };
  useEffect(() => {
    const localTheme = window.localStorage.getItem("theme") as Theme;
    localTheme ? setMode(localTheme) : setMode("dark");
  }, []);
  return [theme, themeToggler];
};

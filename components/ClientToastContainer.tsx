"use client";

import { ToastContainer } from "react-toastify";
import { useTheme } from "next-themes";

export default function ClientToastContainer() {
  const { theme } = useTheme();

  return (
    <ToastContainer
      position="top-center"
      autoClose={1000}
      theme={theme === "dark" ? "dark" : "light"}
      closeOnClick
    />
  );
}

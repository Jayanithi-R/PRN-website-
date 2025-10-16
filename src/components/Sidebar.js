import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { Menu, X } from "lucide-react";

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const isMobile = windowWidth <= 768;

  // Base sidebar styles
  const sidebarBase = {
    width: "220px",
    background: "#0f172a",
    color: "#fff",
    display: "flex",
    flexDirection: "column",
    height: "100vh",
    transition: "left 0.3s ease, width 0.3s ease",
    overflowY: "auto", // Makes it scrollable
    zIndex: 999,
    padding: "20px",
  };

  // Responsive sidebar for mobile
  const sidebarResponsive = {
    ...sidebarBase,
    position: "fixed",
    top: 0,
    left: isOpen ? 0 : "-240px",
  };

  const mobileHeaderStyle = {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    background: "#0f172a",
    color: "#fff",
    padding: "12px 16px",
    position: "sticky",
    top: 0,
    zIndex: 1000,
  };

  const navLinkStyle = {
    display: "block",
    color: "#cbd5e1",
    padding: "10px",
    borderRadius: "8px",
    textDecoration: "none",
    marginBottom: "6px",
    transition: "background 0.2s",
  };

  const activeStyle = {
    background: "#0b1220",
    color: "#fff",
  };

  const versionStyle = {
    marginTop: "20px",
    fontSize: "13px",
    color: "#94a3b8",
  };

  const menuButtonStyle = {
    background: "none",
    border: "none",
    color: "#fff",
    cursor: "pointer",
  };

  return (
    <>
      {/* Mobile Header */}
      {isMobile && (
        <div style={mobileHeaderStyle}>
          <div style={{ fontWeight: 700, fontSize: "18px" }}>My Shop</div>
          <button style={menuButtonStyle} onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      )}

      {/* Sidebar */}
      <div style={isMobile ? sidebarResponsive : sidebarBase}>
        {/* Logo */}
        {!isMobile && (
          <div style={{ fontWeight: 700, fontSize: "18px", marginBottom: "20px" }}>
            My Shop
          </div>
        )}

        {/* Navigation Links */}
        <div style={{ flex: 1 }}>
          {["products", "purchases", "sales", "combos", "reports"].map((route) => (
            <NavLink
              key={route}
              to={`/${route}`}
              style={({ isActive }) => (isActive ? { ...navLinkStyle, ...activeStyle } : navLinkStyle)}
              onClick={() => isMobile && setIsOpen(false)} // Close sidebar on mobile link click
            >
              {route.charAt(0).toUpperCase() + route.slice(1)}
            </NavLink>
          ))}
        </div>

        {/* Version */}
        <div style={versionStyle}>v1.0</div>
      </div>

      {/* Overlay for mobile when sidebar is open */}
      {isMobile && isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "rgba(0,0,0,0.4)",
            zIndex: 998,
          }}
        ></div>
      )}
    </>
  );
}

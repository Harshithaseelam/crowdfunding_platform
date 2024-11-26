import React from "react";
import "./Navbar.css";

function Navbar() {
  return (
    <nav className="navbar">
      <h2>Crowdfunding</h2>
      <ul>
        <li><a href="/">Home</a></li>
        <li><a href="/create">Create Campaign</a></li>
      </ul>
    </nav>
  );
}

export default Navbar;

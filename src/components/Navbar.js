import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import "../styles/Navbar.css";

const Navbar = () => {
const { user, logout } = useContext(AuthContext);

return (
<nav className="navbar">
<div className="nav-left">
<Link to="/" className="nav-logo">✨ NAVBAR</Link>
</div>
<div className="nav-right">
<Link to="/" className="nav-link">Home</Link>
<Link to="/create" className="nav-link">Create</Link>
{user ? (
<>
<span className="nav-user">Hi, {user.user.username}</span>
<button className="nav-button" onClick={logout}>Logout</button>
</>
) : (
<>
<Link to="/login" className="nav-link">Login</Link>
<Link to="/register" className="nav-link">Register</Link>
</>
)}
</div>
</nav>
);
};

export default Navbar;
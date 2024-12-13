import React from 'react';
import { NavLink } from 'react-router-dom';
import './Header.css';

const Header = () => {
  return (
    <header className="header">
      <nav className="nav">
        <NavLink to="/" className="nav-link" activeClassName="active">
          HOME
        </NavLink>
      </nav>
    </header>
  );
};

export default Header;

// src/components/Navbar.js
import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="bg-blue-500 p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-white text-2xl font-bold">
          <Link to="/">Academy Management</Link>
        </div>
        <div>
          <Link to="/students" className="text-white mx-4 hover:underline">Students</Link>
          <Link to="/teachers" className="text-white mx-4 hover:underline">Teachers</Link>
          <Link to="/groups" className="text-white mx-4 hover:underline">Groups</Link>
          <Link to="/faculties" className="text-white mx-4 hover:underline">Faculties</Link>
          <Link to="/departments" className="text-white mx-4 hover:underline">Departments</Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

import React from 'react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-500 to-purple-600 text-white">
      <div className="container mx-auto py-10">
        <h1 className="text-4xl font-bold mb-8 text-center">Academy Management</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Link to="/students" className="block p-6 bg-white rounded-lg shadow-lg text-center text-blue-700 font-bold hover:bg-blue-100">
            Manage Students
          </Link>
          <Link to="/teachers" className="block p-6 bg-white rounded-lg shadow-lg text-center text-blue-700 font-bold hover:bg-blue-100">
            Manage Teachers
          </Link>
          <Link to="/groups" className="block p-6 bg-white rounded-lg shadow-lg text-center text-blue-700 font-bold hover:bg-blue-100">
            Manage Groups
          </Link>
          <Link to="/faculties" className="block p-6 bg-white rounded-lg shadow-lg text-center text-blue-700 font-bold hover:bg-blue-100">
            Manage Faculties
          </Link>
          <Link to="/departments" className="block p-6 bg-white rounded-lg shadow-lg text-center text-blue-700 font-bold hover:bg-blue-100">
            Manage Departments
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

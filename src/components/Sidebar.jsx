// src/components/Sidebar.jsx
import { Home, Menu } from "lucide-react";
import React from "react";
import { Link } from 'react-router-dom';

// import { useNavigate } from 'react-router-dom';

function Sidebar() {

  // const navigate = useNavigate();
  return (
    <div className="w-64 bg-gray-100 border-r flex flex-col p-4">
      <div className="flex items-center justify-between mb-6">
        <Menu className="w-6 h-6 cursor-pointer" />
        <Home className="w-6 h-6" />
      </div>
      <nav className="flex flex-col gap-4">
        <button className="text-left p-2 hover:bg-gray-200 rounded">
          Stock
        </button>
        <Link to="/customers" className="p-2 hover:bg-gray-200 rounded block">
          Customer
        </Link>

      </nav>
    </div>
  );
}

export default Sidebar;

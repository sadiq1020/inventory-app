import { Home, Menu } from "lucide-react";
import React, { useState } from "react";
import { Link } from 'react-router-dom';

function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div className={`bg-gray-100 border-r flex flex-col p-4 transition-all duration-300 ${isCollapsed ? "w-20" : "w-64"}`}>

      {/* Top Icons Section */}
      <div className={`flex ${isCollapsed ? "flex-col items-center gap-4" : "flex-row justify-between items-center mb-6"}`}>
        <Menu className="w-6 h-6 cursor-pointer" onClick={toggleSidebar} />
        <Link to="/">
          <Home className="w-6 h-6" />
        </Link>
      </div>

      {/* Navigation Items */}
      {!isCollapsed && (
        <nav className="flex flex-col gap-4">
          <Link to="/stock" className="text-left p-2 hover:bg-gray-200 rounded">
            Stock
          </Link>
          <Link to="/customers" className="p-2 hover:bg-gray-200 rounded block">
            Customer
          </Link>
        </nav>
      )}
    </div>
  );
}

export default Sidebar;

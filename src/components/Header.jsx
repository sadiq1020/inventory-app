// src/components/Header.jsx
import React from "react";

function Header() {
  return (
    <header className="flex justify-between items-center p-4 border-b">
      <div className="flex gap-4">
        <button className="px-4 py-2 border rounded hover:bg-gray-100">
          Retail
        </button>
        <button className="px-4 py-2 border rounded hover:bg-gray-100">
          Wholesale
        </button>
      </div>
      <button className="px-4 py-2 border rounded bg-red-500 text-white hover:bg-red-600">
        Log out
      </button>
    </header>
  );
}

export default Header;

import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, useNavigate } from "react-router-dom";
import HomePage from "./components/HomePage";
import CustomerList from "./pages/CustomerList";
import StockPage from "./pages/StockPage";
import { useAuth } from "react-oidc-context";

// 🔒 Custom ProtectedRoute wrapper
function ProtectedRoute({ children }) {
  const auth = useAuth();
  const location = useLocation();
  const navigate = useNavigate();


  useEffect(() => {
    if (!auth.isLoading && !auth.isAuthenticated) {
      auth.signinRedirect({ state: { from: location.pathname } });
    }
  }, [auth, location]);

  if (auth.isLoading) return <div className="p-4">Loading authentication...</div>;
  if (auth.error) return <div className="p-4 text-red-600">Auth error: {auth.error.message}</div>;

  return auth.isAuthenticated ? children : null;
}

// ✅ Move App function OUTSIDE
function App() {


  return (
    <Router>
      <Routes>
        {/* Public route */}
        <Route path="/" element={<HomePage />} />

        {/* Protected routes */}
        <Route
          path="/customers"
          element={
            <ProtectedRoute>
              <CustomerList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/stock"
          element={
            <ProtectedRoute>
              <StockPage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;

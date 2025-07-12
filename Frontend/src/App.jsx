import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import ItemDetail from './pages/ItemDetail';
import AddItem from './pages/AddItem';
import Admin from './pages/Admin';

function App() {
  const isAuthenticated = () => {
    // Check if the user is authenticated (e.g., token exists in localStorage)
    const token = localStorage.getItem('token');
    return !!token; // Returns true if token exists, false otherwise
  };

  const PrivateRoute = ({ children }) => {
    // If authenticated, render the children, otherwise redirect to login
    return isAuthenticated() ? children : <Navigate to="/login" />;
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route
          path="/dashboard"
          element={<PrivateRoute><Dashboard /></PrivateRoute>}
        />
        <Route
          path="/item/:id"
          element={<PrivateRoute><ItemDetail /></PrivateRoute>}
        />
        <Route
          path="/add-item"
          element={<PrivateRoute><AddItem /></PrivateRoute>}
        />
        <Route
          path="/admin"
          element={<PrivateRoute><Admin /></PrivateRoute>}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
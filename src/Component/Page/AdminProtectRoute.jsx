import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../Auth/AuthContext';
const AdminProtectedRoute = () => {
    const { user } = useAuth();
    const location = useLocation();
    console.log('AdminProtectedRoute - User:', user); 
    console.log('AdminProtectedRoute - Location:', location.pathname);
    if (!user) {
        // User is not logged in, redirect to the login page
        // Pass the current location in state so you can redirect back after login
        console.log('AdminProtectedRoute: No user, redirecting to login.');
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    if (user.role !== 'admin') {
        // User is logged in but is not an admin
        // Redirect to login page with a message, or to a general access denied page
        // Or, if you have a non-admin dashboard, you could redirect there.
        // For simplicity, redirecting to login is shown here.
        console.log('AdminProtectedRoute: User is not admin, redirecting to login. User role:', user.role);
        return <Navigate to="/login" state={{ from: location, message: "Admin access required." }} replace />;
    }

    // User is logged in and has the 'admin' role, render the requested component
    console.log('AdminProtectedRoute: User is admin, rendering Outlet.');
    return <Outlet />;
};

export default AdminProtectedRoute;
/* eslint-disable react/prop-types */
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const RoleBasedRoute = ({ children, requiredRole }) => {
    const { isUserLoggedIn, jobRole } = useAuth();
    const userToken = localStorage.getItem('token');
    const storedJobRole = localStorage.getItem('jobRole');

    // Check localStorage first for initial render, then use context values
    const isLoggedIn = userToken ? true : isUserLoggedIn;
    const currentRole = storedJobRole || jobRole;

    if (!isLoggedIn || currentRole !== requiredRole) {
        return <Navigate to="/user-login" replace />;
    }

    return children;
};


export default RoleBasedRoute;

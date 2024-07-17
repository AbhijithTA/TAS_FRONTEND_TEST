/* eslint-disable react/prop-types */
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const PublicRoute = ({ children }) => {
    const { isBranchLoggedIn } = useAuth();

    if (isBranchLoggedIn) {
        return <Navigate to="/user-login" />;
    }

    return children;
};

export default PublicRoute;

/* eslint-disable react/prop-types */
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const UserAuthRoute = ({ children }) => {
    const { isUserLoggedIn, jobRole,isBranchLoggedIn } = useAuth();

    if (isUserLoggedIn && jobRole !== '' ) {
        if(jobRole === import.meta.env.VITE_ROLE_ADMIN) return <Navigate to="/review-panel" />;
        if(jobRole === import.meta.env.VITE_ROLE_USER && isBranchLoggedIn) return <Navigate to="/" />;
    }

    return children;
};

export default UserAuthRoute;

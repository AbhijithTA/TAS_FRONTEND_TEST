/* eslint-disable react/prop-types */
import  {  useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContext from './AuthContext';



export const AuthProvider = ({ children }) => {
    const [isBranchLoggedIn, setBranchLoggedIn] = useState(!!localStorage.getItem('branchToken'));
    const [isUserLoggedIn, setUserLoggedIn] = useState(!!localStorage.getItem('token'));
    const [jobRole, setJobRole] = useState(localStorage.getItem('jobRole') || '');
    
    const navigate = useNavigate()
    
    useEffect(() => {
        const branchToken = localStorage.getItem('branchToken');
        const userToken = localStorage.getItem('token');
        const storedJobRole = localStorage.getItem('jobRole');

        setBranchLoggedIn(!!branchToken);
        setUserLoggedIn(!!userToken);
        setJobRole(storedJobRole || '');
    }, []);

    const loginBranch = (token) => {
        localStorage.setItem('branchToken', token);
        setBranchLoggedIn(true);
    };

    const loginUser = (token, role) => {
        localStorage.setItem('token', token);
        localStorage.setItem('jobRole', role);
        setUserLoggedIn(true);
        setJobRole(role);
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('branchToken');
        setBranchLoggedIn(false);
        setUserLoggedIn(false);
    };
    
    const logoutUser = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('jobRole');
        localStorage.removeItem('LoggedInUser');
        setUserLoggedIn(false);
        navigate('/user-login');
        
    };
    
    const logoutBranch = () => {
        logoutUser();
        localStorage.removeItem('branchToken');
        localStorage.removeItem('branch');
        setBranchLoggedIn(false);
        navigate('/login');
    };

    return (
        <AuthContext.Provider value={{ isBranchLoggedIn, loginBranch,jobRole,logoutUser, isUserLoggedIn, loginUser, logout,logoutBranch }}>
            {children}
        </AuthContext.Provider>
    );
};

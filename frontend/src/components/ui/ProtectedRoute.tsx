import React from 'react';
import {Navigate, useLocation} from 'react-router-dom';
import {useAuth} from '@/authContext/useAuth';

interface Props {
    children: React.ReactNode;
    requireAdmin?: boolean;
}

const ProtectedRoute: React.FC<Props> = ({children, requireAdmin = false}) => {
    const {user, isLoading, isAdmin} = useAuth();
    const location = useLocation();

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div
                    className="w-10 h-10 border-4 border-parchment-300 border-t-leather-500 rounded-full animate-spin"/>
            </div>
        );
    }

    if (!user) {
        return <Navigate to={`/login?next=${encodeURIComponent(location.pathname)}`} replace/>;
    }

    if (requireAdmin && !isAdmin) {
        return <Navigate to="/" replace/>;
    }

    return <>{children}</>;
};

export default ProtectedRoute;

import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import type { ReactNode } from 'react';

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles?: ('ADMIN' | 'OWNER' | 'USER')[];
}

export function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const { user, isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-[#C6A87C] border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-500 font-medium">Chargement de votre session...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    // Redirect toward login but save the current location
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    // Role not authorized, redirect to appropriate home
    const redirectPath = user.role === 'ADMIN' ? '/admin' : user.role === 'OWNER' ? '/owner' : '/';
    return <Navigate to={redirectPath} replace />;
  }

  return <>{children}</>;
}

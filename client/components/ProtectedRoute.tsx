import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { LoginModal } from './LoginModal';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [showLoginModal, setShowLoginModal] = useState(false);

  useEffect(() => {
    // Check if user is logged in
    const isLoggedIn = localStorage.getItem('edusathi_logged_in') === 'true';
    setIsAuthenticated(isLoggedIn);
    
    if (!isLoggedIn) {
      setShowLoginModal(true);
    }
  }, []);

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
    setShowLoginModal(false);
  };

  const handleLoginModalChange = (open: boolean) => {
    setShowLoginModal(open);
    if (!open && !isAuthenticated) {
      // If modal is closed but user is not authenticated, redirect to home
      window.location.href = '/';
    }
  };

  if (isAuthenticated === null) {
    // Loading state
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <>
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
          <div className="text-center">
            <h1 className="text-2xl font-semibold text-slate-800 mb-4">
              Authentication Required
            </h1>
            <p className="text-slate-600 mb-6">
              Please log in to access the dashboard
            </p>
            <button
              onClick={() => setShowLoginModal(true)}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Login
            </button>
          </div>
        </div>
        <LoginModal 
          open={showLoginModal} 
          onOpenChange={handleLoginModalChange}
        />
      </>
    );
  }

  return <>{children}</>;
}

import { useState, useEffect } from 'react';
import { useKeycloak } from '@react-keycloak/web';

// 1. The Public Page
export const PublicPage = () => {
  return (
    <div className="max-w-4xl mx-auto mt-10 p-8 bg-white rounded-xl shadow-sm border border-gray-100">
      <h1 className="text-3xl font-bold text-gray-900 mb-4">Public Page</h1>
      <p className="text-gray-600 text-lg">
        Anyone can see this page. No login required! Feel free to browse around.
      </p>
    </div>
  );
};

// 2. The Protected Page
export const ProtectedPage = () => {
  const { keycloak } = useKeycloak();

  return (
    <div className="max-w-4xl mx-auto mt-10 p-8 bg-blue-50 rounded-xl shadow-md border border-blue-200">
      <h1 className="text-3xl font-bold text-blue-900 mb-4 flex items-center gap-2">
        <span>🔒</span> Protected Page
      </h1>
      <p className="text-blue-800 text-lg mb-6">
        You can only see this because you successfully authenticated with Keycloak.
      </p>
      
      <div className="bg-white p-4 rounded-lg border border-blue-100 shadow-inner">
        <p className="text-gray-700">
          <span className="font-semibold">Welcome, </span> 
          <span className="text-blue-600 font-mono">{keycloak.tokenParsed?.preferred_username}</span>!
        </p>
      </div>
    </div>
  );
};

// 3. Helper: Private Route Wrapper
export const PrivateRoute = ({ children }) => {
  const { keycloak, initialized } = useKeycloak();

  if (!initialized) {
    return <TimeoutLoader />; 
  }

  if (!keycloak.authenticated) {
    keycloak.login();
    return null;
  }

  return children;
};

export const TimeoutLoader = () => {
  const [hasTimedOut, setHasTimedOut] = useState(false);

  useEffect(() => {
    // Start a 10-second (10000ms) countdown when the loader appears
    const timer = setTimeout(() => {
      setHasTimedOut(true);
    }, 10000);

    // Clean up the timer if Keycloak suddenly finishes loading
    return () => clearTimeout(timer);
  }, []);

  if (hasTimedOut) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <div className="bg-red-50 border border-red-200 p-6 rounded-xl shadow-sm max-w-md text-center">
          <h2 className="text-xl font-bold text-red-700 mb-3 flex items-center justify-center gap-2">
            <span>⚠️</span> Connection Timeout
          </h2>
          <p className="text-red-600 mb-5">
            Keycloak took too long to respond.
          </p>
          <button 
            onClick={() => window.location.reload()}
            className="bg-red-600 hover:bg-red-700 text-white font-medium px-5 py-2 rounded-lg transition-colors shadow-sm"
          >
            Reload Page
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-xl font-medium text-gray-500 animate-pulse">
        Loading Authentication...
      </div>
    </div>
  );
};

// 4. The Admin Page
export const AdminPage = () => {
  const { keycloak } = useKeycloak();

  return (
    <div className="max-w-4xl mx-auto mt-10 p-8 bg-purple-50 rounded-xl shadow-md border border-purple-200">
      <h1 className="text-3xl font-bold text-purple-900 mb-4 flex items-center gap-2">
        <span>👨‍💻</span> Admin Dashboard
      </h1>
      <p className="text-purple-800 text-lg mb-6">
        You can only see this because you have the admin role.
      </p>
      
      <div className="bg-white p-4 rounded-lg border border-purple-100 shadow-inner">
        <p className="text-gray-700">
          <span className="font-semibold">Logged in as admin: </span> 
          <span className="text-purple-600 font-mono">{keycloak.tokenParsed?.preferred_username}</span>
        </p>
      </div>
    </div>
  );
};

// 5. Helper: Admin Route Wrapper
export const AdminRoute = ({ children }) => {
  const { keycloak, initialized } = useKeycloak();

  if (!initialized) {
    return <TimeoutLoader />; 
  }

  if (!keycloak.authenticated) {
    keycloak.login();
    return null;
  }

  // Check if the user has the 'admin' realm role
  if (!keycloak.hasRealmRole('admin')) {
    return (
      <div className="max-w-4xl mx-auto mt-10 p-8 bg-red-50 rounded-xl shadow-md border border-red-200 text-center">
        <h1 className="text-3xl font-bold text-red-900 mb-4">Access Denied</h1>
        <p className="text-red-800 text-lg">You do not have the necessary permissions to view this page.</p>
      </div>
    );
  }

  return children;
};
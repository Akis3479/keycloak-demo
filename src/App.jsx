import { ReactKeycloakProvider, useKeycloak } from '@react-keycloak/web';
import { BrowserRouter, Route, Routes, Link } from 'react-router-dom';
import keycloak from './keycloak';
import { PublicPage, ProtectedPage, PrivateRoute } from './components';

function App() {
  return (
    <ReactKeycloakProvider 
      authClient={keycloak} 
      initOptions={{ onLoad: 'check-sso' }}
    >
      <BrowserRouter>
        <nav className="bg-white shadow-md border-b border-gray-200">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16 items-center">
              
              <div className="flex space-x-8">
                <Link 
                  to="/" 
                  className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Home (Public)
                </Link>
                <ProtectedNavLink />
              </div>

              <AuthButtons />
            </div>
          </div>
        </nav>
        <main className="px-4 sm:px-6 lg:px-8">
          <Routes>
            <Route path="/" element={<PublicPage />} />
            <Route 
              path="/protected" 
              element={
                <PrivateRoute>
                  <ProtectedPage />
                </PrivateRoute>
              } 
            />
          </Routes>
        </main>
      </BrowserRouter>
    </ReactKeycloakProvider>
  );
}

const AuthButtons = () => {
  const { keycloak, initialized } = useKeycloak();

  if (!initialized) {
    return <span className="text-sm text-gray-400">Loading...</span>;
  }

  return (
    <div className="flex items-center">
      {!keycloak.authenticated ? (
        <button 
          onClick={() => keycloak.login()} 
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm"
        >
          Login
        </button>
      ) : (
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-600 hidden sm:block">
            Signed in as <strong className="text-gray-900">{keycloak.tokenParsed?.preferred_username}</strong>
          </span>
          <button 
            onClick={() => keycloak.logout({ redirectUri: 'http://localhost:5173/' })} 
            className="bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-300 px-5 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
};

const ProtectedNavLink = () => {
  const { keycloak } = useKeycloak();

  if (!keycloak?.authenticated) {
    return null;
  }

  return (
    <Link 
      to="/protected" 
      className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
    >
      Protected Page
    </Link>
  );
};

export default App;
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { AuthPage } from './AuthPage';
import { HomePage } from './components/HomePage';
import { BlogDetailPage } from './components/BlogDetailPage';
import { MyBlogsPage } from './components/MyBlogsPage';
import { Layout } from './components/Layout';
import { Toaster } from 'react-hot-toast';

// Guard: redirect unauthenticated users to /auth
const PrivateRoute = ({ children }) => {
  const { user } = useAuth();
  return user ? children : <Navigate to="/auth" replace />;
};

// Guard: redirect authenticated users away from /auth to home
const PublicRoute = ({ children }) => {
  const { user } = useAuth();
  return user ? <Navigate to="/" replace /> : children;
};

function App() {
  return (
    <>
      <Routes>
        {/* Public auth route */}
        <Route
          path="/auth"
          element={
            <PublicRoute>
              <AuthPage />
            </PublicRoute>
          }
        />

        {/* Protected routes — all wrapped in shared Layout (navbar + footer) */}
        <Route
          path="/"
          element={
            <PrivateRoute>
              <Layout />
            </PrivateRoute>
          }
        >
          {/* / → Home: article grid */}
          <Route index element={<HomePage />} />

          {/* /blogs/:id → Single article detail */}
          <Route path="blogs/:id" element={<BlogDetailPage />} />

          {/* /my-blogs → User's own articles */}
          <Route path="my-blogs" element={<MyBlogsPage />} />
        </Route>

        {/* Catch-all → redirect to home (or auth if not logged in) */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      <Toaster position="bottom-center" />
    </>
  );
}

export default App;
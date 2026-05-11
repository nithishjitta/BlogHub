import { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

const makeUser = (name, email, provider = 'email', avatar = null) => ({
  name,
  email,
  initials: name.slice(0, 2).toUpperCase(),
  provider,
  avatar,
  joinedDate: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const login = (email, password) => {
    if (email && password.length >= 6) {
      const name = email.split('@')[0];
      setUser(makeUser(name.charAt(0).toUpperCase() + name.slice(1), email));
      return { success: true };
    }
    return { success: false, error: 'Invalid credentials. Password must be at least 6 characters.' };
  };

  const register = (name, email, password) => {
    if (name && email && password.length >= 6) {
      setUser(makeUser(name, email));
      return { success: true };
    }
    return { success: false, error: 'Please fill all fields. Password must be at least 6 characters.' };
  };

  // Simulated social auth — in production these would open OAuth popups
  const loginWithGoogle = () => {
    setTimeout(() => {
      setUser(makeUser('Google User', 'user@gmail.com', 'google',
        'https://lh3.googleusercontent.com/a/default-user'));
    }, 800);
  };

  const loginWithGitHub = () => {
    setTimeout(() => {
      setUser(makeUser('GitHub User', 'user@github.com', 'github'));
    }, 800);
  };

  const loginWithLinkedIn = () => {
    setTimeout(() => {
      setUser(makeUser('LinkedIn User', 'user@linkedin.com', 'linkedin'));
    }, 800);
  };

  const loginWithMicrosoft = () => {
    setTimeout(() => {
      setUser(makeUser('Microsoft User', 'user@outlook.com', 'microsoft'));
    }, 800);
  };

  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{
      user, login, register,
      loginWithGoogle, loginWithGitHub, loginWithLinkedIn, loginWithMicrosoft,
      logout,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
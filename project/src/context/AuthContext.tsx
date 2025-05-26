import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  useEffect(() => {
    // Check for saved user in localStorage
    const savedUser = localStorage.getItem('tastygo_user');
    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        setUser(parsedUser);
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Failed to parse saved user:', error);
        localStorage.removeItem('tastygo_user');
      }
    }
  }, []);

  const login = async (email: string, password: string) => {
    // Mocking API call for login
    // In a real app, you would call your authentication API here
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock successful login with sample user data
      const mockUser = {
        id: '123456',
        name: 'John Doe',
        email: email,
        avatar: 'https://i.pravatar.cc/150?img=68'
      };
      
      setUser(mockUser);
      setIsAuthenticated(true);
      localStorage.setItem('tastygo_user', JSON.stringify(mockUser));
    } catch (error) {
      console.error('Login failed:', error);
      throw new Error('Login failed. Please check your credentials.');
    }
  };

  const signup = async (name: string, email: string, password: string) => {
    // Mocking API call for signup
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock successful signup with new user data
      const newUser = {
        id: Date.now().toString(),
        name,
        email,
        avatar: 'https://i.pravatar.cc/150?img=33'
      };
      
      setUser(newUser);
      setIsAuthenticated(true);
      localStorage.setItem('tastygo_user', JSON.stringify(newUser));
    } catch (error) {
      console.error('Signup failed:', error);
      throw new Error('Signup failed. Please try again later.');
    }
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('tastygo_user');
  };

  const value = {
    user,
    isAuthenticated,
    login,
    signup,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
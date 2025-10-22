'use client';

import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check if user is logged in on mount
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const token = localStorage.getItem('auth_token');
      console.log("Token from localStorage:", token); // ডিবাগিংয়ের জন্য
      
      if (token) {
        const response = await fetch('/api/me', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        console.log("Response status:", response.status); // ডিবাগিংয়ের জন্য
        
        if (response.ok) {
          const userData = await response.json();
          console.log("User data:", userData); // ডিবাগিংয়ের জন্য
          setUser(userData.user);
        } else {
          // If token is invalid or expired, remove it
          localStorage.removeItem('auth_token');
          setUser(null);
          console.log("Token invalid or expired"); // ডিবাগিংয়ের জন্য
        }
      } else {
        setUser(null);
        console.log("No token found"); // ডিবাগিংয়ের জন্য
      }
    } catch (error) {
      console.error('Auth check error:', error);
      localStorage.removeItem('auth_token');
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const signup = async (name, email, password) => {
    try {
      const response = await fetch('/api/sign', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // Auto login after signup
        const loginResponse = await fetch('/api/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, password }),
        });

        if (loginResponse.ok) {
          const loginData = await loginResponse.json();
          localStorage.setItem('auth_token', loginData.token);
          setUser(loginData.user);
          console.log("Signup successful, user set:", loginData.user); // ডিবাগিংয়ের জন্য
          return true;
        }
      } else {
        throw new Error(data.error || 'Signup failed');
      }
      
      return false;
    } catch (error) {
      console.error('Signup error:', error);
      throw error;
    }
  };

  const login = async (email, password) => {
    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('auth_token', data.token);
        setUser(data.user);
        console.log("Login successful, token saved:", data.token); // ডিবাগিংয়ের জন্য
        console.log("User set:", data.user); // ডিবাগিংয়ের জন্য
        return true;
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('auth_token');
    setUser(null);
    console.log("User logged out"); // ডিবাগিংয়ের জন্য
  };

  // পেজ রিলোডের সময় ইউজার চলে যাওয়া ঠেকাতে এই ইফেক্ট যোগ করুন
  useEffect(() => {
    const handleBeforeUnload = () => {
      // পেজ আনলোডের আগে বর্তমান ইউজার ডেটা সেশন স্টোরেজে সংরক্ষণ করুন
      if (user) {
        sessionStorage.setItem('temp_user', JSON.stringify(user));
      }
    };

    const handleLoad = () => {
      // পেজ লোড হওয়ার সময় সেশন স্টোরেজ থেকে ইউজার ডেটা পুনরুদ্ধার করুন
      const tempUser = sessionStorage.getItem('temp_user');
      if (tempUser && !user) {
        try {
          setUser(JSON.parse(tempUser));
          // সেশন স্টোরেজ থেকে ডেটা মুছে ফেলুন
          sessionStorage.removeItem('temp_user');
        } catch (e) {
          console.error('Error parsing temp user data:', e);
        }
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    window.addEventListener('load', handleLoad);
    
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('load', handleLoad);
    };
  }, [user]);

  const value = {
    user,
    login,
    signup,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
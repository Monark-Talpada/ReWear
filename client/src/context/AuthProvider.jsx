import React, { createContext, useContext, useEffect, useState } from "react";
import { authApi } from "@/lib/api"; // Your API wrapper (e.g., axios)
import { toast } from "sonner";
import { useNavigate } from "react-router";

const AuthContext = createContext(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loginLoading, setLoginLoading] = useState(false);
  const [signupLoading, setSignupLoading] = useState(false);
  const navigate = useNavigate();

  // Fetch authenticated user
  const fetchUser = async () => {
    try {
      setIsLoading(true);
      const response = await authApi.getAuthUser();
      setUser(response?.user || null);
    } catch (err) {
      console.error("Auth check failed:", err);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  // Login function
  const login = async (credentials) => {
    try {
      setLoginLoading(true);
      const response = await authApi.login(credentials);

      setUser(response.user);

      localStorage.setItem("token", response.token);

      toast.success("Login successfully");

      navigate("/dashboard");
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Failed to Login";
      toast.error(errorMessage);
      throw error;
    } finally {
      setLoginLoading(false);
    }
  };

  // Signup function
  const signup = async (details) => {
    try {
      setSignupLoading(true);
      const response = await authApi.signup(details);
      setUser(response.user);
      navigate("/login");
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Failed to Singup";
      toast.error(errorMessage);
      throw error;
    } finally {
      setSignupLoading(false);
    }
  };

  const logout = async () => {
    // try {
    //   await authApi.logout(); // if you have a logout endpoint
    // } catch (err) {
    //   console.warn("Logout failed:", err);
    // }
    // setUser(null);
  };

  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    signup,
    logout,
    refetch: fetchUser,
    loginLoading,
    signupLoading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

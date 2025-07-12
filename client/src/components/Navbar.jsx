import React, { useState } from "react";
import {
  Home,
  Heart,
  ShoppingBag,
  Settings,
  LogOut,
  Search,
  User,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { useAuth } from "../context/AuthProvider";
import { useLocation, Link } from "react-router";
const Navbar = () => {
  const [showSearch, setShowSearch] = useState(false);
  const { isAuthenticated, user } = useAuth();

  const toggleSearch = () => {
    setShowSearch((prev) => !prev);
  };

  const hideNavLinks = location.pathname.startsWith("/dashboard");

  return (
    <>
      <nav className="flex items-center justify-between p-4 py-2 max-w-7xl mx-auto border-b relative">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">D</span>
          </div>
          <span className="text-xl font-semibold text-gray-800">Dashboard</span>
        </div>

        {/* Navigation Links */}
        {!hideNavLinks && (
          <div className="hidden md:flex items-center gap-6">
            <Button variant="ghost" className="text-gray-600 hover:text-black">
              <Home className="w-4 h-4 mr-2" />
              Home
            </Button>
            <Button
              variant="ghost"
              className="text-gray-600 hover:text-black"
              onClick={toggleSearch}
            >
              <Search className="w-4 h-4 mr-2" />
              {showSearch ? "Close" : "Browse"}
            </Button>
          </div>
        )}

        <div className="flex items-center gap-4">
          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-10 w-10 rounded-full"
                >
                  <Avatar className="h-10 w-10 border-2 border-gray-300">
                    <AvatarImage
                      src={user?.profileImage || "/placeholder.svg"}
                      alt="User"
                    />
                    <AvatarFallback className="bg-gray-200 text-gray-600">
                      {user?.name?.charAt(0)?.toUpperCase() || "U"}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-56 bg-white border-gray-200 shadow-md"
                align="end"
                forceMount
              >
                <div className="flex items-center justify-start gap-2 p-2">
                  <div className="flex flex-col space-y-1 leading-none">
                    <p className="font-medium text-gray-800">{user.name}</p>
                    <p className="w-[200px] truncate text-sm text-gray-500">
                      {user.email}
                    </p>
                  </div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-gray-700 hover:text-black hover:bg-gray-100">
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="text-gray-700 hover:text-black hover:bg-gray-100">
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-gray-700 hover:text-black hover:bg-gray-100">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex gap-2">
              <Button variant="outline" asChild>
                <Link to="/login">Login</Link>
              </Button>
              <Button asChild>
                <Link to="/signup">Sign Up</Link>
              </Button>
            </div>
          )}
        </div>
      </nav>

      {/* Conditionally Rendered Search Bar */}
      {showSearch && (
        <div className="w-full border-b  max-w-8xl mx-auto">
          <div className="max-w-7xl mx-auto px-4 py-2">
            <Input
              type="text"
              placeholder="Search items..."
              className="w-full"
            />
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;

import React, { useContext, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";
import { AuthContext } from "../../App";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const location = useLocation()
  const { logout } = useContext(AuthContext)
  const { user, isAuthenticated } = useSelector((state) => state.user)
  
  const navigation = [
    { name: 'Dashboard', href: '/', icon: 'LayoutDashboard' },
    { name: 'Students', href: '/students', icon: 'Users' },
    { name: 'Grades', href: '/grades', icon: 'BookOpen' },
    { name: 'Attendance', href: '/attendance', icon: 'Calendar' }
  ]
  
  const isActive = (path) => {
    if (path === '/') {
      return location.pathname === '/'
    }
    return location.pathname.startsWith(path)
  }
  
  const handleLogout = async () => {
    try {
      await logout()
    } catch (error) {
      console.error("Logout error:", error)
    }
  }
  
  return (
    <header className="bg-white/90 backdrop-blur-md border-b border-slate-200/60 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 bg-gradient-to-r from-primary to-secondary rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform duration-200">
              <ApperIcon name="GraduationCap" className="w-6 h-6 text-white" />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-xl font-bold gradient-text">ClassHub</h1>
              <p className="text-xs text-slate-500 -mt-1">Student Management</p>
            </div>
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                  isActive(item.href)
                    ? 'bg-primary/10 text-primary border border-primary/20'
                    : 'text-slate-600 hover:text-primary hover:bg-primary/5'
                }`}
              >
                <ApperIcon name={item.icon} className="w-5 h-5" />
                <span>{item.name}</span>
              </Link>
            ))}
          </nav>
          
          {/* Actions */}
          <div className="flex items-center space-x-3">
            {/* User Info */}
            {isAuthenticated && user && (
              <div className="hidden sm:flex items-center space-x-3">
                <div className="text-right">
                  <div className="text-sm font-medium text-slate-900">
                    {user.firstName} {user.lastName}
                  </div>
                  <div className="text-xs text-slate-500">{user.emailAddress}</div>
                </div>
                <div className="w-8 h-8 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center text-white font-medium">
                  {user.firstName?.charAt(0)?.toUpperCase()}
                </div>
              </div>
            )}
            
            {/* Logout Button */}
            {isAuthenticated && (
              <Button
                variant="ghost"
                size="small"
                icon="LogOut"
                onClick={handleLogout}
                className="text-slate-600 hover:text-red-500"
              >
                <span className="hidden sm:inline">Logout</span>
              </Button>
            )}
            
            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="small"
              icon={isMobileMenuOpen ? "X" : "Menu"}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden text-slate-600 hover:text-primary"
            />
          </div>
        </div>
        
        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="md:hidden py-4 border-t border-slate-200"
          >
            <nav className="space-y-2">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center space-x-3 px-3 py-2 rounded-lg font-medium transition-all duration-200 ${
                    isActive(item.href)
                      ? 'bg-primary/10 text-primary border border-primary/20'
                      : 'text-slate-600 hover:text-primary hover:bg-primary/5'
                  }`}
                >
                  <ApperIcon name={item.icon} className="w-5 h-5" />
                  <span>{item.name}</span>
                </Link>
              ))}
              
              {/* Mobile User Info & Logout */}
              {isAuthenticated && (
                <div className="pt-4 border-t border-slate-200 mt-4">
                  {user && (
                    <div className="flex items-center space-x-3 px-3 py-2 mb-2">
                      <div className="w-8 h-8 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center text-white font-medium">
                        {user.firstName?.charAt(0)?.toUpperCase()}
                      </div>
                      <div>
                        <div className="text-sm font-medium text-slate-900">
                          {user.firstName} {user.lastName}
                        </div>
                        <div className="text-xs text-slate-500">{user.emailAddress}</div>
                      </div>
                    </div>
                  )}
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-3 px-3 py-2 rounded-lg font-medium transition-all duration-200 text-slate-600 hover:text-red-500 hover:bg-red-50 w-full"
                  >
                    <ApperIcon name="LogOut" className="w-5 h-5" />
                    <span>Logout</span>
                  </button>
                </div>
              )}
            </nav>
          </motion.div>
)}
      </div>
    </header>
  )
}

export default Header
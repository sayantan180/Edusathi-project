import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { GraduationCap, Sparkles, Menu, X } from "lucide-react";

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b bg-white/95 backdrop-blur-md shadow-sm">
      <div className="container max-w-7xl mx-auto px-4 py-3 sm:py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg">
              <GraduationCap className="h-4 w-4 sm:h-5 sm:w-5" />
            </div>
            <span className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Edusathi
            </span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-6 xl:space-x-8">
            <Link
              to="/creator"
              className="text-slate-600 hover:text-blue-600 transition-colors font-medium relative group py-2"
            >
              Creator
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link
              to="/business"
              className="text-slate-600 hover:text-blue-600 transition-colors font-medium relative group py-2"
            >
              For Business
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link
              to="/student"
              className="text-slate-600 hover:text-blue-600 transition-colors font-medium relative group py-2"
            >
              For Students
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link
              to="/about"
              className="text-slate-600 hover:text-blue-600 transition-colors font-medium relative group py-2"
            >
              About us
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link
              to="/contact"
              className="text-slate-600 hover:text-blue-600 transition-colors font-medium relative group py-2"
            >
              Contact us
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-300 group-hover:w-full"></span>
            </Link>
          </nav>

          {/* Desktop CTA & Mobile Menu Button */}
          <div className="flex items-center gap-3">
            <Link to="/get-started" className="hidden sm:block">
              <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-4 sm:px-6 py-2 text-sm sm:text-base shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                <Sparkles className="w-4 h-4 mr-2" />
                Join Now
              </Button>
            </Link>
            
            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden p-2"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
          
          {/* Mobile Navigation Menu */}
          {mobileMenuOpen && (
            <div className="lg:hidden mt-4 pb-4 border-t border-slate-200 animate-in slide-in-from-top-2 duration-300">
              <nav className="flex flex-col space-y-3 pt-4">
                <Link
                  to="/creator"
                  className="text-slate-600 hover:text-blue-600 transition-colors font-medium py-2 px-2 rounded-lg hover:bg-blue-50"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Creator
                </Link>
                <Link
                  to="/business"
                  className="text-slate-600 hover:text-blue-600 transition-colors font-medium py-2 px-2 rounded-lg hover:bg-blue-50"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  For Business
                </Link>
                <Link
                  to="/student"
                  className="text-slate-600 hover:text-blue-600 transition-colors font-medium py-2 px-2 rounded-lg hover:bg-blue-50"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  For Students
                </Link>
                <Link
                  to="/catalog"
                  className="text-slate-600 hover:text-blue-600 transition-colors font-medium py-2 px-2 rounded-lg hover:bg-blue-50"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Catalog
                </Link>
                <Link
                  to="/about"
                  className="text-slate-600 hover:text-blue-600 transition-colors font-medium py-2 px-2 rounded-lg hover:bg-blue-50"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  About us
                </Link>
                <Link
                  to="/contact"
                  className="text-slate-600 hover:text-blue-600 transition-colors font-medium py-2 px-2 rounded-lg hover:bg-blue-50"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Contact us
                </Link>
                <div className="pt-3 border-t border-slate-200">
                  <Link to="/get-started" onClick={() => setMobileMenuOpen(false)}>
                    <Button className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300">
                      <Sparkles className="w-4 h-4 mr-2" />
                      Join Now
                    </Button>
                  </Link>
                </div>
              </nav>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

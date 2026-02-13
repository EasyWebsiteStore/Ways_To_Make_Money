import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { base44 } from "@/api/base44Client";
import { Menu, X, Sparkles, LogIn, LogOut, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Layout({ children, currentPageName }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [isAuth, setIsAuth] = useState(false);

  useEffect(() => {
    base44.auth.isAuthenticated().then(async (auth) => {
      setIsAuth(auth);
      if (auth) {
        const u = await base44.auth.me();
        setUser(u);
      }
    });
  }, []);

  const navItems = [
    { label: "Home", page: "Home" },
    { label: "Browse", page: "Browse" },
  ];

  if (user?.role === "admin") {
    navItems.push({ label: "Admin", page: "Admin" });
  }

  return (
    <div className="min-h-screen bg-gray-950">
      <style>{`
        :root {
          --background: 222.2 84% 4.9%;
          --foreground: 210 40% 98%;
        }
        body {
          background-color: #030712;
          color: #f9fafb;
        }
        /* Custom scrollbar */
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 3px; }
        ::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.2); }
      `}</style>

      {/* Nav */}
      <nav className="sticky top-0 z-50 bg-gray-950/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link to={createPageUrl("Home")} className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="text-white font-bold text-lg tracking-tight">EarnSmart</span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <Link key={item.page} to={createPageUrl(item.page)}>
                <Button
                  variant="ghost"
                  className={`text-sm rounded-lg ${
                    currentPageName === item.page
                      ? "text-white bg-white/10"
                      : "text-gray-400 hover:text-white hover:bg-white/5"
                  }`}
                >
                  {item.page === "Admin" && <Shield className="w-3.5 h-3.5 mr-1.5" />}
                  {item.label}
                </Button>
              </Link>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-3">
            {isAuth ? (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => base44.auth.logout()}
                className="text-gray-400 hover:text-white"
              >
                <LogOut className="w-4 h-4 mr-2" /> Sign Out
              </Button>
            ) : (
              <Button
                size="sm"
                onClick={() => base44.auth.redirectToLogin()}
                className="bg-white/10 hover:bg-white/20 text-white rounded-lg"
              >
                <LogIn className="w-4 h-4 mr-2" /> Sign In
              </Button>
            )}
          </div>

          {/* Mobile menu toggle */}
          <button className="md:hidden text-gray-400" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden bg-gray-950 border-b border-white/5 px-6 pb-4 space-y-1">
            {navItems.map((item) => (
              <Link key={item.page} to={createPageUrl(item.page)} onClick={() => setMenuOpen(false)}>
                <div className={`px-4 py-3 rounded-lg text-sm ${
                  currentPageName === item.page ? "text-white bg-white/10" : "text-gray-400"
                }`}>
                  {item.label}
                </div>
              </Link>
            ))}
            <div className="pt-2">
              {isAuth ? (
                <Button variant="ghost" size="sm" onClick={() => base44.auth.logout()} className="text-gray-400 w-full justify-start">
                  <LogOut className="w-4 h-4 mr-2" /> Sign Out
                </Button>
              ) : (
                <Button size="sm" onClick={() => base44.auth.redirectToLogin()} className="bg-white/10 text-white w-full">
                  <LogIn className="w-4 h-4 mr-2" /> Sign In
                </Button>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* Page content */}
      <main>{children}</main>

      {/* Footer */}
      <footer className="border-t border-white/5 py-12 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-6 h-6 rounded-md bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <Sparkles className="w-3 h-3 text-white" />
            </div>
            <span className="text-white font-semibold">EarnSmart</span>
          </div>
          <p className="text-gray-500 text-sm">
            Curated online earning opportunities — tested and reviewed by Ashley.
          </p>
          <p className="text-gray-600 text-xs mt-4">
            © {new Date().getFullYear()} EarnSmart. All opportunities are shared for informational purposes.
          </p>
        </div>
      </footer>
    </div>
  );
}
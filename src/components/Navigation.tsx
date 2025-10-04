import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { useState } from "react";

const Navigation = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-lg">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <img
              src="/logo.jpg"
              alt="ClimaTrack Logo"
              className="h-10 w-10 rounded-full border border-gray-300 shadow-sm object-cover"
            />
            <span className="text-xl font-bold">ClimaTrack</span>
          </Link>
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <a href="/#features" className="text-sm text-muted-foreground hover:text-foreground transition-smooth">
              Features
            </a>
            <Link to="/docs" className="text-sm text-muted-foreground hover:text-foreground transition-smooth">
              Docs
            </Link>
            <Link to="/about" className="text-sm text-muted-foreground hover:text-foreground transition-smooth">
              About
            </Link>
            <Link to="/app">
              <Button variant="outline" size="sm">
                Open App
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 space-y-3 border-t border-border/50">
            <a
              href="/#features"
              className="block text-sm text-muted-foreground hover:text-foreground transition-smooth"
              onClick={() => setMobileMenuOpen(false)}
            >
              Features
            </a>
            <Link
              to="/docs"
              className="block text-sm text-muted-foreground hover:text-foreground transition-smooth"
              onClick={() => setMobileMenuOpen(false)}
            >
              Docs
            </Link>
            <Link
              to="/about"
              className="block text-sm text-muted-foreground hover:text-foreground transition-smooth"
              onClick={() => setMobileMenuOpen(false)}
            >
              About
            </Link>
            <Link to="/app" onClick={() => setMobileMenuOpen(false)}>
              <Button variant="outline" size="sm" className="w-full">
                Open App
              </Button>
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;

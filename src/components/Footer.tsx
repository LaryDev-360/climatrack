import { Link } from "react-router-dom";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border/50 bg-card/30 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="text-sm text-muted-foreground">
            © {currentYear} OrbitCode — ClimaTrack
          </div>
          <div className="flex items-center space-x-6">
            <Link to="/terms" className="text-sm text-muted-foreground hover:text-foreground transition-smooth">
              Terms
            </Link>
            <Link to="/privacy" className="text-sm text-muted-foreground hover:text-foreground transition-smooth">
              Privacy
            </Link>
            <a
              href="mailto:hello@orbitcode.dev"
              className="text-sm text-muted-foreground hover:text-foreground transition-smooth"
            >
              Contact
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

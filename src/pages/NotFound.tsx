import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-calm">
      <div className="text-center animate-fade-in">
        <h1 className="text-4xl font-light mb-4 text-foreground">404</h1>
        <p className="text-xl text-muted-foreground mb-6">Oops! This page doesn't exist</p>
        <a 
          href="/" 
          className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 transition-colors text-primary-foreground px-6 py-3 rounded-lg font-medium"
        >
          Return to Home
        </a>
      </div>
    </div>
  );
};

export default NotFound;

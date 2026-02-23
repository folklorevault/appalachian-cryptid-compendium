import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);

    // Tell crawlers not to index 404 pages
    let robotsMeta = document.querySelector('meta[name="robots"]') as HTMLMetaElement;
    if (!robotsMeta) {
      robotsMeta = document.createElement("meta");
      robotsMeta.setAttribute("name", "robots");
      document.head.appendChild(robotsMeta);
    }
    robotsMeta.setAttribute("content", "noindex, nofollow");

    document.title = "Page Not Found | Appalachian Cryptids List";

    return () => {
      robotsMeta?.remove();
    };
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-background dark">
      <Header />
      <div className="flex items-center justify-center py-32">
        <div className="text-center space-y-4">
          <h1 className="text-6xl font-bold text-primary font-display">404</h1>
          <p className="text-xl text-muted-foreground">Specimen not found in database</p>
          <p className="text-sm text-muted-foreground">
            The cryptid you're looking for may have escaped our archives.
          </p>
          <Link to="/">
            <Button className="mt-4 bg-primary text-primary-foreground hover:bg-primary/90">
              Return to Directory
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;

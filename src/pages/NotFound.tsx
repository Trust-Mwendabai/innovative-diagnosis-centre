import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { Home, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-[80vh] items-center justify-center relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/5 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-accent/5 rounded-full blur-3xl animate-float" style={{ animationDelay: "3s" }} />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center relative z-10"
      >
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
          className="mx-auto mb-6 h-20 w-20 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center shadow-lg"
        >
          <AlertTriangle className="h-10 w-10 text-white" />
        </motion.div>

        <h1 className="text-7xl font-heading font-extrabold gradient-text mb-4">404</h1>
        <p className="text-xl text-muted-foreground mb-8">Oops! Page not found</p>

        <Link to="/">
          <Button size="lg" className="gradient-primary text-white border-0 shadow-md hover:shadow-glow transition-all duration-300 gap-2 font-semibold">
            <Home className="h-4 w-4" /> Return to Home
          </Button>
        </Link>
      </motion.div>
    </div>
  );
};

export default NotFound;

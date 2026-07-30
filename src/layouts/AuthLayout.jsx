import { Outlet, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import Logo from "@/shared/ui/Logo";
import AuthHeroCarousel, { AuthHeroBg } from "@/features/auth/components/AuthHeroCarousel";

export default function AuthLayout() {
  return (
    <div className="min-h-screen flex bg-gray-50 dark:bg-gray-900">
      {/* Left Hero Carousel Panel */}
      <div className="hidden lg:flex lg:w-1/2 xl:w-[55%] relative overflow-hidden">
        <AuthHeroCarousel />
      </div>

      {/* Right Form Panel */}
      <div className="flex-1 flex flex-col">
        {/* Mobile Logo with animated background */}
        <div className="lg:hidden relative overflow-hidden" style={{ height: 160 }}>
          <div className="absolute inset-0 opacity-15 pointer-events-none">
            <AuthHeroBg />
          </div>
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-gray-50 dark:to-gray-900 z-10" />
          <Link to="/" className="absolute left-4 top-4 z-20 flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm font-medium">Retour</span>
          </Link>
          <div className="absolute inset-0 z-20 flex items-center justify-center">
            <Link to="/" className="inline-flex items-center gap-2">
              <Logo size="lg" className="shadow-none" />
              <span className="text-2xl font-bold text-white drop-shadow-lg">
                Market
              </span>
            </Link>
          </div>
        </div>

        <div className="flex-1 flex items-center justify-center p-6 sm:p-8">
          <div className="w-full max-w-md">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Outlet />
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}

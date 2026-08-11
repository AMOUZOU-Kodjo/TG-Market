import { Link, useLocation } from "react-router-dom";
import { Home, Heart, PlusCircle, MessageCircle, User } from "lucide-react";
import { useAuth } from "@/shared/contexts/AuthContext";

const tabs = [
  { to: "/", label: "Accueil", icon: Home },
  { to: "/favoris", label: "Favoris", icon: Heart },
  { to: "/vendre", label: "Vendre", icon: PlusCircle },
  { to: "/messages", label: "Messages", icon: MessageCircle },
  { to: "/profil", label: "Profil", icon: User },
];

export default function BottomNav() {
  const location = useLocation();
  const { user } = useAuth();

  return (
    <nav className="md:hidden fixed bottom-0 inset-x-0 z-[200] bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 safe-area-pb">
      <div className="flex items-center justify-around h-16">
        {tabs.map((tab) => {
          const isActive = location.pathname === tab.to ||
            (tab.to !== "/" && location.pathname.startsWith(tab.to));

          return (
            <Link
              key={tab.to}
              to={tab.to}
              className={`flex flex-col items-center justify-center gap-0.5 w-full h-full transition-colors ${
                isActive
                  ? "text-brand-600 dark:text-brand-400"
                  : "text-gray-400 dark:text-gray-500"
              }`}
            >
              <div className="relative">
                {tab.to === "/vendre" ? (
                  <span
                    className={`w-10 h-10 -mt-4 mb-0.5 rounded-full flex items-center justify-center shadow-md bg-fuchsia-600 ${
                      isActive ? "ring-4 ring-fuchsia-600/25 scale-105" : ""
                    }`}
                  >
                    <tab.icon className="w-5 h-5 text-white" strokeWidth={isActive ? 2.2 : 1.8} />
                  </span>
                ) : (
                  <tab.icon className="w-6 h-6" strokeWidth={isActive ? 2.2 : 1.5} />
                )}
                {tab.to === "/messages" && user?.unreadMessages > 0 && (
                  <span className="absolute -top-1.5 -right-2 w-4 h-4 bg-brand-700 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                    {user.unreadMessages}
                  </span>
                )}
              </div>
              <span className={`text-[10px] leading-tight ${isActive ? "font-semibold" : "font-medium"}`}>
                {tab.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

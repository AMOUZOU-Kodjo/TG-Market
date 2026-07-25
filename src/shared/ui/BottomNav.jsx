import { Link, useLocation } from "react-router-dom";
import { Home, Heart, PlusCircle, MessageCircle, User } from "lucide-react";
import { mockCurrentUser } from "../../data/users";

const tabs = [
  { to: "/", label: "Accueil", icon: Home },
  { to: "/favoris", label: "Favoris", icon: Heart },
  { to: "/vendre", label: "Vendre", icon: PlusCircle },
  { to: "/messages", label: "Messages", icon: MessageCircle },
  { to: "/profil", label: "Profil", icon: User },
];

export default function BottomNav() {
  const location = useLocation();

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
                <tab.icon className="w-6 h-6" strokeWidth={isActive ? 2.2 : 1.5} />
                {tab.to === "/messages" && mockCurrentUser.unreadMessages > 0 && (
                  <span className="absolute -top-1.5 -right-2 w-4 h-4 bg-brand-700 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                    {mockCurrentUser.unreadMessages}
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

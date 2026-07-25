import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  MapPin,
  Calendar,
  ShieldCheck,
  Package,
  Star,
  Users,
  Edit3,
  MessageCircle,
  UserPlus,
} from "lucide-react";
import Avatar from "@/shared/ui/Avatar";
import Badge from "@/shared/ui/Badge";
import Button from "@/shared/ui/Button";
import { cn } from "@/shared/utils/cn";
import { formatDate } from "@/shared/utils/format";

export default function ProfileHeader({
  user,
  isOwnProfile = false,
  onEdit,
  onMessage,
  onFollow,
  isFollowing = false,
}) {
  const [following, setFollowing] = useState(isFollowing);

  const handleFollow = () => {
    setFollowing(!following);
    onFollow?.(!following);
  };

  const stats = [
    {
      label: "Annonces",
      value: user?.productCount || 0,
      icon: Package,
    },
    {
      label: "Avis",
      value: user?.reviewCount || 0,
      icon: Star,
    },
    {
      label: "Note",
      value: user?.rating?.toFixed(1) || "0.0",
      icon: Star,
    },
    {
      label: "Abonnés",
      value: user?.followerCount || 0,
      icon: Users,
    },
  ];

  return (
    <div className="overflow-hidden rounded-2xl bg-white shadow-sm dark:bg-gray-900">
      <div className="relative h-48 sm:h-56">
        <div className="absolute inset-0 bg-brand-800" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djItSDI0di0yaDEyem0wLTRWMjhIMjR2Mmgxem0tMi0ydi0yaC0xdjJoMXptNC0ydjJIMjh2LTJoMTJ6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-30" />
      </div>

      <div className="relative px-4 sm:px-6 pb-6">
        <div className="-mt-16 flex flex-col sm:flex-row sm:items-end sm:gap-5">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 20, delay: 0.1 }}
          >
            <Avatar
              src={user?.avatar}
              name={user?.name}
              size="xl"
              verified={user?.verified}
              className="ring-4 ring-white dark:ring-gray-900"
            />
          </motion.div>

          <div className="mt-3 flex-1 sm:mt-0 sm:pb-1">
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                {user?.name}
              </h1>
              {user?.verified && (
                <Badge variant="primary" size="sm">
                  <ShieldCheck className="h-3 w-3" />
                  Vérifié
                </Badge>
              )}
            </div>
            <div className="mt-1 flex flex-wrap items-center gap-3 text-sm text-gray-500 dark:text-gray-400">
              {user?.city && (
                <span className="flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5" />
                  {user?.district ? `${user.district}, ${user.city}` : user.city}
                </span>
              )}
              <span className="flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5" />
                Membre depuis {formatDate(user?.joinedAt, { month: "short", year: "numeric" })}
              </span>
            </div>
          </div>

          <div className="mt-4 flex gap-2 sm:mt-0 sm:pb-1">
            {isOwnProfile ? (
              <Button
                variant="outline"
                size="sm"
                icon={Edit3}
                onClick={onEdit}
              >
                Modifier
              </Button>
            ) : (
              <>
                <Button
                  variant="primary"
                  size="sm"
                  icon={MessageCircle}
                  onClick={onMessage}
                >
                  Contacter
                </Button>
                <Button
                  variant={following ? "secondary" : "outline"}
                  size="sm"
                  icon={following ? Users : UserPlus}
                  onClick={handleFollow}
                >
                  {following ? "Abonné" : "Suivre"}
                </Button>
              </>
            )}
          </div>
        </div>

        {user?.bio && (
          <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">
            {user.bio}
          </p>
        )}

        <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 + i * 0.05 }}
              className={cn(
                "flex items-center gap-3 rounded-xl border border-gray-100 p-3",
                "dark:border-gray-800"
              )}
            >
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-50 dark:bg-brand-800/10">
                <stat.icon className="h-4 w-4 text-brand-800" />
              </div>
              <div>
                <p className="text-lg font-bold text-gray-900 dark:text-white">
                  {stat.value}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {stat.label}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

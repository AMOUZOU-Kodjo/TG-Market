import { useState } from "react";
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
  TrendingUp,
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
      icon: TrendingUp,
    },
    {
      label: "Abonnés",
      value: user?.followerCount || 0,
      icon: Users,
    },
  ];

  return (
    <div className="overflow-hidden rounded-2xl bg-white shadow-sm dark:bg-gray-800">
      {/* Cover */}
      <div className="relative h-20 sm:h-28 bg-white dark:bg-gray-800">
        {/* Avatar overlapping cover bottom */}
        <div className="absolute -bottom-12 left-1/2 -translate-x-1/2">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 20, delay: 0.1 }}
          >
            <div className="relative">
              <Avatar
                src={user?.avatar}
                name={user?.name}
                size="2xl"
                verified={user?.verified}
              />
              {isOwnProfile && (
                <button
                  onClick={onEdit}
                  className="absolute bottom-1 right-1 flex h-8 w-8 items-center justify-center rounded-full bg-brand-600 text-white shadow-lg transition-all hover:bg-brand-700 hover:scale-105 active:scale-95"
                >
                  <Edit3 className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Profile info */}
      <div className="relative px-5 sm:px-8 pb-6 pt-16">

        {/* Name & meta centered */}
        <div className="mt-3 text-center">
          <div className="flex items-center justify-center gap-2.5">
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
          <div className="mt-1.5 flex flex-wrap items-center justify-center gap-3 text-sm text-gray-500 dark:text-gray-400">
            {user?.city && (
              <span className="flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5 text-gray-400" />
                {user?.district ? `${user.district}, ${user.city}` : user.city}
              </span>
            )}
            <span className="flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5 text-gray-400" />
              Membre depuis {formatDate(user?.joinedAt, { month: "short", year: "numeric" })}
            </span>
          </div>
        </div>

        {/* Action buttons */}
        <div className="mt-4 flex justify-center gap-2">
          {isOwnProfile ? (
            <Button
              variant="primary"
              size="sm"
              icon={Edit3}
              onClick={onEdit}
            >
              Modifier le profil
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

        {/* Bio */}
        {user?.bio && (
          <p className="mt-4 text-center text-sm leading-relaxed text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            {user.bio}
          </p>
        )}

        {/* Stats */}
        <div className="mt-5 flex flex-wrap justify-center gap-3">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 + i * 0.05 }}
              className="flex items-center gap-2.5 rounded-xl border border-gray-100 bg-gray-50/80 px-4 py-2.5 dark:border-gray-800 dark:bg-gray-800/50"
            >
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-brand-100 dark:bg-brand-800/20">
                <stat.icon className="h-4 w-4 text-brand-700 dark:text-brand-400" />
              </div>
              <div className="min-w-0">
                <p className="text-base font-bold leading-tight text-gray-900 dark:text-white">
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

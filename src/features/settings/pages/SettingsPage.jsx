import { useState } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import {
  User,
  Mail,
  Phone,
  FileText,
  Lock,
  Trash2,
  Globe,
  DollarSign,
  Bell,
  BellOff,
  Eye,
  EyeOff,
  MapPin,
  Sun,
  Moon,
  Save,
  Camera,
  Shield,
  ChevronRight,
  Smartphone,
  MessageCircle,
} from "lucide-react";
import { Link } from "react-router-dom";
import Button from "@/shared/ui/Button";
import Input from "@/shared/ui/Input";
import Textarea from "@/shared/ui/Textarea";
import Avatar from "@/shared/ui/Avatar";
import { mockCurrentUser } from "@/data/users";
import toast from "react-hot-toast";

const sectionVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, type: "spring", stiffness: 260, damping: 20 },
  }),
};

function Toggle({ enabled, onChange, label, description }) {
  return (
    <div className="flex items-center justify-between py-3">
      <div className="flex-1">
        <p className="text-sm font-medium text-gray-900 dark:text-white">{label}</p>
        {description && (
          <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">{description}</p>
        )}
      </div>
      <button
        onClick={() => onChange(!enabled)}
        className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors ${
          enabled ? "bg-red-800" : "bg-gray-300 dark:bg-gray-600"
        }`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform ${
            enabled ? "translate-x-6" : "translate-x-1"
          }`}
        />
      </button>
    </div>
  );
}

export default function SettingsPage() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    sms: false,
  });
  const [privacy, setPrivacy] = useState({
    profileVisibility: "public",
    showPhone: false,
    showLocation: true,
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm({
    defaultValues: {
      name: mockCurrentUser.name,
      email: mockCurrentUser.email,
      phone: mockCurrentUser.phone,
      bio: mockCurrentUser.bio,
    },
  });

  const {
    register: registerPassword,
    handleSubmit: handlePasswordSubmit,
    formState: { errors: passwordErrors },
    reset: resetPassword,
  } = useForm();

  const onProfileSubmit = (data) => {
    toast.success("Profil mis à jour avec succès !");
  };

  const onPasswordSubmit = (data) => {
    toast.success("Mot de passe modifié avec succès !");
    resetPassword();
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-6 sm:px-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Paramètres</h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Gérez votre profil, vos préférences et la sécurité de votre compte.
        </p>
      </div>

      <div className="space-y-8">
        {/* Profile Section */}
        <motion.section
          custom={0}
          variants={sectionVariants}
          initial="hidden"
          animate="visible"
          className="rounded-2xl border border-gray-100 bg-white p-6 dark:border-gray-800 dark:bg-gray-900"
        >
          <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-gray-900 dark:text-white">
            <User className="h-5 w-5 text-red-800" />
            Profil
          </h2>

          <div className="mb-6 flex items-center gap-4">
            <div className="relative">
              <Avatar src={mockCurrentUser.avatar} name={mockCurrentUser.name} size="xl" />
              <button className="absolute bottom-0 right-0 rounded-full bg-red-800 p-1.5 text-white shadow-lg transition-transform hover:scale-110">
                <Camera className="h-3.5 w-3.5" />
              </button>
            </div>
            <div>
              <p className="font-medium text-gray-900 dark:text-white">{mockCurrentUser.name}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">{mockCurrentUser.email}</p>
              <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">
                Membre depuis janvier 2023
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit(onProfileSubmit)} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <Input
                label="Nom complet"
                icon={User}
                {...register("name", { required: "Le nom est requis" })}
                error={errors.name?.message}
              />
              <Input
                label="Email"
                type="email"
                icon={Mail}
                {...register("email", { required: "L'email est requis", pattern: { value: /^\S+@\S+$/i, message: "Email invalide" } })}
                error={errors.email?.message}
              />
            </div>
            <Input
              label="Téléphone"
              icon={Phone}
              prefix="+228"
              {...register("phone")}
            />
            <Textarea
              label="Bio"
              placeholder="Parlez-nous de vous..."
              rows={3}
              maxLength={200}
              showCount
              {...register("bio")}
            />
            <div className="flex justify-end">
              <Button type="submit" icon={Save} disabled={!isDirty}>
                Enregistrer les modifications
              </Button>
            </div>
          </form>
        </motion.section>

        {/* Password Section */}
        <motion.section
          custom={1}
          variants={sectionVariants}
          initial="hidden"
          animate="visible"
          className="rounded-2xl border border-gray-100 bg-white p-6 dark:border-gray-800 dark:bg-gray-900"
        >
          <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-gray-900 dark:text-white">
            <Lock className="h-5 w-5 text-red-800" />
            Sécurité
          </h2>

          <form onSubmit={handlePasswordSubmit(onPasswordSubmit)} className="space-y-4">
            <Input
              label="Mot de passe actuel"
              type="password"
              icon={Lock}
              {...registerPassword("currentPassword", { required: "Le mot de passe actuel est requis" })}
              error={passwordErrors.currentPassword?.message}
            />
            <div className="grid gap-4 sm:grid-cols-2">
              <Input
                label="Nouveau mot de passe"
                type="password"
                icon={Lock}
                {...registerPassword("newPassword", { required: "Le nouveau mot de passe est requis", minLength: { value: 8, message: "Minimum 8 caractères" } })}
                error={passwordErrors.newPassword?.message}
              />
              <Input
                label="Confirmer le mot de passe"
                type="password"
                icon={Lock}
                {...registerPassword("confirmPassword", { required: "Veuillez confirmer le mot de passe" })}
                error={passwordErrors.confirmPassword?.message}
              />
            </div>
            <div className="flex justify-end">
              <Button type="submit" variant="secondary" icon={Shield}>
                Modifier le mot de passe
              </Button>
            </div>
          </form>
        </motion.section>

        {/* Preferences Section */}
        <motion.section
          custom={2}
          variants={sectionVariants}
          initial="hidden"
          animate="visible"
          className="rounded-2xl border border-gray-100 bg-white p-6 dark:border-gray-800 dark:bg-gray-900"
        >
          <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-gray-900 dark:text-white">
            <Globe className="h-5 w-5 text-red-800" />
            Préférences
          </h2>

          <div className="divide-y divide-gray-100 dark:divide-gray-800">
            <div className="flex items-center justify-between py-3">
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">Langue</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Langue d'affichage de l'application</p>
              </div>
              <select className="rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-900 dark:text-white">
                <option>Français</option>
                <option>English</option>
              </select>
            </div>
            <div className="flex items-center justify-between py-3">
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">Devise</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Devise d'affichage des prix</p>
              </div>
              <select className="rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-900 dark:text-white">
                <option>FCFA</option>
                <option>EUR</option>
                <option>USD</option>
              </select>
            </div>
          </div>

          <div className="mt-2 divide-y divide-gray-100 dark:divide-gray-800">
            <Toggle
              label="Notifications par email"
              description="Recevez les alertes importantes par email"
              enabled={notifications.email}
              onChange={(v) => setNotifications((p) => ({ ...p, email: v }))}
            />
            <Toggle
              label="Notifications push"
              description="Recevez les notifications sur votre appareil"
              enabled={notifications.push}
              onChange={(v) => setNotifications((p) => ({ ...p, push: v }))}
            />
            <Toggle
              label="Notifications SMS"
              description="Recevez les alertes critiques par SMS"
              enabled={notifications.sms}
              onChange={(v) => setNotifications((p) => ({ ...p, sms: v }))}
            />
            <Toggle
              label="Mode sombre"
              description="Activez le thème sombre pour plus de confort"
              enabled={isDarkMode}
              onChange={setIsDarkMode}
            />
          </div>
        </motion.section>

        {/* Privacy Section */}
        <motion.section
          custom={3}
          variants={sectionVariants}
          initial="hidden"
          animate="visible"
          className="rounded-2xl border border-gray-100 bg-white p-6 dark:border-gray-800 dark:bg-gray-900"
        >
          <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-gray-900 dark:text-white">
            <Eye className="h-5 w-5 text-red-800" />
            Confidentialité
          </h2>

          <div className="divide-y divide-gray-100 dark:divide-gray-800">
            <div className="flex items-center justify-between py-3">
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">Visibilité du profil</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Qui peut voir votre profil</p>
              </div>
              <select
                value={privacy.profileVisibility}
                onChange={(e) => setPrivacy((p) => ({ ...p, profileVisibility: e.target.value }))}
                className="rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-900 dark:text-white"
              >
                <option value="public">Public</option>
                <option value="contacts">Mes contacts</option>
                <option value="private">Privé</option>
              </select>
            </div>
            <Toggle
              label="Afficher mon numéro de téléphone"
              description="Visible sur votre profil par les autres utilisateurs"
              enabled={privacy.showPhone}
              onChange={(v) => setPrivacy((p) => ({ ...p, showPhone: v }))}
            />
            <Toggle
              label="Afficher ma localisation"
              description="Affiche votre ville dans vos annonces"
              enabled={privacy.showLocation}
              onChange={(v) => setPrivacy((p) => ({ ...p, showLocation: v }))}
            />
          </div>
        </motion.section>

        {/* Danger Zone */}
        <motion.section
          custom={4}
          variants={sectionVariants}
          initial="hidden"
          animate="visible"
          className="rounded-2xl border border-red-200 bg-red-50/50 p-6 dark:border-red-700/20 dark:bg-red-700/5"
        >
          <h2 className="mb-2 flex items-center gap-2 text-lg font-semibold text-red-800 dark:text-red-400">
            <Trash2 className="h-5 w-5" />
            Zone dangereuse
          </h2>
          <p className="mb-4 text-sm text-red-800/80 dark:text-red-400/80">
            La suppression de votre compte est irréversible. Toutes vos données seront définitivement effacées.
          </p>
          <Button
            variant="danger"
            size="sm"
            icon={Trash2}
            onClick={() => toast.error("Cette action est irréversible. Contactez le support pour supprimer votre compte.")}
          >
            Supprimer mon compte
          </Button>
        </motion.section>
      </div>
    </div>
  );
}

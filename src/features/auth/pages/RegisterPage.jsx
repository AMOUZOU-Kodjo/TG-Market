import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import {
  User,
  Mail,
  Phone,
  Lock,
  Eye,
  EyeOff,
  UserPlus,
  CircleDot,
  ExternalLink,
  MapPin,
} from "lucide-react";
import toast from "react-hot-toast";
import { registerSchema } from "@/shared/utils/validators";
import { useAuth } from "@/shared/contexts/AuthContext";
import { useSiteSettings } from "@/shared/contexts/SiteSettingsContext";
import Input from "@/shared/ui/Input";
import Button from "@/shared/ui/Button";

const togoCities = [
  "Lomé",
  "Sokodé",
  "Kara",
  "Kpalimé",
  "Atakpamé",
  "Dapaong",
  "Tsévié",
  "Kétou",
  "Bassar",
  "Niamtougou",
];

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [socialLoading, setSocialLoading] = useState(null);
  const navigate = useNavigate();
  const { register: registerUser } = useAuth();
  const { siteName } = useSiteSettings();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
      city: "",
      acceptTerms: false,
    },
  });

  const onSubmit = async (data) => {
    // Ajouter le préfixe +228 au numéro de téléphone
    const phone = data.phone.startsWith("+228") ? data.phone : `+228${data.phone.replace(/\s+/g, "")}`;
    
    const result = await registerUser({
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      phone,
      password: data.password,
      city: data.city,
    });
    if (result.success) {
      toast.success(`Inscription réussie ! Bienvenue sur ${siteName} 🎉`);
      navigate("/");
    } else {
      toast.error(result.error || "Erreur lors de l'inscription");
    }
  };

  const handleSocialRegister = (provider) => {
    setSocialLoading(provider);
    toast.loading(`Inscription avec ${provider} en cours...`, {
      id: provider,
    });
    setTimeout(() => {
      toast.dismiss(provider);
      toast.error(`Inscription ${provider} pas encore disponible`);
      setSocialLoading(null);
    }, 1500);
  };

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-8"
      >
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white sm:text-3xl">
          Créer un compte
        </h1>
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
          Rejoignez la communauté {siteName} et commencez à acheter/vendre
        </p>
      </motion.div>

      <motion.form
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-4"
      >
        <div className="grid grid-cols-2 gap-3">
          <Input
            label="Prénom"
            placeholder="Kofi"
            leftIcon={User}
            error={errors.firstName?.message}
            autoComplete="given-name"
            {...register("firstName")}
          />
          <Input
            label="Nom"
            placeholder="Mensah"
            error={errors.lastName?.message}
            autoComplete="family-name"
            {...register("lastName")}
          />
        </div>

        <Input
          label="Email"
          type="email"
          placeholder="votre@email.com"
          leftIcon={Mail}
          error={errors.email?.message}
          autoComplete="email"
          {...register("email")}
        />

        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
            Téléphone
          </label>
          <div className="relative flex">
            <div className="flex items-center gap-2 rounded-l-xl border border-r-0 border-gray-300 bg-gray-50 px-3 dark:border-gray-700 dark:bg-gray-800">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                +228
              </span>
            </div>
            <input
              type="tel"
              placeholder="90 12 34 56"
              className="w-full rounded-r-xl border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 transition-colors placeholder:text-gray-400 focus:border-red-800 focus:outline-none focus:ring-2 focus:ring-red-800/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder:text-gray-500 dark:focus:border-red-800 dark:focus:ring-red-800/20"
              {...register("phone")}
            />
          </div>
          {errors.phone?.message && (
            <p className="mt-1.5 text-xs text-red-700 dark:text-red-400">
              {errors.phone.message}
            </p>
          )}
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
            Ville
          </label>
          <div className="relative">
            <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              <MapPin className="h-5 w-5" />
            </div>
            <select
              className="w-full appearance-none rounded-xl border border-gray-300 bg-white py-2.5 pl-10 pr-4 text-sm text-gray-900 transition-colors focus:border-red-800 focus:outline-none focus:ring-2 focus:ring-red-800/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:focus:border-red-800 dark:focus:ring-red-800/20"
              {...register("city")}
            >
              <option value="">Sélectionnez votre ville</option>
              {togoCities.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
          </div>
          {errors.city?.message && (
            <p className="mt-1.5 text-xs text-red-700 dark:text-red-400">
              {errors.city.message}
            </p>
          )}
        </div>

        <Input
          label="Mot de passe"
          type="password"
          placeholder="••••••••"
          leftIcon={Lock}
          rightIcon={showPassword ? EyeOff : Eye}
          error={errors.password?.message}
          helperText="Minimum 8 caractères, 1 majuscule, 1 minuscule, 1 chiffre"
          autoComplete="new-password"
          {...register("password")}
        />

        <Input
          label="Confirmer le mot de passe"
          type="password"
          placeholder="••••••••"
          leftIcon={Lock}
          rightIcon={showConfirmPassword ? EyeOff : Eye}
          error={errors.confirmPassword?.message}
          autoComplete="new-password"
          {...register("confirmPassword")}
        />

        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            className="mt-0.5 h-4 w-4 rounded border-gray-300 text-red-800 focus:ring-red-800 dark:border-gray-600"
            {...register("acceptTerms")}
          />
          <span className="text-sm text-gray-600 dark:text-gray-400">
            J'accepte les{" "}
            <span className="font-medium text-red-800 hover:underline">
              conditions d'utilisation
            </span>{" "}
            et la{" "}
            <span className="font-medium text-red-800 hover:underline">
              politique de confidentialité
            </span>
          </span>
        </label>
        {errors.acceptTerms?.message && (
          <p className="-mt-2 text-xs text-red-700 dark:text-red-400">
            {errors.acceptTerms.message}
          </p>
        )}

        <Button
          type="submit"
          fullWidth
          size="lg"
          loading={isSubmitting}
          icon={UserPlus}
        >
          Créer mon compte
        </Button>
      </motion.form>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mt-6"
      >
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200 dark:border-gray-700" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="bg-gray-50 px-4 text-gray-500 dark:bg-white dark:text-gray-500">
              ou
            </span>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-3">
          <Button
            type="button"
            variant="outline"
            size="lg"
            icon={CircleDot}
            onClick={() => handleSocialRegister("Google")}
            loading={socialLoading === "Google"}
          >
            Google
          </Button>
          <Button
            type="button"
            variant="outline"
            size="lg"
            icon={ExternalLink}
            onClick={() => handleSocialRegister("Facebook")}
            loading={socialLoading === "Facebook"}
          >
            Facebook
          </Button>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.25 }}
        className="mt-6 text-center"
      >
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Déjà un compte ?{" "}
          <Link
            to="/connexion"
            className="font-semibold text-red-800 hover:text-red-900 dark:text-red-700 dark:hover:text-red-400 transition-colors"
          >
            Se connecter
          </Link>
        </p>
      </motion.div>
    </div>
  );
}

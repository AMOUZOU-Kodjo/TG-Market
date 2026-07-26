import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { Mail, Lock, Eye, EyeOff, LogIn, CircleDot, ExternalLink } from "lucide-react";
import toast from "react-hot-toast";
import { loginSchema } from "@/shared/utils/validators";
import { useAuth } from "@/shared/contexts/AuthContext";
import Input from "@/shared/ui/Input";
import Button from "@/shared/ui/Button";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [socialLoading, setSocialLoading] = useState(null);
  const navigate = useNavigate();
  const { login } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data) => {
    const result = await login(data.email, data.password);
    if (result.success) {
      toast.success("Connexion réussie ! Bienvenue 🎉");
      navigate("/");
    } else {
      toast.error(result.error || "Erreur lors de la connexion");
    }
  };

  const handleSocialLogin = (provider) => {
    setSocialLoading(provider);
    toast.loading(`Connexion avec ${provider} en cours...`, {
      id: provider,
    });
    setTimeout(() => {
      toast.dismiss(provider);
      toast.error(`Connexion ${provider} pas encore disponible`);
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
          Bon retour parmi nous !
        </h1>
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
          Connectez-vous pour accéder à votre compte
        </p>
      </motion.div>

      <motion.form
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-5"
      >
        <Input
          label="Email ou téléphone"
          placeholder="votre@email.com"
          leftIcon={Mail}
          error={errors.email?.message}
          autoComplete="email"
          {...register("email")}
        />

        <Input
          label="Mot de passe"
          type="password"
          placeholder="••••••••"
          leftIcon={Lock}
          rightIcon={showPassword ? EyeOff : Eye}
          error={errors.password?.message}
          autoComplete="current-password"
          {...register("password")}
        />

        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="h-4 w-4 rounded border-gray-300 text-red-800 focus:ring-red-800 dark:border-gray-600"
            />
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Se souvenir de moi
            </span>
          </label>
          <Link
            to="/mot-de-passe-oublie"
            className="text-sm font-medium text-red-800 hover:text-red-900 dark:text-red-700 dark:hover:text-red-400 transition-colors"
          >
            Mot de passe oublié?
          </Link>
        </div>

        <Button
          type="submit"
          fullWidth
          size="lg"
          loading={isSubmitting}
          icon={LogIn}
        >
          Se connecter
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
            onClick={() => handleSocialLogin("Google")}
            loading={socialLoading === "Google"}
          >
            Google
          </Button>
          <Button
            type="button"
            variant="outline"
            size="lg"
            icon={ExternalLink}
            onClick={() => handleSocialLogin("Facebook")}
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
          Pas encore de compte ?{" "}
          <Link
            to="/inscription"
            className="font-semibold text-red-800 hover:text-red-900 dark:text-red-700 dark:hover:text-red-400 transition-colors"
          >
            S'inscrire
          </Link>
        </p>
      </motion.div>
    </div>
  );
}

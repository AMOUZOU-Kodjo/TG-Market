import { useGoogleLogin } from "@react-oauth/google";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { Mail, Lock, Eye, EyeOff, LogIn, CircleDot, ShieldCheck, ArrowLeft } from "lucide-react";
import toast from "react-hot-toast";
import { loginSchema } from "@/shared/utils/validators";
import { useAuth } from "@/shared/contexts/AuthContext";
import Input from "@/shared/ui/Input";
import Button from "@/shared/ui/Button";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [socialLoading, setSocialLoading] = useState(null);
  const [tempToken, setTempToken] = useState(null);
  const [twoFactorCode, setTwoFactorCode] = useState("");
  const [verifying, setVerifying] = useState(false);
  const navigate = useNavigate();
  const { login, verifyTwoFactor, googleLogin } = useAuth();

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
    const result = await login(data.email, data.password, rememberMe);
    if (result.requiresTwoFactor) {
      setTempToken(result.tempToken);
      toast("Un code de vérification est requis pour continuer");
    } else if (result.success) {
      toast.success("Connexion réussie ! Bienvenue 🎉");
      navigate("/");
    } else {
      toast.error(result.error || "Erreur lors de la connexion");
    }
  };

  const handleVerifyTwoFactor = async (e) => {
    e.preventDefault();
    if (twoFactorCode.length !== 6) return;
    setVerifying(true);
    const result = await verifyTwoFactor(tempToken, twoFactorCode, rememberMe);
    setVerifying(false);
    if (result.success) {
      toast.success("Connexion réussie ! Bienvenue 🎉");
      navigate("/");
    } else {
      toast.error(result.error || "Code invalide. Veuillez réessayer.");
      setTwoFactorCode("");
    }
  };

  const googleSignIn = useGoogleLogin({
    flow: "auth-code",
    onSuccess: async (codeResponse) => {
      setSocialLoading("Google");
      toast.loading("Connexion avec Google en cours...", { id: "google" });
      const result = await googleLogin(codeResponse.code, rememberMe);
      toast.dismiss("google");
      setSocialLoading(null);
      if (result.requiresTwoFactor) {
        setTempToken(result.tempToken);
        toast("Un code de vérification est requis pour continuer");
      } else if (result.success) {
        toast.success("Connexion réussie !");
        navigate("/");
      } else {
        toast.error(result.error || "Erreur de connexion Google");
      }
    },
    onError: () => {
      setSocialLoading(null);
      toast.error("Connexion Google annulée");
    },
  });

  const handleSocialLogin = (provider) => {
    if (provider === "Google") {
      googleSignIn();
    } else {
      setSocialLoading(provider);
      toast.loading(`Connexion avec ${provider} en cours...`, { id: provider });
      setTimeout(() => {
        toast.dismiss(provider);
        toast.error(`Connexion ${provider} pas encore disponible`);
        setSocialLoading(null);
      }, 1500);
    }
  };

  if (tempToken) {
    return (
      <div>
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white sm:text-3xl">
            Vérification en deux étapes
          </h1>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            Entrez le code à 6 chiffres de votre application d'authentification.
          </p>
        </motion.div>

        <motion.form
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          onSubmit={handleVerifyTwoFactor}
          className="space-y-5"
        >
          <div className="flex justify-center py-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-brand-100 dark:bg-brand-900/30">
              <ShieldCheck className="h-8 w-8 text-brand-600 dark:text-brand-400" />
            </div>
          </div>

          <Input
            label="Code de vérification"
            placeholder="••••••"
            value={twoFactorCode}
            onChange={(e) => setTwoFactorCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
            className="text-center font-mono text-xl tracking-widest"
            autoComplete="one-time-code"
            inputMode="numeric"
            maxLength={6}
            autoFocus
          />

          <Button
            type="submit"
            fullWidth
            size="lg"
            loading={verifying}
            icon={ShieldCheck}
            disabled={twoFactorCode.length !== 6}
          >
            Vérifier et se connecter
          </Button>

          <Button
            type="button"
            variant="ghost"
            fullWidth
            icon={ArrowLeft}
            onClick={() => setTempToken(null)}
          >
            Retour à la connexion
          </Button>
        </motion.form>
      </div>
    );
  }

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

        <div className="mt-6">
          <Button
            type="button"
            variant="outline"
            size="lg"
            fullWidth
            icon={CircleDot}
            onClick={() => handleSocialLogin("Google")}
            loading={socialLoading === "Google"}
          >
            Google
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

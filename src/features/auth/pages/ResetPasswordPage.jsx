import { useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { Mail, KeyRound, Lock, ArrowLeft, CheckCircle2 } from "lucide-react";
import toast from "react-hot-toast";
import { resetPasswordSchema } from "@/shared/utils/validators";
import { authApi } from "@/features/auth/services/auth.api";
import Input from "@/shared/ui/Input";
import Button from "@/shared/ui/Button";

export default function ResetPasswordPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [success, setSuccess] = useState(false);
  const prefilledEmail = location.state?.email || "";

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      email: prefilledEmail,
      otp: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data) => {
    try {
      await authApi.resetPassword({
        email: data.email,
        otp: data.otp,
        password: data.password,
      });
      setSuccess(true);
      toast.success("Mot de passe réinitialisé !");
    } catch (err) {
      toast.error(err.response?.data?.message || "Erreur lors de la réinitialisation");
    }
  };

  if (success) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
          className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-100 dark:bg-green-700/15"
        >
          <CheckCircle2 className="h-10 w-10 text-green-600" />
        </motion.div>
        <h1 className="mb-3 text-2xl font-bold text-gray-900 dark:text-white">
          Mot de passe réinitialisé !
        </h1>
        <p className="mx-auto mb-8 max-w-sm text-sm text-gray-500 dark:text-gray-400">
          Votre mot de passe a été modifié avec succès. Vous pouvez maintenant vous connecter.
        </p>
        <Button variant="primary" size="lg" onClick={() => navigate("/connexion")}>
          Se connecter
        </Button>
      </motion.div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <Link
          to="/mot-de-passe-oublie"
          className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-gray-500 transition-colors hover:text-brand-800 dark:text-gray-400 dark:hover:text-brand-700"
        >
          <ArrowLeft className="h-4 w-4" />
          Retour
        </Link>
        <h1 className="mt-4 text-2xl font-bold text-gray-900 dark:text-white sm:text-3xl">
          Réinitialisation
        </h1>
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
          Saisissez le code reçu par email et votre nouveau mot de passe.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <Input
          label="Adresse email"
          type="email"
          placeholder="votre@email.com"
          leftIcon={Mail}
          error={errors.email?.message}
          autoComplete="email"
          {...register("email")}
        />

        <Input
          label="Code de vérification"
          placeholder="123456"
          leftIcon={KeyRound}
          error={errors.otp?.message}
          maxLength={6}
          autoComplete="one-time-code"
          {...register("otp", { required: "Le code est requis" })}
        />

        <Input
          label="Nouveau mot de passe"
          type="password"
          placeholder="Au moins 8 caractères"
          leftIcon={Lock}
          error={errors.password?.message}
          autoComplete="new-password"
          {...register("password")}
        />

        <Input
          label="Confirmer le mot de passe"
          type="password"
          placeholder="Répétez le mot de passe"
          leftIcon={Lock}
          error={errors.confirmPassword?.message}
          autoComplete="new-password"
          {...register("confirmPassword")}
        />

        <Button type="submit" fullWidth size="lg" loading={isSubmitting} icon={KeyRound}>
          Réinitialiser le mot de passe
        </Button>
      </form>
    </div>
  );
}
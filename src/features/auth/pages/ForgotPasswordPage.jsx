import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, ArrowLeft, Send, CheckCircle2, KeyRound } from "lucide-react";
import toast from "react-hot-toast";
import { forgotPasswordSchema } from "@/shared/utils/validators";
import { authApi } from "@/features/auth/services/auth.api";
import Input from "@/shared/ui/Input";
import Button from "@/shared/ui/Button";

export default function ForgotPasswordPage() {
  const [emailSent, setEmailSent] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState("");
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    getValues,
  } = useForm({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (data) => {
    try {
      await authApi.forgotPassword({ email: data.email });
      setSubmittedEmail(data.email);
      setEmailSent(true);
      toast.success("Code de réinitialisation envoyé !");
    } catch (err) {
      toast.error(err.response?.data?.message || "Erreur lors de l'envoi du code");
    }
  };

  const handleResend = async () => {
    const email = getValues("email");
    if (!email) return;
    try {
      await authApi.forgotPassword({ email });
      toast.success("Code renvoyé avec succès !");
    } catch (err) {
      toast.error(err.response?.data?.message || "Erreur lors du renvoi");
    }
  };

  return (
    <div>
      <AnimatePresence mode="wait">
        {!emailSent ? (
          <motion.div
            key="form"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
          >
            <div className="mb-8">
              <Link
                to="/connexion"
                className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-gray-500 transition-colors hover:text-brand-800 dark:text-gray-400 dark:hover:text-brand-700"
              >
                <ArrowLeft className="h-4 w-4" />
                Retour à la connexion
              </Link>
              <h1 className="mt-4 text-2xl font-bold text-gray-900 dark:text-white sm:text-3xl">
                Mot de passe oublié ?
              </h1>
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                Entrez votre email et nous vous enverrons un lien pour
                réinitialiser votre mot de passe.
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

              <Button
                type="submit"
                fullWidth
                size="lg"
                loading={isSubmitting}
                icon={Send}
              >
                Envoyer le lien de réinitialisation
              </Button>
            </form>
          </motion.div>
        ) : (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{
                type: "spring",
                stiffness: 260,
                damping: 20,
                delay: 0.1,
              }}
              className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-brand-100 dark:bg-brand-700/15"
            >
              <CheckCircle2 className="h-10 w-10 text-brand-700" />
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mb-3 text-2xl font-bold text-gray-900 dark:text-white"
            >
              Email envoyé !
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              className="mx-auto mb-8 max-w-sm text-sm text-gray-500 dark:text-gray-400"
            >
              Nous avons envoyé un code de vérification à 6 chiffres à{" "}
              <span className="font-medium text-gray-900 dark:text-white">
                {submittedEmail}
              </span>
              . Vérifiez votre boîte de réception.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="space-y-3"
            >
              <Button
                variant="primary"
                fullWidth
                size="lg"
                icon={KeyRound}
                onClick={() => navigate("/reinitialisation", { state: { email: submittedEmail } })}
              >
                J'ai un code, réinitialiser
              </Button>
              <Button
                variant="secondary"
                fullWidth
                size="lg"
                onClick={handleResend}
              >
                Renvoyer le code
              </Button>
              <Button
                variant="ghost"
                fullWidth
                size="md"
                icon={ArrowLeft}
                onClick={() => setEmailSent(false)}
              >
                Modifier l'adresse email
              </Button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.35 }}
              className="mt-8 rounded-2xl bg-brand-50 p-4 dark:bg-brand-800/10"
            >
              <p className="text-sm text-brand-950 dark:text-brand-700">
                💡 Vous ne trouvez pas l'email ? Vérifiez vos spams ou
                contactez le support.
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

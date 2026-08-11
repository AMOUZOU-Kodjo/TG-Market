// import { useState } from "react";
// import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
// import { motion, AnimatePresence } from "framer-motion";
// import { useForm } from "react-hook-form";
// import {
//   User,
//   Mail,
//   Phone,
//   Lock,
//   Trash2,
//   Globe,
//   Eye,
//   EyeOff,
//   Save,
//   Camera,
//   Shield,
//   ShieldAlert,
//   ShieldCheck,
//   ChevronDown,
//   ChevronUp,
//   Smartphone,
//   Monitor,
//   Key,
//   History,
//   LogOut,
//   CheckCircle2,
//   AlertCircle,
//   X,
//   Fingerprint,
// } from "lucide-react";
// import { Link } from "react-router-dom";
// import Button from "@/shared/ui/Button";
// import Input from "@/shared/ui/Input";
// import Textarea from "@/shared/ui/Textarea";
// import Avatar from "@/shared/ui/Avatar";
// import { useAuth } from "@/shared/contexts/AuthContext";
// import { useKycStatus, useKycBadges } from "@/features/verification/hooks/useKyc";
// import { usersApi } from "@/features/profile/services/users.api";
// import { authApi } from "@/features/auth/services/auth.api";
// import toast from "react-hot-toast";
// import KycProgress from "@/features/verification/components/KycProgress";
// import BadgeGrid from "@/features/verification/components/BadgeGrid";
// import DocumentUpload from "@/features/verification/components/DocumentUpload";
// import PhoneVerification from "@/features/verification/components/PhoneVerification";

// const sectionVariants = {
//   hidden: { opacity: 0, y: 12 },
//   visible: (i) => ({
//     opacity: 1,
//     y: 0,
//     transition: { delay: i * 0.08, type: "spring", stiffness: 260, damping: 20 },
//   }),
// };

// function Toggle({ enabled, onChange, label, description }) {
//   return (
//     <div className="flex items-center justify-between py-3">
//       <div className="flex-1">
//         <p className="text-sm font-medium text-gray-900 dark:text-white">{label}</p>
//         {description && (
//           <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">{description}</p>
//         )}
//       </div>
//       <button
//         onClick={() => onChange(!enabled)}
//         className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors ${
//           enabled ? "bg-red-800" : "bg-gray-300 dark:bg-gray-600"
//         }`}
//       >
//         <span
//           className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform ${
//             enabled ? "translate-x-6" : "translate-x-1"
//           }`}
//         />
//       </button>
//     </div>
//   );
// }

// const mockSessions = [
//   {
//     id: 1,
//     device: "iPhone 15 Pro",
//     os: "iOS 17.4",
//     browser: "Safari",
//     location: "Lomé, Togo",
//     ip: "196.xxx.xxx.42",
//     lastActive: "Maintenant",
//     isCurrent: true,
//     icon: Smartphone,
//   },
//   {
//     id: 2,
//     device: "MacBook Pro",
//     os: "macOS Sonoma",
//     browser: "Chrome 122",
//     location: "Lomé, Togo",
//     ip: "196.xxx.xxx.18",
//     lastActive: "Il y a 2 heures",
//     isCurrent: false,
//     icon: Monitor,
//   },
//   {
//     id: 3,
//     device: "Samsung Galaxy S24",
//     os: "Android 14",
//     browser: "Chrome Mobile",
//     location: "Kara, Togo",
//     ip: "102.xxx.xxx.55",
//     lastActive: "Il y a 3 jours",
//     isCurrent: false,
//     icon: Smartphone,
//   },
// ];

// const mockLoginHistory = [
//   { id: 1, date: "25 juil. 2026 — 14:32", location: "Lomé, Togo", device: "iPhone 15 Pro", success: true },
//   { id: 2, date: "25 juil. 2026 — 09:15", location: "Lomé, Togo", device: "MacBook Pro", success: true },
//   { id: 3, date: "24 juil. 2026 — 21:08", location: "Lomé, Togo", device: "iPhone 15 Pro", success: true },
//   { id: 4, date: "24 juil. 2026 — 18:44", location: "Kara, Togo", device: "Samsung Galaxy S24", success: true },
//   { id: 5, date: "23 juil. 2026 — 07:12", location: "Lomé, Togo", device: "iPhone 15 Pro", success: false },
// ];

// export default function SettingsPage() {
//   const { user } = useAuth();
//   const qc = useQueryClient();
//   const userId = user?.id;

//   const { data: kycStatus } = useKycStatus();
//   const { data: badgesResponse } = useKycBadges();
//   const badges = badgesResponse?.data ?? [];

//   const { data: sessions = [] } = useQuery({
//     queryKey: ["sessions"],
//     queryFn: authApi.getSessions,
//     enabled: !!userId,
//   });

//   const { data: loginHistory = [] } = useQuery({
//     queryKey: ["loginHistory"],
//     queryFn: authApi.getLoginHistory,
//     enabled: !!userId,
//   });

//   const { mutate: updateProfile, isPending: updatingProfile } = useMutation({
//     mutationFn: usersApi.updateProfile,
//     onSuccess: () => {
//       toast.success("Profil mis à jour avec succès !");
//       qc.invalidateQueries({ queryKey: ["authMe"] });
//     },
//     onError: () => {
//       toast.error("Erreur lors de la mise à jour du profil");
//     },
//   });

//   const { mutate: changePassword, isPending: changingPassword } = useMutation({
//     mutationFn: usersApi.changePassword,
//     onSuccess: () => {
//       toast.success("Mot de passe modifié avec succès !");
//       resetPassword();
//     },
//     onError: () => {
//       toast.error("Erreur lors du changement de mot de passe");
//     },
//   });

//   const { mutate: revokeOtherSessions, isPending: revokingSessions } = useMutation({
//     mutationFn: authApi.revokeOtherSessions,
//     onSuccess: () => {
//       toast.success("Toutes les autres sessions ont été déconnectées.");
//     },
//     onError: () => {
//       toast.error("Erreur lors de la déconnexion des autres sessions");
//     },
//   });

//   const verificationSteps = [
//     { id: 1, title: "Téléphone", description: "Vérifier votre numéro +228", status: kycStatus?.phoneVerified ? "completed" : "pending", icon: "Phone" },
//     { id: 2, title: "Email", description: "Confirmer votre adresse email", status: kycStatus?.emailVerified ? "completed" : "pending", icon: "Mail" },
//     { id: 3, title: "Document d'identité", description: "Carte d'identité, passeport ou permis", status: kycStatus?.documentStatus === "approved" ? "completed" : kycStatus?.documentStatus === "pending" ? "pending" : "pending", icon: "FileCheck" },
//     { id: 4, title: "Selfie", description: "Photo de vous avec le document", status: kycStatus?.selfieStatus === "approved" ? "completed" : "pending", icon: "Camera" },
//   ];
//   const [isDarkMode, setIsDarkMode] = useState(false);
//   const [notifications, setNotifications] = useState({
//     email: true,
//     push: true,
//     sms: false,
//   });
//   const [privacy, setPrivacy] = useState({
//     profileVisibility: "public",
//     showPhone: false,
//     showLocation: true,
//   });
//   const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
//   const [show2FASetup, setShow2FASetup] = useState(false);
//   const [showLoginHistory, setShowLoginHistory] = useState(false);
//   const [showPassword, setShowPassword] = useState({
//     current: false,
//     new: false,
//     confirm: false,
//   });
//   const [activeTab, setActiveTab] = useState("profile");

//   const {
//     register,
//     handleSubmit,
//     formState: { errors, isDirty },
//   } = useForm({
//     defaultValues: {
//       name: user?.name || "",
//       email: user?.email || "",
//       phone: user?.phone || "",
//       bio: user?.bio || "",
//     },
//   });

//   const {
//     register: registerPassword,
//     handleSubmit: handlePasswordSubmit,
//     formState: { errors: passwordErrors },
//     reset: resetPassword,
//   } = useForm();

//   const onProfileSubmit = (data) => {
//     updateProfile(data);
//   };

//   const onPasswordSubmit = (data) => {
//     changePassword(data);
//   };

//   return (
//     <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6">
//       <div className="mb-8">
//         <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Paramètres</h1>
//         <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
//           Gérez votre profil, vos préférences et la sécurité de votre compte.
//         </p>
//       </div>

//       {/* Tabs Navigation */}
//       <div className="mb-6 flex overflow-x-auto gap-2 border-b border-gray-200 dark:border-gray-800 pb-2">
//         {[
//           { id: "profile", label: "Profil", icon: User },
//           { id: "security", label: "Sécurité", icon: Shield },
//           { id: "preferences", label: "Préférences", icon: Globe },
//           { id: "privacy", label: "Confidentialité", icon: Eye },
//           { id: "kyc", label: "Vérification", icon: ShieldCheck },
//         ].map((tab) => {
//           const Icon = tab.icon;
//           return (
//             <button
//               key={tab.id}
//               onClick={() => setActiveTab(tab.id)}
//               className={`flex shrink-0 items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors ${
//                 activeTab === tab.id
//                   ? "bg-red-800 text-white"
//                   : "text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
//               }`}
//             >
//               <Icon className="h-4 w-4" />
//               {tab.label}
//             </button>
//           );
//         })}
//       </div>

//       <div className="space-y-8">
//         {/* Profile Section */}
//         {activeTab === "profile" && (
//         <motion.section
//           custom={0}
//           variants={sectionVariants}
//           initial="hidden"
//           animate="visible"
//           className="rounded-2xl border border-gray-100 bg-white p-6 dark:border-gray-800 dark:bg-gray-800"
//         >
//           <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-gray-900 dark:text-white">
//             <User className="h-5 w-5 text-red-800" />
//             Profil
//           </h2>

//           <div className="mb-6 flex items-center gap-4">
//             <div className="relative">
//               <Avatar src={user?.avatar} name={user?.name} size="xl" />
//               <button className="absolute bottom-0 right-0 rounded-full bg-red-800 p-1.5 text-white shadow-lg transition-transform hover:scale-110">
//                 <Camera className="h-3.5 w-3.5" />
//               </button>
//             </div>
//             <div>
//               <p className="font-medium text-gray-900 dark:text-white">{user?.name}</p>
//               <p className="text-sm text-gray-500 dark:text-gray-400">{user?.email}</p>
//               <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">
//                 Membre depuis janvier 2023
//               </p>
//             </div>
//           </div>

//           <form onSubmit={handleSubmit(onProfileSubmit)} className="space-y-4">
//             <div className="grid gap-4 sm:grid-cols-2">
//               <Input
//                 label="Nom complet"
//                 icon={User}
//                 {...register("name", { required: "Le nom est requis" })}
//                 error={errors.name?.message}
//               />
//               <Input
//                 label="Email"
//                 type="email"
//                 icon={Mail}
//                 {...register("email", { required: "L'email est requis", pattern: { value: /^\S+@\S+$/i, message: "Email invalide" } })}
//                 error={errors.email?.message}
//               />
//             </div>
//             <Input
//               label="Téléphone"
//               icon={Phone}
//               prefix="+228"
//               {...register("phone")}
//             />
//             <Textarea
//               label="Bio"
//               placeholder="Parlez-nous de vous..."
//               rows={3}
//               maxLength={200}
//               showCount
//               {...register("bio")}
//             />
//             <div className="flex justify-end">
//               <Button type="submit" icon={Save} disabled={!isDirty}>
//                 Enregistrer les modifications
//               </Button>
//             </div>
//           </form>
//         </motion.section>
//         )}
//         {/* Sécurité Section */}
//         {activeTab === "security" && (
//         <motion.section
//           custom={1}
//           variants={sectionVariants}
//           initial="hidden"
//           animate="visible"
//           className="rounded-2xl border border-gray-100 bg-white p-6 dark:border-gray-800 dark:bg-gray-800"
//         >
//           <h2 className="mb-1 flex items-center gap-2 text-lg font-semibold text-gray-900 dark:text-white">
//             <Lock className="h-5 w-5 text-red-800" />
//             Sécurité
//           </h2>
//           <p className="mb-6 text-sm text-gray-500 dark:text-gray-400">
//             Protégez votre compte avec un mot de passe solide et l'authentification à deux facteurs.
//           </p>

//           {/* Mot de passe */}
//           <div className="mb-6">
//             <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-gray-900 dark:text-white">
//               <Key className="h-4 w-4 text-gray-400" />
//               Mot de passe
//             </h3>
//             <form onSubmit={handlePasswordSubmit(onPasswordSubmit)} className="space-y-4">
//               <div className="relative">
//                 <Input
//                   label="Mot de passe actuel"
//                   type={showPassword.current ? "text" : "password"}
//                   icon={Lock}
//                   {...registerPassword("currentPassword", { required: "Le mot de passe actuel est requis" })}
//                   error={passwordErrors.currentPassword?.message}
//                 />
//                 <button
//                   type="button"
//                   onClick={() => setShowPassword((p) => ({ ...p, current: !p.current }))}
//                   className="absolute right-3 top-[38px] text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
//                 >
//                   {showPassword.current ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
//                 </button>
//               </div>
//               <div className="grid gap-4 sm:grid-cols-2">
//                 <div className="relative">
//                   <Input
//                     label="Nouveau mot de passe"
//                     type={showPassword.new ? "text" : "password"}
//                     icon={Lock}
//                     {...registerPassword("newPassword", {
//                       required: "Le nouveau mot de passe est requis",
//                       minLength: { value: 8, message: "Minimum 8 caractères" },
//                     })}
//                     error={passwordErrors.newPassword?.message}
//                   />
//                   <button
//                     type="button"
//                     onClick={() => setShowPassword((p) => ({ ...p, new: !p.new }))}
//                     className="absolute right-3 top-[38px] text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
//                   >
//                     {showPassword.new ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
//                   </button>
//                 </div>
//                 <div className="relative">
//                   <Input
//                     label="Confirmer le mot de passe"
//                     type={showPassword.confirm ? "text" : "password"}
//                     icon={Lock}
//                     {...registerPassword("confirmPassword", {
//                       required: "Veuillez confirmer le mot de passe",
//                     })}
//                     error={passwordErrors.confirmPassword?.message}
//                   />
//                   <button
//                     type="button"
//                     onClick={() => setShowPassword((p) => ({ ...p, confirm: !p.confirm }))}
//                     className="absolute right-3 top-[38px] text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
//                   >
//                     {showPassword.confirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
//                   </button>
//                 </div>
//               </div>
//               <div className="flex items-center justify-between">
//                 <p className="text-xs text-gray-400 dark:text-gray-500">
//                   Minimum 8 caractères, avec majuscule, minuscule et chiffre.
//                 </p>
//                 <Button type="submit" variant="secondary" size="sm" icon={Shield}>
//                   Modifier le mot de passe
//                 </Button>
//               </div>
//             </form>
//           </div>

//           <div className="border-t border-gray-100 dark:border-gray-800" />

//           {/* Authentification à deux facteurs */}
//           <div className="my-6">
//             <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-gray-900 dark:text-white">
//               <Fingerprint className="h-4 w-4 text-gray-400" />
//               Authentification à deux facteurs (2FA)
//             </h3>
//             <div className="flex items-center justify-between rounded-xl border border-gray-100 bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-800/50">
//               <div className="flex items-center gap-3">
//                 <div className={`flex h-10 w-10 items-center justify-center rounded-full ${twoFactorEnabled ? "bg-brand-100 dark:bg-brand-900/30" : "bg-gray-200 dark:bg-gray-700"}`}>
//                   {twoFactorEnabled ? (
//                     <ShieldCheck className="h-5 w-5 text-brand-600 dark:text-brand-400" />
//                   ) : (
//                     <ShieldAlert className="h-5 w-5 text-gray-400" />
//                   )}
//                 </div>
//                 <div>
//                   <p className="text-sm font-medium text-gray-900 dark:text-white">
//                     {twoFactorEnabled ? "Authentification à deux facteurs activée" : "Authentification à deux facteurs désactivée"}
//                   </p>
//                   <p className="text-xs text-gray-500 dark:text-gray-400">
//                     {twoFactorEnabled
//                       ? "Un code de vérification est requis pour se connecter."
//                       : "Ajoutez une couche de sécurité supplémentaire à votre compte."}
//                   </p>
//                 </div>
//               </div>
//               <button
//                 onClick={() => {
//                   if (twoFactorEnabled) {
//                     setTwoFactorEnabled(false);
//                     setShow2FASetup(false);
//                     toast.success("2FA désactivée.");
//                   } else {
//                     setShow2FASetup(true);
//                   }
//                 }}
//                 className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors ${
//                   twoFactorEnabled ? "bg-brand-600" : "bg-gray-300 dark:bg-gray-600"
//                 }`}
//               >
//                 <span
//                   className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform ${
//                     twoFactorEnabled ? "translate-x-6" : "translate-x-1"
//                   }`}
//                 />
//               </button>
//             </div>

//             <AnimatePresence>
//               {show2FASetup && !twoFactorEnabled && (
//                 <motion.div
//                   initial={{ height: 0, opacity: 0 }}
//                   animate={{ height: "auto", opacity: 1 }}
//                   exit={{ height: 0, opacity: 0 }}
//                   className="overflow-hidden"
//                 >
//                   <div className="mt-4 rounded-xl border border-yellow-200 bg-yellow-50 p-5 dark:border-yellow-800/50 dark:bg-yellow-900/10">
//                     <h4 className="mb-2 text-sm font-semibold text-yellow-800 dark:text-yellow-300">
//                       Activer la 2FA par SMS
//                     </h4>
//                     <p className="mb-4 text-xs text-yellow-700 dark:text-yellow-400">
//                       Un code de vérification sera envoyé à votre numéro chaque tentative de connexion.
//                     </p>
//                     <div className="flex items-center gap-3">
//                       <Input
//                         placeholder="Entrez le code reçu par SMS"
//                         className="max-w-xs bg-white dark:bg-gray-800"
//                       />
//                       <Button
//                         size="sm"
//                         onClick={() => {
//                           setTwoFactorEnabled(true);
//                           setShow2FASetup(false);
//                           toast.success("2FA activée avec succès !");
//                         }}
//                       >
//                         Vérifier
//                       </Button>
//                       <Button
//                         size="sm"
//                         variant="ghost"
//                         onClick={() => setShow2FASetup(false)}
//                       >
//                         Annuler
//                       </Button>
//                     </div>
//                   </div>
//                 </motion.div>
//               )}
//             </AnimatePresence>
//           </div>

//           <div className="border-t border-gray-100 dark:border-gray-800" />

//           {/* Sessions actives */}
//           <div className="my-6">
//             <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-gray-900 dark:text-white">
//               <Monitor className="h-4 w-4 text-gray-400" />
//               Sessions actives
//             </h3>
//             <div className="space-y-3">
//               {sessions.map((session) => {
//                 const Icon = session.icon;
//                 return (
//                   <div
//                     key={session.id}
//                     className={`flex items-center justify-between rounded-xl border p-4 ${
//                       session.isCurrent
//                         ? "border-brand-200 bg-brand-50/50 dark:border-brand-800/30 dark:bg-brand-900/10"
//                         : "border-gray-100 bg-gray-50 dark:border-gray-800 dark:bg-gray-800/30"
//                     }`}
//                   >
//                     <div className="flex items-center gap-3">
//                       <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-sm dark:bg-gray-800">
//                         <Icon className="h-5 w-5 text-gray-600 dark:text-gray-400" />
//                       </div>
//                       <div>
//                         <div className="flex items-center gap-2">
//                           <p className="text-sm font-medium text-gray-900 dark:text-white">
//                             {session.device}
//                           </p>
//                           {session.isCurrent && (
//                             <span className="inline-flex items-center gap-1 rounded-full bg-brand-100 px-2 py-0.5 text-[10px] font-semibold text-brand-700 dark:bg-brand-900/30 dark:text-brand-400">
//                               <span className="h-1.5 w-1.5 rounded-full bg-brand-500" />
//                               Actuelle
//                             </span>
//                           )}
//                         </div>
//                         <p className="text-xs text-gray-500 dark:text-gray-400">
//                           {session.os} · {session.browser} · {session.location}
//                         </p>
//                         <p className="text-xs text-gray-400 dark:text-gray-500">
//                           IP: {session.ip} · {session.lastActive}
//                         </p>
//                       </div>
//                     </div>
//                     {!session.isCurrent && (
//                       <button
//                         onClick={() => toast.success("Session déconnectée.")}
//                         className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20 dark:hover:text-red-400"
//                         title="Déconnecter cette session"
//                       >
//                         <LogOut className="h-4 w-4" />
//                       </button>
//                     )}
//                   </div>
//                 );
//               })}
//             </div>
//             <button
//               onClick={() => revokeOtherSessions()}
//               disabled={revokingSessions}
//               className="mt-3 text-xs font-medium text-red-700 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
//             >
//               Déconnecter toutes les autres sessions
//             </button>
//           </div>

//           <div className="border-t border-gray-100 dark:border-gray-800" />

//           {/* Historique de connexion */}
//           <div className="mt-6">
//             <button
//               onClick={() => setShowLoginHistory(!showLoginHistory)}
//               className="flex w-full items-center justify-between text-sm font-semibold text-gray-900 dark:text-white"
//             >
//               <span className="flex items-center gap-2">
//                 <History className="h-4 w-4 text-gray-400" />
//                 Historique de connexion
//               </span>
//               {showLoginHistory ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
//             </button>

//             <AnimatePresence>
//               {showLoginHistory && (
//                 <motion.div
//                   initial={{ height: 0, opacity: 0 }}
//                   animate={{ height: "auto", opacity: 1 }}
//                   exit={{ height: 0, opacity: 0 }}
//                   className="overflow-hidden"
//                 >
//                   <div className="mt-3 space-y-2">
//                     {loginHistory.map((entry) => (
//                       <div
//                         key={entry.id}
//                         className="flex items-center justify-between rounded-lg border border-gray-100 bg-gray-50 px-4 py-3 dark:border-gray-800 dark:bg-gray-800/30"
//                       >
//                         <div className="flex items-center gap-3">
//                           {entry.success ? (
//                             <CheckCircle2 className="h-4 w-4 text-brand-500" />
//                           ) : (
//                             <X className="h-4 w-4 text-red-500" />
//                           )}
//                           <div>
//                             <p className="text-sm text-gray-900 dark:text-white">{entry.date}</p>
//                             <p className="text-xs text-gray-500 dark:text-gray-400">
//                               {entry.location} · {entry.device}
//                             </p>
//                           </div>
//                         </div>
//                         <span
//                           className={`text-xs font-medium ${
//                             entry.success
//                               ? "text-brand-600 dark:text-brand-400"
//                               : "text-red-600 dark:text-red-400"
//                           }`}
//                         >
//                           {entry.success ? "Réussi" : "Échoué"}
//                         </span>
//                       </div>
//                     ))}
//                   </div>
//                 </motion.div>
//               )}
//             </AnimatePresence>
//           </div>
//         </motion.section>
//         )}
//         {/* Preferences Section */}
//         {activeTab === "preferences" && (
//         <motion.section
//           custom={2}
//           variants={sectionVariants}
//           initial="hidden"
//           animate="visible"
//           className="rounded-2xl border border-gray-100 bg-white p-6 dark:border-gray-800 dark:bg-gray-800"
//         >
//           <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-gray-900 dark:text-white">
//             <Globe className="h-5 w-5 text-red-800" />
//             Préférences
//           </h2>

//           <div className="divide-y divide-gray-100 dark:divide-gray-800">
//             <div className="flex items-center justify-between py-3">
//               <div>
//                 <p className="text-sm font-medium text-gray-900 dark:text-white">Langue</p>
//                 <p className="text-xs text-gray-500 dark:text-gray-400">Langue d'affichage de l'application</p>
//               </div>
//               <select className="rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-800 dark:text-white">
//                 <option>Français</option>
//                 <option>English</option>
//               </select>
//             </div>
//             <div className="flex items-center justify-between py-3">
//               <div>
//                 <p className="text-sm font-medium text-gray-900 dark:text-white">Devise</p>
//                 <p className="text-xs text-gray-500 dark:text-gray-400">Devise d'affichage des prix</p>
//               </div>
//               <select className="rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-800 dark:text-white">
//                 <option>FCFA</option>
//                 <option>EUR</option>
//                 <option>USD</option>
//               </select>
//             </div>
//           </div>

//           <div className="mt-2 divide-y divide-gray-100 dark:divide-gray-800">
//             <Toggle
//               label="Notifications par email"
//               description="Recevez les alertes importantes par email"
//               enabled={notifications.email}
//               onChange={(v) => setNotifications((p) => ({ ...p, email: v }))}
//             />
//             <Toggle
//               label="Notifications push"
//               description="Recevez les notifications sur votre appareil"
//               enabled={notifications.push}
//               onChange={(v) => setNotifications((p) => ({ ...p, push: v }))}
//             />
//             <Toggle
//               label="Notifications SMS"
//               description="Recevez les alertes critiques par SMS"
//               enabled={notifications.sms}
//               onChange={(v) => setNotifications((p) => ({ ...p, sms: v }))}
//             />
//             <Toggle
//               label="Mode sombre"
//               description="Activez le thème sombre pour plus de confort"
//               enabled={isDarkMode}
//               onChange={setIsDarkMode}
//             />
//           </div>
//         </motion.section>
//         )}
//         {/* Privacy Section */}
//         {activeTab === "privacy" && (
//         <motion.section
//           custom={3}
//           variants={sectionVariants}
//           initial="hidden"
//           animate="visible"
//           className="rounded-2xl border border-gray-100 bg-white p-6 dark:border-gray-800 dark:bg-gray-800"
//         >
//           <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-gray-900 dark:text-white">
//             <Eye className="h-5 w-5 text-red-800" />
//             Confidentialité
//           </h2>

//           <div className="divide-y divide-gray-100 dark:divide-gray-800">
//             <div className="flex items-center justify-between py-3">
//               <div>
//                 <p className="text-sm font-medium text-gray-900 dark:text-white">Visibilité du profil</p>
//                 <p className="text-xs text-gray-500 dark:text-gray-400">Qui peut voir votre profil</p>
//               </div>
//               <select
//                 value={privacy.profileVisibility}
//                 onChange={(e) => setPrivacy((p) => ({ ...p, profileVisibility: e.target.value }))}
//                 className="rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-800 dark:text-white"
//               >
//                 <option value="public">Public</option>
//                 <option value="contacts">Mes contacts</option>
//                 <option value="private">Privé</option>
//               </select>
//             </div>
//             <Toggle
//               label="Afficher mon numéro de téléphone"
//               description="Visible sur votre profil par les autres utilisateurs"
//               enabled={privacy.showPhone}
//               onChange={(v) => setPrivacy((p) => ({ ...p, showPhone: v }))}
//             />
//             <Toggle
//               label="Afficher ma localisation"
//               description="Affiche votre ville dans vos annonces"
//               enabled={privacy.showLocation}
//               onChange={(v) => setPrivacy((p) => ({ ...p, showLocation: v }))}
//             />
//           </div>
//          </motion.section>
//         )}
//         {/* Verification / KYC Section */}
//         {activeTab === "kyc" && (
//         <motion.section
//           custom={4}
//           variants={sectionVariants}
//           initial="hidden"
//           animate="visible"
//           className="rounded-2xl border border-gray-100 bg-white p-6 dark:border-gray-800 dark:bg-gray-800"
//         >
//           <h2 className="mb-2 flex items-center gap-2 text-lg font-semibold text-gray-900 dark:text-white">
//             <ShieldCheck className="h-5 w-5 text-red-800" />
//             Vérification du compte (KYC)
//           </h2>
//           <p className="mb-6 text-sm text-gray-500 dark:text-gray-400">
//             Vérifiez votre identité pour obtenir un badge de confiance et accéder à plus de fonctionnalités.
//           </p>

//           <KycProgress steps={verificationSteps} />

//           <div className="mt-6 space-y-6">
//             <PhoneVerification />

//             <div>
//               <h3 className="mb-3 text-sm font-semibold text-gray-900 dark:text-white">
//                 Document d'identité
//               </h3>
//               {kycStatus?.documentStatus === "none" || !kycStatus?.documentStatus ? (
//                 <DocumentUpload
//                   onUpload={(file) => toast.success("Document téléchargé avec succès !")}
//                 />
//               ) : kycStatus?.documentStatus === "pending" ? (
//                 <div className="flex items-center gap-3 rounded-xl border border-yellow-200 bg-yellow-50 p-4 dark:border-yellow-800 dark:bg-yellow-900/20">
//                   <AlertCircle className="h-5 w-5 text-yellow-600" />
//                   <div>
//                     <p className="text-sm font-medium text-yellow-800 dark:text-yellow-300">Document en cours de vérification</p>
//                     <p className="text-xs text-yellow-600 dark:text-yellow-400">Nous examinerons votre document sous 24-48h.</p>
//                   </div>
//                 </div>
//               ) : kycStatus?.documentStatus === "approved" ? (
//                 <div className="flex items-center gap-3 rounded-xl border border-brand-200 bg-brand-50 p-4 dark:border-brand-800 dark:bg-brand-900/20">
//                   <CheckCircle2 className="h-5 w-5 text-brand-600" />
//                   <p className="text-sm font-medium text-brand-800 dark:text-brand-300">Document vérifié avec succès</p>
//                 </div>
//               ) : (
//                 <div className="flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-900/20">
//                   <AlertCircle className="h-5 w-5 text-red-600" />
//                   <div>
//                     <p className="text-sm font-medium text-red-800 dark:text-red-300">Document rejeté</p>
//                     <p className="text-xs text-red-600 dark:text-red-400">{kycStatus?.rejectionReason || "Veuillez soumettre un nouveau document."}</p>
//                     <DocumentUpload
//                       onUpload={(file) => toast.success("Nouveau document téléchargé !")}
//                     />
//                   </div>
//                 </div>
//               )}
//             </div>

//             <div>
//               <h3 className="mb-3 text-sm font-semibold text-gray-900 dark:text-white">
//                 Vos badges
//               </h3>
//               <BadgeGrid badges={badges} />
//             </div>
//           </div>
//         </motion.section>
//           )}
//         {/* Danger Zone */}
//         <motion.section
//           custom={5}
//           variants={sectionVariants}
//           initial="hidden"
//           animate="visible"
//           className="rounded-2xl border border-red-200 bg-red-50/50 p-6 dark:border-red-700/20 dark:bg-red-700/5"
//         >
//           <h2 className="mb-2 flex items-center gap-2 text-lg font-semibold text-red-800 dark:text-red-400">
//             <Trash2 className="h-5 w-5" />
//             Zone dangereuse
//           </h2>
//           <p className="mb-4 text-sm text-red-800/80 dark:text-red-400/80">
//             La suppression de votre compte est irréversible. Toutes vos données seront définitivement effacées.
//           </p>
//           <Button
//             variant="danger"
//             size="sm"
//             icon={Trash2}
//             onClick={() => toast.error("Cette action est irréversible. Contactez le support pour supprimer votre compte.")}
//           >
//              Supprimer mon compte
//            </Button>
//          </motion.section>
//          )}
//        </div>
//      </div>
//   );
// }

import { useState, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { useTheme } from "@/shared/contexts/ThemeContext";
import {
  User,
  Mail,
  Phone,
  Lock,
  Trash2,
  Globe,
  Eye,
  EyeOff,
  Save,
  Camera,
  Shield,
  ShieldAlert,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  Smartphone,
  Monitor,
  Key,
  History,
  LogOut,
  CheckCircle2,
  AlertCircle,
  X,
  Fingerprint,
} from "lucide-react";
import { Link } from "react-router-dom";
import Button from "@/shared/ui/Button";
import Input from "@/shared/ui/Input";
import Textarea from "@/shared/ui/Textarea";
import Avatar from "@/shared/ui/Avatar";
import { useAuth } from "@/shared/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useKycStatus, useKycBadges } from "@/features/verification/hooks/useKyc";
import { usersApi } from "@/features/profile/services/users.api";
import { authApi } from "@/features/auth/services/auth.api";
import toast from "react-hot-toast";
import KycProgress from "@/features/verification/components/KycProgress";
import BadgeGrid from "@/features/verification/components/BadgeGrid";
import DocumentUpload from "@/features/verification/components/DocumentUpload";
import PhoneVerification from "@/features/verification/components/PhoneVerification";
import EmailVerification from "@/features/verification/components/EmailVerification";
import BackButton from "@/shared/ui/BackButton";
import { useSubmitKyc } from "@/features/verification/hooks/useKyc";

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

function parseUserAgent(ua) {
  if (!ua) return { browser: "Inconnu", os: "Inconnu", device: "Appareil inconnu" };

  let browser = "Autre";
  if (ua.includes("Edg/")) browser = "Edge";
  else if (ua.includes("OPR/") || ua.includes("Opera")) browser = "Opera";
  else if (ua.includes("Chrome") && !ua.includes("Edg/")) browser = "Chrome";
  else if (ua.includes("Safari") && !ua.includes("Chrome")) browser = "Safari";
  else if (ua.includes("Firefox")) browser = "Firefox";

  let os = "Autre";
  if (ua.includes("Android")) {
    const version = ua.match(/Android\s([\d.]+)/);
    os = `Android${version ? " " + version[1] : ""}`;
  } else if (ua.includes("iPhone") || ua.includes("iPad")) {
    const version = ua.match(/OS\s([\d_]+)/);
    os = `iOS${version ? " " + version[1].replace(/_/g, ".") : ""}`;
  } else if (ua.includes("Windows NT 10")) os = "Windows 10";
  else if (ua.includes("Windows NT 11") || ua.includes("Windows NT 10.0")) os = "Windows 11";
  else if (ua.includes("Mac OS X")) {
    const version = ua.match(/Mac OS X ([\d_]+)/);
    os = `macOS${version ? " " + version[1].replace(/_/g, ".") : ""}`;
  } else if (ua.includes("Linux")) os = "Linux";

  let device = "Desktop";
  if (ua.includes("Mobile") || ua.includes("Android") || ua.includes("iPhone")) device = "Mobile";
  else if (ua.includes("iPad") || ua.includes("Tablet")) device = "Tablette";

  return { browser, os, device };
}

function getDeviceIcon(userAgent) {
  if (!userAgent) return Smartphone;
  const ua = userAgent.toLowerCase();
  if (ua.includes("mobile") || ua.includes("android") || ua.includes("iphone")) return Smartphone;
  return Monitor;
}

export default function SettingsPage() {
  const { user, refreshUser, logout } = useAuth();
  const navigate = useNavigate();
  const qc = useQueryClient();
  const userId = user?.id;

  const { data: kycStatus } = useKycStatus();
  const { data: badgesResponse } = useKycBadges();
  const badges = badgesResponse?.data ?? [];

  const { data: sessions = [] } = useQuery({
    queryKey: ["sessions"],
    queryFn: authApi.getSessions,
    enabled: !!userId,
  });

  const { data: loginHistory = [] } = useQuery({
    queryKey: ["loginHistory"],
    queryFn: authApi.getLoginHistory,
    enabled: !!userId,
  });

  const { mutate: updateProfile, isPending: updatingProfile } = useMutation({
    mutationFn: usersApi.updateProfile,
    onSuccess: () => {
      toast.success("Profil mis à jour avec succès !");
      refreshUser();
    },
    onError: () => {
      toast.error("Erreur lors de la mise à jour du profil");
    },
  });

  const { mutate: changePassword, isPending: changingPassword } = useMutation({
    mutationFn: usersApi.changePassword,
    onSuccess: () => {
      toast.success("Mot de passe modifié avec succès !");
      resetPassword();
    },
    onError: () => {
      toast.error("Erreur lors du changement de mot de passe");
    },
  });

  const { mutate: revokeOtherSessions, isPending: revokingSessions } = useMutation({
    mutationFn: authApi.revokeOtherSessions,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["sessions"] });
      toast.success("Toutes les autres sessions ont été déconnectées.");
    },
    onError: () => {
      toast.error("Erreur lors de la déconnexion des autres sessions");
    },
  });

  const { data: twoFactorStatus } = useQuery({
    queryKey: ["twoFactorStatus"],
    queryFn: authApi.get2FAStatus,
    enabled: !!userId,
  });
  const twoFactorEnabled = twoFactorStatus?.enabled ?? false;

  const { mutate: generate2FASecret, data: twoFactorSecretData, isPending: generatingSecret, reset: reset2FASecret } = useMutation({
    mutationFn: authApi.generate2FASecret,
    onError: () => {
      toast.error("Erreur lors de la génération du code 2FA");
    },
  });

  const { mutate: enable2FA, isPending: enabling2FA } = useMutation({
    mutationFn: authApi.enable2FA,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["twoFactorStatus"] });
      setShow2FASetup(false);
      setTwoFactorCode("");
      reset2FASecret();
      toast.success("2FA activée avec succès !");
    },
    onError: () => {
      toast.error("Code invalide. Veuillez réessayer.");
    },
  });

  const { mutate: disable2FA, isPending: disabling2FA } = useMutation({
    mutationFn: authApi.disable2FA,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["twoFactorStatus"] });
      setShowDisablePrompt(false);
      setDisablePassword("");
      toast.success("2FA désactivée.");
    },
    onError: () => {
      toast.error("Mot de passe incorrect.");
    },
  });

  const { mutate: savePreferences } = useMutation({
    mutationFn: usersApi.updatePreferences,
    onSuccess: () => {
      toast.success("Préférences sauvegardées !");
      refreshUser();
    },
    onError: () => {
      toast.error("Erreur lors de la sauvegarde des préférences");
    },
  });

  const { mutate: deleteAccount, isPending: deletingAccount } = useMutation({
    mutationFn: authApi.deleteAccount,
    onSuccess: () => {
      toast.success("Compte supprimé avec succès.");
      setTimeout(() => { logout(); navigate("/"); }, 2000);
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || "Erreur lors de la suppression du compte");
    },
  });

  const { mutate: savePrivacy } = useMutation({
    mutationFn: usersApi.updatePrivacy,
    onSuccess: () => {
      toast.success("Confidentialité sauvegardée !");
      refreshUser();
    },
    onError: () => {
      toast.error("Erreur lors de la sauvegarde de la confidentialité");
    },
  });

  const { mutate: submitKyc, isPending: submittingKyc } = useSubmitKyc();
  const [documentType, setDocumentType] = useState("cni");
  const [documentFrontUrl, setDocumentFrontUrl] = useState(null);
  const [documentBackUrl, setDocumentBackUrl] = useState(null);
  const [selfieUrl, setSelfieUrl] = useState(null);

  const handleSubmitKyc = () => {
    if (!documentFrontUrl || !selfieUrl) {
      toast.error("Veuillez ajouter le recto du document et un selfie");
      return;
    }
    submitKyc({
      documentType,
      documentFrontUrl,
      documentBackUrl: documentBackUrl || undefined,
      selfieUrl,
    });
  };

  const verificationSteps = [
    {
      id: 1,
      title: "Téléphone",
      description: "Vérifier votre numéro +228",
      status: kycStatus?.phoneVerified ? "completed" : "pending",
      icon: "Phone",
    },
    {
      id: 2,
      title: "Email",
      description: "Confirmer votre adresse email",
      status: kycStatus?.emailVerified ? "completed" : "pending",
      icon: "Mail",
    },
    {
      id: 3,
      title: "Document d'identité",
      description: "Carte d'identité, passeport ou permis",
      status:
        kycStatus?.documentStatus === "approved"
          ? "completed"
          : kycStatus?.documentStatus === "pending"
            ? "pending"
            : "pending",
      icon: "FileCheck",
    },
    {
      id: 4,
      title: "Selfie",
      description: "Photo de vous avec le document",
      status: kycStatus?.selfieStatus === "approved" ? "completed" : "pending",
      icon: "Camera",
    },
  ];
  const { isDark: isDarkMode, toggleTheme } = useTheme();
  const [preferredLanguage, setPreferredLanguage] = useState(user?.preferredLanguage || "fr");
  const [preferredCurrency, setPreferredCurrency] = useState(user?.preferredCurrency || "FCFA");
  const [notifications, setNotifications] = useState({
    email: user?.notificationsEmail ?? true,
    push: user?.notificationsPush ?? true,
    sms: user?.notificationsSms ?? false,
  });
  const [privacy, setPrivacy] = useState({
    profileVisibility: user?.profileVisibility || "public",
    showPhone: user?.showPhone ?? false,
    showLocation: user?.showLocation ?? true,
  });
  const [twoFactorCode, setTwoFactorCode] = useState("");
  const [show2FASetup, setShow2FASetup] = useState(false);
  const [showDisablePrompt, setShowDisablePrompt] = useState(false);
  const [disablePassword, setDisablePassword] = useState("");
  const [showLoginHistory, setShowLoginHistory] = useState(false);
  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const [activeTab, setActiveTab] = useState("profile");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm({
    defaultValues: {
      name: user?.name || "",
      email: user?.email || "",
      phone: user?.phone || "",
      bio: user?.bio || "",
    },
  });

  const {
    register: registerPassword,
    handleSubmit: handlePasswordSubmit,
    formState: { errors: passwordErrors },
    reset: resetPassword,
  } = useForm();

  const onProfileSubmit = (data) => {
    updateProfile(data);
  };

  const onPasswordSubmit = (data) => {
    changePassword(data);
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6">
      <BackButton />
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Paramètres</h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Gérez votre profil, vos préférences et la sécurité de votre compte.
        </p>
      </div>

      {/* Tabs Navigation */}
      <div className="mb-6 flex overflow-x-auto gap-2 border-b border-gray-200 dark:border-gray-800 pb-2">
        {[
          { id: "profile", label: "Profil", icon: User },
          { id: "security", label: "Sécurité", icon: Shield },
          { id: "preferences", label: "Préférences", icon: Globe },
          { id: "privacy", label: "Confidentialité", icon: Eye },
          { id: "kyc", label: "Vérification", icon: ShieldCheck },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex shrink-0 items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? "bg-red-800 text-white"
                  : "text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
              }`}
            >
              <Icon className="h-4 w-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      <div className="space-y-8">
        {/* Profile Section */}
        {activeTab === "profile" && (
          <motion.section
            custom={0}
            variants={sectionVariants}
            initial="hidden"
            animate="visible"
            className="rounded-2xl border border-gray-100 bg-white p-6 dark:border-gray-800 dark:bg-gray-800"
          >
            <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-gray-900 dark:text-white">
              <User className="h-5 w-5 text-red-800" />
              Profil
            </h2>

            <div className="mb-6 flex items-center gap-4">
              <div className="relative">
                <Avatar src={user?.avatar} name={user?.name} size="xl" />
                <button className="absolute bottom-0 right-0 rounded-full bg-red-800 p-1.5 text-white shadow-lg transition-transform hover:scale-110">
                  <Camera className="h-3.5 w-3.5" />
                </button>
              </div>
              <div>
                <p className="font-medium text-gray-900 dark:text-white">{user?.name}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">{user?.email}</p>
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
                  {...register("email", {
                    required: "L'email est requis",
                    pattern: { value: /^\S+@\S+$/i, message: "Email invalide" },
                  })}
                  error={errors.email?.message}
                />
              </div>
              <Input label="Téléphone" icon={Phone} prefix="+228" {...register("phone")} />
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
        )}

        {/* Sécurité Section */}
        {activeTab === "security" && (
          <motion.section
            custom={1}
            variants={sectionVariants}
            initial="hidden"
            animate="visible"
            className="rounded-2xl border border-gray-100 bg-white p-6 dark:border-gray-800 dark:bg-gray-800"
          >
            <h2 className="mb-1 flex items-center gap-2 text-lg font-semibold text-gray-900 dark:text-white">
              <Lock className="h-5 w-5 text-red-800" />
              Sécurité
            </h2>
            <p className="mb-6 text-sm text-gray-500 dark:text-gray-400">
              Protégez votre compte avec un mot de passe solide et l'authentification à deux
              facteurs.
            </p>

            {/* Mot de passe */}
            <div className="mb-6">
              <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-gray-900 dark:text-white">
                <Key className="h-4 w-4 text-gray-400" />
                Mot de passe
              </h3>
              <form onSubmit={handlePasswordSubmit(onPasswordSubmit)} className="space-y-4">
                <div className="relative">
                  <Input
                    label="Mot de passe actuel"
                    type={showPassword.current ? "text" : "password"}
                    icon={Lock}
                    {...registerPassword("currentPassword", {
                      required: "Le mot de passe actuel est requis",
                    })}
                    error={passwordErrors.currentPassword?.message}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((p) => ({ ...p, current: !p.current }))}
                    className="absolute right-3 top-[38px] text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  >
                    {showPassword.current ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="relative">
                    <Input
                      label="Nouveau mot de passe"
                      type={showPassword.new ? "text" : "password"}
                      icon={Lock}
                      {...registerPassword("newPassword", {
                        required: "Le nouveau mot de passe est requis",
                        minLength: { value: 8, message: "Minimum 8 caractères" },
                      })}
                      error={passwordErrors.newPassword?.message}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((p) => ({ ...p, new: !p.new }))}
                      className="absolute right-3 top-[38px] text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                    >
                      {showPassword.new ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                  <div className="relative">
                    <Input
                      label="Confirmer le mot de passe"
                      type={showPassword.confirm ? "text" : "password"}
                      icon={Lock}
                      {...registerPassword("confirmPassword", {
                        required: "Veuillez confirmer le mot de passe",
                      })}
                      error={passwordErrors.confirmPassword?.message}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((p) => ({ ...p, confirm: !p.confirm }))}
                      className="absolute right-3 top-[38px] text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                    >
                      {showPassword.confirm ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-xs text-gray-400 dark:text-gray-500">
                    Minimum 8 caractères, avec majuscule, minuscule et chiffre.
                  </p>
                  <Button type="submit" variant="secondary" size="sm" icon={Shield}>
                    Modifier le mot de passe
                  </Button>
                </div>
              </form>
            </div>

            <div className="border-t border-gray-100 dark:border-gray-800" />

            {/* Authentification à deux facteurs */}
            <div className="my-6">
              <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-gray-900 dark:text-white">
                <Fingerprint className="h-4 w-4 text-gray-400" />
                Authentification à deux facteurs (2FA)
              </h3>
              <div className="flex items-center justify-between rounded-xl border border-gray-100 bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-800/50">
                <div className="flex items-center gap-3">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-full ${twoFactorEnabled ? "bg-brand-100 dark:bg-brand-900/30" : "bg-gray-200 dark:bg-gray-700"}`}
                  >
                    {twoFactorEnabled ? (
                      <ShieldCheck className="h-5 w-5 text-brand-600 dark:text-brand-400" />
                    ) : (
                      <ShieldAlert className="h-5 w-5 text-gray-400" />
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {twoFactorEnabled
                        ? "Authentification à deux facteurs activée"
                        : "Authentification à deux facteurs désactivée"}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {twoFactorEnabled
                        ? "Un code de vérification est requis pour se connecter."
                        : "Ajoutez une couche de sécurité supplémentaire à votre compte."}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    if (twoFactorEnabled) {
                      setShowDisablePrompt(true);
                    } else {
                      generate2FASecret();
                      setShow2FASetup(true);
                    }
                  }}
                  className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors ${
                    twoFactorEnabled ? "bg-brand-600" : "bg-gray-300 dark:bg-gray-600"
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform ${
                      twoFactorEnabled ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>

              {/* Disable 2FA — password confirmation */}
              <AnimatePresence>
                {showDisablePrompt && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-5 dark:border-red-800/50 dark:bg-red-900/10">
                      <h4 className="mb-2 text-sm font-semibold text-red-800 dark:text-red-300">
                        Désactiver la 2FA
                      </h4>
                      <p className="mb-4 text-xs text-red-700 dark:text-red-400">
                        Veuillez entrer votre mot de passe pour confirmer la désactivation.
                      </p>
                      <div className="flex items-center gap-3">
                        <Input
                          type="password"
                          placeholder="Votre mot de passe"
                          value={disablePassword}
                          onChange={(e) => setDisablePassword(e.target.value)}
                          className="max-w-xs bg-white dark:bg-gray-800"
                        />
                        <Button
                          size="sm"
                          onClick={() => disable2FA({ password: disablePassword })}
                          disabled={disabling2FA || !disablePassword}
                        >
                          {disabling2FA ? "Désactivation..." : "Confirmer"}
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => { setShowDisablePrompt(false); setDisablePassword(""); }}>
                          Annuler
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Enable 2FA — QR code + TOTP */}
              <AnimatePresence>
                {show2FASetup && !twoFactorEnabled && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="mt-4 rounded-xl border border-brand-200 bg-brand-50 p-5 dark:border-brand-800/50 dark:bg-brand-900/10">
                      {generatingSecret ? (
                        <p className="text-sm text-brand-700 dark:text-brand-400">Génération du code...</p>
                      ) : twoFactorSecretData?.qrCode ? (
                        <>
                          <h4 className="mb-2 text-sm font-semibold text-brand-800 dark:text-brand-300">
                            Activer la 2FA
                          </h4>
                          <p className="mb-4 text-xs text-brand-700 dark:text-brand-400">
                            Scannez ce QR code avec Google Authenticator ou une application compatible, puis saisissez le code à 6 chiffres généré.
                          </p>
                          <div className="mb-4 flex justify-center">
                            <img
                              src={twoFactorSecretData.qrCode}
                              alt="QR Code 2FA"
                              className="h-40 w-40 rounded-lg"
                            />
                          </div>
                          {twoFactorSecretData.secret && (
                            <p className="mb-4 text-center text-xs text-gray-500 dark:text-gray-400">
                              Code secret : <code className="rounded bg-gray-200 px-2 py-0.5 font-mono text-sm dark:bg-gray-700">{twoFactorSecretData.secret}</code>
                            </p>
                          )}
                          <div className="flex items-center gap-3">
                            <Input
                              placeholder="Code à 6 chiffres"
                              value={twoFactorCode}
                              onChange={(e) => setTwoFactorCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                              className="max-w-[140px] bg-white text-center font-mono text-lg dark:bg-gray-800"
                              maxLength={6}
                            />
                            <Button
                              size="sm"
                              onClick={() => enable2FA({ token: twoFactorCode })}
                              disabled={enabling2FA || twoFactorCode.length !== 6}
                            >
                              {enabling2FA ? "Vérification..." : "Vérifier"}
                            </Button>
                            <Button size="sm" variant="ghost" onClick={() => { setShow2FASetup(false); reset2FASecret(); setTwoFactorCode(""); }}>
                              Annuler
                            </Button>
                          </div>
                        </>
                      ) : (
                        <p className="text-sm text-red-600">Erreur lors de la génération du code. Veuillez réessayer.</p>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="border-t border-gray-100 dark:border-gray-800" />

            {/* Sessions actives */}
            <div className="my-6">
              <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-gray-900 dark:text-white">
                <Monitor className="h-4 w-4 text-gray-400" />
                Sessions actives
              </h3>
              <div className="space-y-3">
                {sessions.map((session) => {
                  const Icon = getDeviceIcon(session.device);
                  const { browser, os, device } = parseUserAgent(session.device);
                  return (
                    <div
                      key={session.id}
                      className={`flex items-center justify-between rounded-xl border p-4 ${
                        session.isCurrent
                          ? "border-brand-200 bg-brand-50/50 dark:border-brand-800/30 dark:bg-brand-900/10"
                          : "border-gray-100 bg-gray-50 dark:border-gray-800 dark:bg-gray-800/30"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-sm dark:bg-gray-800">
                          <Icon className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                              {browser} · {device}
                            </p>
                            {session.isCurrent && (
                              <span className="inline-flex items-center gap-1 rounded-full bg-brand-100 px-2 py-0.5 text-[10px] font-semibold text-brand-700 dark:bg-brand-900/30 dark:text-brand-400">
                                <span className="h-1.5 w-1.5 rounded-full bg-brand-500" />
                                Actuelle
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {browser} · {os} · {session.location}
                          </p>
                          <p className="text-xs text-gray-400 dark:text-gray-500">
                            IP: {session.ip} · {session.lastActive}
                          </p>
                        </div>
                      </div>
                      {!session.isCurrent && (
                        <button
                          onClick={() => toast.success("Session déconnectée.")}
                          className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20 dark:hover:text-red-400"
                          title="Déconnecter cette session"
                        >
                          <LogOut className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
              <button
                onClick={() => revokeOtherSessions()}
                disabled={revokingSessions}
                className="mt-3 text-xs font-medium text-red-700 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
              >
                Déconnecter toutes les autres sessions
              </button>
            </div>

            <div className="border-t border-gray-100 dark:border-gray-800" />

            {/* Historique de connexion */}
            <div className="mt-6">
              <button
                onClick={() => setShowLoginHistory(!showLoginHistory)}
                className="flex w-full items-center justify-between text-sm font-semibold text-gray-900 dark:text-white"
              >
                <span className="flex items-center gap-2">
                  <History className="h-4 w-4 text-gray-400" />
                  Historique de connexion
                </span>
                {showLoginHistory ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </button>

              <AnimatePresence>
                {showLoginHistory && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="mt-3 space-y-2">
                      {loginHistory.map((entry) => (
                        <div
                          key={entry.id}
                          className="flex items-center justify-between rounded-lg border border-gray-100 bg-gray-50 px-4 py-3 dark:border-gray-800 dark:bg-gray-800/30"
                        >
                          <div className="flex items-center gap-3">
                            {entry.success ? (
                              <CheckCircle2 className="h-4 w-4 text-brand-500" />
                            ) : (
                              <X className="h-4 w-4 text-red-500" />
                            )}
                            <div>
                              <p className="text-sm text-gray-900 dark:text-white">{entry.date}</p>
                              <p className="text-xs text-gray-500 dark:text-gray-400">
                                {entry.location} · {entry.device}
                              </p>
                            </div>
                          </div>
                          <span
                            className={`text-xs font-medium ${
                              entry.success
                                ? "text-brand-600 dark:text-brand-400"
                                : "text-red-600 dark:text-red-400"
                            }`}
                          >
                            {entry.success ? "Réussi" : "Échoué"}
                          </span>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.section>
        )}

        {/* Preferences Section */}
        {activeTab === "preferences" && (
          <motion.section
            custom={2}
            variants={sectionVariants}
            initial="hidden"
            animate="visible"
            className="rounded-2xl border border-gray-100 bg-white p-6 dark:border-gray-800 dark:bg-gray-800"
          >
            <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-gray-900 dark:text-white">
              <Globe className="h-5 w-5 text-red-800" />
              Préférences
            </h2>

            <div className="divide-y divide-gray-100 dark:divide-gray-800">
              <div className="flex items-center justify-between py-3">
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">Langue</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Langue d'affichage de l'application
                  </p>
                </div>
                <select
                  value={preferredLanguage}
                  onChange={(e) => {
                    const v = e.target.value;
                    setPreferredLanguage(v);
                    savePreferences({ preferredLanguage: v });
                  }}
                  className="rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                >
                  <option value="fr">Français</option>
                  <option value="ee">Ewe</option>
                  <option value="en">English</option>
                </select>
              </div>
              <div className="flex items-center justify-between py-3">
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">Devise</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Devise d'affichage des prix
                  </p>
                </div>
                <select
                  value={preferredCurrency}
                  onChange={(e) => {
                    const v = e.target.value;
                    setPreferredCurrency(v);
                    savePreferences({ preferredCurrency: v });
                  }}
                  className="rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                >
                  <option value="FCFA">FCFA</option>
                  <option value="EUR">EUR</option>
                  <option value="USD">USD</option>
                </select>
              </div>
            </div>

            <div className="mt-2 divide-y divide-gray-100 dark:divide-gray-800">
              <Toggle
                label="Notifications par email"
                description="Recevez les alertes importantes par email"
                enabled={notifications.email}
                onChange={(v) => {
                  setNotifications((p) => ({ ...p, email: v }));
                  savePreferences({ notificationsEmail: v });
                }}
              />
              <Toggle
                label="Notifications push"
                description="Recevez les notifications sur votre appareil"
                enabled={notifications.push}
                onChange={(v) => {
                  setNotifications((p) => ({ ...p, push: v }));
                  savePreferences({ notificationsPush: v });
                }}
              />
              <Toggle
                label="Notifications SMS"
                description="Recevez les alertes critiques par SMS"
                enabled={notifications.sms}
                onChange={(v) => {
                  setNotifications((p) => ({ ...p, sms: v }));
                  savePreferences({ notificationsSms: v });
                }}
              />
              <Toggle
                label="Mode sombre"
                description="Activez le thème sombre pour plus de confort"
                enabled={isDarkMode}
                onChange={toggleTheme}
              />
            </div>
          </motion.section>
        )}

        {/* Privacy Section */}
        {activeTab === "privacy" && (
          <motion.section
            custom={3}
            variants={sectionVariants}
            initial="hidden"
            animate="visible"
            className="rounded-2xl border border-gray-100 bg-white p-6 dark:border-gray-800 dark:bg-gray-800"
          >
            <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-gray-900 dark:text-white">
              <Eye className="h-5 w-5 text-red-800" />
              Confidentialité
            </h2>

            <div className="divide-y divide-gray-100 dark:divide-gray-800">
              <div className="flex items-center justify-between py-3">
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    Visibilité du profil
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Qui peut voir votre profil
                  </p>
                </div>
                <select
                  value={privacy.profileVisibility}
                  onChange={(e) => {
                    const v = e.target.value;
                    setPrivacy((p) => ({ ...p, profileVisibility: v }));
                    savePrivacy({ profileVisibility: v });
                  }}
                  className="rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-800 dark:text-white"
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
                onChange={(v) => {
                  setPrivacy((p) => ({ ...p, showPhone: v }));
                  savePrivacy({ showPhone: v });
                }}
              />
              <Toggle
                label="Afficher ma localisation"
                description="Affiche votre ville dans vos annonces"
                enabled={privacy.showLocation}
                onChange={(v) => {
                  setPrivacy((p) => ({ ...p, showLocation: v }));
                  savePrivacy({ showLocation: v });
                }}
              />
            </div>
          </motion.section>
        )}

        {/* Verification / KYC Section */}
        {activeTab === "kyc" && (
          <motion.section
            custom={4}
            variants={sectionVariants}
            initial="hidden"
            animate="visible"
            className="rounded-2xl border border-gray-100 bg-white p-6 dark:border-gray-800 dark:bg-gray-800"
          >
            <h2 className="mb-2 flex items-center gap-2 text-lg font-semibold text-gray-900 dark:text-white">
              <ShieldCheck className="h-5 w-5 text-red-800" />
              Vérification du compte (KYC)
            </h2>
            <p className="mb-6 text-sm text-gray-500 dark:text-gray-400">
              Vérifiez votre identité pour obtenir un badge de confiance et accéder à plus de
              fonctionnalités.
            </p>

            <KycProgress steps={verificationSteps} />

            <div className="mt-6 space-y-6">
              <PhoneVerification phone={user?.phone} verified={kycStatus?.phoneVerified} />

              <EmailVerification email={user?.email} verified={kycStatus?.emailVerified} />

              <div>
                <h3 className="mb-3 text-sm font-semibold text-gray-900 dark:text-white">
                  Document d'identité
                </h3>
                {kycStatus?.documentStatus === "approved" ? (
                  <div className="flex items-center gap-3 rounded-xl border border-brand-200 bg-brand-50 p-4 dark:border-brand-800 dark:bg-brand-900/20">
                    <CheckCircle2 className="h-5 w-5 text-brand-600" />
                    <p className="text-sm font-medium text-brand-800 dark:text-brand-300">
                      Document vérifié avec succès
                    </p>
                  </div>
                ) : kycStatus?.documentStatus === "pending" ? (
                  <div className="flex items-center gap-3 rounded-xl border border-yellow-200 bg-yellow-50 p-4 dark:border-yellow-800 dark:bg-yellow-900/20">
                    <AlertCircle className="h-5 w-5 text-yellow-600" />
                    <div>
                      <p className="text-sm font-medium text-yellow-800 dark:text-yellow-300">
                        Document en cours de vérification
                      </p>
                      <p className="text-xs text-yellow-600 dark:text-yellow-400">
                        Nous examinerons votre document sous 24-48h.
                      </p>
                    </div>
                  </div>
                ) : (
                  <>
                    {kycStatus?.documentStatus === "rejected" && (
                      <div className="mb-4 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-900/20">
                        <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-600" />
                        <div>
                          <p className="text-sm font-medium text-red-800 dark:text-red-300">
                            Document rejeté
                          </p>
                          <p className="text-xs text-red-600 dark:text-red-400">
                            {kycStatus?.rejectionReason || "Veuillez soumettre un nouveau document."}
                          </p>
                        </div>
                      </div>
                    )}

                    <div className="space-y-4">
                      <div>
                        <p className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                          Type de document
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {[
                            { value: "cni", label: "Carte Nationale d'Identité" },
                            { value: "peris", label: "Permis de conduire" },
                            { value: "passeport", label: "Passeport" },
                          ].map((opt) => (
                            <button
                              key={opt.value}
                              type="button"
                              onClick={() => setDocumentType(opt.value)}
                              className={`rounded-lg border px-3 py-2 text-sm font-medium transition-colors ${
                                documentType === opt.value
                                  ? "border-red-800 bg-red-800 text-white"
                                  : "border-gray-300 bg-white text-gray-700 hover:border-red-800/40 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300"
                              }`}
                            >
                              {opt.label}
                            </button>
                          ))}
                        </div>
                      </div>

                      <DocumentUpload
                        title="Recto du document"
                        onUpload={(file, fileUrl) => setDocumentFrontUrl(fileUrl)}
                      />
                      <DocumentUpload
                        title="Verso du document (optionnel)"
                        onUpload={(file, fileUrl) => setDocumentBackUrl(fileUrl)}
                      />
                      <DocumentUpload
                        title="Selfie avec votre document"
                        hint="Prenez une photo de vous tenant votre document près de votre visage."
                        accept="image/*"
                        onUpload={(file, fileUrl) => setSelfieUrl(fileUrl)}
                      />

                      <Button
                        onClick={handleSubmitKyc}
                        loading={submittingKyc}
                        disabled={!documentFrontUrl || !selfieUrl}
                        className="w-full"
                      >
                        Soumettre ma demande de vérification
                      </Button>
                      <p className="text-center text-xs text-gray-400">
                        {!documentFrontUrl || !selfieUrl
                          ? "Ajoutez le recto du document et un selfie pour soumettre."
                          : "Votre demande sera examinée sous 24-48h."}
                      </p>
                    </div>
                  </>
                )}
              </div>

              <div>
                <h3 className="mb-3 text-sm font-semibold text-gray-900 dark:text-white">
                  Vos badges
                </h3>
                <BadgeGrid badges={badges} />
              </div>
            </div>
          </motion.section>
        )}

        {/* Danger Zone */}
        <motion.section
          custom={5}
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
            La suppression de votre compte est irréversible. Toutes vos données seront
            définitivement effacées.
          </p>
          <Button
            variant="danger"
            size="sm"
            icon={Trash2}
            onClick={() => setShowDeleteConfirm(true)}
          >
            Supprimer mon compte
          </Button>
        </motion.section>
      </div>

      {/* Delete Account Confirmation Modal */}
      <AnimatePresence>
        {showDeleteConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
            onClick={() => { if (!deletingAccount) { setShowDeleteConfirm(false); setDeleteConfirmText("") } }}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md rounded-2xl bg-white p-6 dark:bg-gray-800"
            >
              <h3 className="text-lg font-bold text-red-800 dark:text-red-400">Supprimer mon compte</h3>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                Cette action est <strong>irréversible</strong>. Toutes vos données (annonces, messages, favoris) seront définitivement effacées.
              </p>
              <p className="mt-4 text-sm font-medium text-gray-700 dark:text-gray-300">
                Tapez <strong className="text-red-700">SUPPRIMER</strong> pour confirmer :
              </p>
              <input
                value={deleteConfirmText}
                onChange={(e) => setDeleteConfirmText(e.target.value)}
                placeholder="SUPPRIMER"
                className="mt-2 w-full rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:border-red-800 focus:outline-none focus:ring-2 focus:ring-red-800/20 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              />
              <div className="mt-6 flex items-center gap-3">
                <Button
                  variant="danger"
                  className="flex-1"
                  icon={Trash2}
                  loading={deletingAccount}
                  disabled={deleteConfirmText !== "SUPPRIMER"}
                  onClick={() => deleteAccount()}
                >
                  {deletingAccount ? "Suppression..." : "Confirmer la suppression"}
                </Button>
                <Button
                  variant="ghost"
                  className="flex-1"
                  onClick={() => { setShowDeleteConfirm(false); setDeleteConfirmText("") }}
                  disabled={deletingAccount}
                >
                  Annuler
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
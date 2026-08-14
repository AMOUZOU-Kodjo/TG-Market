// import { useState, useCallback } from "react";
// import { useNavigate } from "react-router-dom";
// import { motion, AnimatePresence } from "framer-motion";
// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import toast from "react-hot-toast";
// import {
//   ChevronLeft,
//   ChevronRight,
//   Save,
//   Eye,
//   Send,
//   CheckCircle2,
//   Share2,
//   ExternalLink,
//   MessageCircle,
//   Link2,
//   Copy,
//   MapPin,
//   Smartphone,
//   Car,
//   Laptop,
//   Sofa,
//   Shirt,
//   Home,
//   Refrigerator,
//   Gamepad2,
//   Dumbbell,
//   Sparkles,
//   Baby,
//   Apple,
//   Briefcase,
//   PawPrint,
//   BookOpen,
//   Music,
//   Palette,
//   TreePine,
//   Wrench,
//   Package,
// } from "lucide-react";
// import { cn } from "@/shared/utils/cn";
// import Button from "@/shared/ui/Button";
// import Input from "@/shared/ui/Input";
// import Textarea from "@/shared/ui/Textarea";
// import Select from "@/shared/ui/Select";
// import StepIndicator from "@/shared/ui/StepIndicator";
// import ListingFormStep from "@/features/listings/components/ListingFormStep";
// import PhotoUploader from "@/features/listings/components/PhotoUploader";
// import ListingPreview from "@/features/listings/components/ListingPreview";
// import { useCategories } from "@/features/categories/hooks/useCategories";
// import CategoryPicker from "@/features/categories/components/CategoryPicker";
// import { useCreateProduct } from "@/features/products/hooks/useProducts";
// import api from "@/shared/services/api";
// import { CITIES, PRODUCT_CONDITIONS, MAX_IMAGES_PER_LISTING } from "@/shared/constants";
// import { createListingSchema } from "@/shared/utils/validators";

// const WIZARD_STEPS = [
//   { label: "Catégorie", icon: "📁" },
//   { label: "Infos", icon: "📝" },
//   { label: "Photos", icon: "📷" },
//   { label: "Prix", icon: "💰" },
//   { label: "Lieu", icon: "📍" },
//   { label: "Aperçu", icon: "👁️" },
//   { label: "Publier", icon: "🚀" },
// ];

// const defaultFormValues = {
//   title: "",
//   description: "",
//   price: "",
//   negotiable: false,
//   category: "",
//   condition: "",
//   city: "",
//   neighborhood: "",
//   brand: "",
//   images: [],
//   deliveryAvailable: false,
//   deliveryPrice: "",
// };

// export default function CreateListingPage() {
//   const navigate = useNavigate();
//   const { data: categories = [] } = useCategories();
//   const createProduct = useCreateProduct();
//   const [currentStep, setCurrentStep] = useState(0);
//   const [photos, setPhotos] = useState([]);
//   const [selectedCategory, setSelectedCategory] = useState(null);
//   const [isPublished, setIsPublished] = useState(false);
//   const [publishedProductId, setPublishedProductId] = useState(null);
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   const {
//     register,
//     watch,
//     setValue,
//     trigger,
//     formState: { errors },
//   } = useForm({
//     resolver: zodResolver(createListingSchema),
//     defaultValues: defaultFormValues,
//     mode: "onChange",
//   });

//   const formValues = watch();

//   async function uploadImages(files) {
//     const formData = new FormData();
//     files.forEach((file) => formData.append("files", file));
//     const res = await api.post("/upload/images", formData);
//     return res.data.data.map((img) => img.url);
//   }

//   const validateStep = useCallback(
//     async (step) => {
//       switch (step) {
//         case 0:
//           if (!selectedCategory) {
//             toast.error("Veuillez sélectionner une sous-catégorie");
//             return false;
//           }
//           return true;
//         case 1:
//           return await trigger(["title", "description", "condition"]);
//         case 2:
//           if (photos.length === 0) {
//             toast.error("Ajoutez au moins une photo");
//             return false;
//           }
//           return true;
//         case 3:
//           return await trigger(["price"]);
//         case 4:
//           return await trigger(["city"]);
//         default:
//           return true;
//       }
//     },
//     [selectedCategory, photos.length, trigger]
//   );

//   const handleNext = useCallback(async () => {
//     const valid = await validateStep(currentStep);
//     if (valid && currentStep < WIZARD_STEPS.length - 1) {
//       setCurrentStep((s) => s + 1);
//     }
//   }, [currentStep, validateStep]);

//   const handleBack = useCallback(() => {
//     if (currentStep > 0) {
//       setCurrentStep((s) => s - 1);
//     }
//   }, [currentStep]);

//   const handlePublish = useCallback(async () => {
//     if (!selectedCategory) {
//       toast.error("Veuillez sélectionner une catégorie");
//       return;
//     }
//     if (photos.length === 0) {
//       toast.error("Ajoutez au moins une photo");
//       return;
//     }

//     setIsSubmitting(true);
//     try {
//       const filesToUpload = photos.filter((p) => p.file).map((p) => p.file);
//       const existingUrls = photos.filter((p) => !p.file).map((p) => p.url);

//       let uploadedUrls = [];
//       if (filesToUpload.length > 0) {
//         uploadedUrls = await uploadImages(filesToUpload);
//       }

//       const allImages = [...existingUrls, ...uploadedUrls];

//       const payload = {
//         categoryId: selectedCategory.id,
//         title: formValues.title,
//         description: formValues.description,
//         condition: formValues.condition,
//         brand: formValues.brand || undefined,
//         tags: formValues.tags || [],
//         images: allImages,
//         price: Math.round(Number(formValues.price)),
//         negotiable: formValues.negotiable,
//         deliveryAvailable: formValues.deliveryAvailable,
//         deliveryPrice: formValues.deliveryAvailable
//           ? Math.round(Number(formValues.deliveryPrice) || 0) || undefined
//           : undefined,
//         city: formValues.city,
//         neighborhood: formValues.neighborhood || undefined,
//       };

//       const result = await createProduct.mutateAsync(payload);
//       setPublishedProductId(result?.id);
//       setIsPublished(true);
//       toast.success("Votre annonce a été publiée !");
//     } catch (err) {
//       const msg = err?.response?.data?.message || err?.message || "Erreur lors de la publication";
//       toast.error(msg);
//     } finally {
//       setIsSubmitting(false);
//     }
//   }, [selectedCategory, photos, formValues, createProduct]);

//   const handleSaveDraft = useCallback(() => {
//     toast.success("Brouillon sauvegardé !");
//   }, []);

//   const handleShare = useCallback((platform) => {
//     toast.success(`Partage via ${platform} !`);
//   }, []);

//   const renderStep = () => {
//     switch (currentStep) {
//       case 0: //Case de Choix des catégories de l'articles
//         return (
//           <ListingFormStep
//             title="Choisissez une catégorie"
//             description="Sélectionnez la catégorie la plus appropriée pour votre annonce"
//           >
//             <CategoryPicker
//               categories={categories}
//               value={selectedCategory}
//               onChange={(cat) => {
//                 setSelectedCategory(cat);
//                 setValue("category", cat?.slug ?? "");
//               }}
//               error={errors.category?.message}
//             />
//           </ListingFormStep>
//         );

//       case 1: //Case de sélection des informations sur l'article
//         return (
//           <ListingFormStep
//             title="Informations sur l'article"
//             description="Décrivez votre article en détail pour attirer l'attention des acheteurs"
//           >
//             <div className="space-y-5">
//               <Input
//                 label="Titre de l'annonce"
//                 placeholder="Ex: iPhone 15 Pro Max 256Go"
//                 error={errors.title?.message}
//                 {...register("title")}
//               />

//               <Textarea
//                 label="Description"
//                 placeholder="Décrivez votre article en détail : état, marque, modèle, raison de la vente..."
//                 rows={5}
//                 maxLength={5000}
//                 showCount
//                 error={errors.description?.message}
//                 {...register("description")}
//               />

//               <Select
//                 label="État de l'article"
//                 placeholder="Sélectionnez l'état"
//                 options={PRODUCT_CONDITIONS.map((c) => ({
//                   value: c.value,
//                   label: c.label,
//                 }))}
//                 value={formValues.condition}
//                 onChange={(val) => setValue("condition", val)}
//                 error={errors.condition?.message}
//               />

//               <Input
//                 label="Marque (optionnel)"
//                 placeholder="Ex: Apple, Samsung, Nike..."
//                 {...register("brand")}
//               />

//               <Input
//                 label="Tags (optionnel)"
//                 placeholder="Ex: iphone, smartphone, apple (séparés par des virgules)"
//                 helperText="Ajoutez des mots-clés pour faciliter la recherche"
//                 {...register("tags", {
//                   setValueAs: (v) =>
//                     v
//                       ? v.split(",").map((t) => t.trim()).filter(Boolean)
//                       : [],
//                 })}
//               />
//             </div>
//           </ListingFormStep>
//         );

//       case 2: //Case de sélections des photos des produits 
//         return (
//           <ListingFormStep
//             title="Ajoutez des photos"
//             description={`Ajoutez jusqu'à ${MAX_IMAGES_PER_LISTING} photos. La première sera la photo principale.`}
//           >
//             <PhotoUploader
//               photos={photos}
//               onPhotosChange={setPhotos}
//               maxPhotos={MAX_IMAGES_PER_LISTING}
//               error={errors.images?.message}
//             />
//           </ListingFormStep>
//         );

//       case 3: //Case de Prix et Livraison 
//         return (
//           <ListingFormStep
//             title="Prix & Livraison"
//             description="Définissez le prix et les options de livraison"
//           >
//             <div className="space-y-6">
//               <div>
//                 <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
//                   Prix (FCFA) <span className="text-red-600">*</span>
//                 </label>
//                 <div className="relative">
//                   <input
//                     type="text"
//                     inputMode="numeric"
//                     pattern="[0-9]*"
//                     placeholder="0"
//                     required
//                     className={cn(
//                       "w-full rounded-xl border bg-white py-2.5 pl-4 pr-24 text-lg font-bold text-gray-900 transition-colors",
//                       "placeholder:text-gray-400 focus:border-brand-800 focus:outline-none focus:ring-2 focus:ring-brand-800/20",
//                       "dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder:text-gray-500",
//                       errors.price
//                         ? "border-red-700"
//                         : "border-gray-300 dark:border-gray-700"
//                     )}
//                     {...register("price", {
//                       valueAsNumber: true,
//                       setValueAs: (v) => {
//                         if (v === "" || v === null || v === undefined) return NaN;
//                         const n = Number(String(v).replace(/[^0-9]/g, ""));
//                         return isNaN(n) ? NaN : n;
//                       },
//                     })}
//                   />
//                   <span className="absolute right-4 top-1/2 -translate-y-1/2 text-lg font-bold text-gray-400">
//                     FCFA
//                   </span>
//                 </div>
//                 {errors.price && (
//                   <p className="mt-1.5 text-xs text-red-700">{errors.price.message}</p>
//                 )}
//               </div>

//               <label className="flex cursor-pointer items-center justify-between rounded-xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800">
//                 <div>
//                   <p className="text-sm font-semibold text-gray-900 dark:text-white">
//                     Prix négociable
//                   </p>
//                   <p className="text-xs text-gray-500 dark:text-gray-400">
//                     Permet aux acheteurs de faire des offres
//                   </p>
//                 </div>
//                 <button
//                   type="button"
//                   role="switch"
//                   aria-checked={formValues.negotiable}
//                   onClick={() => setValue("negotiable", !formValues.negotiable)}
//                   className={cn(
//                     "relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full transition-colors duration-200",
//                     formValues.negotiable ? "bg-brand-800" : "bg-gray-300 dark:bg-gray-600"
//                   )}
//                 >
//                   <span
//                     className={cn(
//                       "inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform duration-200",
//                       formValues.negotiable ? "translate-x-6" : "translate-x-1"
//                     )}
//                   />
//                 </button>
//               </label>

//               <label className="flex cursor-pointer items-center justify-between rounded-xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800">
//                 <div>
//                   <p className="text-sm font-semibold text-gray-900 dark:text-white">
//                     Livraison disponible
//                   </p>
//                   <p className="text-xs text-gray-500 dark:text-gray-400">
//                     Proposez la livraison à l'acheteur
//                   </p>
//                 </div>
//                 <button
//                   type="button"
//                   role="switch"
//                   aria-checked={formValues.deliveryAvailable}
//                   onClick={() => setValue("deliveryAvailable", !formValues.deliveryAvailable)}
//                   className={cn(
//                     "relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full transition-colors duration-200",
//                     formValues.deliveryAvailable
//                       ? "bg-brand-800"
//                       : "bg-gray-300 dark:bg-gray-600"
//                   )}
//                 >
//                   <span
//                     className={cn(
//                       "inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform duration-200",
//                       formValues.deliveryAvailable ? "translate-x-6" : "translate-x-1"
//                     )}
//                   />
//                 </button>
//               </label>

//               <AnimatePresence>
//                 {formValues.deliveryAvailable && (
//                   <motion.div
//                     initial={{ opacity: 0, height: 0 }}
//                     animate={{ opacity: 1, height: "auto" }}
//                     exit={{ opacity: 0, height: 0 }}
//                     className="overflow-hidden"
//                   >
//                     <Input
//                       label="Frais de livraison (FCFA)"
//                       placeholder="0"
//                       type="text"
//                       inputMode="numeric"
//                       {...register("deliveryPrice", {
//                         valueAsNumber: true,
//                         setValueAs: (v) => {
//                           if (v === "" || v === null || v === undefined) return 0;
//                           const n = Number(String(v).replace(/[^0-9]/g, ""));
//                           return isNaN(n) ? 0 : n;
//                         },
//                       })}
//                     />
//                   </motion.div>
//                 )}
//               </AnimatePresence>
//             </div>
//           </ListingFormStep>
//         );

//       case 4: //Case de Localisation (Choix de la ville et le quartier de provenance)
//         return (
//           <ListingFormStep
//             title="Localisation"
//             description="Indiquez où se trouve votre article"
//           >
//             <div className="space-y-5">
//               <Select
//                 label="Ville"
//                 placeholder="Sélectionnez une ville"
//                 options={CITIES.map((c) => ({ value: c, label: c }))}
//                 value={formValues.city}
//                 onChange={(val) => setValue("city", val)}
//                 error={errors.city?.message}
//               />

//               <Input
//                 label="Quartier / Quartier (optionnel)"
//                 placeholder="Ex: Agbalepedogan, Bè Kpota..."
//                 leftIcon={MapPin}
//                 {...register("neighborhood")}
//               />

//               <div className="overflow-hidden rounded-2xl border border-gray-200 bg-gray-100 dark:border-gray-700 dark:bg-gray-800">
//                 <div className="flex h-48 items-center justify-center">
//                   <div className="text-center">
//                     <MapPin className="mx-auto h-8 w-8 text-gray-300 dark:text-gray-600" />
//                     <p className="mt-2 text-sm text-gray-400">
//                       {formValues.city
//                         ? `${formValues.city}${formValues.neighborhood ? `, ${formValues.neighborhood}` : ""}`
//                         : "Sélectionnez une ville pour afficher la carte"}
//                     </p>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </ListingFormStep>
//         );

//       case 5: //Case de l'aperçu de l'article
//         return (
//           <ListingFormStep
//             title="Aperçu de votre annonce"
//             description="Vérifiez que toutes les informations sont correctes avant de publier"
//           >
//             <ListingPreview
//               data={{
//                 ...formValues,
//                 // category: selectedCategory?.name || "",
//                 category: selectedCategory?.name || "",
//                 images: photos,
//                 tags: formValues.tags || [],
//               }}
//             />
//           </ListingFormStep>
//         );

//       case 6: //Case de finalisation et de publication
//         return (
//           <ListingFormStep>
//             {isPublished ? (
//               <motion.div
//                 initial={{ opacity: 0, scale: 0.9 }}
//                 animate={{ opacity: 1, scale: 1 }}
//                 className="flex flex-col items-center py-12 text-center"
//               >
//                 <motion.div
//                   initial={{ scale: 0 }}
//                   animate={{ scale: 1 }}
//                   transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.2 }}
//                   className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-brand-100 dark:bg-brand-700/10"
//                 >
//                   <CheckCircle2 className="h-12 w-12 text-brand-700" />
//                 </motion.div>

//                 <motion.h2
//                   initial={{ opacity: 0, y: 10 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   transition={{ delay: 0.4 }}
//                   className="text-2xl font-bold text-gray-900 dark:text-white"
//                 >
//                   Votre annonce est en ligne !
//                 </motion.h2>
//                 <motion.p
//                   initial={{ opacity: 0, y: 10 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   transition={{ delay: 0.5 }}
//                   className="mt-2 max-w-md text-sm text-gray-500 dark:text-gray-400"
//                 >
//                   Félicitations ! Votre annonce est maintenant visible par des milliers
//                   d'acheteurs potentiels.
//                 </motion.p>

//                 <motion.div
//                   initial={{ opacity: 0, y: 10 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   transition={{ delay: 0.6 }}
//                   className="mt-8 flex flex-col gap-3 sm:flex-row"
//                 >
//                   <Button
//                     icon={Eye}
//                     onClick={() => navigate(`/annonce/${publishedProductId}`)}
//                   >
//                     Voir l'annonce
//                   </Button>
//                   <Button
//                     variant="outline"
//                     icon={Share2}
//                     onClick={() => handleShare("partage")}
//                   >
//                     Partager
//                   </Button>
//                 </motion.div>

//                 <motion.div
//                   initial={{ opacity: 0 }}
//                   animate={{ opacity: 1 }}
//                   transition={{ delay: 0.8 }}
//                   className="mt-8"
//                 >
//                   <p className="mb-3 text-xs font-medium text-gray-400">
//                     Partager sur :
//                   </p>
//                   <div className="flex items-center justify-center gap-3">
//                     <button
//                       onClick={() => handleShare("Facebook")}
//                       className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-800 text-white transition-transform hover:scale-110"
//                     >
//                       <ExternalLink className="h-5 w-5" />
//                     </button>
//                     <button
//                       onClick={() => handleShare("WhatsApp")}
//                       className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-700 text-white transition-transform hover:scale-110"
//                     >
//                       <MessageCircle className="h-5 w-5" />
//                     </button>
//                     <button
//                       onClick={() => handleShare("lien")}
//                       className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-700 text-white transition-transform hover:scale-110"
//                     >
//                       <Link2 className="h-5 w-5" />
//                     </button>
//                     <button
//                       onClick={() => handleShare("copier")}
//                       className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-800 text-white transition-transform hover:scale-110"
//                     >
//                       <Copy className="h-5 w-5" />
//                     </button>
//                   </div>
//                 </motion.div>
//               </motion.div>
//             ) : (
//               <div className="flex flex-col items-center py-12 text-center">
//                 <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-brand-200 dark:bg-brand-800/10">
//                   <Send className="h-12 w-12 text-brand-800" />
//                 </div>
//                 <h2 className="text-xl font-bold text-gray-900 dark:text-white">
//                   Prêt à publier ?
//                 </h2>
//                 <p className="mt-2 max-w-md text-sm text-gray-500 dark:text-gray-400">
//                   Votre annonce sera visible immédiatement après la publication.
//                 </p>
//                 <div className="mt-8 flex flex-col gap-3 sm:flex-row">
//                   <Button
//                     icon={Send}
//                     size="lg"
//                     onClick={handlePublish}
//                     disabled={isSubmitting}
//                     loading={isSubmitting}
//                   >
//                     {isSubmitting ? "Publication en cours..." : "Publier l'annonce"}
//                   </Button>
//                   <Button
//                     variant="outline"
//                     icon={Save}
//                     onClick={handleSaveDraft}
//                   >
//                     Sauvegarder brouillon
//                   </Button>
//                 </div>
//               </div>
//             )}
//           </ListingFormStep>
//         );

//       default:
//         return null;
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
//       <div className="mx-auto max-w-8xl px-4 py-6 sm:px-6">
//         <div className="mb-6">
//           <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
//             Nouvelle annonce
//           </h1>
//           <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
//             Remplissez les informations pour publier votre annonce
//           </p>
//         </div>

//         <div className="mb-8 overflow-hidden rounded-2xl border border-gray-100 bg-white px-4 py-5 dark:border-gray-800 dark:bg-gray-800">
//           <StepIndicator steps={WIZARD_STEPS} currentStep={currentStep} />
//         </div>

//         <div className="min-h-[400px] rounded-2xl border border-gray-100 bg-white p-6 dark:border-gray-800 dark:bg-gray-800 sm:p-8">
//           <AnimatePresence mode="wait">{renderStep()}</AnimatePresence>
//         </div>

//         {currentStep < WIZARD_STEPS.length - 1 && (
//           <div className="mt-6 flex items-center justify-between">
//             <Button
//               variant="ghost"
//               icon={ChevronLeft}
//               onClick={handleBack}
//               disabled={currentStep === 0}
//             >
//               Retour
//             </Button>

//             <div className="flex items-center gap-3">
//               <Button
//                 variant="ghost"
//                 icon={Save}
//                 onClick={handleSaveDraft}
//                 className="hidden sm:inline-flex"
//               >
//                 Brouillon
//               </Button>

//               {currentStep === WIZARD_STEPS.length - 2 ? (
//                 <Button icon={Eye} onClick={handleNext}>
//                   Aperçu
//                 </Button>
//               ) : (
//                 <Button icon={ChevronRight} iconPosition="right" onClick={handleNext}>
//                   Suivant
//                 </Button>
//               )}
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// const ICON_MAP = {
//   Smartphone,
//   Car,
//   Laptop,
//   Sofa,
//   Shirt,
//   Home,
//   Refrigerator,
//   Gamepad2,
//   Dumbbell,
//   Sparkles,
//   Baby,
//   Apple,
//   Briefcase,
//   PawPrint,
//   BookOpen,
//   Music,
//   Palette,
//   TreePine,
//   Wrench,
//   Package,
// };

// function getIconComponent(iconName) {
//   return ICON_MAP[iconName] || Package;
// }


import { useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import {
  ChevronLeft,
  ChevronRight,
  Save,
  Eye,
  Send,
  CheckCircle2,
  Share2,
  ExternalLink,
  MessageCircle,
  Link2,
  Copy,
  MapPin,
  Smartphone,
  Car,
  Laptop,
  Sofa,
  Shirt,
  Home,
  Refrigerator,
  Gamepad2,
  Dumbbell,
  Sparkles,
  Baby,
  Apple,
  Briefcase,
  PawPrint,
  BookOpen,
  Music,
  Palette,
  TreePine,
  Wrench,
  Package,
  Layers,
  Trash2,
  ShieldCheck,
} from "lucide-react";
import BackButton from "@/shared/ui/BackButton";
import { cn } from "@/shared/utils/cn";
import Button from "@/shared/ui/Button";
import Input from "@/shared/ui/Input";
import Textarea from "@/shared/ui/Textarea";
import Select from "@/shared/ui/Select";
import StepIndicator from "@/shared/ui/StepIndicator";
import Modal from "@/shared/ui/Modal";
import ListingFormStep from "@/features/listings/components/ListingFormStep";
import PhotoUploader from "@/features/listings/components/PhotoUploader";
import ListingPreview from "@/features/listings/components/ListingPreview";
import { useCategories } from "@/features/categories/hooks/useCategories";
import CategoryPicker from "@/features/categories/components/CategoryPicker";
import { useCreateProduct } from "@/features/products/hooks/useProducts";
import { useKycStatus } from "@/features/verification/hooks/useKyc";
import { usePaymentMethods, useAddPaymentMethod } from "@/features/wallet/hooks/useWallet";
import { useCategorySpecTemplates } from "@/features/categories/hooks/useCategories";
import api from "@/shared/services/api";
import { CITIES, PRODUCT_CONDITIONS, MAX_IMAGES_PER_LISTING } from "@/shared/constants";
import { createListingSchema } from "@/shared/utils/validators";

// Ordre du wizard : Catégorie -> Photos -> Infos -> Prix -> Lieu -> Aperçu -> Publier
const WIZARD_STEPS = [
  { label: "Catégorie", icon: "📁" },
  { label: "Photos", icon: "📷" },
  { label: "Infos", icon: "📝" },
  { label: "Prix", icon: "💰" },
  { label: "Lieu", icon: "📍" },
  { label: "Aperçu", icon: "👁️" },
  { label: "Publier", icon: "🚀" },
];

const defaultFormValues = {
  title: "",
  description: "",
  price: "",
  negotiable: false,
  category: "",
  condition: "",
  city: "",
  neighborhood: "",
  brand: "",
  images: [],
  deliveryAvailable: false,
  deliveryPrice: "",
  quantity: 1,
};

export default function CreateListingPage() {
  const navigate = useNavigate();
  const { data: categories = [] } = useCategories();
  const createProduct = useCreateProduct();
  const { data: methodsData } = usePaymentMethods();
  const { data: kycStatus, isLoading: kycLoading } = useKycStatus();
  const [currentStep, setCurrentStep] = useState(0);
  const [photos, setPhotos] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isPublished, setIsPublished] = useState(false);
  const [publishedProductId, setPublishedProductId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [specValues, setSpecValues] = useState({});
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [newMethod, setNewMethod] = useState({ provider: "flooz", providerUserId: "" });
  const addPayment = useAddPaymentMethod();
  const [batchMode, setBatchMode] = useState(false);
  const [draftList, setDraftList] = useState([]);
  const [batchResult, setBatchResult] = useState(null);
  const [pendingPublish, setPendingPublish] = useState(null);
  const [batchProgress, setBatchProgress] = useState({ done: 0, total: 0 });

  const { data: specTemplatesData } = useCategorySpecTemplates(selectedCategory?.id);
  const specTemplates = specTemplatesData?.data ?? specTemplatesData ?? [];

  useEffect(() => {
    setSpecValues({});
  }, [selectedCategory?.id]);

  const buildSpecifications = useCallback(
    () =>
      specTemplates
        .map((t) => ({ label: t.label, value: (specValues[t.id] ?? "").trim() }))
        .filter((s) => s.value),
    [specTemplates, specValues]
  );

  const {
    register,
    watch,
    setValue,
    trigger,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(createListingSchema),
    defaultValues: defaultFormValues,
    mode: "onChange",
  });

  const formValues = watch();

  async function uploadImages(files) {
    const formData = new FormData();
    files.forEach((file) => formData.append("files", file));
    const res = await api.post("/upload/images", formData);
    return res.data.data.map((img) => img.url);
  }

  // Validation par étape, réordonnée : 0 Catégorie, 1 Photos, 2 Infos, 3 Prix, 4 Lieu
  const validateStep = useCallback(
    async (step) => {
      switch (step) {
        case 0:
          if (!selectedCategory) {
            toast.error("Veuillez sélectionner une sous-catégorie");
            return false;
          }
          return true;
        case 1:
          if (photos.length === 0) {
            toast.error("Ajoutez au moins une photo");
            return false;
          }
          return true;
        case 2:
          return await trigger(["title", "description", "condition"]);
        case 3:
          return await trigger(["price"]);
        case 4:
          return await trigger(["city"]);
        default:
          return true;
      }
    },
    [selectedCategory, photos.length, trigger]
  );

  const handleNext = useCallback(async () => {
    const valid = await validateStep(currentStep);
    if (valid && currentStep < WIZARD_STEPS.length - 1) {
      setCurrentStep((s) => s + 1);
    }
  }, [currentStep, validateStep]);

  const handleBack = useCallback(() => {
    if (currentStep > 0) {
      setCurrentStep((s) => s - 1);
    }
  }, [currentStep]);

  const buildPayloadFrom = useCallback(
    async ({ category, photos: targetPhotos, values, specs }) => {
      const filesToUpload = targetPhotos.filter((p) => p.file).map((p) => p.file);
      const existingUrls = targetPhotos.filter((p) => !p.file).map((p) => p.url);

      let uploadedUrls = [];
      if (filesToUpload.length > 0) {
        uploadedUrls = await uploadImages(filesToUpload);
      }

      const allImages = [...existingUrls, ...uploadedUrls];

      return {
        categoryId: category.id,
        title: values.title,
        description: values.description,
        condition: values.condition,
        brand: values.brand || undefined,
        tags: values.tags || [],
        images: allImages,
        price: Math.round(Number(values.price)),
        negotiable: values.negotiable,
        deliveryAvailable: values.deliveryAvailable,
        deliveryPrice: values.deliveryAvailable
          ? Math.round(Number(values.deliveryPrice) || 0) || undefined
          : undefined,
        quantity: values.quantity || 1,
        city: values.city,
        neighborhood: values.neighborhood || undefined,
        specifications: specs,
      };
    },
    [uploadImages]
  );

  const captureCurrentDraft = useCallback(
    () => ({
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      category: selectedCategory,
      photos,
      values: { ...formValues },
      specs: buildSpecifications(),
    }),
    [selectedCategory, photos, formValues, buildSpecifications]
  );

  const addToBatch = useCallback(async () => {
    for (const step of [0, 1, 2, 3, 4]) {
      const valid = await validateStep(step);
      if (!valid) {
        setCurrentStep(step);
        return;
      }
    }
    if (draftList.length >= 10) {
      toast.error("Maximum 10 annonces par lot");
      return;
    }
    setDraftList((prev) => [...prev, captureCurrentDraft()]);
    setSelectedCategory(null);
    setPhotos([]);
    setSpecValues({});
    reset(defaultFormValues);
    setCurrentStep(0);
    toast.success("Annonce ajoutée au lot — préparez la suivante !");
  }, [validateStep, draftList.length, captureCurrentDraft, reset]);

  const removeDraft = useCallback((id) => {
    setDraftList((prev) => prev.filter((d) => d.id !== id));
  }, []);

  const handlePublishBatch = useCallback(async () => {
    const methods = methodsData?.data || methodsData || [];
    if (methods.length === 0) {
      setPendingPublish("batch");
      setNewMethod({ provider: "flooz", providerUserId: "" });
      setShowPaymentModal(true);
      toast.error("Ajoutez un moyen de réception (numéro Flooz/T-Money) pour recevoir vos paiements");
      return;
    }

    for (const step of [0, 1, 2, 3, 4]) {
      const valid = await validateStep(step);
      if (!valid) {
        setCurrentStep(step);
        return;
      }
    }

    const allDrafts = [...draftList, captureCurrentDraft()];
    setIsSubmitting(true);
    setBatchProgress({ done: 0, total: allDrafts.length });
    const results = { published: [], failed: [] };
    for (let i = 0; i < allDrafts.length; i++) {
      const d = allDrafts[i];
      try {
        const payload = await buildPayloadFrom(d);
        const result = await createProduct.mutateAsync(payload);
        results.published.push({ id: result?.id, title: d.values.title });
      } catch (err) {
        const msg = err?.response?.data?.message || err?.message || "Erreur lors de la publication";
        results.failed.push({ title: d.values.title || "Annonce sans titre", error: msg });
      }
      setBatchProgress((prev) => ({ ...prev, done: prev.done + 1 }));
    }
    setBatchResult(results);
    setIsPublished(true);
    setPublishedProductId(results.published[0]?.id);
    setIsSubmitting(false);
    if (results.failed.length === 0) {
      toast.success(`${results.published.length} annonce(s) publiée(s) !`);
    } else {
      toast.error(`${results.failed.length} annonce(s) en échec sur ${allDrafts.length}`);
    }
  }, [draftList, captureCurrentDraft, buildPayloadFrom, createProduct, methodsData, validateStep]);

  const handlePublish = useCallback(async () => {
    if (!selectedCategory) {
      toast.error("Veuillez sélectionner une catégorie");
      return;
    }
    if (photos.length === 0) {
      toast.error("Ajoutez au moins une photo");
      return;
    }

    const methods = methodsData?.data || methodsData || [];
    if (methods.length === 0) {
      setPendingPublish("single");
      setNewMethod({ provider: "flooz", providerUserId: "" });
      setShowPaymentModal(true);
      toast.error("Ajoutez un moyen de réception (numéro Flooz/T-Money) pour recevoir vos paiements");
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = await buildPayloadFrom({
        category: selectedCategory,
        photos,
        values: formValues,
        specs: buildSpecifications(),
      });

      const result = await createProduct.mutateAsync(payload);
      setPublishedProductId(result?.id);
      setIsPublished(true);
      toast.success("Votre annonce a été publiée !");
    } catch (err) {
      const msg = err?.response?.data?.message || err?.message || "Erreur lors de la publication";
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  }, [selectedCategory, photos, formValues, createProduct, buildSpecifications, buildPayloadFrom, methodsData]);

  const handleSaveDraft = useCallback(() => {
    toast.success("Brouillon sauvegardé !");
  }, []);

  const handleShare = useCallback((platform) => {
    toast.success(`Partage via ${platform} !`);
  }, []);

  const handleSpecChange = useCallback((templateId, v) => {
    const val = v && typeof v === "object" && v.target ? v.target.value : v;
    setSpecValues((prev) => ({ ...prev, [templateId]: val ?? "" }));
  }, []);

  const renderSpecFields = () => {
    if (!specTemplates.length) return null;

    return (
      <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800">
        <h3 className="mb-1 text-sm font-semibold text-gray-900 dark:text-white">
          Caractéristiques
        </h3>
        <p className="mb-4 text-xs text-gray-500 dark:text-gray-400">
          Champs suggérés pour cette catégorie
        </p>
        <div className="space-y-4">
          {specTemplates.map((t) => {
            const value = specValues[t.id] ?? "";
            const common = {
              label: t.label,
              value,
              onChange: (v) => handleSpecChange(t.id, v),
            };
            if (t.inputType === "select") {
              return (
                <Select
                  key={t.id}
                  {...common}
                  placeholder={`Sélectionnez ${t.label.toLowerCase()}`}
                  options={(t.options || []).map((o) => ({ value: o, label: o }))}
                />
              );
            }
            if (t.inputType === "number") {
              return (
                <Input
                  key={t.id}
                  {...common}
                  type="number"
                  placeholder="Ex: valeur en nombre"
                />
              );
            }
            return (
              <Input
                key={t.id}
                {...common}
                placeholder={`Ex: valeur de ${t.label.toLowerCase()}`}
              />
            );
          })}
        </div>
      </div>
    );
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0: // Choix de la catégorie de l'article
        return (
          <ListingFormStep
            title="Choisissez une catégorie"
            description="Sélectionnez la catégorie la plus appropriée pour votre annonce"
          >
            <CategoryPicker
              categories={categories}
              value={selectedCategory}
              onChange={(cat) => {
                setSelectedCategory(cat);
                setValue("category", cat?.slug ?? "");
              }}
              error={errors.category?.message}
            />
          </ListingFormStep>
        );

      case 1: // Sélection des photos du produit (déplacée avant les infos)
        return (
          <ListingFormStep
            title="Ajoutez des photos"
            description={`Ajoutez jusqu'à ${MAX_IMAGES_PER_LISTING} photos. La première sera la photo principale.`}
          >
            <PhotoUploader
              photos={photos}
              onPhotosChange={setPhotos}
              maxPhotos={MAX_IMAGES_PER_LISTING}
              error={errors.images?.message}
            />
          </ListingFormStep>
        );

      case 2: // Informations sur l'article
        return (
          <ListingFormStep
            title="Informations sur l'article"
            description="Décrivez votre article en détail pour attirer l'attention des acheteurs"
          >
            <div className="space-y-5">
              <Input
                label="Titre de l'annonce"
                placeholder="Ex: iPhone 15 Pro Max 256Go"
                error={errors.title?.message}
                {...register("title")}
              />

              <Textarea
                label="Description"
                placeholder="Décrivez votre article en détail : état, marque, modèle, raison de la vente..."
                rows={5}
                maxLength={5000}
                showCount
                error={errors.description?.message}
                {...register("description")}
              />

              <Select
                label="État de l'article"
                placeholder="Sélectionnez l'état"
                options={PRODUCT_CONDITIONS.map((c) => ({
                  value: c.value,
                  label: c.label,
                }))}
                value={formValues.condition}
                onChange={(val) => setValue("condition", val)}
                error={errors.condition?.message}
              />

              <Input
                label="Marque (optionnel)"
                placeholder="Ex: Apple, Samsung, Nike..."
                {...register("brand")}
              />

              <Input
                label="Tags (optionnel)"
                placeholder="Ex: iphone, smartphone, apple (séparés par des virgules)"
                helperText="Ajoutez des mots-clés pour faciliter la recherche"
                {...register("tags", {
                  setValueAs: (v) =>
                    v
                      ? v.split(",").map((t) => t.trim()).filter(Boolean)
                      : [],
                })}
              />
            </div>
            {renderSpecFields()}
          </ListingFormStep>
        );

      case 3: // Prix et livraison
        return (
          <ListingFormStep
            title="Prix & Livraison"
            description="Définissez le prix et les options de livraison"
          >
            <div className="space-y-6">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Prix (FCFA) <span className="text-red-600">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    placeholder="0"
                    required
                    className={cn(
                      "w-full rounded-xl border bg-white py-2.5 pl-4 pr-24 text-lg font-bold text-gray-900 transition-colors",
                      "placeholder:text-gray-400 focus:border-brand-800 focus:outline-none focus:ring-2 focus:ring-brand-800/20",
                      "dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder:text-gray-500",
                      errors.price
                        ? "border-red-700"
                        : "border-gray-300 dark:border-gray-700"
                    )}
                    {...register("price", {
                      valueAsNumber: true,
                      setValueAs: (v) => {
                        if (v === "" || v === null || v === undefined) return NaN;
                        const n = Number(String(v).replace(/[^0-9]/g, ""));
                        return isNaN(n) ? NaN : n;
                      },
                    })}
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-lg font-bold text-gray-400">
                    FCFA
                  </span>
                </div>
                {errors.price && (
                  <p className="mt-1.5 text-xs text-red-700">{errors.price.message}</p>
                )}
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Quantité en stock
                </label>
                <input
                  type="number"
                  min="1"
                  max="999"
                  defaultValue={1}
                  className="w-full rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 transition-colors focus:border-brand-800 focus:outline-none focus:ring-2 focus:ring-brand-800/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                  {...register("quantity", { valueAsNumber: true, min: 1 })}
                />
                {errors.quantity && (
                  <p className="mt-1.5 text-xs text-red-700">{errors.quantity.message}</p>
                )}
              </div>

              <label className="flex cursor-pointer items-center justify-between rounded-xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800">
                <div>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">
                    Prix négociable
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Permet aux acheteurs de faire des offres
                  </p>
                </div>
                <button
                  type="button"
                  role="switch"
                  aria-checked={formValues.negotiable}
                  onClick={() => setValue("negotiable", !formValues.negotiable)}
                  className={cn(
                    "relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full transition-colors duration-200",
                    formValues.negotiable ? "bg-brand-800" : "bg-gray-300 dark:bg-gray-600"
                  )}
                >
                  <span
                    className={cn(
                      "inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform duration-200",
                      formValues.negotiable ? "translate-x-6" : "translate-x-1"
                    )}
                  />
                </button>
              </label>

              <label className="flex cursor-pointer items-center justify-between rounded-xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800">
                <div>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">
                    Livraison disponible
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Proposez la livraison à l'acheteur
                  </p>
                </div>
                <button
                  type="button"
                  role="switch"
                  aria-checked={formValues.deliveryAvailable}
                  onClick={() => setValue("deliveryAvailable", !formValues.deliveryAvailable)}
                  className={cn(
                    "relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full transition-colors duration-200",
                    formValues.deliveryAvailable
                      ? "bg-brand-800"
                      : "bg-gray-300 dark:bg-gray-600"
                  )}
                >
                  <span
                    className={cn(
                      "inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform duration-200",
                      formValues.deliveryAvailable ? "translate-x-6" : "translate-x-1"
                    )}
                  />
                </button>
              </label>

              <AnimatePresence>
                {formValues.deliveryAvailable && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden"
                  >
                    <Input
                      label="Frais de livraison (FCFA)"
                      placeholder="0"
                      type="text"
                      inputMode="numeric"
                      {...register("deliveryPrice", {
                        valueAsNumber: true,
                        setValueAs: (v) => {
                          if (v === "" || v === null || v === undefined) return 0;
                          const n = Number(String(v).replace(/[^0-9]/g, ""));
                          return isNaN(n) ? 0 : n;
                        },
                      })}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </ListingFormStep>
        );

      case 4: // Localisation (ville et quartier)
        return (
          <ListingFormStep
            title="Localisation"
            description="Indiquez où se trouve votre article"
          >
            <div className="space-y-5">
              <Select
                label="Ville"
                placeholder="Sélectionnez une ville"
                options={CITIES.map((c) => ({ value: c, label: c }))}
                value={formValues.city}
                onChange={(val) => setValue("city", val)}
                error={errors.city?.message}
              />

              <Input
                label="Quartier / Quartier (optionnel)"
                placeholder="Ex: Agbalepedogan, Bè Kpota..."
                leftIcon={MapPin}
                {...register("neighborhood")}
              />

              <div className="overflow-hidden rounded-2xl border border-gray-200 bg-gray-100 dark:border-gray-700 dark:bg-gray-800">
                <div className="flex h-48 items-center justify-center">
                  <div className="text-center">
                    <MapPin className="mx-auto h-8 w-8 text-gray-300 dark:text-gray-600" />
                    <p className="mt-2 text-sm text-gray-400">
                      {formValues.city
                        ? `${formValues.city}${formValues.neighborhood ? `, ${formValues.neighborhood}` : ""}`
                        : "Sélectionnez une ville pour afficher la carte"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </ListingFormStep>
        );

      case 5: // Aperçu de l'article
        return (
          <ListingFormStep
            title="Aperçu de votre annonce"
            description="Vérifiez que toutes les informations sont correctes avant de publier"
          >
            <ListingPreview
              data={{
                ...formValues,
                category: selectedCategory?.name || "",
                images: photos,
                tags: formValues.tags || [],
                specifications: buildSpecifications(),
              }}
            />
          </ListingFormStep>
        );

      case 6: // Finalisation et publication
        return (
          <ListingFormStep>
            {isPublished && batchResult ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex w-full flex-col items-center py-12 text-center"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.2 }}
                  className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-brand-100 dark:bg-brand-700/10"
                >
                  <CheckCircle2 className="h-12 w-12 text-brand-700" />
                </motion.div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {batchResult.published.length} annonce(s) en ligne !
                </h2>
                <p className="mt-2 max-w-md text-sm text-gray-500 dark:text-gray-400">
                  {batchResult.failed.length > 0
                    ? `${batchResult.published.length} publiée(s), ${batchResult.failed.length} en échec.`
                    : "Toutes vos annonces sont maintenant visibles par les acheteurs."}
                </p>

                {batchResult.published.length > 0 && (
                  <div className="mt-6 w-full max-w-md space-y-2 text-left">
                    {batchResult.published.map((p) => (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => navigate(`/annonce/${p.id}`)}
                        className="flex w-full items-center justify-between rounded-xl border border-gray-100 bg-white px-4 py-3 text-sm font-medium text-gray-700 shadow-sm transition-colors hover:border-brand-300 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:border-brand-600"
                      >
                        <span className="truncate">{p.title || "Annonce"}</span>
                        <ExternalLink className="ml-3 h-4 w-4 shrink-0 text-gray-400" />
                      </button>
                    ))}
                  </div>
                )}

                {batchResult.failed.length > 0 && (
                  <div className="mt-4 w-full max-w-md space-y-2 text-left">
                    <p className="text-xs font-semibold uppercase tracking-wide text-red-500">
                      Échecs
                    </p>
                    {batchResult.failed.map((f, i) => (
                      <div
                        key={i}
                        className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600 dark:border-red-900/40 dark:bg-red-950/30 dark:text-red-400"
                      >
                        <span className="font-medium">{f.title}</span>
                        <span className="ml-2 text-xs">{f.error}</span>
                      </div>
                    ))}
                  </div>
                )}

                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                  <Button icon={Eye} onClick={() => navigate("/dashboard")}>
                    Mes annonces
                  </Button>
                  <Button
                    variant="outline"
                    icon={Layers}
                    onClick={() => {
                      setBatchResult(null);
                      setDraftList([]);
                      setBatchProgress({ done: 0, total: 0 });
                      setSelectedCategory(null);
                      setPhotos([]);
                      setSpecValues({});
                      reset(defaultFormValues);
                      setCurrentStep(0);
                      setIsPublished(false);
                      setPublishedProductId(null);
                    }}
                  >
                    Nouveau lot
                  </Button>
                </div>
              </motion.div>
            ) : isPublished ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center py-12 text-center"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.2 }}
                  className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-brand-100 dark:bg-brand-700/10"
                >
                  <CheckCircle2 className="h-12 w-12 text-brand-700" />
                </motion.div>

                <motion.h2
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="text-2xl font-bold text-gray-900 dark:text-white"
                >
                  Votre annonce est en ligne !
                </motion.h2>
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="mt-2 max-w-md text-sm text-gray-500 dark:text-gray-400"
                >
                  Félicitations ! Votre annonce est maintenant visible par des milliers
                  d'acheteurs potentiels.
                </motion.p>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="mt-8 flex flex-col gap-3 sm:flex-row"
                >
                  <Button
                    icon={Eye}
                    onClick={() => navigate(`/annonce/${publishedProductId}`)}
                  >
                    Voir l'annonce
                  </Button>
                  <Button
                    variant="outline"
                    icon={Share2}
                    onClick={() => handleShare("partage")}
                  >
                    Partager
                  </Button>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8 }}
                  className="mt-8"
                >
                  <p className="mb-3 text-xs font-medium text-gray-400">
                    Partager sur :
                  </p>
                  <div className="flex items-center justify-center gap-3">
                    <button
                      onClick={() => handleShare("Facebook")}
                      className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-800 text-white transition-transform hover:scale-110"
                    >
                      <ExternalLink className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => handleShare("WhatsApp")}
                      className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-700 text-white transition-transform hover:scale-110"
                    >
                      <MessageCircle className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => handleShare("lien")}
                      className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-700 text-white transition-transform hover:scale-110"
                    >
                      <Link2 className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => handleShare("copier")}
                      className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-800 text-white transition-transform hover:scale-110"
                    >
                      <Copy className="h-5 w-5" />
                    </button>
                  </div>
                </motion.div>
              </motion.div>
            ) : (
              batchMode ? (
                <div className="flex w-full flex-col items-center py-8 text-center">
                  <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-brand-200 dark:bg-brand-800/10">
                    <Layers className="h-12 w-12 text-brand-800" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                    Publier plusieurs annonces
                  </h2>
                  <p className="mt-2 max-w-md text-sm text-gray-500 dark:text-gray-400">
                    Ajoutez cette annonce au lot, remplissez la suivante, puis tout publier d'un coup.
                  </p>

                  {draftList.length > 0 && (
                    <div className="mt-8 w-full max-w-xl space-y-2 text-left">
                      {draftList.map((d, i) => (
                        <div
                          key={d.id}
                          className="flex items-center justify-between rounded-xl border border-gray-100 bg-white px-4 py-3 shadow-sm dark:border-gray-700 dark:bg-gray-800"
                        >
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-medium text-gray-900 dark:text-white">
                              {i + 1}. {d.values.title || "Annonce"}
                            </p>
                            <p className="truncate text-xs text-gray-500 dark:text-gray-400">
                              {d.category?.name}
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeDraft(d.id)}
                            className="ml-3 rounded-lg p-2 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-950/40"
                            aria-label="Retirer l'annonce du lot"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                    <Button
                      variant="outline"
                      icon={Save}
                      onClick={addToBatch}
                      disabled={isSubmitting}
                    >
                      Ajouter au lot
                    </Button>
                    <Button
                      icon={Send}
                      size="lg"
                      onClick={handlePublishBatch}
                      disabled={isSubmitting}
                      loading={isSubmitting}
                    >
                      {isSubmitting
                        ? batchProgress.total > 0
                          ? `Publication ${batchProgress.done}/${batchProgress.total}...`
                          : "Publication en cours..."
                        : `Tout publier (${draftList.length + 1})`}
                    </Button>
                  </div>
                </div>
              ) : (
              <div className="flex flex-col items-center py-12 text-center">
                <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-brand-200 dark:bg-brand-800/10">
                  <Send className="h-12 w-12 text-brand-800" />
                </div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  Prêt à publier ?
                </h2>
                <p className="mt-2 max-w-md text-sm text-gray-500 dark:text-gray-400">
                  Votre annonce sera visible immédiatement après la publication.
                </p>
                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                  <Button
                    icon={Send}
                    size="lg"
                    onClick={handlePublish}
                    disabled={isSubmitting}
                    loading={isSubmitting}
                  >
                    {isSubmitting ? "Publication en cours..." : "Publier l'annonce"}
                  </Button>
                  <Button
                    variant="outline"
                    icon={Save}
                    onClick={handleSaveDraft}
                  >
                    Sauvegarder brouillon
                  </Button>
                </div>
              </div>
              )
            )}
          </ListingFormStep>
        );

      default:
        return null;
    }
  };

  if (kycLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white dark:bg-gray-950">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-800 border-t-transparent" />
      </div>
    );
  }

  if (kycStatus && !kycStatus.identityVerified) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-950">
        <div className="mx-auto max-w-lg px-4 py-16 sm:px-6">
          <BackButton />
          <div className="mt-6 rounded-2xl border border-gray-100 bg-white p-8 text-center shadow-sm dark:border-gray-800 dark:bg-gray-800">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-amber-50 dark:bg-amber-900/20">
              <ShieldCheck className="h-8 w-8 text-amber-600" />
            </div>
            <h1 className="mt-5 text-xl font-bold text-gray-900 dark:text-white">
              Vérification requise pour vendre
            </h1>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              Pour publier une annonce, votre identité doit d'abord être vérifiée.
              Soumettez votre pièce d'identité et un selfie — la vérification prend 24-48h.
            </p>
            <Button
              variant="primary"
              fullWidth
              className="mt-6"
              onClick={() => navigate("/parametres")}
            >
              Vérifier mon identité
            </Button>
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="mt-3 text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
            >
              Retour
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      <div className="mx-auto max-w-8xl px-4 py-6 sm:px-6">
        <BackButton />
        <div className="mb-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Nouvelle annonce
              </h1>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Remplissez les informations pour publier votre annonce
              </p>
            </div>
            <button
              type="button"
              onClick={() => setBatchMode((m) => !m)}
              className={`flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
                batchMode
                  ? "border-brand-600 bg-brand-50 text-brand-700 dark:border-brand-500 dark:bg-brand-700/10 dark:text-brand-400"
                  : "border-gray-200 text-gray-600 hover:border-gray-300 dark:border-gray-700 dark:text-gray-400 dark:hover:border-gray-600"
              }`}
            >
              <Layers className="h-4 w-4" />
              Mode lot
              <span
                className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                  batchMode ? "bg-brand-700" : "bg-gray-300 dark:bg-gray-700"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
                    batchMode ? "translate-x-4" : "translate-x-0.5"
                  }`}
                />
              </span>
            </button>
          </div>
          {batchMode && (
            <p className="mt-2 text-sm text-brand-700 dark:text-brand-400">
              {draftList.length > 0
                ? `${draftList.length} annonce(s) dans le lot.`
                : "Préparez plusieurs annonces puis publiez-les d'un coup."}
            </p>
          )}
        </div>

        <div className="mb-8 overflow-hidden rounded-2xl border border-gray-100 bg-white px-4 py-5 dark:border-gray-800 dark:bg-gray-800">
          <StepIndicator steps={WIZARD_STEPS} currentStep={currentStep} />
        </div>

        <div className="min-h-[400px] rounded-2xl border border-gray-100 bg-white p-6 dark:border-gray-800 dark:bg-gray-800 sm:p-8">
          <AnimatePresence mode="wait">{renderStep()}</AnimatePresence>
        </div>

        {currentStep < WIZARD_STEPS.length - 1 && (
          <div className="mt-6 flex items-center justify-between">
            <Button
              variant="ghost"
              icon={ChevronLeft}
              onClick={handleBack}
              disabled={currentStep === 0}
            >
              Retour
            </Button>

            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                icon={Save}
                onClick={handleSaveDraft}
                className="hidden sm:inline-flex"
              >
                Brouillon
              </Button>

              {currentStep === WIZARD_STEPS.length - 2 ? (
                <Button icon={Eye} onClick={handleNext}>
                  Aperçu
                </Button>
              ) : (
                <Button icon={ChevronRight} iconPosition="right" onClick={handleNext}>
                  Suivant
                </Button>
              )}
            </div>
          </div>
        )}
      </div>

      <Modal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        title="Ajouter un moyen de réception"
        size="sm"
        footer={
          <div className="flex gap-3 justify-end">
            <Button variant="ghost" size="sm" onClick={() => setShowPaymentModal(false)}>Annuler</Button>
            <Button
              variant="primary"
              size="sm"
              disabled={!newMethod.providerUserId || addPayment.isPending}
              onClick={async () => {
                try {
                  await addPayment.mutateAsync(newMethod);
                  setShowPaymentModal(false);
                  toast.success("Moyen de réception ajouté");
                  if (pendingPublish === "batch") handlePublishBatch();
                  else handlePublish();
                } catch {
                  toast.error("Erreur lors de l'ajout du moyen de réception");
                }
              }}
            >
              {addPayment.isPending ? "Ajout..." : "Ajouter"}
            </Button>
          </div>
        }
      >
        <div className="space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Opérateur</label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { value: "flooz", label: "Flooz", icon: Smartphone },
                { value: "tmoney", label: "T-Money", icon: Smartphone },
              ].map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setNewMethod({ ...newMethod, provider: opt.value })}
                  className={`flex items-center gap-2 rounded-xl border p-3 text-sm font-medium transition-colors ${
                    newMethod.provider === opt.value
                      ? "border-brand-600 bg-brand-50 text-brand-700 dark:border-brand-500 dark:bg-brand-700/10 dark:text-brand-400"
                      : "border-gray-200 text-gray-600 hover:border-gray-300 dark:border-gray-700 dark:text-gray-400"
                  }`}
                >
                  <opt.icon className="h-5 w-5" />
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Numéro de téléphone</label>
            <input
              type="tel"
              value={newMethod.providerUserId}
              onChange={(e) => setNewMethod({ ...newMethod, providerUserId: e.target.value })}
              placeholder="+228 XX XX XX XX"
              className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:border-brand-600 focus:outline-none focus:ring-1 focus:ring-brand-600 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
            />
          </div>
        </div>
      </Modal>
    </div>
  );
}

const ICON_MAP = {
  Smartphone,
  Car,
  Laptop,
  Sofa,
  Shirt,
  Home,
  Refrigerator,
  Gamepad2,
  Dumbbell,
  Sparkles,
  Baby,
  Apple,
  Briefcase,
  PawPrint,
  BookOpen,
  Music,
  Palette,
  TreePine,
  Wrench,
  Package,
};

function getIconComponent(iconName) {
  return ICON_MAP[iconName] || Package;
}
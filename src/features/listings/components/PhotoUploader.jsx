// import { useState, useRef, useCallback } from "react";
// import { AnimatePresence, Reorder } from "framer-motion";
// import { Camera, X, Plus, GripVertical, Upload } from "lucide-react";
// import { cn } from "@/shared/utils/cn";
// import { MAX_IMAGES_PER_LISTING } from "@/shared/constants";

// export default function PhotoUploader({
//   photos = [],
//   onPhotosChange,
//   maxPhotos = MAX_IMAGES_PER_LISTING,
//   error,
// }) {
//   const [isDragOver, setIsDragOver] = useState(false);
//   const fileInputRef = useRef(null);

//   const processFiles = useCallback(
//     (files) => {
//       const remaining = maxPhotos - photos.length;
//       const imageFiles = Array.from(files)
//         .filter((f) => f.type.startsWith("image/"))
//         .slice(0, remaining);

//       if (imageFiles.length === 0) return;

//       const newPhotos = imageFiles.map((file) => ({
//         id: `photo-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
//         url: URL.createObjectURL(file),
//         file,
//         name: file.name,
//       }));

//       onPhotosChange?.([...photos, ...newPhotos]);
//     },
//     [photos, maxPhotos, onPhotosChange]
//   );

//   const handleFileChange = useCallback(
//     (e) => {
//       processFiles(e.target.files);
//       e.target.value = "";
//     },
//     [processFiles]
//   );

//   const openFilePicker = useCallback(() => {
//     fileInputRef.current?.click();
//   }, []);

//   const removePhoto = useCallback(
//     (id) => {
//       const photo = photos.find((p) => p.id === id);
//       if (photo?.url?.startsWith("blob:")) {
//         URL.revokeObjectURL(photo.url);
//       }
//       onPhotosChange?.(photos.filter((p) => p.id !== id));
//     },
//     [photos, onPhotosChange]
//   );

//   const handleDragOver = useCallback((e) => {
//     e.preventDefault();
//     setIsDragOver(true);
//   }, []);

//   const handleDragLeave = useCallback(() => {
//     setIsDragOver(false);
//   }, []);

//   const handleDrop = useCallback(
//     (e) => {
//       e.preventDefault();
//       setIsDragOver(false);
//       processFiles(e.dataTransfer.files);
//     },
//     [processFiles]
//   );

//   const reorderPhotos = useCallback(
//     (newOrder) => {
//       onPhotosChange?.(newOrder);
//     },
//     [onPhotosChange]
//   );

//   return (
//     <div className="space-y-4">
//       <input
//         ref={fileInputRef}
//         type="file"
//         accept="image/*"
//         multiple
//         className="hidden"
//         onChange={handleFileChange}
//       />

//       <div
//         onDragOver={handleDragOver}
//         onDragLeave={handleDragLeave}
//         onDrop={handleDrop}
//         onClick={openFilePicker}
//         className={cn(
//           "relative cursor-pointer rounded-2xl border-2 border-dashed p-8 text-center transition-all",
//           isDragOver
//             ? "border-brand-800 bg-brand-50 dark:bg-brand-800/10"
//             : "border-gray-300 hover:border-brand-700 hover:bg-gray-50 dark:border-gray-700 dark:hover:border-brand-800 dark:hover:bg-gray-800/50",
//           photos.length >= maxPhotos && "cursor-not-allowed opacity-50"
//         )}
//       >
//         <div className="flex flex-col items-center gap-3">
//           <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-200 dark:bg-brand-800/10">
//             <Upload className="h-7 w-7 text-brand-800" />
//           </div>
//           <div>
//             <p className="text-sm font-semibold text-gray-900 dark:text-white">
//               {isDragOver
//                 ? "Déposez vos photos ici"
//                 : "Ajoutez des photos à votre annonce"}
//             </p>
//             <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
//               Glissez-déposez ou cliquez pour ajouter &bull; {photos.length}/{maxPhotos}{" "}
//               photos
//             </p>
//           </div>
//           {photos.length < maxPhotos && (
//             <button
//               type="button"
//               onClick={(e) => {
//                 e.stopPropagation();
//                 openFilePicker();
//               }}
//               className="inline-flex items-center gap-1.5 rounded-lg bg-brand-800 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-brand-900"
//             >
//               <Camera className="h-4 w-4" />
//               Ajouter une photo
//             </button>
//           )}
//         </div>
//       </div>

//       {error && (
//         <p className="text-xs text-red-700 dark:text-red-400">{error}</p>
//       )}

//       {photos.length > 0 && (
//         <Reorder.Group
//           axis="x"
//           values={photos}
//           onReorder={reorderPhotos}
//           className="flex gap-3 overflow-x-auto pb-2"
//         >
//           <AnimatePresence mode="popLayout">
//             {photos.map((photo, index) => (
//               <Reorder.Item
//                 key={photo.id}
//                 value={photo}
//                 initial={{ opacity: 0, scale: 0.8 }}
//                 animate={{ opacity: 1, scale: 1 }}
//                 exit={{ opacity: 0, scale: 0.8 }}
//                 className="group relative shrink-0"
//               >
//                 <div className="relative h-28 w-28 overflow-hidden rounded-xl border-2 border-gray-200 dark:border-gray-700">
//                   <img
//                     src={photo.url}
//                     alt={photo.name}
//                     className="h-full w-full object-cover"
//                   />
//                   <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition-colors group-hover:bg-black/30">
//                     <GripVertical className="h-5 w-5 text-white opacity-0 transition-opacity group-hover:opacity-100" />
//                   </div>
//                   <button
//                     type="button"
//                     onClick={(e) => {
//                       e.stopPropagation();
//                       removePhoto(photo.id);
//                     }}
//                     className="absolute right-1.5 top-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-black/60 text-white opacity-0 transition-opacity group-hover:opacity-100 hover:bg-black/80"
//                   >
//                     <X className="h-3.5 w-3.5" />
//                   </button>
//                   <div className="absolute bottom-1.5 left-1.5">
//                     <span className="rounded-md bg-black/60 px-1.5 py-0.5 text-[10px] font-bold text-white">
//                       {index + 1}
//                     </span>
//                   </div>
//                   {index === 0 && (
//                     <div className="absolute left-1.5 top-1.5">
//                       <span className="rounded-md bg-brand-800 px-1.5 py-0.5 text-[10px] font-bold text-white">
//                         Principale
//                       </span>
//                     </div>
//                   )}
//                 </div>
//               </Reorder.Item>
//             ))}
//           </AnimatePresence>

//           {photos.length < maxPhotos && (
//             <button
//               type="button"
//               onClick={openFilePicker}
//               className="flex h-28 w-28 shrink-0 items-center justify-center rounded-xl border-2 border-dashed border-gray-300 transition-colors hover:border-brand-700 hover:bg-brand-50 dark:border-gray-700 dark:hover:border-brand-800 dark:hover:bg-gray-800/50"
//             >
//               <Plus className="h-6 w-6 text-gray-400" />
//             </button>
//           )}
//         </Reorder.Group>
//       )}
//     </div>
//   );
// }

import { useState, useRef, useCallback } from "react";
import { AnimatePresence, Reorder } from "framer-motion";
import { Camera, X, Plus, GripVertical, Upload, ImagePlus } from "lucide-react";
import { cn } from "@/shared/utils/cn";
import { MAX_IMAGES_PER_LISTING } from "@/shared/constants";

export default function PhotoUploader({
  photos = [],
  onPhotosChange,
  maxPhotos = MAX_IMAGES_PER_LISTING,
  error,
}) {
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef(null);
  const cameraInputRef = useRef(null);

  const processFiles = useCallback(
    (files) => {
      const remaining = maxPhotos - photos.length;
      const imageFiles = Array.from(files)
        .filter((f) => f.type.startsWith("image/"))
        .slice(0, remaining);

      if (imageFiles.length === 0) return;

      const newPhotos = imageFiles.map((file) => ({
        id: `photo-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        url: URL.createObjectURL(file),
        file,
        name: file.name,
      }));

      onPhotosChange?.([...photos, ...newPhotos]);
    },
    [photos, maxPhotos, onPhotosChange]
  );

  const handleFileChange = useCallback(
    (e) => {
      processFiles(e.target.files);
      e.target.value = "";
    },
    [processFiles]
  );

  // Même pipeline que la galerie : le fichier capturé passe par processFiles
  const handleCameraChange = useCallback(
    (e) => {
      processFiles(e.target.files);
      e.target.value = "";
    },
    [processFiles]
  );

  const openFilePicker = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const openCamera = useCallback(() => {
    cameraInputRef.current?.click();
  }, []);

  const removePhoto = useCallback(
    (id) => {
      const photo = photos.find((p) => p.id === id);
      if (photo?.url?.startsWith("blob:")) {
        URL.revokeObjectURL(photo.url);
      }
      onPhotosChange?.(photos.filter((p) => p.id !== id));
    },
    [photos, onPhotosChange]
  );

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback(
    (e) => {
      e.preventDefault();
      setIsDragOver(false);
      processFiles(e.dataTransfer.files);
    },
    [processFiles]
  );

  const reorderPhotos = useCallback(
    (newOrder) => {
      onPhotosChange?.(newOrder);
    },
    [onPhotosChange]
  );

  const canAddMore = photos.length < maxPhotos;

  return (
    <div className="space-y-4">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={handleFileChange}
      />

      {/* Input dédié à la capture caméra : capture="environment" ouvre directement
          l'appareil photo arrière sur mobile au lieu de la galerie */}
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={handleCameraChange}
      />

      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={openFilePicker}
        className={cn(
          "relative cursor-pointer rounded-2xl border-2 border-dashed p-8 text-center transition-all",
          isDragOver
            ? "border-brand-800 bg-brand-50 dark:bg-brand-800/10"
            : "border-gray-300 hover:border-brand-700 hover:bg-gray-50 dark:border-gray-700 dark:hover:border-brand-800 dark:hover:bg-gray-800/50",
          photos.length >= maxPhotos && "cursor-not-allowed opacity-50"
        )}
      >
        <div className="flex flex-col items-center gap-3">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-200 dark:bg-brand-800/10">
            <Upload className="h-7 w-7 text-brand-800" />
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-900 dark:text-white">
              {isDragOver
                ? "Déposez vos photos ici"
                : "Ajoutez des photos à votre annonce"}
            </p>
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              Glissez-déposez, prenez une photo ou cliquez pour ajouter &bull;{" "}
              {photos.length}/{maxPhotos} photos
            </p>
          </div>
          {canAddMore && (
            <div className="flex flex-wrap items-center justify-center gap-2">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  openCamera();
                }}
                className="inline-flex items-center gap-1.5 rounded-lg bg-brand-800 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-brand-900"
              >
                <Camera className="h-4 w-4" />
                Prendre une photo
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  openFilePicker();
                }}
                className="inline-flex items-center gap-1.5 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
              >
                <ImagePlus className="h-4 w-4" />
                Depuis la galerie
              </button>
            </div>
          )}
        </div>
      </div>

      {error && (
        <p className="text-xs text-red-700 dark:text-red-400">{error}</p>
      )}

      {photos.length > 0 && (
        <Reorder.Group
          axis="x"
          values={photos}
          onReorder={reorderPhotos}
          className="flex gap-3 overflow-x-auto pb-2"
        >
          <AnimatePresence mode="popLayout">
            {photos.map((photo, index) => (
              <Reorder.Item
                key={photo.id}
                value={photo}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="group relative shrink-0"
              >
                <div className="relative h-28 w-28 overflow-hidden rounded-xl border-2 border-gray-200 dark:border-gray-700">
                  <img
                    src={photo.url}
                    alt={photo.name}
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition-colors group-hover:bg-black/30">
                    <GripVertical className="h-5 w-5 text-white opacity-0 transition-opacity group-hover:opacity-100" />
                  </div>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      removePhoto(photo.id);
                    }}
                    className="absolute right-1.5 top-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-black/60 text-white opacity-0 transition-opacity group-hover:opacity-100 hover:bg-black/80"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                  <div className="absolute bottom-1.5 left-1.5">
                    <span className="rounded-md bg-black/60 px-1.5 py-0.5 text-[10px] font-bold text-white">
                      {index + 1}
                    </span>
                  </div>
                  {index === 0 && (
                    <div className="absolute left-1.5 top-1.5">
                      <span className="rounded-md bg-brand-800 px-1.5 py-0.5 text-[10px] font-bold text-white">
                        Principale
                      </span>
                    </div>
                  )}
                </div>
              </Reorder.Item>
            ))}
          </AnimatePresence>

          {canAddMore && (
            <button
              type="button"
              onClick={openFilePicker}
              className="flex h-28 w-28 shrink-0 items-center justify-center rounded-xl border-2 border-dashed border-gray-300 transition-colors hover:border-brand-700 hover:bg-brand-50 dark:border-gray-700 dark:hover:border-brand-800 dark:hover:bg-gray-800/50"
            >
              <Plus className="h-6 w-6 text-gray-400" />
            </button>
          )}
        </Reorder.Group>
      )}
    </div>
  );
}
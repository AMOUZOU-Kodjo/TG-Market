import { useState, useRef, useCallback } from "react";
import { AnimatePresence, Reorder } from "framer-motion";
import { Camera, X, Plus, GripVertical, Upload } from "lucide-react";
import { cn } from "@/shared/utils/cn";
import { MAX_IMAGES_PER_LISTING } from "@/shared/constants";

const PLACEHOLDER_PHOTOS = [
  "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=600&h=400&fit=crop",
  "https://images.unsplash.com/photo-1606722590583-6951b5ea92ad?w=600&h=400&fit=crop",
  "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&h=400&fit=crop",
  "https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=600&h=400&fit=crop",
  "https://images.unsplash.com/photo-1509391366360-2e959784a276?w=600&h=400&fit=crop",
  "https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=600&h=400&fit=crop",
  "https://images.unsplash.com/photo-1590735213920-68192a487bc2?w=600&h=400&fit=crop",
  "https://images.unsplash.com/photo-1541643600914-78b084683601?w=600&h=400&fit=crop",
  "https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=600&h=400&fit=crop",
  "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&h=400&fit=crop",
];

export default function PhotoUploader({
  photos = [],
  onPhotosChange,
  maxPhotos = MAX_IMAGES_PER_LISTING,
  error,
}) {
  const [isDragOver, setIsDragOver] = useState(false);
  const placeholderIndex = useRef(0);

  const addPhoto = useCallback(() => {
    if (photos.length >= maxPhotos) return;
    const newPhoto = {
      id: `photo-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      url: PLACEHOLDER_PHOTOS[placeholderIndex.current % PLACEHOLDER_PHOTOS.length],
      name: `Photo ${photos.length + 1}`,
    };
    placeholderIndex.current++;
    onPhotosChange?.([...photos, newPhoto]);
  }, [photos, maxPhotos, onPhotosChange]);

  const removePhoto = useCallback(
    (id) => {
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
      addPhoto();
    },
    [addPhoto]
  );

  const reorderPhotos = useCallback(
    (newOrder) => {
      onPhotosChange?.(newOrder);
    },
    [onPhotosChange]
  );

  return (
    <div className="space-y-4">
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => photos.length < maxPhotos && addPhoto()}
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
              Glissez-déposez ou cliquez pour ajouter • {photos.length}/{maxPhotos}{" "}
              photos
            </p>
          </div>
          {photos.length < maxPhotos && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                addPhoto();
              }}
              className="inline-flex items-center gap-1.5 rounded-lg bg-brand-800 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-brand-900"
            >
              <Camera className="h-4 w-4" />
              Ajouter une photo
            </button>
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

          {photos.length < maxPhotos && (
            <button
              type="button"
              onClick={addPhoto}
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


import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Image, Upload, XCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import LoadingSpinner from "./LoadingSpinner";

interface ImageUploadProps {
  bucketName: string;
  onImageUploaded: (imageUrl: string) => void;
  currentImageUrl?: string;
  className?: string;
  maxSize?: number; // Taille maximale en Mo
  aspectRatio?: number; // Rapport largeur/hauteur
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  bucketName,
  onImageUploaded,
  currentImageUrl,
  className = "",
  maxSize = 2, // Par défaut 2 Mo
  aspectRatio,
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | undefined>(currentImageUrl);
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  // Mettre à jour l'URL de prévisualisation si l'URL actuelle change
  useEffect(() => {
    setPreviewUrl(currentImageUrl);
  }, [currentImageUrl]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Valider le type de fichier
    if (!file.type.startsWith("image/")) {
      toast.error("Le fichier doit être une image");
      return;
    }

    // Valider la taille du fichier
    const maxSizeBytes = maxSize * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      toast.error(`L'image ne doit pas dépasser ${maxSize} Mo`);
      return;
    }

    try {
      setIsUploading(true);
      
      // Créer un nom de fichier unique avec timestamp et nom original
      const timestamp = new Date().getTime();
      const fileExt = file.name.split('.').pop();
      const fileName = `${timestamp}_${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
      const filePath = `${fileName}`;
      
      // Optimiser l'image côté client avant l'upload (si possible)
      let fileToUpload = file;
      
      // Upload du fichier vers Supabase Storage
      const { data, error } = await supabase.storage
        .from(bucketName)
        .upload(filePath, fileToUpload, {
          cacheControl: '3600', // Cache control d'1 heure
          upsert: false
        });

      if (error) {
        throw error;
      }

      // Obtenir l'URL publique pour le fichier uploadé
      const { data: { publicUrl } } = supabase.storage
        .from(bucketName)
        .getPublicUrl(filePath);

      // Définir la prévisualisation et appeler le callback onImageUploaded
      setPreviewUrl(publicUrl);
      onImageUploaded(publicUrl);
      
      toast.success("Image téléchargée avec succès");
    } catch (error) {
      console.error("Erreur lors du téléchargement de l'image:", error);
      toast.error("Erreur lors du téléchargement de l'image");
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveImage = () => {
    setPreviewUrl(undefined);
    setIsImageLoaded(false);
    onImageUploaded("");
  };

  return (
    <div className={`${className} space-y-2`}>
      {previewUrl ? (
        <div className="relative">
          {!isImageLoaded && (
            <div className="absolute inset-0 flex items-center justify-center bg-muted/30">
              <LoadingSpinner size="sm" />
            </div>
          )}
          <img 
            src={previewUrl} 
            alt="Prévisualisation" 
            loading="lazy" // Lazy loading natif
            className={`w-full h-48 object-cover rounded-md transition-opacity ${isImageLoaded ? 'opacity-100' : 'opacity-0'}`}
            onLoad={() => setIsImageLoaded(true)}
            onError={(e) => {
              e.currentTarget.src = "/placeholder.svg";
              e.currentTarget.classList.add("p-6");
              setIsImageLoaded(true);
            }}
          />
          <button 
            type="button"
            onClick={handleRemoveImage}
            className="absolute top-2 right-2 bg-black/70 text-white p-1 rounded-full hover:bg-black/90 transition-colors"
            aria-label="Supprimer l'image"
          >
            <XCircle size={20} />
          </button>
        </div>
      ) : (
        <div className="w-full h-48 border-2 border-dashed rounded-md flex flex-col items-center justify-center bg-muted/30 p-4">
          {isUploading ? (
            <div className="flex flex-col items-center space-y-2">
              <LoadingSpinner />
              <span className="text-sm text-muted-foreground">Téléchargement en cours...</span>
            </div>
          ) : (
            <>
              <Image className="h-10 w-10 text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground text-center">
                Cliquez pour télécharger une image<br/>
                <span className="text-xs">(JPG, PNG, max {maxSize} Mo)</span>
              </p>
            </>
          )}
        </div>
      )}
      
      <Button
        type="button"
        variant="outline"
        disabled={isUploading}
        className="w-full"
        onClick={() => document.getElementById(`file-upload-${bucketName}`)?.click()}
      >
        {isUploading ? (
          <LoadingSpinner size="sm" className="mr-2" />
        ) : (
          <Upload className="mr-2 h-4 w-4" />
        )}
        {previewUrl ? "Changer l'image" : "Télécharger une image"}
      </Button>
      <input
        id={`file-upload-${bucketName}`}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
        disabled={isUploading}
        aria-label="Sélectionner une image"
      />
    </div>
  );
};

export default ImageUpload;

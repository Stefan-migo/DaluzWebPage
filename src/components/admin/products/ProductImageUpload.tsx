"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Upload,
  X,
  Image as ImageIcon,
  Loader2,
  ExternalLink,
  GripVertical,
} from "lucide-react";
import { toast } from "sonner";

interface ProductImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
  aspectRatio?: "square" | "video" | "portrait";
}

export default function ProductImageUpload({
  value,
  onChange,
  label = "Imagen",
  aspectRatio = "square",
}: ProductImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const aspectRatioClasses = {
    square: "aspect-square",
    video: "aspect-video",
    portrait: "aspect-[3/4]",
  };

  const handleFileSelect = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("Por favor selecciona un archivo de imagen válido");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("La imagen debe ser menor a 5MB");
      return;
    }

    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", "products");

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Error al subir la imagen");
      }

      const data = await response.json();

      if (data.url) {
        onChange(data.url);
        toast.success("Imagen subida exitosamente");
      } else {
        throw new Error("No se recibió URL de la imagen");
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error("Error al subir la imagen. Inténtalo de nuevo.");
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);

    const file = e.dataTransfer.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Por favor selecciona un archivo de imagen válido");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("La imagen debe ser menor a 5MB");
      return;
    }

    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", "products");

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Error al subir la imagen");
      }

      const data = await response.json();

      if (data.url) {
        onChange(data.url);
        toast.success("Imagen subida exitosamente");
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error("Error al subir la imagen");
    } finally {
      setUploading(false);
    }
  };

  const handleUrlSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const url = formData.get("url") as string;
    if (url) {
      onChange(url);
      setShowUrlInput(false);
    }
  };

  const clearImage = () => {
    onChange("");
  };

  return (
    <div className="space-y-2">
      {label && (
        <Label
          className="text-sm font-medium"
          style={{ color: "var(--admin-text-secondary)" }}
        >
          {label}
        </Label>
      )}

      {value ? (
        // Vista previa de imagen cargada
        <div
          className={`relative ${aspectRatioClasses[aspectRatio]} group rounded-xl overflow-hidden border-2 transition-all duration-200`}
          style={{
            borderColor: "var(--admin-border-secondary)",
          }}
        >
          <img
            src={value}
            alt={label}
            className="w-full h-full object-cover"
            onError={() => {
              toast.error("Error al cargar la imagen");
              onChange("");
            }}
          />

          {/* Overlay con acciones */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-200 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
              className="bg-white text-gray-900 hover:bg-gray-100 shadow-lg"
            >
              <Upload className="h-4 w-4 mr-1" />
              Cambiar
            </Button>
            <Button
              type="button"
              variant="destructive"
              size="sm"
              onClick={clearImage}
              className="shadow-lg"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Indicador de imagen cargada */}
          <div
            className="absolute top-2 right-2 px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1"
            style={{
              backgroundColor: "var(--admin-success)",
              color: "white",
            }}
          >
            <ImageIcon className="h-3 w-3" />
            Cargada
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
            disabled={uploading}
          />
        </div>
      ) : (
        // Zona de carga (dropzone)
        <div
          className={`
            ${aspectRatioClasses[aspectRatio]}
            relative rounded-xl border-2 border-dashed transition-all duration-200
            flex flex-col items-center justify-center cursor-pointer
            ${dragOver ? "scale-[1.02]" : ""}
          `}
          style={{
            borderColor: dragOver
              ? "var(--admin-bg-secondary)"
              : "var(--admin-border-secondary)",
            backgroundColor: dragOver
              ? "rgba(139, 0, 0, 0.05)"
              : "var(--admin-bg-tertiary)",
          }}
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
            disabled={uploading}
          />

          {uploading ? (
            <div className="flex flex-col items-center gap-3 p-4">
              <Loader2
                className="h-10 w-10 animate-spin"
                style={{ color: "var(--admin-bg-secondary)" }}
              />
              <p
                className="text-sm font-medium"
                style={{ color: "var(--admin-text-secondary)" }}
              >
                Subiendo imagen...
              </p>
              <p className="text-xs text-gray-500">Por favor espera</p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-3 p-4 text-center">
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center transition-transform duration-200 hover:scale-110"
                style={{ backgroundColor: "rgba(139, 0, 0, 0.1)" }}
              >
                <Upload
                  className="h-8 w-8"
                  style={{ color: "var(--admin-bg-secondary)" }}
                />
              </div>
              <div>
                <p
                  className="text-sm font-medium"
                  style={{ color: "var(--admin-text-secondary)" }}
                >
                  Arrastra una imagen o haz clic para seleccionar
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  JPG, PNG o WebP. Máximo 5MB.
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Botón de URL alternativa */}
      {!value && (
        <Button
          type="button"
          variant="link"
          size="sm"
          onClick={() => setShowUrlInput(!showUrlInput)}
          className="text-xs h-auto p-0 text-gray-500 hover:text-gray-700"
        >
          <ExternalLink className="h-3 w-3 mr-1" />
          {showUrlInput ? "Cancelar" : "Usar URL de imagen"}
        </Button>
      )}

      {/* Input de URL */}
      {showUrlInput && (
        <form onSubmit={handleUrlSubmit} className="flex gap-2">
          <Input
            name="url"
            placeholder="https://ejemplo.com/imagen.jpg"
            className="admin-input flex-1"
            defaultValue={value}
          />
          <Button
            type="submit"
            size="sm"
            style={{
              backgroundColor: "var(--admin-bg-secondary)",
              color: "white",
            }}
          >
            Agregar
          </Button>
        </form>
      )}
    </div>
  );
}

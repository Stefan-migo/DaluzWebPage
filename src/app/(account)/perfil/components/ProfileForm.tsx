"use client";

import { UseFormRegister, UseFormWatch, FieldErrors } from "react-hook-form";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Save,
  X,
  Loader2,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { StaggeredContainer, StaggeredItem } from "./AnimatedEntry";

interface ProfileFormProps {
  isEditing: boolean;
  isLoading: boolean;
  register: UseFormRegister<{
    firstName: string;
    lastName: string;
    phone?: string;
    dateOfBirth?: string;
    city?: string;
    country?: string;
    addressLine1?: string;
    addressLine2?: string;
    postalCode?: string;
    bio?: string;
  }>;
  errors: FieldErrors<{
    firstName: string;
    lastName: string;
    phone?: string;
    dateOfBirth?: string;
    city?: string;
    country?: string;
    addressLine1?: string;
    addressLine2?: string;
    postalCode?: string;
    bio?: string;
  }>;
  watch: UseFormWatch<{
    firstName: string;
    lastName: string;
    phone?: string;
    dateOfBirth?: string;
    city?: string;
    country?: string;
    addressLine1?: string;
    addressLine2?: string;
    postalCode?: string;
    bio?: string;
  }>;
  // User data
  email?: string;
  firstName?: string | null;
  lastName?: string | null;
  phone?: string | null;
  dateOfBirth?: string | null;
  city?: string | null;
  addressLine1?: string | null;
  postalCode?: string | null;
  country?: string | null;
  bio?: string | null;
  // Formatters
  formatDate: (dateString?: string) => string;
  // Handlers
  onCancel: () => void;
}

export function ProfileForm({
  isEditing,
  isLoading,
  register,
  errors,
  watch,
  email,
  firstName,
  lastName,
  phone,
  dateOfBirth,
  city,
  addressLine1,
  postalCode,
  country,
  bio,
  formatDate,
  onCancel,
}: ProfileFormProps) {
  return (
    <Card variant="brand-subtle" className="shadow-alkimya overflow-hidden">
      <CardHeader className="bg-bg-light">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <CardTitle size="lg" theme="elegant" className="text-text-primary">
              Información Personal
            </CardTitle>
            <CardDescription
              size="lg"
              theme="elegant"
              className="text-text-primary/70"
            >
              Mantén tu información actualizada para una mejor experiencia
            </CardDescription>
          </div>
          {isEditing && (
            <div className="flex gap-2">
              <Button
                type="button"
                variant="brand-outline"
                onClick={onCancel}
                className="font-title uppercase tracking-wider"
              >
                <X className="h-4 w-4 mr-2" />
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={isLoading}
                variant="brand"
                className="font-title uppercase tracking-wider"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Guardando...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Guardar
                  </>
                )}
              </Button>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="bg-bg-light p-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={isEditing ? "editing" : "viewing"}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="space-y-6"
          >
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-subtitle text-text-primary italic flex items-center gap-2">
                <User className="h-5 w-5" />
                Información Básica
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label
                    htmlFor="firstName"
                    className="text-text-primary font-text font-medium"
                  >
                    Nombre
                  </Label>
                  {isEditing ? (
                    <Input
                      id="firstName"
                      {...register("firstName")}
                      className={`font-text border-brand-primary/30 focus:border-brand-primary focus:ring-brand-primary/50 ${
                        errors.firstName ? "border-red-500" : ""
                      }`}
                    />
                  ) : (
                    <div className="text-text-primary bg-white px-3 py-2 rounded-md border border-brand-primary/20 font-text">
                      {firstName || "No especificado"}
                    </div>
                  )}
                  {errors.firstName && (
                    <p className="text-sm text-red-600 font-text">
                      {errors.firstName.message as string}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="lastName"
                    className="text-text-primary font-text font-medium"
                  >
                    Apellido
                  </Label>
                  {isEditing ? (
                    <Input
                      id="lastName"
                      {...register("lastName")}
                      className={`font-text border-brand-primary/30 focus:border-brand-primary focus:ring-brand-primary/50 ${
                        errors.lastName ? "border-red-500" : ""
                      }`}
                    />
                  ) : (
                    <div className="text-text-primary bg-white px-3 py-2 rounded-md border border-brand-primary/20 font-text">
                      {lastName || "No especificado"}
                    </div>
                  )}
                  {errors.lastName && (
                    <p className="text-sm text-red-600 font-text">
                      {errors.lastName.message as string}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="space-y-4 pt-4 border-t border-brand-primary/20">
              <h3 className="text-lg font-subtitle text-text-primary italic flex items-center gap-2">
                <Mail className="h-5 w-5" />
                Información de Contacto
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label
                    htmlFor="email"
                    className="text-text-primary font-text font-medium"
                  >
                    Email
                  </Label>
                  <div className="text-text-primary bg-white px-3 py-2 rounded-md border border-brand-primary/20 font-text">
                    {email}
                  </div>
                  <p className="text-xs text-text-primary/60 font-text">
                    El email no se puede modificar
                  </p>
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="phone"
                    className="text-text-primary font-text font-medium"
                  >
                    Teléfono
                  </Label>
                  {isEditing ? (
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="+54 9 11 1234-5678"
                      {...register("phone")}
                      className={`font-text border-brand-primary/30 focus:border-brand-primary focus:ring-brand-primary/50 ${
                        errors.phone ? "border-red-500" : ""
                      }`}
                    />
                  ) : (
                    <div className="text-text-primary bg-white px-3 py-2 rounded-md border border-brand-primary/20 font-text">
                      {phone || "No especificado"}
                    </div>
                  )}
                  {errors.phone && (
                    <p className="text-sm text-red-600 font-text">
                      {errors.phone.message as string}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Personal Details */}
            <div className="space-y-4 pt-4 border-t border-brand-primary/20">
              <h3 className="text-lg font-subtitle text-text-primary italic flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Detalles Personales
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label
                    htmlFor="dateOfBirth"
                    className="text-text-primary font-text font-medium"
                  >
                    Fecha de Nacimiento
                  </Label>
                  {isEditing ? (
                    <Input
                      id="dateOfBirth"
                      type="date"
                      {...register("dateOfBirth")}
                      className="font-text border-brand-primary/30 focus:border-brand-primary focus:ring-brand-primary/50"
                    />
                  ) : (
                    <div className="text-text-primary bg-white px-3 py-2 rounded-md border border-brand-primary/20 font-text">
                      {formatDate(dateOfBirth || undefined)}
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="city"
                    className="text-text-primary font-text font-medium"
                  >
                    Ciudad
                  </Label>
                  {isEditing ? (
                    <Input
                      id="city"
                      placeholder="Buenos Aires"
                      {...register("city")}
                      className="font-text border-brand-primary/30 focus:border-brand-primary focus:ring-brand-primary/50"
                    />
                  ) : (
                    <div className="text-text-primary bg-white px-3 py-2 rounded-md border border-brand-primary/20 font-text">
                      {city || "No especificado"}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Address - Only show when editing */}
            {isEditing && (
              <div className="space-y-4 pt-4 border-t border-brand-primary/20">
                <h3 className="text-lg font-subtitle text-text-primary italic flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Dirección
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label
                      htmlFor="addressLine1"
                      className="text-text-primary font-text font-medium"
                    >
                      Dirección
                    </Label>
                    <Input
                      id="addressLine1"
                      placeholder="Calle y número"
                      {...register("addressLine1")}
                      className="font-text border-brand-primary/30 focus:border-brand-primary focus:ring-brand-primary/50"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label
                      htmlFor="postalCode"
                      className="text-text-primary font-text font-medium"
                    >
                      Código Postal
                    </Label>
                    <Input
                      id="postalCode"
                      placeholder="1001"
                      {...register("postalCode")}
                      className="font-text border-brand-primary/30 focus:border-brand-primary focus:ring-brand-primary/50"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label
                    htmlFor="country"
                    className="text-text-primary font-text font-medium"
                  >
                    País
                  </Label>
                  <Input
                    id="country"
                    placeholder="Argentina"
                    {...register("country")}
                    className="font-text border-brand-primary/30 focus:border-brand-primary focus:ring-brand-primary/50"
                  />
                </div>
              </div>
            )}

            {/* Bio - Only show when editing */}
            {isEditing && (
              <div className="space-y-2 pt-4 border-t border-brand-primary/20">
                <Label
                  htmlFor="bio"
                  className="text-text-primary font-text font-medium"
                >
                  Biografía
                </Label>
                <textarea
                  id="bio"
                  {...register("bio")}
                  placeholder="Cuéntanos un poco sobre ti..."
                  className="w-full px-3 py-2 border border-brand-primary/30 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-primary/50 font-text resize-none"
                  rows={4}
                />
                <p className="text-xs text-text-primary/60 font-text">
                  {watch("bio")?.length || 0} / 500 caracteres
                </p>
                {errors.bio && (
                  <p className="text-sm text-red-600 font-text">
                    {errors.bio.message as string}
                  </p>
                )}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </CardContent>
    </Card>
  );
}

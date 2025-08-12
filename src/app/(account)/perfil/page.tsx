"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useAuthContext } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import AvatarUpload from "@/components/ui/AvatarUpload";
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  Edit3, 
  Save, 
  X,
  Sparkles,
  Heart,
  Award,
  CheckCircle
} from "lucide-react";

const profileSchema = z.object({
  firstName: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  lastName: z.string().min(2, "El apellido debe tener al menos 2 caracteres"),
  phone: z.string().min(10, "Ingresa un número de teléfono válido"),
  dateOfBirth: z.string().optional(),
  city: z.string().optional(),
  country: z.string().optional(),
  addressLine1: z.string().optional(),
  addressLine2: z.string().optional(),
  postalCode: z.string().optional(),
  bio: z.string().max(500, "La biografía no puede exceder 500 caracteres").optional(),
});

type ProfileForm = z.infer<typeof profileSchema>;

export default function ProfilePage() {
  const { user, profile, updateProfile } = useAuthContext();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [avatarUpdateSuccess, setAvatarUpdateSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ProfileForm>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: profile?.first_name || "",
      lastName: profile?.last_name || "",
      phone: profile?.phone || "",
      dateOfBirth: profile?.date_of_birth || "",
      city: profile?.city || "",
      country: profile?.country || "",
      addressLine1: profile?.address_line_1 || "",
      addressLine2: profile?.address_line_2 || "",
      postalCode: profile?.postal_code || "",
      bio: profile?.bio || "",
    },
  });

  const handleAvatarUpload = async (avatarUrl: string) => {
    try {
      await updateProfile({
        avatar_url: avatarUrl
      });
      setAvatarUpdateSuccess(true);
      setTimeout(() => setAvatarUpdateSuccess(false), 3000);
    } catch (error) {
      console.error("Error updating avatar:", error);
      throw error; // Re-throw to let AvatarUpload component handle the error display
    }
  };

  const handleAvatarError = (error: string) => {
    console.error("Avatar upload error:", error);
    // You could add a toast notification here or set a state for error display
  };

  const onSubmit = async (data: ProfileForm) => {
    setIsLoading(true);
    try {
      await updateProfile({
        first_name: data.firstName,
        last_name: data.lastName,
        phone: data.phone,
        date_of_birth: data.dateOfBirth || null,
        city: data.city || null,
        country: data.country || null,
        address_line_1: data.addressLine1 || null,
        address_line_2: data.addressLine2 || null,
        postal_code: data.postalCode || null,
        bio: data.bio || null,
      });
      setUpdateSuccess(true);
      setIsEditing(false);
      setTimeout(() => setUpdateSuccess(false), 3000);
    } catch (error) {
      console.error("Error updating profile:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelEdit = () => {
    reset();
    setIsEditing(false);
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "No especificado";
    return new Date(dateString).toLocaleDateString("es-AR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const memberSince = profile?.created_at ?
    new Date(profile.created_at).toLocaleDateString("es-AR", {
      year: "numeric",
      month: "long",
    }) : "Fecha desconocida";

  if (!user || !profile) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-dorado mx-auto"></div>
          <p className="mt-2 text-tierra-media">Cargando perfil...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-azul-profundo">Mi Perfil</h1>
          <p className="text-tierra-media">
            Gestiona tu información personal y preferencias
          </p>
        </div>
        {!isEditing && (
          <Button
            onClick={() => setIsEditing(true)}
            className="bg-dorado hover:bg-dorado/90 text-azul-profundo"
          >
            <Edit3 className="h-4 w-4 mr-2" />
            Editar Perfil
          </Button>
        )}
      </div>

      {/* Success Messages */}
      {updateSuccess && (
        <Alert className="border-verde-suave bg-verde-suave/10">
          <CheckCircle className="h-4 w-4 text-verde-suave" />
          <AlertDescription className="text-verde-suave">
            ¡Perfil actualizado exitosamente!
          </AlertDescription>
        </Alert>
      )}

      {avatarUpdateSuccess && (
        <Alert className="border-verde-suave bg-verde-suave/10">
          <CheckCircle className="h-4 w-4 text-verde-suave" />
          <AlertDescription className="text-verde-suave">
            ¡Foto de perfil actualizada exitosamente!
          </AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Summary */}
        <div className="lg:col-span-1">
          <Card>
            <CardContent className="p-6">
              <div className="text-center space-y-4">
                {/* Avatar with Upload */}
                <AvatarUpload
                  currentAvatarUrl={profile?.avatar_url || undefined}
                  onUploadSuccess={handleAvatarUpload}
                  onUploadError={handleAvatarError}
                  isEditing={isEditing}
                  size="lg"
                />

                {/* User Info */}
                <div>
                  <h3 className="text-xl font-semibold text-azul-profundo">
                    {profile?.first_name} {profile?.last_name}
                  </h3>
                  <p className="text-sm text-tierra-media">{user?.email}</p>
                </div>

                {/* Badges */}
                <div className="flex flex-wrap gap-2 justify-center">
                  <Badge className="bg-verde-suave text-white">
                    <Heart className="h-3 w-3 mr-1" />
                    Cliente Activo
                  </Badge>
                  {profile?.is_member && (
                    <Badge className="bg-dorado text-azul-profundo">
                      <Sparkles className="h-3 w-3 mr-1" />
                      Miembro
                    </Badge>
                  )}
                  <Badge variant="outline" className="border-azul-profundo text-azul-profundo">
                    <Award className="h-3 w-3 mr-1" />
                    Miembro desde {memberSince}
                  </Badge>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-azul-profundo">0</p>
                    <p className="text-xs text-tierra-media">Pedidos</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-azul-profundo">
                      {profile?.membership_tier === 'none' ? '0' : '1'}
                    </p>
                    <p className="text-xs text-tierra-media">Membresías</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Profile Details */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-azul-profundo">Información Personal</CardTitle>
                  <CardDescription>
                    Mantén tu información actualizada para una mejor experiencia
                  </CardDescription>
                </div>
                {isEditing && (
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleCancelEdit}
                    >
                      <X className="h-4 w-4 mr-2" />
                      Cancelar
                    </Button>
                    <Button
                      type="submit"
                      form="profile-form"
                      disabled={isLoading}
                      className="bg-dorado hover:bg-dorado/90 text-azul-profundo"
                    >
                      <Save className="h-4 w-4 mr-2" />
                      {isLoading ? "Guardando..." : "Guardar"}
                    </Button>
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <form id="profile-form" onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Basic Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">
                      <User className="h-4 w-4 inline mr-2" />
                      Nombre
                    </Label>
                    {isEditing ? (
                      <Input
                        id="firstName"
                        {...register("firstName")}
                        className={errors.firstName ? "border-red-500" : ""}
                      />
                    ) : (
                      <p className="text-azul-profundo bg-gray-50 px-3 py-2 rounded-md">
                        {profile?.first_name || "No especificado"}
                      </p>
                    )}
                    {errors.firstName && (
                      <p className="text-sm text-red-500">{errors.firstName.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="lastName">Apellido</Label>
                    {isEditing ? (
                      <Input
                        id="lastName"
                        {...register("lastName")}
                        className={errors.lastName ? "border-red-500" : ""}
                      />
                    ) : (
                      <p className="text-azul-profundo bg-gray-50 px-3 py-2 rounded-md">
                        {profile?.last_name || "No especificado"}
                      </p>
                    )}
                    {errors.lastName && (
                      <p className="text-sm text-red-500">{errors.lastName.message}</p>
                    )}
                  </div>
                </div>

                {/* Contact Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">
                      <Mail className="h-4 w-4 inline mr-2" />
                      Email
                    </Label>
                    <p className="text-azul-profundo bg-gray-50 px-3 py-2 rounded-md">
                      {user?.email}
                    </p>
                    <p className="text-xs text-tierra-media">
                      El email no se puede modificar
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">
                      <Phone className="h-4 w-4 inline mr-2" />
                      Teléfono
                    </Label>
                    {isEditing ? (
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="+54 9 11 1234-5678"
                        {...register("phone")}
                        className={errors.phone ? "border-red-500" : ""}
                      />
                    ) : (
                      <p className="text-azul-profundo bg-gray-50 px-3 py-2 rounded-md">
                        {profile?.phone || "No especificado"}
                      </p>
                    )}
                    {errors.phone && (
                      <p className="text-sm text-red-500">{errors.phone.message}</p>
                    )}
                  </div>
                </div>

                {/* Personal Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="dateOfBirth">
                      <Calendar className="h-4 w-4 inline mr-2" />
                      Fecha de Nacimiento
                    </Label>
                    {isEditing ? (
                      <Input
                        id="dateOfBirth"
                        type="date"
                        {...register("dateOfBirth")}
                      />
                    ) : (
                      <p className="text-azul-profundo bg-gray-50 px-3 py-2 rounded-md">
                        {formatDate(profile?.date_of_birth || undefined)}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="city">
                      <MapPin className="h-4 w-4 inline mr-2" />
                      Ciudad
                    </Label>
                    {isEditing ? (
                      <Input
                        id="city"
                        placeholder="Buenos Aires"
                        {...register("city")}
                      />
                    ) : (
                      <p className="text-azul-profundo bg-gray-50 px-3 py-2 rounded-md">
                        {profile?.city || "No especificado"}
                      </p>
                    )}
                  </div>
                </div>

                {/* Address */}
                {isEditing && (
                  <div className="space-y-4">
                    <h4 className="font-semibold text-azul-profundo">Dirección</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="addressLine1">Dirección</Label>
                        <Input
                          id="addressLine1"
                          placeholder="Calle y número"
                          {...register("addressLine1")}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="postalCode">Código Postal</Label>
                        <Input
                          id="postalCode"
                          placeholder="1001"
                          {...register("postalCode")}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Bio */}
                {isEditing && (
                  <div className="space-y-2">
                    <Label htmlFor="bio">Biografía</Label>
                    <textarea
                      id="bio"
                      {...register("bio")}
                      placeholder="Cuéntanos un poco sobre ti..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-dorado"
                      rows={4}
                    />
                    {errors.bio && (
                      <p className="text-sm text-red-500">{errors.bio.message}</p>
                    )}
                  </div>
                )}
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 
"use client";

import { useState, useEffect } from "react";
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
  CheckCircle,
  Loader2,
  Package,
  Shield,
  Globe
} from "lucide-react";

const profileSchema = z.object({
  firstName: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  lastName: z.string().min(2, "El apellido debe tener al menos 2 caracteres"),
  phone: z.string().min(10, "Ingresa un número de teléfono válido").optional().or(z.literal("")),
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
  const { user, profile, loading, updateProfile, refetchProfile } = useAuthContext();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [avatarUpdateSuccess, setAvatarUpdateSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm<ProfileForm>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      phone: "",
      dateOfBirth: "",
      city: "",
      country: "",
      addressLine1: "",
      addressLine2: "",
      postalCode: "",
      bio: "",
    },
  });

  // Update form when profile loads
  useEffect(() => {
    if (profile) {
      reset({
        firstName: profile.first_name || "",
        lastName: profile.last_name || "",
        phone: profile.phone || "",
        dateOfBirth: profile.date_of_birth ? profile.date_of_birth.split('T')[0] : "",
        city: profile.city || "",
        country: profile.country || "Argentina",
        addressLine1: profile.address_line_1 || "",
        addressLine2: profile.address_line_2 || "",
        postalCode: profile.postal_code || "",
        bio: profile.bio || "",
      });
    }
  }, [profile, reset]);

  // Try to refetch profile if it doesn't exist
  useEffect(() => {
    if (user && !profile && !loading) {
      const timer = setTimeout(() => {
        refetchProfile?.();
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [user, profile, loading, refetchProfile]);

  const handleAvatarUpload = async (avatarUrl: string) => {
    try {
      setError(null);
      await updateProfile({
        avatar_url: avatarUrl
      });
      setAvatarUpdateSuccess(true);
      setTimeout(() => setAvatarUpdateSuccess(false), 3000);
      // Refetch to get updated profile
      refetchProfile?.();
    } catch (error: any) {
      console.error("Error updating avatar:", error);
      setError(error.message || "Error al actualizar la foto de perfil");
      throw error;
    }
  };

  const handleAvatarError = (error: string) => {
    setError(error);
    console.error("Avatar upload error:", error);
  };

  const onSubmit = async (data: ProfileForm) => {
    setIsLoading(true);
    setError(null);
    try {
      await updateProfile({
        first_name: data.firstName,
        last_name: data.lastName,
        phone: data.phone || null,
        date_of_birth: data.dateOfBirth || null,
        city: data.city || null,
        country: data.country || "Argentina",
        address_line_1: data.addressLine1 || null,
        address_line_2: data.addressLine2 || null,
        postal_code: data.postalCode || null,
        bio: data.bio || null,
      });
      setUpdateSuccess(true);
      setIsEditing(false);
      setTimeout(() => setUpdateSuccess(false), 3000);
      // Refetch to get updated profile
      refetchProfile?.();
    } catch (error: any) {
      console.error("Error updating profile:", error);
      setError(error.message || "Error al actualizar el perfil");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelEdit = () => {
    reset();
    setIsEditing(false);
    setError(null);
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "No especificado";
    try {
      return new Date(dateString).toLocaleDateString("es-AR", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch {
      return "Fecha inválida";
    }
  };

  const memberSince = profile?.created_at ?
    new Date(profile.created_at).toLocaleDateString("es-AR", {
      year: "numeric",
      month: "long",
    }) : "Fecha desconocida";

  // Loading state
  if (loading || !user) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin text-brand-primary mx-auto" />
          <p className="text-text-primary/70 font-text">Cargando perfil...</p>
        </div>
      </div>
    );
  }

  // Show form even if profile doesn't exist yet (for new users)
  const displayProfile = profile || {
    id: user.id,
    first_name: user.user_metadata?.first_name || user.user_metadata?.full_name?.split(' ')[0] || "",
    last_name: user.user_metadata?.last_name || user.user_metadata?.full_name?.split(' ').slice(1).join(' ') || "",
    email: user.email || "",
    phone: null,
    date_of_birth: null,
    avatar_url: user.user_metadata?.avatar_url || user.user_metadata?.picture || null,
    is_member: false,
    membership_tier: 'none' as const,
    created_at: user.created_at || new Date().toISOString(),
    city: null,
    country: null,
    address_line_1: null,
    address_line_2: null,
    postal_code: null,
    bio: null,
    updated_at: user.created_at || new Date().toISOString(),
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-title text-brand-primary">Mi Perfil</h1>
          <p className="text-text-primary/70 font-text mt-1">
            Gestiona tu información personal y preferencias
          </p>
        </div>
        {!isEditing && (
          <Button
            onClick={() => setIsEditing(true)}
            className="bg-brand-primary hover:bg-brand-secondary text-white font-text font-semibold"
            style={{ borderRadius: '0px 15px' }}
          >
            <Edit3 className="h-4 w-4 mr-2" />
            Editar Perfil
          </Button>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <Alert variant="destructive" className="bg-red-50 border-red-200">
          <AlertDescription className="text-red-800 font-text">{error}</AlertDescription>
        </Alert>
      )}

      {/* Success Messages */}
      {updateSuccess && (
        <Alert className="bg-green-50 border-green-200">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800 font-text">
            ¡Perfil actualizado exitosamente!
          </AlertDescription>
        </Alert>
      )}

      {avatarUpdateSuccess && (
        <Alert className="bg-green-50 border-green-200">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800 font-text">
            ¡Foto de perfil actualizada exitosamente!
          </AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Summary Card */}
        <div className="lg:col-span-1">
          <Card 
            className="shadow-alkimya border-0 overflow-hidden" 
            style={{ 
              borderRadius: '0px 15px',
              backgroundColor: 'var(--admin-accent-primary)'
            }}
          >
            <CardContent className="p-6 bg-bg-light">
              <div className="text-center space-y-5">
                {/* Avatar with Upload */}
                <div className="flex justify-center">
                  <AvatarUpload
                    currentAvatarUrl={displayProfile.avatar_url || undefined}
                    onUploadSuccess={handleAvatarUpload}
                    onUploadError={handleAvatarError}
                    isEditing={isEditing}
                    size="lg"
                  />
                </div>

                {/* User Info */}
                <div>
                  <h3 className="text-xl font-title text-brand-primary">
                    {displayProfile.first_name || displayProfile.last_name 
                      ? `${displayProfile.first_name || ''} ${displayProfile.last_name || ''}`.trim()
                      : user.email?.split('@')[0] || 'Usuario'}
                  </h3>
                  <p className="text-sm text-text-primary/70 font-text mt-1">{user.email}</p>
                </div>

                {/* Badges */}
                <div className="flex flex-wrap gap-2 justify-center">
                  <Badge className="bg-brand-primary text-white font-text">
                    <Heart className="h-3 w-3 mr-1" />
                    Cliente Activo
                  </Badge>
                  {displayProfile.is_member && (
                    <Badge className="bg-brand-highlight text-brand-primary font-text">
                      <Sparkles className="h-3 w-3 mr-1" />
                      Miembro
                    </Badge>
                  )}
                  <Badge variant="outline" className="border-brand-primary text-brand-primary font-text">
                    <Award className="h-3 w-3 mr-1" />
                    Desde {memberSince}
                  </Badge>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-text-primary/20">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-brand-primary">0</p>
                    <p className="text-xs text-text-primary/70 font-text">Pedidos</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-brand-primary">
                      {displayProfile.membership_tier === 'none' ? '0' : '1'}
                    </p>
                    <p className="text-xs text-text-primary/70 font-text">Membresías</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Profile Details Card */}
        <div className="lg:col-span-2">
          <Card 
            className="shadow-alkimya border-0 overflow-hidden" 
            style={{ 
              borderRadius: '0px 15px',
              backgroundColor: 'var(--admin-accent-primary)'
            }}
          >
            <CardHeader 
              className="bg-white" 
              style={{ backgroundColor: 'var(--admin-accent-primary)' }}
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <CardTitle className="text-2xl font-title text-brand-primary">Información Personal</CardTitle>
                  <CardDescription className="font-text text-text-primary/70">
                    Mantén tu información actualizada para una mejor experiencia
                  </CardDescription>
                </div>
                {isEditing && (
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleCancelEdit}
                      className="font-text"
                      style={{ borderRadius: '0px 15px' }}
                    >
                      <X className="h-4 w-4 mr-2" />
                      Cancelar
                    </Button>
                    <Button
                      type="submit"
                      form="profile-form"
                      disabled={isLoading}
                      className="bg-brand-primary hover:bg-brand-secondary text-white font-text font-semibold"
                      style={{ borderRadius: '0px 15px' }}
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
              <form id="profile-form" onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Basic Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-title text-brand-primary flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Información Básica
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName" className="text-text-primary font-text font-medium">
                        Nombre
                      </Label>
                      {isEditing ? (
                        <Input
                          id="firstName"
                          {...register("firstName")}
                          className={`font-text ${errors.firstName ? "border-red-500" : ""}`}
                          style={{ backgroundColor: 'var(--admin-bg-tertiary)', borderColor: errors.firstName ? undefined : 'var(--admin-text-primary)' }}
                        />
                      ) : (
                        <div 
                          className="text-text-primary bg-white px-3 py-2 rounded-md border border-text-primary/20 font-text"
                          style={{ 
                            backgroundColor: 'var(--admin-accent-primary)',
                            borderColor: 'var(--admin-text-primary)'
                          }}
                        >
                          {displayProfile.first_name || "No especificado"}
                        </div>
                      )}
                      {errors.firstName && (
                        <p className="text-sm text-red-600 font-text">{errors.firstName.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="lastName" className="text-text-primary font-text font-medium">
                        Apellido
                      </Label>
                      {isEditing ? (
                        <Input
                          id="lastName"
                          {...register("lastName")}
                          className={`font-text ${errors.lastName ? "border-red-500" : ""}`}
                          style={{ backgroundColor: 'var(--admin-bg-tertiary)', borderColor: errors.lastName ? undefined : 'var(--admin-text-primary)' }}
                        />
                      ) : (
                        <div 
                          className="text-text-primary bg-white px-3 py-2 rounded-md border border-text-primary/20 font-text"
                          style={{ 
                            backgroundColor: 'var(--admin-accent-primary)',
                            borderColor: 'var(--admin-text-primary)'
                          }}
                        >
                          {displayProfile.last_name || "No especificado"}
                        </div>
                      )}
                      {errors.lastName && (
                        <p className="text-sm text-red-600 font-text">{errors.lastName.message}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Contact Information */}
                <div 
                  className="space-y-4 pt-4 border-t border-text-primary/20"
                  style={{ borderTopColor: 'var(--admin-text-primary)' }}
                >
                  <h3 className="text-lg font-title text-brand-primary flex items-center gap-2">
                    <Mail className="h-5 w-5" />
                    Información de Contacto
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-text-primary font-text font-medium">
                        Email
                      </Label>
                      <div 
                        className="text-text-primary bg-white px-3 py-2 rounded-md border border-text-primary/20 font-text"
                        style={{ 
                          backgroundColor: 'var(--admin-accent-primary)',
                          borderColor: 'var(--admin-text-primary)'
                        }}
                      >
                        {user.email}
                      </div>
                      <p className="text-xs text-text-primary/60 font-text">
                        El email no se puede modificar
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone" className="text-text-primary font-text font-medium">
                        Teléfono
                      </Label>
                      {isEditing ? (
                        <Input
                          id="phone"
                          type="tel"
                          placeholder="+54 9 11 1234-5678"
                          {...register("phone")}
                          className={`font-text ${errors.phone ? "border-red-500" : ""}`}
                          style={{ backgroundColor: 'var(--admin-bg-tertiary)', borderColor: errors.phone ? undefined : 'var(--admin-text-primary)' }}
                        />
                      ) : (
                        <div 
                          className="text-text-primary bg-white px-3 py-2 rounded-md border border-text-primary/20 font-text"
                          style={{ 
                            backgroundColor: 'var(--admin-accent-primary)',
                            borderColor: 'var(--admin-text-primary)'
                          }}
                        >
                          {displayProfile.phone || "No especificado"}
                        </div>
                      )}
                      {errors.phone && (
                        <p className="text-sm text-red-600 font-text">{errors.phone.message}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Personal Details */}
                <div 
                  className="space-y-4 pt-4 border-t border-text-primary/20"
                  style={{ borderTopColor: 'var(--admin-text-primary)' }}
                >
                  <h3 className="text-lg font-title text-brand-primary flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    Detalles Personales
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="dateOfBirth" className="text-text-primary font-text font-medium">
                        Fecha de Nacimiento
                      </Label>
                      {isEditing ? (
                        <Input
                          id="dateOfBirth"
                          type="date"
                          {...register("dateOfBirth")}
                          className="font-text"
                          style={{ backgroundColor: 'var(--admin-bg-tertiary)', borderColor: 'var(--admin-text-primary)' }}
                        />
                      ) : (
                        <div 
                          className="text-text-primary bg-white px-3 py-2 rounded-md border border-text-primary/20 font-text"
                          style={{ 
                            backgroundColor: 'var(--admin-accent-primary)',
                            borderColor: 'var(--admin-text-primary)'
                          }}
                        >
                          {formatDate(displayProfile.date_of_birth || undefined)}
                        </div>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="city" className="text-text-primary font-text font-medium">
                        Ciudad
                      </Label>
                      {isEditing ? (
                        <Input
                          id="city"
                          placeholder="Buenos Aires"
                          {...register("city")}
                          className="font-text"
                          style={{ backgroundColor: 'var(--admin-bg-tertiary)', borderColor: 'var(--admin-text-primary)' }}
                        />
                      ) : (
                        <div 
                          className="text-text-primary bg-white px-3 py-2 rounded-md border border-text-primary/20 font-text"
                          style={{ 
                            backgroundColor: 'var(--admin-accent-primary)',
                            borderColor: 'var(--admin-text-primary)'
                          }}
                        >
                          {displayProfile.city || "No especificado"}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Address - Only show when editing */}
                {isEditing && (
                  <div 
                    className="space-y-4 pt-4 border-t border-text-primary/20"
                    style={{ borderTopColor: 'var(--admin-text-primary)' }}
                  >
                    <h3 className="text-lg font-title text-brand-primary flex items-center gap-2">
                      <MapPin className="h-5 w-5" />
                      Dirección
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="addressLine1" className="text-text-primary font-text font-medium">
                          Dirección
                        </Label>
                        <Input
                          id="addressLine1"
                          placeholder="Calle y número"
                          {...register("addressLine1")}
                          className="font-text"
                          style={{ backgroundColor: 'var(--admin-bg-tertiary)', borderColor: 'var(--admin-text-primary)' }}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="postalCode" className="text-text-primary font-text font-medium">
                          Código Postal
                        </Label>
                        <Input
                          id="postalCode"
                          placeholder="1001"
                          {...register("postalCode")}
                          className="font-text"
                          style={{ backgroundColor: 'var(--admin-bg-tertiary)', borderColor: 'var(--admin-text-primary)' }}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="country" className="text-text-primary font-text font-medium">
                        País
                      </Label>
                      <Input
                        id="country"
                        placeholder="Argentina"
                        {...register("country")}
                        className="font-text"
                        style={{ backgroundColor: 'var(--admin-bg-tertiary)', borderColor: 'var(--admin-text-primary)' }}
                      />
                    </div>
                  </div>
                )}

                {/* Bio - Only show when editing */}
                {isEditing && (
                  <div className="space-y-2 pt-4 border-t border-text-primary/20">
                    <Label htmlFor="bio" className="text-text-primary font-text font-medium">
                      Biografía
                    </Label>
                    <textarea
                      id="bio"
                      {...register("bio")}
                      placeholder="Cuéntanos un poco sobre ti..."
                      className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-brand-primary font-text resize-none"
                      style={{ 
                        backgroundColor: 'var(--admin-bg-tertiary)', 
                        borderColor: 'var(--admin-text-primary)',
                        borderRadius: '0px 15px'
                      }}
                      rows={4}
                    />
                    <p className="text-xs text-text-primary/60 font-text">
                      {watch('bio')?.length || 0} / 500 caracteres
                    </p>
                    {errors.bio && (
                      <p className="text-sm text-red-600 font-text">{errors.bio.message}</p>
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

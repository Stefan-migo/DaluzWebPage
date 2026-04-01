"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { useAuthContext } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Loader2, Edit3 } from "lucide-react";
import { ProfileCard } from "./components/ProfileCard";
import { ProfileForm } from "./components/ProfileForm";
import { ProfileSkeleton } from "./components/ProfileSkeleton";
import { useProfileStats } from "./components/useProfileStats";
import { AnimatedEntry } from "./components/AnimatedEntry";

const profileSchema = z.object({
  firstName: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  lastName: z.string().min(2, "El apellido debe tener al menos 2 caracteres"),
  phone: z
    .string()
    .min(10, "Ingresa un número de teléfono válido")
    .optional()
    .or(z.literal("")),
  dateOfBirth: z.string().optional(),
  city: z.string().optional(),
  country: z.string().optional(),
  addressLine1: z.string().optional(),
  addressLine2: z.string().optional(),
  postalCode: z.string().optional(),
  bio: z
    .string()
    .max(500, "La biografía no puede exceder 500 caracteres")
    .optional(),
});

type ProfileFormData = z.infer<typeof profileSchema>;

export default function ProfilePage() {
  const { user, profile, loading, updateProfile, refetchProfile } =
    useAuthContext();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch profile stats (order count)
  const { orderCount, isLoading: isLoadingStats } = useProfileStats(user?.id);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm<ProfileFormData>({
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

  // Helper to format date for display
  const formatDate = (dateString?: string): string => {
    if (!dateString) return "No especificada";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("es-AR", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch {
      return dateString;
    }
  };

  // Calculate member since date
  const memberSince = profile?.created_at
    ? new Date(profile.created_at).toLocaleDateString("es-AR", {
        year: "numeric",
        month: "short",
      })
    : user?.created_at
      ? new Date(user.created_at).toLocaleDateString("es-AR", {
          year: "numeric",
          month: "short",
        })
      : "---";

  // Handle form submission
  const onSubmit = async (data: ProfileFormData) => {
    if (!user) return;
    setIsLoading(true);

    try {
      await updateProfile({
        first_name: data.firstName,
        last_name: data.lastName,
        phone: data.phone || null,
        date_of_birth: data.dateOfBirth || null,
        city: data.city || null,
        country: data.country || null,
        address_line_1: data.addressLine1 || null,
        address_line_2: data.addressLine2 || null,
        postal_code: data.postalCode || null,
        bio: data.bio || null,
      });

      toast.success("¡Perfil actualizado exitosamente!");
      setIsEditing(false);
      await refetchProfile?.();

      // Reset form with new values
      reset({
        firstName: data.firstName,
        lastName: data.lastName,
        phone: data.phone || "",
        dateOfBirth: data.dateOfBirth || "",
        city: data.city || "",
        country: data.country || "",
        addressLine1: data.addressLine1 || "",
        addressLine2: data.addressLine2 || "",
        postalCode: data.postalCode || "",
        bio: data.bio || "",
      });
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Ocurrió un error inesperado",
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Handle avatar upload success
  const handleAvatarUpload = async (avatarUrl: string) => {
    if (!user) return;

    try {
      await updateProfile({ avatar_url: avatarUrl });
      toast.success("¡Foto de perfil actualizada exitosamente!");
      await refetchProfile?.();
    } catch (err) {
      toast.error(
        err instanceof Error
          ? err.message
          : "Ocurrió un error al subir la foto",
      );
    }
  };

  // Handle avatar upload error
  const handleAvatarError = (errorMessage: string) => {
    toast.error(errorMessage);
  };

  // Handle cancel edit
  const handleCancelEdit = () => {
    if (profile) {
      reset({
        firstName: profile.first_name || "",
        lastName: profile.last_name || "",
        phone: profile.phone || "",
        dateOfBirth: profile.date_of_birth || "",
        city: profile.city || "",
        country: profile.country || "",
        addressLine1: profile.address_line_1 || "",
        addressLine2: profile.address_line_2 || "",
        postalCode: profile.postal_code || "",
        bio: profile.bio || "",
      });
    }
    setIsEditing(false);
  };

  // Try to refetch profile if it doesn't exist
  useEffect(() => {
    if (user && !profile && !loading) {
      const timer = setTimeout(() => {
        refetchProfile?.();
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [user, profile, loading, refetchProfile]);

  // Loading state
  if (loading || !user) {
    return <ProfileSkeleton />;
  }
  const displayProfile = profile || {
    id: user.id,
    first_name:
      user.user_metadata?.first_name ||
      user.user_metadata?.full_name?.split(" ")[0] ||
      "",
    last_name:
      user.user_metadata?.last_name ||
      user.user_metadata?.full_name?.split(" ").slice(1).join(" ") ||
      "",
    email: user.email || "",
    phone: null,
    date_of_birth: null,
    avatar_url:
      user.user_metadata?.avatar_url || user.user_metadata?.picture || null,
    is_member: false,
    membership_tier: "none" as const,
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
          <h1 className="text-3xl font-title text-text-primary">Mi Perfil</h1>
          <p className="text-text-primary/70 font-text mt-1">
            Gestiona tu información personal y preferencias
          </p>
        </div>
        {!isEditing && (
          <Button
            onClick={() => setIsEditing(true)}
            variant="brand"
            className="font-title uppercase tracking-wider"
          >
            <Edit3 className="h-4 w-4 mr-2" />
            Editar Perfil
          </Button>
        )}
      </div>

      <AnimatedEntry
        delay={0.2}
        className="grid grid-cols-1 lg:grid-cols-3 gap-6"
      >
        {/* Profile Summary Card */}
        <div className="lg:col-span-1">
          <ProfileCard
            avatarUrl={displayProfile.avatar_url}
            firstName={displayProfile.first_name}
            lastName={displayProfile.last_name}
            email={user.email}
            isMember={displayProfile.is_member ?? false}
            membershipTier={displayProfile.membership_tier || "none"}
            memberSince={memberSince}
            isEditing={isEditing}
            orderCount={orderCount}
            isLoadingStats={isLoadingStats}
            onAvatarUpload={handleAvatarUpload}
            onAvatarError={handleAvatarError}
          />
        </div>

        {/* Profile Details Card */}
        <div className="lg:col-span-2">
          <form id="profile-form" onSubmit={handleSubmit(onSubmit)}>
            <ProfileForm
              isEditing={isEditing}
              isLoading={isLoading}
              register={register}
              errors={errors}
              watch={watch}
              email={user.email}
              firstName={displayProfile.first_name}
              lastName={displayProfile.last_name}
              phone={displayProfile.phone}
              dateOfBirth={displayProfile.date_of_birth}
              city={displayProfile.city}
              addressLine1={displayProfile.address_line_1}
              postalCode={displayProfile.postal_code}
              country={displayProfile.country}
              bio={displayProfile.bio}
              formatDate={formatDate}
              onCancel={handleCancelEdit}
            />
          </form>
        </div>
      </AnimatedEntry>
    </div>
  );
}

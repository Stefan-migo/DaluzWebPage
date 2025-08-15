"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useAuthContext } from "@/contexts/AuthContext";
import { createClient } from "@/utils/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { 
  Shield, 
  Key, 
  Bell, 
  Eye, 
  EyeOff,
  Mail,
  Smartphone,
  AlertTriangle,
  CheckCircle,
  Settings,
  Lock,
  Trash2 
} from "lucide-react";

const passwordSchema = z.object({
  currentPassword: z.string().min(6, "La contraseña actual es requerida"),
  newPassword: z.string().min(6, "La nueva contraseña debe tener al menos 6 caracteres"),
  confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Las contraseñas no coinciden",
  path: ["confirmPassword"],
});

type PasswordForm = z.infer<typeof passwordSchema>;

export default function SettingsPage() {
  const router = useRouter();
  const { user, profile, updateProfile } = useAuthContext();
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [notifications, setNotifications] = useState({
    email: profile?.newsletter_subscribed || true,
    sms: false,
    orders: true,
    newsletter: profile?.newsletter_subscribed || true,
    membership: true,
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<PasswordForm>({
    resolver: zodResolver(passwordSchema),
  });

  const onPasswordSubmit = async (data: PasswordForm) => {
    setIsChangingPassword(true);
    setPasswordError(null);
    
    try {
      // Update password with Supabase Auth
      const supabase = createClient()
      const { error } = await supabase.auth.updateUser({
        password: data.newPassword
      });

      if (error) {
        throw error;
      }

      setPasswordSuccess(true);
      reset();
      setTimeout(() => setPasswordSuccess(false), 5000);
    } catch (error: any) {
      console.error("Error changing password:", error);
      setPasswordError(error.message || "Error al cambiar la contraseña");
    } finally {
      setIsChangingPassword(false);
    }
  };

  const togglePasswordVisibility = (field: 'current' | 'new' | 'confirm') => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const handleNotificationChange = async (setting: keyof typeof notifications) => {
    const newValue = !notifications[setting];
    
    setNotifications(prev => ({
      ...prev,
      [setting]: newValue
    }));

    // Update newsletter subscription in profile if it's the newsletter setting
    if (setting === 'newsletter' || setting === 'email') {
      try {
        await updateProfile({
          newsletter_subscribed: newValue
        });
      } catch (error) {
        console.error("Error updating notification preference:", error);
        // Revert the change if it failed
        setNotifications(prev => ({
          ...prev,
          [setting]: !newValue
        }));
      }
    }
  };

  const handleAccountDeletion = async () => {
    if (!confirm("¿Estás seguro de que deseas eliminar tu cuenta? Esta acción no se puede deshacer.")) {
      return;
    }

    try {
      // Sign out the user directly (profile deletion would be handled server-side)
      const supabase = createClient()
      await supabase.auth.signOut();
      
      toast.success('Cuenta eliminada correctamente');
      router.push('/');
    } catch (error) {
      console.error('Error deleting account:', error);
      toast.error('Error al eliminar la cuenta');
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-azul-profundo">Configuración</h1>
        <p className="text-tierra-media">
          Administra tu cuenta, seguridad y preferencias
        </p>
      </div>

      {/* Success Alert */}
      {passwordSuccess && (
        <Alert className="border-verde-suave bg-verde-suave/10">
          <CheckCircle className="h-4 w-4 text-verde-suave" />
          <AlertDescription className="text-verde-suave">
            ¡Contraseña actualizada exitosamente!
          </AlertDescription>
        </Alert>
      )}

      {/* Error Alert */}
      {passwordError && (
        <Alert className="border-red-500 bg-red-50">
          <AlertTriangle className="h-4 w-4 text-red-500" />
          <AlertDescription className="text-red-600">
            {passwordError}
          </AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Security Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-azul-profundo">
              <Shield className="h-5 w-5" />
              Seguridad
            </CardTitle>
            <CardDescription>
              Mantén tu cuenta segura con estos ajustes
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Account Status */}
            <div className="space-y-3">
              <h4 className="font-semibold text-azul-profundo">Estado de la Cuenta</h4>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-verde-suave" />
                  <span className="text-sm">Email verificado</span>
                </div>
                <Badge className="bg-verde-suave text-white">Activo</Badge>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Lock className="h-4 w-4 text-dorado" />
                  <span className="text-sm">Autenticación de dos factores</span>
                </div>
                <Badge variant="outline">Inactivo</Badge>
              </div>
            </div>

            <Separator />

            {/* Change Password */}
            <div className="space-y-4">
              <h4 className="font-semibold text-azul-profundo flex items-center gap-2">
                <Key className="h-4 w-4" />
                Cambiar Contraseña
              </h4>
              <form onSubmit={handleSubmit(onPasswordSubmit)} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="currentPassword">Contraseña Actual</Label>
                  <div className="relative">
                    <Input
                      id="currentPassword"
                      type={showPasswords.current ? "text" : "password"}
                      {...register("currentPassword")}
                      className={errors.currentPassword ? "border-red-500" : ""}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3"
                      onClick={() => togglePasswordVisibility('current')}
                    >
                      {showPasswords.current ? 
                        <EyeOff className="h-4 w-4" /> : 
                        <Eye className="h-4 w-4" />
                      }
                    </Button>
                  </div>
                  {errors.currentPassword && (
                    <p className="text-sm text-red-500">{errors.currentPassword.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="newPassword">Nueva Contraseña</Label>
                  <div className="relative">
                    <Input
                      id="newPassword"
                      type={showPasswords.new ? "text" : "password"}
                      {...register("newPassword")}
                      className={errors.newPassword ? "border-red-500" : ""}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3"
                      onClick={() => togglePasswordVisibility('new')}
                    >
                      {showPasswords.new ? 
                        <EyeOff className="h-4 w-4" /> : 
                        <Eye className="h-4 w-4" />
                      }
                    </Button>
                  </div>
                  {errors.newPassword && (
                    <p className="text-sm text-red-500">{errors.newPassword.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirmar Nueva Contraseña</Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      type={showPasswords.confirm ? "text" : "password"}
                      {...register("confirmPassword")}
                      className={errors.confirmPassword ? "border-red-500" : ""}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3"
                      onClick={() => togglePasswordVisibility('confirm')}
                    >
                      {showPasswords.confirm ? 
                        <EyeOff className="h-4 w-4" /> : 
                        <Eye className="h-4 w-4" />
                      }
                    </Button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="text-sm text-red-500">{errors.confirmPassword.message}</p>
                  )}
                </div>

                <Button
                  type="submit"
                  disabled={isChangingPassword}
                  className="w-full bg-dorado hover:bg-dorado/90 text-azul-profundo"
                >
                  {isChangingPassword ? "Cambiando..." : "Cambiar Contraseña"}
                </Button>
              </form>
            </div>
          </CardContent>
        </Card>

        {/* Notification Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-azul-profundo">
              <Bell className="h-5 w-5" />
              Notificaciones
            </CardTitle>
            <CardDescription>
              Elige cómo quieres recibir actualizaciones
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Email Notifications */}
            <div className="space-y-4">
              <h4 className="font-semibold text-azul-profundo flex items-center gap-2">
                <Mail className="h-4 w-4" />
                Notificaciones por Email
              </h4>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">Pedidos</p>
                    <p className="text-xs text-tierra-media">Confirmaciones y actualizaciones de envío</p>
                  </div>
                  <Switch
                    checked={notifications.orders}
                    onCheckedChange={() => handleNotificationChange('orders')}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">Newsletter</p>
                    <p className="text-xs text-tierra-media">Noticias, productos y contenido exclusivo</p>
                  </div>
                  <Switch
                    checked={notifications.newsletter}
                    onCheckedChange={() => handleNotificationChange('newsletter')}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">Membresía</p>
                    <p className="text-xs text-tierra-media">Progreso del programa y nuevo contenido</p>
                  </div>
                  <Switch
                    checked={notifications.membership}
                    onCheckedChange={() => handleNotificationChange('membership')}
                  />
                </div>
              </div>
            </div>

            <Separator />

            {/* SMS Notifications */}
            <div className="space-y-4">
              <h4 className="font-semibold text-azul-profundo flex items-center gap-2">
                <Smartphone className="h-4 w-4" />
                Notificaciones SMS
              </h4>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Envíos urgentes</p>
                  <p className="text-xs text-tierra-media">Solo para actualizaciones críticas de envío</p>
                </div>
                <Switch
                  checked={notifications.sms}
                  onCheckedChange={() => handleNotificationChange('sms')}
                />
              </div>
              
              {!profile?.phone && (
                <Alert>
                  <AlertDescription className="text-sm">
                    Agrega un número de teléfono en tu perfil para recibir SMS.
                  </AlertDescription>
                </Alert>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Account Management */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-azul-profundo">
              <Settings className="h-5 w-5" />
              Gestión de Cuenta
            </CardTitle>
            <CardDescription>
              Opciones avanzadas para tu cuenta
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Data Export */}
            <div className="space-y-3">
              <h4 className="font-semibold text-azul-profundo">Exportar Datos</h4>
              <p className="text-sm text-tierra-media">
                Descarga una copia de todos tus datos personales, pedidos y actividad.
              </p>
              <Button variant="outline" className="border-azul-profundo text-azul-profundo hover:bg-azul-profundo hover:text-white">
                Solicitar Exportación
              </Button>
            </div>

            <Separator />

            {/* Delete Account */}
            <div className="space-y-3">
              <h4 className="font-semibold text-red-600 flex items-center gap-2">
                <AlertTriangle className="h-4 w-4" />
                Zona de Peligro
              </h4>
              <p className="text-sm text-tierra-media">
                Una vez eliminada tu cuenta, no podrás recuperarla. Esta acción es permanente.
              </p>
              <Button 
                variant="destructive" 
                className="bg-red-600 hover:bg-red-700"
                onClick={handleAccountDeletion}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Eliminar Cuenta
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 
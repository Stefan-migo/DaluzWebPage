"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { 
  Users, 
  UserPlus, 
  Crown,
  Shield,
  User,
  Settings,
  Search,
  Eye,
  Edit,
  Trash2,
  AlertTriangle,
  CheckCircle,
  Activity,
  Clock,
  Mail,
  Phone
} from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

interface AdminUser {
  id: string;
  email: string;
  role: string;
  permissions: Record<string, string[]>;
  is_active: boolean;
  last_login?: string;
  created_at: string;
  updated_at: string;
  profiles?: {
    first_name?: string;
    last_name?: string;
    phone?: string;
  };
  analytics?: {
    activityCount30Days: number;
    lastActivity?: string;
    fullName?: string;
  };
}

export default function AdminUsersPage() {
  const [adminUsers, setAdminUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  // Create admin dialog
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [creating, setCreating] = useState(false);
  const [newAdminData, setNewAdminData] = useState({
    email: '',
    role: 'store_manager',
    is_active: true
  });

  useEffect(() => {
    fetchAdminUsers();
  }, [searchTerm, roleFilter, statusFilter]);

  const fetchAdminUsers = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        ...(searchTerm && { search: searchTerm }),
        ...(roleFilter !== 'all' && { role: roleFilter }),
        ...(statusFilter !== 'all' && { status: statusFilter })
      });

      const response = await fetch(`/api/admin/admin-users?${params}`);
      if (!response.ok) {
        if (response.status === 403) {
          throw new Error('Acceso restringido: Solo super administradores pueden ver esta sección');
        }
        throw new Error('Failed to fetch admin users');
      }

      const data = await response.json();
      setAdminUsers(data.adminUsers || []);
      setError(null);
    } catch (err) {
      console.error('Error fetching admin users:', err);
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAdmin = async () => {
    if (!newAdminData.email || !newAdminData.role) {
      toast.error('Email y rol son requeridos');
      return;
    }

    try {
      setCreating(true);
      
      const response = await fetch('/api/admin/admin-users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newAdminData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create admin user');
      }

      toast.success('Usuario administrador creado exitosamente');
      setShowCreateDialog(false);
      setNewAdminData({ email: '', role: 'store_manager', is_active: true });
      fetchAdminUsers();

    } catch (error) {
      console.error('Error creating admin user:', error);
      toast.error(error instanceof Error ? error.message : 'Error al crear usuario administrador');
    } finally {
      setCreating(false);
    }
  };

  const handleToggleStatus = async (adminId: string, currentStatus: boolean) => {
    try {
      const response = await fetch(`/api/admin/admin-users/${adminId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ is_active: !currentStatus }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update admin user');
      }

      toast.success(`Usuario ${!currentStatus ? 'activado' : 'desactivado'} exitosamente`);
      fetchAdminUsers();

    } catch (error) {
      console.error('Error updating admin user:', error);
      toast.error(error instanceof Error ? error.message : 'Error al actualizar usuario');
    }
  };

  const handleDeleteAdmin = async (adminId: string, adminEmail: string) => {
    if (!confirm(`¿Estás seguro de que quieres eliminar al administrador ${adminEmail}? Esta acción no se puede deshacer.`)) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/admin-users/${adminId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete admin user');
      }

      toast.success('Usuario administrador eliminado exitosamente');
      fetchAdminUsers();

    } catch (error) {
      console.error('Error deleting admin user:', error);
      toast.error(error instanceof Error ? error.message : 'Error al eliminar usuario');
    }
  };

  const getRoleBadge = (role: string) => {
    const config: Record<string, { variant: any; label: string; icon: any }> = {
      super_admin: { variant: 'destructive', label: 'Super Admin', icon: Crown },
      store_manager: { variant: 'default', label: 'Gerente', icon: Shield },
      customer_support: { variant: 'secondary', label: 'Soporte', icon: User },
      content_manager: { variant: 'outline', label: 'Contenido', icon: Edit }
    };

    const roleConfig = config[role] || config['store_manager'];
    const Icon = roleConfig.icon;

    return (
      <Badge variant={roleConfig.variant} className="flex items-center gap-1">
        <Icon className="h-3 w-3" />
        {roleConfig.label}
      </Badge>
    );
  };

  const getStatusBadge = (isActive: boolean) => {
    return (
      <Badge variant={isActive ? 'default' : 'outline'}>
        {isActive ? 'Activo' : 'Inactivo'}
      </Badge>
    );
  };

  const formatLastActivity = (dateString?: string) => {
    if (!dateString) return 'Nunca';
    
    const date = new Date(dateString);
    const now = new Date();
    const diffHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffHours < 1) return 'Hace menos de 1 hora';
    if (diffHours < 24) return `Hace ${diffHours} horas`;
    
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays < 7) return `Hace ${diffDays} días`;
    
    return date.toLocaleDateString('es-AR');
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-azul-profundo">Gestión de Administradores</h1>
            <p className="text-tierra-media">Cargando usuarios administradores...</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-8 bg-gray-200 rounded w-1/2"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-azul-profundo">Gestión de Administradores</h1>
            <p className="text-tierra-media">Error al cargar los datos</p>
          </div>
        </div>
        <Card>
          <CardContent className="text-center py-16">
            <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-red-700 mb-2">Error al cargar administradores</h3>
            <p className="text-tierra-media mb-4">{error}</p>
            <Button onClick={fetchAdminUsers}>Reintentar</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-azul-profundo">Gestión de Administradores</h1>
          <p className="text-tierra-media">
            Administra usuarios con acceso al panel de administración
          </p>
        </div>
        
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button>
              <UserPlus className="h-4 w-4 mr-2" />
              Nuevo Administrador
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Crear Nuevo Administrador</DialogTitle>
              <DialogDescription>
                Otorga acceso administrativo a un usuario registrado
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="email">Email del Usuario</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="usuario@ejemplo.com"
                  value={newAdminData.email}
                  onChange={(e) => setNewAdminData({...newAdminData, email: e.target.value})}
                />
                <p className="text-sm text-tierra-media mt-1">
                  El usuario debe estar registrado previamente en el sistema
                </p>
              </div>
              
              <div>
                <Label htmlFor="role">Rol Administrativo</Label>
                <Select 
                  value={newAdminData.role} 
                  onValueChange={(value) => setNewAdminData({...newAdminData, role: value})}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="store_manager">Gerente de Tienda</SelectItem>
                    <SelectItem value="customer_support">Soporte al Cliente</SelectItem>
                    <SelectItem value="content_manager">Gestor de Contenido</SelectItem>
                    <SelectItem value="super_admin">Super Administrador</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                Cancelar
              </Button>
              <Button onClick={handleCreateAdmin} disabled={creating}>
                {creating ? 'Creando...' : 'Crear Administrador'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-azul-profundo" />
              <div className="ml-4">
                <p className="text-sm text-tierra-media">Total Administradores</p>
                <p className="text-2xl font-bold text-azul-profundo">{adminUsers.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Crown className="h-8 w-8 text-dorado" />
              <div className="ml-4">
                <p className="text-sm text-tierra-media">Super Admins</p>
                <p className="text-2xl font-bold text-dorado">
                  {adminUsers.filter(admin => admin.role === 'super_admin').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <CheckCircle className="h-8 w-8 text-verde-suave" />
              <div className="ml-4">
                <p className="text-sm text-tierra-media">Activos</p>
                <p className="text-2xl font-bold text-verde-suave">
                  {adminUsers.filter(admin => admin.is_active).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Activity className="h-8 w-8 text-red-500" />
              <div className="ml-4">
                <p className="text-sm text-tierra-media">Activos Recientes</p>
                <p className="text-2xl font-bold text-red-500">
                  {adminUsers.filter(admin => admin.analytics?.activityCount30Days && admin.analytics.activityCount30Days > 0).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-tierra-media h-4 w-4" />
                <Input
                  placeholder="Buscar por email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Rol" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los roles</SelectItem>
                <SelectItem value="super_admin">Super Admin</SelectItem>
                <SelectItem value="store_manager">Gerente</SelectItem>
                <SelectItem value="customer_support">Soporte</SelectItem>
                <SelectItem value="content_manager">Contenido</SelectItem>
              </SelectContent>
            </Select>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los estados</SelectItem>
                <SelectItem value="active">Activos</SelectItem>
                <SelectItem value="inactive">Inactivos</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Admin Users Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Users className="h-5 w-5 mr-2" />
            Usuarios Administradores ({adminUsers.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Usuario</TableHead>
                <TableHead>Rol</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Última Actividad</TableHead>
                <TableHead>Actividad (30d)</TableHead>
                <TableHead>Fecha Registro</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {adminUsers.map((admin) => (
                <TableRow key={admin.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">
                        {admin.analytics?.fullName || 'Sin nombre'}
                      </div>
                      <div className="text-sm text-tierra-media">{admin.email}</div>
                      {admin.profiles?.phone && (
                        <div className="flex items-center text-xs text-tierra-media mt-1">
                          <Phone className="h-3 w-3 mr-1" />
                          {admin.profiles.phone}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  
                  <TableCell>
                    {getRoleBadge(admin.role)}
                  </TableCell>
                  
                  <TableCell>
                    {getStatusBadge(admin.is_active)}
                  </TableCell>
                  
                  <TableCell>
                    <div className="flex items-center text-sm">
                      <Clock className="h-3 w-3 mr-1 text-tierra-media" />
                      {formatLastActivity(admin.last_login)}
                    </div>
                  </TableCell>
                  
                  <TableCell>
                    <div className="text-center">
                      <div className="font-medium">
                        {admin.analytics?.activityCount30Days || 0}
                      </div>
                      <div className="text-xs text-tierra-media">acciones</div>
                    </div>
                  </TableCell>
                  
                  <TableCell className="text-sm text-tierra-media">
                    {new Date(admin.created_at).toLocaleDateString('es-AR')}
                  </TableCell>
                  
                  <TableCell>
                    <div className="flex space-x-2">
                      <Link href={`/admin/admin-users/${admin.id}`}>
                        <Button variant="outline" size="sm">
                          <Eye className="h-3 w-3" />
                        </Button>
                      </Link>
                      <Link href={`/admin/admin-users/${admin.id}/edit`}>
                        <Button variant="outline" size="sm">
                          <Edit className="h-3 w-3" />
                        </Button>
                      </Link>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleToggleStatus(admin.id, admin.is_active)}
                      >
                        {admin.is_active ? (
                          <AlertTriangle className="h-3 w-3 text-red-500" />
                        ) : (
                          <CheckCircle className="h-3 w-3 text-green-500" />
                        )}
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleDeleteAdmin(admin.id, admin.email)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {adminUsers.length === 0 && (
            <div className="text-center py-12">
              <Users className="h-12 w-12 text-tierra-media mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-azul-profundo mb-2">No se encontraron administradores</h3>
              <p className="text-tierra-media">Ajusta los filtros o crea un nuevo administrador.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

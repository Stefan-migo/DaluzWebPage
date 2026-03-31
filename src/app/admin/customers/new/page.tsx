"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  ArrowLeft,
  Save,
  User,
  Mail,
  Phone,
  MapPin,
  Crown,
  AlertTriangle,
} from "lucide-react";
import { toast } from "sonner";

export default function NewCustomerPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    address_line_1: "",
    address_line_2: "",
    city: "",
    state: "",
    postal_code: "",
    country: "Argentina",
    membership_tier: "none",
    is_member: false,
    membership_start_date: "",
    membership_end_date: "",
    newsletter_subscribed: false,
  });

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setError(null);

      // Validate required fields
      if (!formData.email) {
        throw new Error("El email es requerido");
      }

      if (!formData.first_name && !formData.last_name) {
        throw new Error("Al menos el nombre o apellido es requerido");
      }

      const response = await fetch("/api/admin/customers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create customer");
      }

      const result = await response.json();
      toast.success("Cliente creado exitosamente");
      router.push(`/admin/customers/${result.customer.id}`);
    } catch (err) {
      console.error("Error creating customer:", err);
      const errorMessage =
        err instanceof Error ? err.message : "Error al crear cliente";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.back()}
            style={{
              borderColor: "var(--admin-border-secondary)",
              color: "var(--admin-text-primary)",
            }}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1
              className="font-title text-3xl"
              style={{ color: "var(--admin-text-primary)" }}
            >
              Nuevo Cliente
            </h1>
            <p style={{ color: "var(--admin-text-secondary)" }}>
              Crear un nuevo cliente en el sistema
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            onClick={() => router.back()}
            style={{
              borderColor: "var(--admin-border-secondary)",
              color: "var(--admin-text-primary)",
            }}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleSave}
            disabled={saving}
            style={{
              backgroundColor: "var(--admin-bg-secondary)",
              color: "white",
            }}
          >
            <Save className="h-4 w-4 mr-2" />
            {saving ? "Creando..." : "Crear Cliente"}
          </Button>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <Card
          style={{
            borderColor: "var(--admin-error)",
            backgroundColor: "var(--admin-bg-tertiary)",
          }}
        >
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <AlertTriangle
                className="h-4 w-4"
                style={{ color: "var(--admin-error)" }}
              />
              <p style={{ color: "var(--admin-text-primary)" }}>{error}</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Form */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Personal Information */}
        <Card
          className="admin-card"
          style={{ border: "1px solid var(--admin-border-secondary)" }}
        >
          <CardHeader>
            <CardTitle
              className="flex items-center"
              style={{ color: "var(--admin-text-primary)" }}
            >
              <User
                className="h-5 w-5 mr-2"
                style={{ color: "var(--admin-text-primary)" }}
              />
              Información Personal
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label
                  htmlFor="first_name"
                  style={{ color: "var(--admin-text-secondary)" }}
                >
                  Nombre *
                </Label>
                <Input
                  id="first_name"
                  value={formData.first_name}
                  onChange={(e) =>
                    handleInputChange("first_name", e.target.value)
                  }
                  placeholder="Nombre"
                  style={{
                    borderColor: "var(--admin-border-secondary)",
                    backgroundColor: "var(--admin-bg-primary)",
                    color: "var(--admin-text-primary)",
                  }}
                />
              </div>
              <div>
                <Label
                  htmlFor="last_name"
                  style={{ color: "var(--admin-text-secondary)" }}
                >
                  Apellido *
                </Label>
                <Input
                  id="last_name"
                  value={formData.last_name}
                  onChange={(e) =>
                    handleInputChange("last_name", e.target.value)
                  }
                  placeholder="Apellido"
                  style={{
                    borderColor: "var(--admin-border-secondary)",
                    backgroundColor: "var(--admin-bg-primary)",
                    color: "var(--admin-text-primary)",
                  }}
                />
              </div>
            </div>

            <div>
              <Label
                htmlFor="email"
                style={{ color: "var(--admin-text-secondary)" }}
              >
                Email *
              </Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                placeholder="email@ejemplo.com"
                style={{
                  borderColor: "var(--admin-border-secondary)",
                  backgroundColor: "var(--admin-bg-primary)",
                  color: "var(--admin-text-primary)",
                }}
              />
            </div>

            <div>
              <Label
                htmlFor="phone"
                style={{ color: "var(--admin-text-secondary)" }}
              >
                Teléfono
              </Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => handleInputChange("phone", e.target.value)}
                placeholder="+54 9 11 1234-5678"
                style={{
                  borderColor: "var(--admin-border-secondary)",
                  backgroundColor: "var(--admin-bg-primary)",
                  color: "var(--admin-text-primary)",
                }}
              />
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="newsletter_subscribed"
                checked={formData.newsletter_subscribed}
                onCheckedChange={(checked) =>
                  handleInputChange("newsletter_subscribed", checked)
                }
              />
              <Label
                htmlFor="newsletter_subscribed"
                style={{ color: "var(--admin-text-secondary)" }}
              >
                Suscrito al newsletter
              </Label>
            </div>
          </CardContent>
        </Card>

        {/* Address Information */}
        <Card
          className="admin-card"
          style={{ border: "1px solid var(--admin-border-secondary)" }}
        >
          <CardHeader>
            <CardTitle
              className="flex items-center"
              style={{ color: "var(--admin-text-primary)" }}
            >
              <MapPin
                className="h-5 w-5 mr-2"
                style={{ color: "var(--admin-text-primary)" }}
              />
              Dirección
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label
                htmlFor="address_line_1"
                style={{ color: "var(--admin-text-secondary)" }}
              >
                Dirección
              </Label>
              <Input
                id="address_line_1"
                value={formData.address_line_1}
                onChange={(e) =>
                  handleInputChange("address_line_1", e.target.value)
                }
                placeholder="Calle y número"
                style={{
                  borderColor: "var(--admin-border-secondary)",
                  backgroundColor: "var(--admin-bg-primary)",
                  color: "var(--admin-text-primary)",
                }}
              />
            </div>

            <div>
              <Label
                htmlFor="address_line_2"
                style={{ color: "var(--admin-text-secondary)" }}
              >
                Dirección 2 (opcional)
              </Label>
              <Input
                id="address_line_2"
                value={formData.address_line_2}
                onChange={(e) =>
                  handleInputChange("address_line_2", e.target.value)
                }
                placeholder="Departamento, piso, etc."
                style={{
                  borderColor: "var(--admin-border-secondary)",
                  backgroundColor: "var(--admin-bg-primary)",
                  color: "var(--admin-text-primary)",
                }}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label
                  htmlFor="city"
                  style={{ color: "var(--admin-text-secondary)" }}
                >
                  Ciudad
                </Label>
                <Input
                  id="city"
                  value={formData.city}
                  onChange={(e) => handleInputChange("city", e.target.value)}
                  placeholder="Ciudad"
                  style={{
                    borderColor: "var(--admin-border-secondary)",
                    backgroundColor: "var(--admin-bg-primary)",
                    color: "var(--admin-text-primary)",
                  }}
                />
              </div>
              <div>
                <Label
                  htmlFor="state"
                  style={{ color: "var(--admin-text-secondary)" }}
                >
                  Provincia
                </Label>
                <Input
                  id="state"
                  value={formData.state}
                  onChange={(e) => handleInputChange("state", e.target.value)}
                  placeholder="Provincia"
                  style={{
                    borderColor: "var(--admin-border-secondary)",
                    backgroundColor: "var(--admin-bg-primary)",
                    color: "var(--admin-text-primary)",
                  }}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label
                  htmlFor="postal_code"
                  style={{ color: "var(--admin-text-secondary)" }}
                >
                  Código Postal
                </Label>
                <Input
                  id="postal_code"
                  value={formData.postal_code}
                  onChange={(e) =>
                    handleInputChange("postal_code", e.target.value)
                  }
                  placeholder="1234"
                  style={{
                    borderColor: "var(--admin-border-secondary)",
                    backgroundColor: "var(--admin-bg-primary)",
                    color: "var(--admin-text-primary)",
                  }}
                />
              </div>
              <div>
                <Label
                  htmlFor="country"
                  style={{ color: "var(--admin-text-secondary)" }}
                >
                  País
                </Label>
                <Input
                  id="country"
                  value={formData.country}
                  onChange={(e) => handleInputChange("country", e.target.value)}
                  placeholder="País"
                  style={{
                    borderColor: "var(--admin-border-secondary)",
                    backgroundColor: "var(--admin-bg-primary)",
                    color: "var(--admin-text-primary)",
                  }}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Membership Information */}
        <Card
          className="admin-card"
          style={{ border: "1px solid var(--admin-border-secondary)" }}
        >
          <CardHeader>
            <CardTitle
              className="flex items-center"
              style={{ color: "var(--admin-text-primary)" }}
            >
              <Crown
                className="h-5 w-5 mr-2"
                style={{ color: "var(--admin-text-primary)" }}
              />
              Membresía
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-2">
              <Switch
                id="is_member"
                checked={formData.is_member}
                onCheckedChange={(checked) =>
                  handleInputChange("is_member", checked)
                }
              />
              <Label
                htmlFor="is_member"
                style={{ color: "var(--admin-text-secondary)" }}
              >
                Es miembro
              </Label>
            </div>

            {formData.is_member && (
              <>
                <div>
                  <Label
                    htmlFor="membership_tier"
                    style={{ color: "var(--admin-text-secondary)" }}
                  >
                    Tipo de Membresía
                  </Label>
                  <Select
                    value={formData.membership_tier}
                    onValueChange={(value) =>
                      handleInputChange("membership_tier", value)
                    }
                  >
                    <SelectTrigger
                      style={{
                        borderColor: "var(--admin-border-secondary)",
                        backgroundColor: "var(--admin-bg-primary)",
                      }}
                    >
                      <SelectValue placeholder="Seleccionar tipo" />
                    </SelectTrigger>
                    <SelectContent
                      style={{ backgroundColor: "var(--admin-bg-primary)" }}
                    >
                      <SelectItem value="none">Sin membresía</SelectItem>
                      <SelectItem value="basic">Básica</SelectItem>
                      <SelectItem value="premium">Premium</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label
                      htmlFor="membership_start_date"
                      style={{ color: "var(--admin-text-secondary)" }}
                    >
                      Fecha de Inicio
                    </Label>
                    <Input
                      id="membership_start_date"
                      type="date"
                      value={formData.membership_start_date}
                      onChange={(e) =>
                        handleInputChange(
                          "membership_start_date",
                          e.target.value,
                        )
                      }
                      style={{
                        borderColor: "var(--admin-border-secondary)",
                        backgroundColor: "var(--admin-bg-primary)",
                        color: "var(--admin-text-primary)",
                      }}
                    />
                  </div>
                  <div>
                    <Label
                      htmlFor="membership_end_date"
                      style={{ color: "var(--admin-text-secondary)" }}
                    >
                      Fecha de Fin
                    </Label>
                    <Input
                      id="membership_end_date"
                      type="date"
                      value={formData.membership_end_date}
                      onChange={(e) =>
                        handleInputChange("membership_end_date", e.target.value)
                      }
                      style={{
                        borderColor: "var(--admin-border-secondary)",
                        backgroundColor: "var(--admin-bg-primary)",
                        color: "var(--admin-text-primary)",
                      }}
                    />
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Additional Notes */}
        <Card
          className="admin-card"
          style={{ border: "1px solid var(--admin-border-secondary)" }}
        >
          <CardHeader>
            <CardTitle style={{ color: "var(--admin-text-primary)" }}>
              Notas Adicionales
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="Notas sobre el cliente..."
              className="min-h-[100px]"
              style={{
                borderColor: "var(--admin-border-secondary)",
                backgroundColor: "var(--admin-bg-primary)",
                color: "var(--admin-text-primary)",
              }}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

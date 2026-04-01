"use client";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { UseFormRegister, FieldErrors, FieldValues } from "react-hook-form";

interface ProfileFieldProps {
  id: string;
  label: string;
  type?: "text" | "email" | "tel" | "date";
  placeholder?: string;
  value?: string | null;
  error?: string;
  isEditing?: boolean;
  register?: UseFormRegister<FieldValues>;
  className?: string;
}

export function ProfileField({
  id,
  label,
  type = "text",
  placeholder,
  value,
  error,
  isEditing = false,
  register,
  className = "",
}: ProfileFieldProps) {
  const inputClasses = `font-text border-brand-primary/30 focus:border-brand-primary focus:ring-brand-primary/50 ${
    error ? "border-red-500" : ""
  } ${className}`;

  return (
    <div className="space-y-2">
      <Label htmlFor={id} className="text-text-primary font-text font-medium">
        {label}
      </Label>
      {isEditing && register ? (
        <Input
          id={id}
          type={type}
          placeholder={placeholder}
          {...register(id)}
          className={inputClasses}
        />
      ) : (
        <div className="text-text-primary bg-white px-3 py-2 rounded-md border border-brand-primary/20 font-text">
          {value || "No especificado"}
        </div>
      )}
      {error && <p className="text-sm text-red-600 font-text">{error}</p>}
    </div>
  );
}

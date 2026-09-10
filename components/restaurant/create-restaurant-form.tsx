"use client";

import { useActionState } from "react";
import { AuthSubmitButton } from "@/components/auth/auth-submit-button";
import { FormMessage } from "@/components/auth/form-message";
import { createRestaurantAction } from "@/lib/restaurant/actions";
import { initialRestaurantActionState } from "@/lib/restaurant/state";
import type { RestaurantFormInput } from "@/lib/restaurant/validation";

type FieldConfig = {
  name: keyof RestaurantFormInput;
  label: string;
  autoComplete?: string;
  optional?: boolean;
  type?: "text" | "tel" | "url";
};

const fields: FieldConfig[] = [
  { name: "name", label: "Restaurant name", autoComplete: "organization" },
  { name: "phone", label: "Business phone", autoComplete: "tel", type: "tel" },
  {
    name: "addressLine1",
    label: "Address line 1",
    autoComplete: "address-line1"
  },
  {
    name: "addressLine2",
    label: "Address line 2",
    autoComplete: "address-line2",
    optional: true
  },
  { name: "city", label: "City", autoComplete: "address-level2" },
  {
    name: "region",
    label: "Province/state/region",
    autoComplete: "address-level1"
  },
  { name: "postalCode", label: "Postal/ZIP", autoComplete: "postal-code" },
  { name: "country", label: "Country", autoComplete: "country-name" },
  {
    name: "website",
    label: "Website",
    autoComplete: "url",
    optional: true,
    type: "url"
  }
];

export function CreateRestaurantForm() {
  const [state, formAction] = useActionState(
    createRestaurantAction,
    initialRestaurantActionState
  );

  return (
    <form className="auth-form restaurant-form" action={formAction} noValidate>
      <FormMessage state={state} />
      {fields.map((field) => {
        const error = state.fieldErrors?.[field.name];
        const errorId = `${field.name}-error`;

        return (
          <div className="field-group" key={field.name}>
            <label htmlFor={field.name}>
              {field.label}
              {field.optional ? <span className="optional-label">Optional</span> : null}
            </label>
            <input
              id={field.name}
              name={field.name}
              type={field.type ?? "text"}
              autoComplete={field.autoComplete}
              defaultValue={state.values?.[field.name]}
              aria-describedby={error ? errorId : undefined}
              aria-invalid={Boolean(error)}
              required={!field.optional}
            />
            {error ? (
              <p className="field-error" id={errorId}>
                {error}
              </p>
            ) : null}
          </div>
        );
      })}
      <AuthSubmitButton pendingLabel="Creating restaurant...">
        Create restaurant
      </AuthSubmitButton>
    </form>
  );
}

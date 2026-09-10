import type { FieldErrors } from "@/lib/auth/validation";

export type AuthActionState = {
  status: "idle" | "error" | "success";
  message: string;
  fieldErrors?: FieldErrors;
  email?: string;
};

export const initialAuthActionState: AuthActionState = {
  status: "idle",
  message: ""
};

import type {
  RestaurantFieldErrors,
  RestaurantFormInput
} from "@/lib/restaurant/validation";

export type RestaurantActionState = {
  status: "idle" | "error" | "success";
  message: string;
  fieldErrors?: RestaurantFieldErrors;
  values?: Partial<RestaurantFormInput>;
};

export const initialRestaurantActionState: RestaurantActionState = {
  status: "idle",
  message: ""
};

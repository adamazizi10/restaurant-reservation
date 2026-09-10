import { redirect } from "next/navigation";
import { AuthShell } from "@/components/auth/auth-shell";
import { CreateRestaurantForm } from "@/components/restaurant/create-restaurant-form";
import { requireVerifiedEmailUser } from "@/lib/auth/session";
import { getCurrentRestaurantAccount } from "@/lib/restaurant/queries";

export default async function CreateRestaurantPage() {
  await requireVerifiedEmailUser();
  const account = await getCurrentRestaurantAccount();

  if (account) {
    redirect("/app");
  }

  return (
    <AuthShell
      title="Create restaurant account"
      subtitle="Enter the minimum details to start your trial."
    >
      <CreateRestaurantForm />
    </AuthShell>
  );
}

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { SettingsForm } from "@/components/dashboard/SettingsForm";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";

export default async function SettingsPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/login");
  }

  const dbUser = await db.user.findUnique({
    where: { id: (session.user as any).id }
  });

  const mergedUser = {
    ...session.user,
    image: dbUser?.image || null
  };

  return (
    <div className="flex-1 space-y-8 animate-in fade-in zoom-in-95 duration-500">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Settings</h2>
        <p className="text-muted-foreground">Manage your account settings and set e-mail preferences.</p>
      </div>
      <SettingsForm user={mergedUser} />
    </div>
  );
}

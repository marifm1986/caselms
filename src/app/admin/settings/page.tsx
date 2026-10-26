import { ScopeGuard } from "@/components/admin/scope-guard";
import { SettingsForm } from "@/components/admin/settings-form";

export const metadata = { title: "Site settings" };

export default function AdminSettingsPage() {
  return (
    <ScopeGuard scope="settings">
      <SettingsForm />
    </ScopeGuard>
  );
}

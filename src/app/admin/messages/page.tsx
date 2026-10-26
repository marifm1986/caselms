import { MessagesInbox } from "@/components/admin/messages-inbox";
import { ScopeGuard } from "@/components/admin/scope-guard";

export const metadata = { title: "Messages" };

export default function AdminMessagesPage() {
  return (
    <ScopeGuard scope="messages">
      <MessagesInbox />
    </ScopeGuard>
  );
}

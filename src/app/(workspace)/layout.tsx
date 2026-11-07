import { WorkspaceSidebar } from '@/components/layout/workspace-sidebar';
import { WorkspaceTopbar } from '@/components/layout/workspace-topbar';

export default function WorkspaceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-background">
      <WorkspaceSidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <WorkspaceTopbar />
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}

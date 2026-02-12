import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import Link from "next/link";
import { LayoutDashboard, Users, PlusCircle, Settings, LogOut } from "lucide-react";

export default async function SuperAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session || (session.user as any).role !== "SUPER_ADMIN") {
    redirect("/login");
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-white flex flex-col">
        <div className="p-6 border-b border-slate-800">
          <h1 className="text-xl font-bold tracking-tight">Turnero Admin</h1>
          <p className="text-xs text-slate-400 mt-1">Super Admin Console</p>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          <Link href="/sa" className="flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg hover:bg-slate-800 transition-colors">
            <LayoutDashboard className="w-5 h-5" /> Dashboard
          </Link>
          <Link href="/sa/tenants" className="flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg hover:bg-slate-800 transition-colors">
            <Users className="w-5 h-5" /> Tenants
          </Link>
          <Link href="/sa/tenants/create" className="flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg hover:bg-slate-800 transition-colors">
            <PlusCircle className="w-5 h-5" /> Create Tenant
          </Link>
          <Link href="/sa/settings" className="flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg hover:bg-slate-800 transition-colors">
            <Settings className="w-5 h-5" /> System Settings
          </Link>
        </nav>

        <div className="p-4 border-t border-slate-800">
          <div className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-slate-400 hover:text-white cursor-pointer">
             <LogOut className="w-5 h-5" /> Logout
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}

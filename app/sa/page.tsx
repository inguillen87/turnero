import { prisma } from "@/lib/db";
import { Users, Building, Activity, DollarSign } from "lucide-react";

export default async function SADashboard() {
  const tenantCount = await prisma.tenant.count();
  const userCount = await prisma.user.count();
  const apptCount = await prisma.appointment.count();

  // Quick revenue calc (sum of paid appointments maybe? or just mock for now)
  const revenue = apptCount * 5; // Mock $5 per appointment fee

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-slate-900">Dashboard Overview</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard
          title="Total Tenants"
          value={tenantCount.toString()}
          icon={<Building className="w-8 h-8 text-indigo-500" />}
          change="+12% this month"
        />
        <StatCard
          title="Total Users"
          value={userCount.toString()}
          icon={<Users className="w-8 h-8 text-green-500" />}
          change="+5% this week"
        />
        <StatCard
          title="Appointments"
          value={apptCount.toString()}
          icon={<Activity className="w-8 h-8 text-blue-500" />}
          change="+20% vs last month"
        />
        <StatCard
          title="Total Revenue (Est.)"
          value={`$${revenue.toLocaleString()}`}
          icon={<DollarSign className="w-8 h-8 text-orange-500" />}
          change="+8% MRR"
        />
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <h2 className="text-xl font-bold mb-4">Recent Activity</h2>
        <p className="text-slate-500">Global system activity log here...</p>
        <div className="mt-4 space-y-3">
           {/* Mock activity */}
           <div className="flex items-center justify-between py-2 border-b border-slate-100">
             <span className="text-sm font-medium">New Tenant Created: "Dental Plus"</span>
             <span className="text-xs text-slate-400">2 mins ago</span>
           </div>
           <div className="flex items-center justify-between py-2 border-b border-slate-100">
             <span className="text-sm font-medium">Subscription Upgraded: "Spa Relax"</span>
             <span className="text-xs text-slate-400">1 hour ago</span>
           </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon, change }: any) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-slate-500">{title}</p>
        <p className="text-3xl font-bold text-slate-900 mt-1">{value}</p>
        <p className="text-xs text-green-600 font-medium mt-2">{change}</p>
      </div>
      <div className="p-3 bg-slate-50 rounded-lg">{icon}</div>
    </div>
  )
}

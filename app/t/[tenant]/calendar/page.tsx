import CalendarClient from "./CalendarClient";

export default async function CalendarPage({ params }: { params: Promise<{ tenant: string }> }) {
  const { tenant } = await params;
  return <CalendarClient tenantSlug={tenant} />;
}

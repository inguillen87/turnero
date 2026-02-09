import { redirect } from 'next/navigation';

export default function TenantPage({ params }: { params: { slug: string } }) {
  redirect(`/t/${params.slug}/dashboard`);
}

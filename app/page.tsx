import { redirect } from 'next/navigation';

export const runtime = "nodejs";

export default function RootPage() {
  redirect('/t/demo/dashboard');
}

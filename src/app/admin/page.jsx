'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ROUTES } from '@/routes/paths';

export default function AdminIndexPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace(ROUTES.ADMIN.DASHBOARD);
  }, [router]);

  return null;
}

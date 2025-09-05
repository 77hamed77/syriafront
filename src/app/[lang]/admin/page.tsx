import { getDictionary } from '../../../../get-dictionary';
import { Locale } from '../../../../i18n-config';
import AdminRoute from '../components/AdminRoute';
import AdminPageClient from './AdminPageClient';

export default async function AdminPage({ params: { lang } }: { params: { lang: Locale } }) {
  const dictionary = await getDictionary(lang);
  
  return (
    <AdminRoute>
      <AdminPageClient dictionary={dictionary} />
    </AdminRoute>
  );
}
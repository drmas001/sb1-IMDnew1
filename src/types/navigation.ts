export type Page = 'dashboard' | 'admission' | 'patient' | 'consultation' | 'reports' | 'settings' | 'discharge' | 'specialties' | 'employees' | 'appointments';

export const isValidPage = (page: string): page is Page => {
  const validPages: Page[] = [
    'dashboard',
    'admission',
    'patient',
    'consultation',
    'reports',
    'settings',
    'discharge',
    'specialties',
    'employees',
    'appointments'
  ];
  return validPages.includes(page as Page);
};
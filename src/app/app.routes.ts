import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'dashboard', loadComponent: () => import('./sections/dashboard/dashboard.component').then(m => m.DashboardComponent) },
  { path: 'patients', loadComponent: () => import('./sections/patients/patients.component').then(m => m.PatientsComponent) },
  { path: 'patients/:id', loadComponent: () => import('./sections/patient-detail/patient-detail.component').then(m => m.PatientDetailComponent) },
  { path: 'staff', loadComponent: () => import('./sections/staff/staff.component').then(m => m.StaffComponent) },
  { path: 'admissions', loadComponent: () => import('./sections/admissions/admissions.component').then(m => m.AdmissionsComponent) },
  { path: 'insights', loadComponent: () => import('./sections/insights/insights.component').then(m => m.InsightsComponent) },
  { path: '**', redirectTo: '/dashboard' }
];

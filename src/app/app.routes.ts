import { Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  // Public routes
  { path: 'login', loadComponent: () => import('./sections/login/login.component').then(m => m.LoginComponent) },

  // Protected routes
  {
    path: '',
    redirectTo: '/dashboard',
    pathMatch: 'full'
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./sections/dashboard/dashboard.component').then(m => m.DashboardComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'patients',
    loadComponent: () => import('./sections/patients/patients.component').then(m => m.PatientsComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'patients/:id',
    loadComponent: () => import('./sections/patient-detail/patient-detail.component').then(m => m.PatientDetailComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'patients/:id/outcome',
    loadComponent: () => import('./patients-outcome/patient-outcome.component').then(m => m.PatientOutcomeComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'staff',
    loadComponent: () => import('./sections/staff/staff.component').then(m => m.StaffComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'treatment-planning',
    loadComponent: () => import('./patients-outcome/treatment-planning/treatment-planning.component').then(m => m.TreatmentPlanningComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'admissions',
    loadComponent: () => import('./sections/admissions/admissions.component').then(m => m.AdmissionsComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'insights',
    loadComponent: () => import('./sections/insights/insights.component').then(m => m.InsightsComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'settings',
    loadComponent: () => import('./sections/settings/settings.component').then(m => m.SettingsComponent),
    canActivate: [AuthGuard]
  },

  // Fallback routes
  { path: '**', redirectTo: '/dashboard' }
];

export const environment = {
  production: true,
  apiLoginUrl: 'https://api.medsynhospitals.com/medsyn-business/api',
  apiUrl: 'https://api.medsynhospitals.com/medsyn-hospitals/api',
  botApiUrl: 'https://api.medsynhospitals.com/medsyn-hospitals/api',
  appName: 'MedSyn Hospitals',
  version: '1.0.0',
  debug: false,
  logLevel: 'error',
  features: {
    aiInsights: true,
    medicationScanning: true,
    patientTimeline: true,
    healthEvents: true,
    reportsScans: true,
  },
  auth: {
    tokenKey: 'medsyn_doctor_auth_token',
    refreshTokenKey: 'medsyn_doctor_refresh_token',
    userProfileKey: 'medsyn_doctor_user_profile',
  },
  upload: {
    maxFileSize: 10485760, // 10MB
    allowedTypes: ['image/jpeg', 'image/png', 'application/pdf'],
    maxFiles: 5,
  },
  api: {
    timeout: 30000, // 30 seconds
    retryAttempts: 3,
    retryDelay: 1000,
  },
  client: {
    name: '',
  },
};

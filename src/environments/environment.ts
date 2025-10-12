export const environment = {
  production: false,
  apiLoginUrl: 'http://localhost:3000/medsyn-business/api',
  apiUrl: 'http://localhost:3000/medsyn-business/api',
  botApiUrl: 'http://localhost:3001/api',
  appName: 'MedSyn Hospitals',
  version: '1.0.0',
  debug: true,
  logLevel: 'debug',
  features: {
    aiInsights: true,
    medicationScanning: true,
    patientTimeline: true,
    healthEvents: true,
    reportsScans: true
  },
  auth: {
    tokenKey: 'medsyn_doctor_auth_token',
    refreshTokenKey: 'medsyn_doctor_refresh_token',
    userProfileKey: 'medsyn_doctor_user_profile'
  },
  upload: {
    maxFileSize: 10485760, // 10MB
    allowedTypes: ['image/jpeg', 'image/png', 'application/pdf'],
    maxFiles: 5
  },
  api: {
    timeout: 30000, // 30 seconds
    retryAttempts: 3,
    retryDelay: 1000
  },
  client: {
    name: '',
    hospitalId: '',
  },
};

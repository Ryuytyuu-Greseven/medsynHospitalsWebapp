export interface PublicPatientProfile {
  healthId: string;
  email: string;
  phoneNumber: string;
  dateOfBirth: string;
  name: string;
  profilePicture: string;
  lastAdmittedAt: Date;
  isActive: boolean;
  gender: string;
  address: string;
}

export interface PatientHealthSummary {
  summary: string;
  riskLevel: 'low' | 'medium' | 'high';
  confidence: number;
  lastAnalyzed: Date;
  isProcessing: boolean;
  keyFindings: string;
  predictedRisks: string;
  suggestedActions: string;
}

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

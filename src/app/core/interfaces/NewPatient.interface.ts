export interface NewPatient {
  name: string;
  dateOfBirth: string;
  gender: string;
  email: string;
  phone: string;
  address: string;
  medicalOnboard: {
    type: string;
    admissionDate: string;
    medicalConditions: string | null;
  };
}

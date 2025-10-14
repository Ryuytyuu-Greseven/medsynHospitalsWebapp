import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StaticDataService {

  constructor() { }

  /**
   * Get list of medical departments
   */
  getDepartments(): string[] {
    return [
      'Cardiology',
      'Neurology',
      'Orthopedics',
      'Pediatrics',
      'Emergency Medicine',
      'Internal Medicine',
      'Surgery',
      'Radiology',
      'Anesthesiology',
      'Dermatology',
      'Oncology',
      'Psychiatry',
      'Obstetrics & Gynecology',
      'Ophthalmology',
      'ENT',
      'Urology',
      'Gastroenterology',
      'Pulmonology',
      'Endocrinology',
      'Rheumatology'
    ];
  }

  /**
   * Get list of medical specializations
   */
  getSpecializations(): string[] {
    return [
      'General Practice',
      'Cardiovascular Surgery',
      'Neurosurgery',
      'Orthopedic Surgery',
      'Pediatric Surgery',
      'Plastic Surgery',
      'Trauma Surgery',
      'Minimally Invasive Surgery',
      'Robotic Surgery',
      'Transplant Surgery',
      'Critical Care Medicine',
      'Pain Management',
      'Sports Medicine',
      'Geriatric Medicine',
      'Preventive Medicine',
      'Occupational Medicine',
      'Public Health',
      'Medical Research',
      'Medical Education',
      'Healthcare Administration'
    ];
  }

  /**
   * Get list of common languages
   */
  getCommonLanguages(): string[] {
    return [
      'English',
      'Spanish',
      'French',
      'German',
      'Italian',
      'Portuguese',
      'Chinese',
      'Japanese',
      'Korean',
      'Arabic',
      'Hindi',
      'Russian',
      'Dutch',
      'Swedish',
      'Norwegian',
      'Danish'
    ];
  }

  /**
   * Get list of user roles
   */
  getUserRoles(): string[] {
    return [
      'admin',
      'doctor',
      'nurse',
      'staff'
    ];
  }

  /**
   * Get list of medical certifications
   */
  getMedicalCertifications(): string[] {
    return [
      'Board Certified in Internal Medicine',
      'Board Certified in Surgery',
      'Board Certified in Pediatrics',
      'Board Certified in Obstetrics & Gynecology',
      'Board Certified in Psychiatry',
      'Board Certified in Anesthesiology',
      'Board Certified in Radiology',
      'Board Certified in Emergency Medicine',
      'Board Certified in Family Medicine',
      'Fellowship in Cardiology',
      'Fellowship in Neurology',
      'Fellowship in Oncology',
      'Fellowship in Orthopedics',
      'Fellowship in Plastic Surgery',
      'Fellowship in Urology',
      'Advanced Cardiac Life Support (ACLS)',
      'Basic Life Support (BLS)',
      'Pediatric Advanced Life Support (PALS)',
      'Advanced Trauma Life Support (ATLS)',
      'Neonatal Resuscitation Program (NRP)'
    ];
  }

  /**
   * Get list of medical degrees
   */
  getMedicalDegrees(): string[] {
    return [
      'MD (Doctor of Medicine)',
      'DO (Doctor of Osteopathic Medicine)',
      'MBBS (Bachelor of Medicine, Bachelor of Surgery)',
      'MBChB (Bachelor of Medicine and Bachelor of Surgery)',
      'BMed (Bachelor of Medicine)',
      'PhD in Medicine',
      'DDS (Doctor of Dental Surgery)',
      'DMD (Doctor of Dental Medicine)',
      'PharmD (Doctor of Pharmacy)',
      'DVM (Doctor of Veterinary Medicine)'
    ];
  }

  /**
   * Get list of experience levels
   */
  getExperienceLevels(): { value: number; label: string }[] {
    return [
      { value: 0, label: 'Resident/Fellow' },
      { value: 1, label: '1 year' },
      { value: 2, label: '2 years' },
      { value: 3, label: '3 years' },
      { value: 4, label: '4 years' },
      { value: 5, label: '5 years' },
      { value: 6, label: '6 years' },
      { value: 7, label: '7 years' },
      { value: 8, label: '8 years' },
      { value: 9, label: '9 years' },
      { value: 10, label: '10+ years' },
      { value: 15, label: '15+ years' },
      { value: 20, label: '20+ years' },
      { value: 25, label: '25+ years' },
      { value: 30, label: '30+ years' }
    ];
  }
}

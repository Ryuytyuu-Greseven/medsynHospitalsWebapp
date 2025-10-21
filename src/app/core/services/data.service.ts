import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, delay } from 'rxjs';

export interface Patient {
  id: number;
  name: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  admitted: boolean;
  conditions: string[];
  admissionDate?: Date;
  assignedDoctor?: number;
  assignedNurse?: number;
}

export interface Staff {
  id: number;
  name: string;
  role: 1 | 2 | 3;
  specialization?: string;
  assignedPatients: number[];
  email: string;
  phone?: string;
}

export interface Admission {
  id: number;
  patientId: number;
  date: Date;
  status: 'pending' | 'admitted' | 'discharged';
  notes?: string;
}

export interface MedicalEvent {
  id: number;
  patientId: number;
  date: Date;
  type: 'surgery' | 'medication' | 'scan' | 'therapy' | 'consultation' | 'lab';
  title: string;
  description: string;
  doctor?: string;
  status: 'completed' | 'scheduled' | 'ongoing';
}

export interface PatientStats {
  id: number;
  patientId: number;
  weight: number; // kg
  height: number; // cm
  bmi: number;
  bloodPressure: string; // "120/80"
  heartRate: number; // bpm
  lastUpdated: Date;
}

export interface Medication {
  id: number;
  patientId: number;
  name: string;
  dosage: string;
  frequency: string;
  startDate: Date;
  status: 'active' | 'completed' | 'discontinued';
  notes?: string;
}

export interface DietEntry {
  id: number;
  patientId: number;
  date: Date;
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  notes: string;
  calories: number;
}

export interface HealthEvent {
  id: number;
  patientId: number;
  date: Date;
  type: 'surgery' | 'operation' | 'scan' | 'therapy' | 'consultation' | 'lab' | 'emergency';
  title: string;
  description: string;
  outcome: string;
  doctor?: string;
}

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private patientsSubject = new BehaviorSubject<Patient[]>([]);
  private staffSubject = new BehaviorSubject<Staff[]>([]);
  private admissionsSubject = new BehaviorSubject<Admission[]>([]);
  private medicalHistorySubject = new BehaviorSubject<MedicalEvent[]>([]);

  // Mock data
  private mockPatients: Patient[] = [
    {
      id: 1,
      name: 'Sarah Johnson',
      age: 45,
      gender: 'Female',
      admitted: true,
      conditions: ['Hypertension', 'Diabetes Type 2'],
      admissionDate: new Date('2024-01-15'),
      assignedDoctor: 1,
      assignedNurse: 1
    },
    {
      id: 2,
      name: 'Michael Chen',
      age: 62,
      gender: 'Male',
      admitted: false,
      conditions: ['Heart Disease', 'High Cholesterol']
    },
    {
      id: 3,
      name: 'Emily Rodriguez',
      age: 28,
      gender: 'Female',
      admitted: true,
      conditions: ['Pneumonia', 'Asthma'],
      admissionDate: new Date('2024-01-20'),
      assignedDoctor: 2,
      assignedNurse: 2
    },
    {
      id: 4,
      name: 'David Thompson',
      age: 55,
      gender: 'Male',
      admitted: false,
      conditions: ['Arthritis', 'Osteoporosis']
    },
    {
      id: 5,
      name: 'Lisa Wang',
      age: 38,
      gender: 'Female',
      admitted: true,
      conditions: ['Cancer Treatment', 'Depression'],
      admissionDate: new Date('2024-01-18'),
      assignedDoctor: 1,
      assignedNurse: 1
    }
  ];

  private mockStaff: Staff[] = [
    {
      id: 1,
      name: 'Dr. James Wilson',
      role: 2,
      specialization: 'Cardiology',
      assignedPatients: [1, 5],
      email: 'james.wilson@medsyn.ai',
      phone: '+1-555-0101'
    },
    {
      id: 2,
      name: 'Dr. Maria Garcia',
      role: 2,
      specialization: 'Pulmonology',
      assignedPatients: [3],
      email: 'maria.garcia@medsyn.ai',
      phone: '+1-555-0102'
    },
    {
      id: 3,
      name: 'Nurse Jennifer Lee',
      role: 3,
      assignedPatients: [1, 5],
      email: 'jennifer.lee@medsyn.ai',
      phone: '+1-555-0103'
    },
    {
      id: 4,
      name: 'Nurse Robert Brown',
      role: 3,
      assignedPatients: [3],
      email: 'robert.brown@medsyn.ai',
      phone: '+1-555-0104'
    },
    {
      id: 5,
      name: 'Admin Sarah Davis',
      role: 1,
      assignedPatients: [],
      email: 'sarah.davis@medsyn.ai',
      phone: '+1-555-0105'
    }
  ];

  private mockAdmissions: Admission[] = [
    {
      id: 1,
      patientId: 1,
      date: new Date('2024-01-15'),
      status: 'admitted',
      notes: 'Routine checkup and medication adjustment'
    },
    {
      id: 2,
      patientId: 3,
      date: new Date('2024-01-20'),
      status: 'admitted',
      notes: 'Respiratory infection treatment'
    },
    {
      id: 3,
      patientId: 5,
      date: new Date('2024-01-18'),
      status: 'admitted',
      notes: 'Cancer treatment and psychological support'
    }
  ];

  private mockPatientStats: PatientStats[] = [
    {
      id: 1,
      patientId: 1,
      weight: 70,
      height: 165,
      bmi: 25.7,
      bloodPressure: '130/85',
      heartRate: 72,
      lastUpdated: new Date('2024-01-15')
    },
    {
      id: 2,
      patientId: 3,
      weight: 58,
      height: 160,
      bmi: 22.7,
      bloodPressure: '115/75',
      heartRate: 68,
      lastUpdated: new Date('2024-01-20')
    },
    {
      id: 3,
      patientId: 5,
      weight: 65,
      height: 170,
      bmi: 22.5,
      bloodPressure: '120/80',
      heartRate: 75,
      lastUpdated: new Date('2024-01-18')
    }
  ];

  private mockMedications: Medication[] = [
    {
      id: 1,
      patientId: 1,
      name: 'Metformin',
      dosage: '500mg',
      frequency: 'Twice daily',
      startDate: new Date('2024-01-10'),
      status: 'active',
      notes: 'For diabetes management'
    },
    {
      id: 2,
      patientId: 1,
      name: 'Lisinopril',
      dosage: '10mg',
      frequency: 'Once daily',
      startDate: new Date('2024-01-12'),
      status: 'active',
      notes: 'For hypertension'
    },
    {
      id: 3,
      patientId: 3,
      name: 'Albuterol',
      dosage: '90mcg',
      frequency: 'As needed',
      startDate: new Date('2024-01-18'),
      status: 'active',
      notes: 'Inhaler for asthma'
    },
    {
      id: 4,
      patientId: 5,
      name: 'Tamoxifen',
      dosage: '20mg',
      frequency: 'Once daily',
      startDate: new Date('2023-11-15'),
      status: 'active',
      notes: 'Cancer treatment'
    }
  ];

  private mockDietEntries: DietEntry[] = [
    {
      id: 1,
      patientId: 1,
      date: new Date('2024-01-20'),
      mealType: 'breakfast',
      notes: 'Oatmeal with berries, green tea',
      calories: 350
    },
    {
      id: 2,
      patientId: 1,
      date: new Date('2024-01-20'),
      mealType: 'lunch',
      notes: 'Grilled chicken salad, water',
      calories: 450
    },
    {
      id: 3,
      patientId: 1,
      date: new Date('2024-01-20'),
      mealType: 'dinner',
      notes: 'Baked salmon, vegetables, brown rice',
      calories: 600
    },
    {
      id: 4,
      patientId: 3,
      date: new Date('2024-01-21'),
      mealType: 'breakfast',
      notes: 'Greek yogurt with honey',
      calories: 200
    }
  ];

  private mockHealthEvents: HealthEvent[] = [
    {
      id: 1,
      patientId: 1,
      date: new Date('2023-12-01'),
      type: 'surgery',
      title: 'Cardiac Catheterization',
      description: 'Diagnostic procedure to assess heart condition',
      outcome: 'Successful - no blockages found',
      doctor: 'Dr. James Wilson'
    },
    {
      id: 2,
      patientId: 3,
      date: new Date('2024-01-18'),
      type: 'scan',
      title: 'Chest X-Ray',
      description: 'Diagnostic imaging for respiratory symptoms',
      outcome: 'Clear - no abnormalities detected',
      doctor: 'Dr. Maria Garcia'
    },
    {
      id: 3,
      patientId: 5,
      date: new Date('2023-11-15'),
      type: 'surgery',
      title: 'Tumor Removal Surgery',
      description: 'Surgical removal of malignant tumor',
      outcome: 'Successful - tumor completely removed',
      doctor: 'Dr. James Wilson'
    }
  ];

  private mockMedicalHistory: MedicalEvent[] = [
    // Sarah Johnson (Patient 1)
    {
      id: 1,
      patientId: 1,
      date: new Date('2023-12-01'),
      type: 'surgery',
      title: 'Cardiac Catheterization',
      description: 'Diagnostic procedure to assess heart condition',
      doctor: 'Dr. James Wilson',
      status: 'completed'
    },
    {
      id: 2,
      patientId: 1,
      date: new Date('2024-01-10'),
      type: 'medication',
      title: 'Metformin Prescription',
      description: 'Diabetes management medication',
      doctor: 'Dr. James Wilson',
      status: 'ongoing'
    },
    {
      id: 3,
      patientId: 1,
      date: new Date('2024-01-15'),
      type: 'consultation',
      title: 'Follow-up Consultation',
      description: 'Regular checkup and medication review',
      doctor: 'Dr. James Wilson',
      status: 'completed'
    },
    // Emily Rodriguez (Patient 3)
    {
      id: 4,
      patientId: 3,
      date: new Date('2024-01-18'),
      type: 'scan',
      title: 'Chest X-Ray',
      description: 'Diagnostic imaging for respiratory symptoms',
      doctor: 'Dr. Maria Garcia',
      status: 'completed'
    },
    {
      id: 5,
      patientId: 3,
      date: new Date('2024-01-20'),
      type: 'therapy',
      title: 'Respiratory Therapy',
      description: 'Breathing exercises and lung rehabilitation',
      doctor: 'Dr. Maria Garcia',
      status: 'ongoing'
    },
    // Lisa Wang (Patient 5)
    {
      id: 6,
      patientId: 5,
      date: new Date('2023-11-15'),
      type: 'surgery',
      title: 'Tumor Removal Surgery',
      description: 'Surgical removal of malignant tumor',
      doctor: 'Dr. James Wilson',
      status: 'completed'
    },
    {
      id: 7,
      patientId: 5,
      date: new Date('2023-12-01'),
      type: 'therapy',
      title: 'Chemotherapy Session 1',
      description: 'First round of chemotherapy treatment',
      doctor: 'Dr. James Wilson',
      status: 'completed'
    },
    {
      id: 8,
      patientId: 5,
      date: new Date('2024-01-18'),
      type: 'consultation',
      title: 'Oncology Consultation',
      description: 'Treatment progress review and next steps',
      doctor: 'Dr. James Wilson',
      status: 'completed'
    },
    {
      id: 9,
      patientId: 5,
      date: new Date('2024-02-15'),
      type: 'therapy',
      title: 'Chemotherapy Session 2',
      description: 'Second round of chemotherapy treatment',
      doctor: 'Dr. James Wilson',
      status: 'scheduled'
    }
  ];

  constructor() {
    this.patientsSubject.next(this.mockPatients);
    this.staffSubject.next(this.mockStaff);
    this.admissionsSubject.next(this.mockAdmissions);
    this.medicalHistorySubject.next(this.mockMedicalHistory);
  }

  // Patient methods
  getPatients(): Observable<Patient[]> {
    return this.patientsSubject.asObservable();
  }

  addPatient(patient: Omit<Patient, 'id'>): Observable<Patient> {
    const newPatient: Patient = {
      ...patient,
      id: Math.max(...this.mockPatients.map(p => p.id)) + 1
    };
    this.mockPatients.push(newPatient);
    this.patientsSubject.next([...this.mockPatients]);
    return of(newPatient).pipe(delay(500));
  }

  getPatientById(id: number): Observable<Patient | undefined> {
    const patient = this.mockPatients.find(p => p.id === id);
    return of(patient).pipe(delay(200));
  }

  // Staff methods
  getStaff(): Observable<Staff[]> {
    return this.staffSubject.asObservable();
  }

  getStaffByRole(role: number): Observable<Staff[]> {
    const staff = this.mockStaff.filter(s => s.role === Number(role));
    return of(staff).pipe(delay(200));
  }

  addStaff(staffData: {
    name: string;
    email: string;
    license: string;
    password: string;
    role: 1 | 2 | 3;
  }): Observable<Staff> {
    const newStaff: Staff = {
      id: Math.max(...this.mockStaff.map(s => s.id)) + 1,
      name: staffData.name,
      email: staffData.email,
      role: staffData.role,
      assignedPatients: []
    };

    this.mockStaff.push(newStaff);
    this.staffSubject.next([...this.mockStaff]);
    return of(newStaff).pipe(delay(1000));
  }

  // Medical history methods
  getMedicalHistory(patientId: number): Observable<MedicalEvent[]> {
    const history = this.mockMedicalHistory.filter(event => event.patientId === patientId);
    return of(history).pipe(delay(300));
  }

  // Admission methods
  admitPatient(patientId: number): Observable<{ success: boolean; message: string }> {
    return new Observable(observer => {
      // Simulate API call delay
      setTimeout(() => {
        const patient = this.mockPatients.find(p => p.id === patientId);
        if (patient) {
          patient.admitted = true;
          patient.admissionDate = new Date();

          // Create admission record
          const admission: Admission = {
            id: Math.max(...this.mockAdmissions.map(a => a.id)) + 1,
            patientId: patientId,
            date: new Date(),
            status: 'admitted',
            notes: 'Patient admitted via Medsyn AI system'
          };

          this.mockAdmissions.push(admission);
          this.admissionsSubject.next([...this.mockAdmissions]);
          this.patientsSubject.next([...this.mockPatients]);

          observer.next({ success: true, message: 'Patient admitted successfully' });
        } else {
          observer.next({ success: false, message: 'Patient not found' });
        }
        observer.complete();
      }, 2000); // 2 second delay to simulate syncing
    });
  }

  getAdmissions(): Observable<Admission[]> {
    return this.admissionsSubject.asObservable();
  }

  getPendingAdmissions(): Observable<Patient[]> {
    const pendingPatients = this.mockPatients.filter(p => !p.admitted);
    return of(pendingPatients).pipe(delay(200));
  }

  // Dashboard data methods
  getDashboardStats(): Observable<{
    totalPatients: number;
    totalStaff: number;
    activeAdmissions: number;
    recentAdmissions: Patient[];
  }> {
    const stats = {
      totalPatients: this.mockPatients.length,
      totalStaff: this.mockStaff.length,
      activeAdmissions: this.mockPatients.filter(p => p.admitted).length,
      recentAdmissions: this.mockPatients.filter(p => p.admitted).slice(-5)
    };
    return of(stats).pipe(delay(300));
  }

  // AI Insights methods
  getAIInsights(): Observable<{
    patientInsights: string[];
    systemInsights: string[];
    recommendations: string[];
  }> {
    const insights = {
      patientInsights: [
        '40% of patients are under rehabilitation therapies',
        '2 patients have upcoming surgeries scheduled',
        'Average patient age is 45.6 years',
        'Most common condition is diabetes (40% of patients)'
      ],
      systemInsights: [
        'AI processing time reduced by 35% this month',
        'Patient satisfaction scores increased by 12%',
        'System uptime: 99.8%',
        'Data sync accuracy: 99.9%'
      ],
      recommendations: [
        'Schedule follow-up for 3 patients this week',
        'Review medication dosages for elderly patients',
        'Consider additional therapy sessions for cancer patients',
        'Update patient records with latest lab results'
      ]
    };
    return of(insights).pipe(delay(500));
  }

  // Patient Stats methods
  getPatientStats(patientId: number): Observable<PatientStats | undefined> {
    const stats = this.mockPatientStats.find(s => s.patientId === patientId);
    return of(stats).pipe(delay(200));
  }

  updatePatientStats(patientId: number, stats: Partial<PatientStats>): Observable<PatientStats> {
    const existingStats = this.mockPatientStats.find(s => s.patientId === patientId);
    if (existingStats) {
      Object.assign(existingStats, stats, { lastUpdated: new Date() });
      return of(existingStats).pipe(delay(300));
    } else {
      const newStats: PatientStats = {
        id: Math.max(...this.mockPatientStats.map(s => s.id)) + 1,
        patientId,
        weight: stats.weight || 0,
        height: stats.height || 0,
        bmi: stats.bmi || 0,
        bloodPressure: stats.bloodPressure || '',
        heartRate: stats.heartRate || 0,
        lastUpdated: new Date()
      };
      this.mockPatientStats.push(newStats);
      return of(newStats).pipe(delay(300));
    }
  }

  // Medications methods
  getMedications(patientId: number): Observable<Medication[]> {
    const medications = this.mockMedications.filter(m => m.patientId === patientId);
    return of(medications).pipe(delay(200));
  }

  addMedication(medication: Omit<Medication, 'id'>): Observable<Medication> {
    const newMedication: Medication = {
      ...medication,
      id: Math.max(...this.mockMedications.map(m => m.id)) + 1
    };
    this.mockMedications.push(newMedication);
    return of(newMedication).pipe(delay(300));
  }

  updateMedicationStatus(medicationId: number, status: 'active' | 'completed' | 'discontinued'): Observable<Medication> {
    const medication = this.mockMedications.find(m => m.id === medicationId);
    if (medication) {
      medication.status = status;
      return of(medication).pipe(delay(200));
    }
    throw new Error('Medication not found');
  }

  // Diet methods
  getDietEntries(patientId: number): Observable<DietEntry[]> {
    const entries = this.mockDietEntries.filter(d => d.patientId === patientId);
    return of(entries).pipe(delay(200));
  }

  addDietEntry(entry: Omit<DietEntry, 'id'>): Observable<DietEntry> {
    const newEntry: DietEntry = {
      ...entry,
      id: Math.max(...this.mockDietEntries.map(d => d.id)) + 1
    };
    this.mockDietEntries.push(newEntry);
    return of(newEntry).pipe(delay(300));
  }

  getDietSummary(patientId: number): Observable<{
    totalCalories: number;
    compliancePercentage: number;
    entriesThisWeek: number;
  }> {
    const entries = this.mockDietEntries.filter(d => d.patientId === patientId);
    const totalCalories = entries.reduce((sum, entry) => sum + entry.calories, 0);
    const entriesThisWeek = entries.length;
    const compliancePercentage = Math.min(100, (entriesThisWeek / 21) * 100); // Assuming 3 meals per day for 7 days

    return of({
      totalCalories,
      compliancePercentage,
      entriesThisWeek
    }).pipe(delay(200));
  }

  // Health Events methods
  getHealthEvents(patientId: number): Observable<HealthEvent[]> {
    const events = this.mockHealthEvents.filter(e => e.patientId === patientId);
    return of(events).pipe(delay(200));
  }

  addHealthEvent(event: Omit<HealthEvent, 'id'>): Observable<HealthEvent> {
    const newEvent: HealthEvent = {
      ...event,
      id: Math.max(...this.mockHealthEvents.map(e => e.id)) + 1
    };
    this.mockHealthEvents.push(newEvent);
    return of(newEvent).pipe(delay(300));
  }

  // Patient Medical Summary
  getPatientMedicalSummary(patientId: number): Observable<{
    medicationCount: number;
    dietEntriesThisMonth: number;
    lastSurgeryDate?: Date;
    summary: string;
  }> {
    const medications = this.mockMedications.filter(m => m.patientId === patientId && m.status === 'active');
    const dietEntries = this.mockDietEntries.filter(d => d.patientId === patientId);
    const healthEvents = this.mockHealthEvents.filter(e => e.patientId === patientId && e.type === 'surgery');
    const lastSurgery = healthEvents.length > 0 ? healthEvents.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0] : null;

    const summary = `Patient is currently on ${medications.length} medications, has logged ${dietEntries.length} diet entries this month${lastSurgery ? `, and last surgery was ${this.getMonthsAgo(lastSurgery.date)} months ago` : ''}.`;

    return of({
      medicationCount: medications.length,
      dietEntriesThisMonth: dietEntries.length,
      lastSurgeryDate: lastSurgery?.date,
      summary
    }).pipe(delay(300));
  }

  private getMonthsAgo(date: Date): number {
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.floor(diffDays / 30);
  }

  // Enhanced Medical Journey methods for Digital Time Machine
  getCompleteMedicalJourney(patientId: number): Observable<{
    admissions: any[];
    surgeries: HealthEvent[];
    medications: Medication[];
    reports: any[];
    imaging: any[];
    labTests: any[];
    consultations: HealthEvent[];
  }> {
    const medications = this.mockMedications.filter(m => m.patientId === patientId);
    const healthEvents = this.mockHealthEvents.filter(e => e.patientId === patientId);
    const surgeries = healthEvents.filter(e => e.type === 'surgery' || e.type === 'operation');
    const consultations = healthEvents.filter(e => e.type === 'consultation');

    return of({
      admissions: [],
      surgeries,
      medications,
      reports: [],
      imaging: [],
      labTests: [],
      consultations
    }).pipe(delay(300));
  }

  // Get AI Health Summary (mock for now, would call AI service in production)
  getAIHealthSummary(patientId: number): Observable<{
    summary: string;
    riskLevel: 'low' | 'medium' | 'high';
    confidence: number;
    lastAnalyzed: Date;
    keyFindings: string[];
    predictedRisks: string[];
    suggestedActions: string[];
  }> {
    const patient = this.mockPatients.find(p => p.id === patientId);
    const medications = this.mockMedications.filter(m => m.patientId === patientId && m.status === 'active');

    let riskLevel: 'low' | 'medium' | 'high' = 'low';
    if (patient?.conditions.some(c => c.includes('Cancer') || c.includes('Heart'))) {
      riskLevel = 'high';
    } else if (patient && patient.conditions.length > 1) {
      riskLevel = 'medium';
    }

    return of({
      summary: `Patient ${patient?.name || 'Unknown'} is showing stable vital signs with current medical management. Recent assessments indicate well-controlled conditions with effective medication regimen. Continued monitoring recommended with routine follow-ups.`,
      riskLevel,
      confidence: 0.88 + (Math.random() * 0.1),
      lastAnalyzed: new Date(),
      keyFindings: [
        `Currently on ${medications.length} active medication(s)`,
        'Vital signs within normal parameters',
        'No recent adverse events reported',
        'Treatment compliance: Excellent',
        'Overall health trajectory: Stable'
      ],
      predictedRisks: [
        'Continue monitoring for medication side effects',
        'Regular follow-up consultations recommended',
        'Lifestyle modifications may improve outcomes'
      ],
      suggestedActions: [
        'Schedule follow-up in 2-4 weeks',
        'Review medication dosages at next visit',
        'Consider preventive care screening',
        'Update patient education materials'
      ]
    }).pipe(delay(500));
  }

  // Get vitals trends over time
  getVitalsTrends(patientId: number, days: number = 30): Observable<{
    date: Date;
    weight: number;
    bloodPressure: string;
    heartRate: number;
    glucose?: number;
  }[]> {
    const trends = [];
    const baseDate = new Date();

    for (let i = days; i >= 0; i -= 3) {
      const date = new Date(baseDate);
      date.setDate(date.getDate() - i);

      trends.push({
        date,
        weight: 70 + Math.random() * 3 - 1.5,
        bloodPressure: `${120 + Math.floor(Math.random() * 15)}/${75 + Math.floor(Math.random() * 10)}`,
        heartRate: 68 + Math.floor(Math.random() * 12),
        glucose: 90 + Math.floor(Math.random() * 25)
      });
    }

    return of(trends).pipe(delay(300));
  }

  // Get medical reports and scans
  getMedicalReports(patientId: number): Observable<{
    id: number;
    title: string;
    type: 'lab' | 'imaging' | 'prescription' | 'report';
    date: Date;
    aiSummary: string;
    url?: string;
  }[]> {
    const reports = [
      {
        id: 1,
        title: 'Complete Blood Count (CBC)',
        type: 'lab' as const,
        date: new Date(2024, 0, 15),
        aiSummary: 'All blood parameters within normal range. Hemoglobin levels optimal. No signs of infection or anemia.'
      },
      {
        id: 2,
        title: 'Chest X-Ray',
        type: 'imaging' as const,
        date: new Date(2024, 0, 10),
        aiSummary: 'Clear lung fields with no abnormalities. Cardiac silhouette appears normal. No signs of pneumonia or fluid.'
      },
      {
        id: 3,
        title: 'ECG Report',
        type: 'imaging' as const,
        date: new Date(2024, 0, 8),
        aiSummary: 'Normal sinus rhythm. Heart rate regular. No signs of arrhythmia or ischemia detected.'
      },
      {
        id: 4,
        title: 'Lipid Profile',
        type: 'lab' as const,
        date: new Date(2023, 11, 20),
        aiSummary: 'Cholesterol levels slightly elevated. HDL within normal range. LDL requires monitoring. Recommend dietary modifications.'
      },
      {
        id: 5,
        title: 'Medication Prescription',
        type: 'prescription' as const,
        date: new Date(2024, 0, 12),
        aiSummary: 'Current medications prescribed for chronic condition management. Dosages adjusted based on recent vitals.'
      }
    ];

    return of(reports).pipe(delay(300));
  }
}

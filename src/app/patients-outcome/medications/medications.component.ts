import { Component, Input, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faPills,
  faEye,
  faEdit,
  faTimes,
  faSearch,
  faPlus,
  faDownload,
  faCheckCircle,
  faCalendarAlt,
  faUserMd,
  faFileMedical,
  faHistory,
  faExclamationTriangle,
  faCamera,
  faWandMagicSparkles,
} from '@fortawesome/free-solid-svg-icons';
import { LoadingComponent } from '../../shared/components/loading/loading.component';
import {
  DocumentViewerComponent,
  DocumentViewerData,
} from '../../shared/components/document-viewer/document-viewer.component';
import { PatientService } from '../../core/services/patient.service';
import { PublicPatientProfile } from '../../core/interfaces';
import { ToastService } from '../../core/services';

type MacroKey = 'calories' | 'protein' | 'carbs' | 'fat';

interface DietMacroTotals {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

interface DietMeal {
  name: string;
  time: string;
  foods: string[];
  macros: DietMacroTotals;
  hydration?: string;
}

interface DietDayPlan {
  day: string;
  focus: string;
  meals: DietMeal[];
}

interface DietPlan {
  name: string;
  description: string;
  badge: string;
  doctor: string;
  startDate: Date;
  reviewDate: Date;
  notes: string;
  dailyTargets: DietMacroTotals;
  weeklyPlan: DietDayPlan[];
  hydrationGoal: string;
  supplements: string[];
}

export interface Medication {
  id: number;
  name: string;
  dosage: string;
  frequency: string;
  startDate: Date;
  endDate?: Date;
  status: 'active' | 'completed' | 'discontinued' | 'paused';
  notes?: string;
  prescribedBy?: string;
  discontinueReason?: string;
  description?: string;
  timesPerDay?: number;
  instructions?: string;
  sideEffects?: string;
  interactions?: string;
}

@Component({
  selector: 'app-medications',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    FontAwesomeModule,
    LoadingComponent,
    DocumentViewerComponent,
  ],
  templateUrl: './medications.component.html',
  styleUrls: ['./medications.component.css'],
})
export class MedicationsComponent {
  @Input() medications: Medication[] = [];
  @Input() patientDetails: PublicPatientProfile | null = null;

  // FontAwesome icons
  faPills = faPills;
  faEye = faEye;
  faEdit = faEdit;
  faTimes = faTimes;
  faSearch = faSearch;
  faPlus = faPlus;
  faDownload = faDownload;
  faCheckCircle = faCheckCircle;
  faCalendarAlt = faCalendarAlt;
  faUserMd = faUserMd;
  faFileMedical = faFileMedical;
  faHistory = faHistory;
  faExclamationTriangle = faExclamationTriangle;
  faCamera = faCamera;
  faWandMagicSparkles = faWandMagicSparkles;

  // Modal state
  showMedicationsModal = false;
  showAddMedicationModal = false;
  showImageUploadModal = false;
  showAIDietInstructionsModal = false;
  medicationSearchTerm = '';
  quickSearchTerm = '';
  selectedStatusFilter = 'all';
  selectedMedicationTab: 'active' | 'discontinued' = 'active';
  filteredMedications: Medication[] = [];

  // AI Diet Plan Instructions
  aiDietInstructions = '';
  isGeneratingDietPlan = false;

  // New medication form
  newMedication: Partial<Medication> = {};

  // Reactive Form
  medicationForm!: FormGroup;

  // Image upload state
  uploadedImage: File | null = null;
  medicationFiles: File[] = [];
  isProcessingImage = false;
  isUploadingMedication = false;
  extractedMedicationData: Partial<Medication> | null = null;

  // Document Viewer State
  showDocumentViewer: boolean = false;
  currentDocument: DocumentViewerData | null = null;

  // Diet Plan View
  showDietPlanModal = false;
  selectedDayIndex = 0;

  // Diet Plan State
  inactiveDietPlans: DietPlan[] = [];
  dietPlan: DietPlan = {} as DietPlan;
  currentViewedDietPlan: DietPlan = {} as DietPlan;

  macroStatDefinitions: { key: MacroKey; label: string; unit: string }[] = [
    { key: 'calories', label: 'Calories', unit: 'kcal' },
    { key: 'protein', label: 'Protein', unit: 'g' },
    { key: 'carbs', label: 'Carbs', unit: 'g' },
    { key: 'fat', label: 'Fats', unit: 'g' },
  ];

  // Sample discontinued medications for demo
  discontinuedMedications: Medication[] = [
    // {
    //   id: 101,
    //   name: 'Aspirin',
    //   dosage: '81mg',
    //   frequency: 'Once daily',
    //   startDate: new Date('2023-06-01'),
    //   endDate: new Date('2024-01-15'),
    //   status: 'discontinued',
    //   prescribedBy: 'Dr. Smith',
    //   discontinueReason: 'Switched to alternative medication',
    // },
  ];

  constructor(
    private fb: FormBuilder,
    private patientService: PatientService,
    private toastService: ToastService
  ) {
    this.initializeForm();
  }
  ngOnInit(): void {
    this.getPatientMedications();
    this.getPatientDietPlan();
  }

  ngOnChanges(changes: SimpleChanges): void {
    // if (changes['patientDetails']) {
    //   this.getPatientMedications();
    // }
  }

  private initializeForm(): void {
    this.medicationForm = this.fb.group({
      name: ['', Validators.required],
      dosage: ['', Validators.required],
      frequency: ['', Validators.required],
      timesPerDay: [''],
      startDate: ['', Validators.required],
      prescribedBy: [''],
      description: [''],
      instructions: [''],
      sideEffects: [''],
      interactions: [''],
      notes: [''],
    });
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  }

  getStatusClass(status: string): string {
    const classes: { [key: string]: string } = {
      active: 'bg-green-100 text-green-800',
      completed: 'bg-blue-100 text-blue-800',
      discontinued: 'bg-gray-100 text-gray-800',
      paused: 'bg-yellow-100 text-yellow-800',
    };
    return classes[status] || 'bg-gray-100 text-gray-800';
  }

  // Quick search function
  quickSearchMedication(): void {
    this.medicationSearchTerm = this.quickSearchTerm;
    this.getPatientMedications();
  }

  // Modal functions
  openMedicationsModal(): void {
    this.showMedicationsModal = true;
    this.filterMedications();
  }

  closeMedicationsModal(): void {
    this.showMedicationsModal = false;
    this.medicationSearchTerm = '';
    this.selectedStatusFilter = 'all';
  }

  filterMedications(): void {
    let allMeds = this.getAllMedications();

    // Filter by search term
    if (this.medicationSearchTerm) {
      allMeds = allMeds.filter(
        (med) =>
          med.name
            .toLowerCase()
            .includes(this.medicationSearchTerm.toLowerCase()) ||
          med.dosage
            .toLowerCase()
            .includes(this.medicationSearchTerm.toLowerCase())
      );
    }

    // Filter by status
    if (this.selectedStatusFilter !== 'all') {
      allMeds = allMeds.filter(
        (med) => med.status === this.selectedStatusFilter
      );
    }

    this.filteredMedications = allMeds;
  }

  getAllMedications(): Medication[] {
    return [...this.medications, ...this.discontinuedMedications];
  }

  getFilteredMedications(status: string): Medication[] {
    if (status === 'all') {
      return this.filteredMedications.length > 0
        ? this.filteredMedications
        : this.getAllMedications();
    }

    const allMeds =
      this.filteredMedications.length > 0
        ? this.filteredMedications
        : this.getAllMedications();
    // return allMeds.filter((med) => med.status === status);
    return allMeds;
  }

  // Medication actions
  editMedication(medication: Medication): void {
    console.log('Edit medication:', medication);
    // TODO: Implement edit functionality
  }

  discontinueMedication(medication: Medication): void {
    console.log('Discontinue medication:', medication);
    // TODO: Implement discontinue functionality
  }

  viewMedicationHistory(medication: Medication): void {
    console.log('View medication history:', medication);
    // TODO: Implement history view
  }

  openAddMedicationModal(): void {
    this.showAddMedicationModal = true;
    this.medicationForm.reset({
      name: '',
      dosage: '',
      frequency: '',
      timesPerDay: '',
      startDate: new Date().toISOString().split('T')[0],
      prescribedBy: '',
      description: '',
      instructions: '',
      sideEffects: '',
      interactions: '',
      notes: '',
    });
    this.newMedication = {
      startDate: new Date(),
      status: 'active',
    };
  }

  closeAddMedicationModal(): void {
    this.showAddMedicationModal = false;
    this.medicationForm.reset();
    this.newMedication = {};
  }

  addMedication(): void {
    if (this.medicationForm.valid) {
      const formValue = this.medicationForm.value;
      const medication: Medication = {
        id: Date.now(),
        name: formValue.name,
        dosage: formValue.dosage,
        frequency: formValue.frequency,
        startDate: new Date(formValue.startDate),
        status: 'active',
        notes: formValue.notes,
        prescribedBy: formValue.prescribedBy,
        description: formValue.description,
        timesPerDay: formValue.timesPerDay,
        instructions: formValue.instructions,
        sideEffects: formValue.sideEffects,
        interactions: formValue.interactions,
      };

      this.medications.push(medication);
      this.closeAddMedicationModal();
      this.filterMedications();
    }
  }

  isMedicationFormValid(): boolean {
    return this.medicationForm.valid;
  }

  // Image upload methods
  openImageUpload(): void {
    this.showImageUploadModal = true;
    this.uploadedImage = null;
    this.medicationFiles = [];
    this.extractedMedicationData = null;
    this.isProcessingImage = false;
  }

  closeImageUploadModal(): void {
    this.showImageUploadModal = false;
    this.uploadedImage = null;
    this.medicationFiles = [];
    this.extractedMedicationData = null;
    this.isProcessingImage = false;
    this.isUploadingMedication = false;
  }

  triggerFileInput(): void {
    const fileInput = document.querySelector(
      'input[type="file"]'
    ) as HTMLInputElement;
    if (fileInput) {
      fileInput.click();
    }
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.medicationFiles = [file];
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.uploadedImage = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();

    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      this.medicationFiles = Array.from(files);
      const file = files[0];
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.uploadedImage = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  removeUploadedImage(): void {
    this.uploadedImage = null;
    this.medicationFiles = [];
    this.extractedMedicationData = null;
  }

  // ========================== API CALLS ========================== //
  // Upload medications
  getPatientMedications(): void {
    if (this.patientDetails?.healthId) {
      this.patientService
        .getPatientMedications({
          healthId: this.patientDetails?.healthId,
          search: this.quickSearchTerm,
          limit: 10,
          page: 1,
        })
        .subscribe({
          next: (response) => {
            console.log('response', response);
            this.medications = response;
          },
        });
    }
  }

  // ========================== IMAGE PROCESSING ========================== //
  // Process image
  processImage(): void {
    if (!this.uploadedImage) return;
    if (this.isUploadingMedication) return;

    this.isUploadingMedication = true;
    this.isProcessingImage = true;

    if (this.patientDetails?.healthId) {
      this.patientService
        .addPatientMedication({
          healthId: this.patientDetails?.healthId,
          medications: this.medicationFiles,
        })
        .subscribe({
          next: (response) => {
            console.log('response', response);
            this.toastService.success(
              'Success',
              'Medications are being processed...'
            );
            this.isProcessingImage = false;
            this.isUploadingMedication = false;
            this.getPatientMedications();
            this.closeImageUploadModal();
          },
          error: (error) => {
            console.error('Upload error:', error);
            this.toastService.error(
              'Error',
              'Failed to upload medications. Please try again.'
            );
            this.isProcessingImage = false;
            this.isUploadingMedication = false;
          },
        });
    } else {
      this.isProcessingImage = false;
      this.isUploadingMedication = false;
    }

    // Simulate AI processing
    // setTimeout(() => {
    //   this.extractedMedicationData = {
    //     name: 'Metformin',
    //     dosage: '500mg',
    //     frequency: 'Twice daily',
    //     instructions: 'Take with food',
    //     startDate: new Date(),
    //     status: 'active'
    //   };
    //   this.isProcessingImage = false;
    // }, 3000);
  }

  confirmExtractedData(): void {
    if (this.extractedMedicationData) {
      const medication: Medication = {
        id: Date.now(),
        name: this.extractedMedicationData.name!,
        dosage: this.extractedMedicationData.dosage!,
        frequency: this.extractedMedicationData.frequency!,
        startDate: new Date(this.extractedMedicationData.startDate!),
        status: this.extractedMedicationData.status!,
        instructions: this.extractedMedicationData.instructions,
        notes: 'Added via prescription scan',
      };

      this.medications.push(medication);
      this.closeImageUploadModal();
      this.filterMedications();
    }
  }

  editExtractedData(): void {
    // Open the manual entry modal with pre-filled data
    this.closeImageUploadModal();
    this.showAddMedicationModal = true;
    if (this.extractedMedicationData) {
      this.medicationForm.patchValue({
        name: this.extractedMedicationData.name || '',
        dosage: this.extractedMedicationData.dosage || '',
        frequency: this.extractedMedicationData.frequency || '',
        startDate: this.extractedMedicationData.startDate
          ? new Date(this.extractedMedicationData.startDate)
              .toISOString()
              .split('T')[0]
          : new Date().toISOString().split('T')[0],
        instructions: this.extractedMedicationData.instructions || '',
      });
    }
  }

  // Helper methods for insights
  getUpcomingRefills(): number {
    // Mock data - in real app, this would calculate based on medication schedules
    return 2;
  }

  getRecentActivity(): any[] {
    return [
      {
        icon: this.faPills,
        colorClass: 'text-green-600',
        description: 'Metformin added via scan',
      },
      {
        icon: this.faEdit,
        colorClass: 'text-blue-600',
        description: 'Lisinopril dosage updated',
      },
      {
        icon: this.faTimes,
        colorClass: 'text-red-600',
        description: 'Aspirin discontinued',
      },
    ];
  }

  exportMedications(): void {
    console.log('Export medications');
    // TODO: Implement export functionality
  }

  // Document Viewer Methods
  viewPrescription(medication: Medication) {
    // For demo purposes, we'll create a mock prescription document
    this.currentDocument = {
      title: `Prescription - ${medication.name}`,
      url: 'https://via.placeholder.com/800x600/4F46E5/FFFFFF?text=Prescription+Document',
      type: 'image',
      fileSize: '2.4 MB',
      uploadedBy: medication.prescribedBy || 'Dr. Unknown',
      uploadedAt: medication.startDate,
      description: `Prescription for ${medication.name} - ${medication.dosage} ${medication.frequency}`,
    };

    this.showDocumentViewer = true;
  }

  closeDocumentViewer() {
    this.showDocumentViewer = false;
    this.currentDocument = null;
  }

  openDietPlanModal(plan:any): void {
    this.currentViewedDietPlan = plan;
    this.showDietPlanModal = true;
  }

  closeDietPlanModal(): void {
    this.showDietPlanModal = false;
    this.currentViewedDietPlan = {} as DietPlan;
  }

  getDayMacroTotals(dayPlan: DietDayPlan): DietMacroTotals {
    return dayPlan.meals.reduce(
      (totals, meal) => {
        totals.calories += meal.macros.calories;
        totals.protein += meal.macros.protein;
        totals.carbs += meal.macros.carbs;
        totals.fat += meal.macros.fat;
        return totals;
      },
      { calories: 0, protein: 0, carbs: 0, fat: 0 }
    );
  }

  getWeeklyMacroTotals(): DietMacroTotals {
    return this.dietPlan.weeklyPlan.reduce(
      (weeklyTotals, day) => {
        const dayTotals = this.getDayMacroTotals(day);
        weeklyTotals.calories += dayTotals.calories;
        weeklyTotals.protein += dayTotals.protein;
        weeklyTotals.carbs += dayTotals.carbs;
        weeklyTotals.fat += dayTotals.fat;
        return weeklyTotals;
      },
      { calories: 0, protein: 0, carbs: 0, fat: 0 }
    );
  }

  getTotalMealsScheduled(): number {
    const plan = this.currentViewedDietPlan;
    return plan.weeklyPlan.reduce((count, day) => count + day.meals.length, 0);
  }

  viewInactivePlan(plan: any): void {
    this.currentViewedDietPlan = plan;
    this.selectedDayIndex = 0;
    this.showDietPlanModal = true;
  }

  activateDietPlan(plan: DietPlan, startDate: Date): void {
    console.log('Activating diet plan:', plan.name, 'from', startDate);
    // TODO: Implement activation logic - API call to activate plan
  }

  selectDietDay(index: number): void {
    if (index >= 0 && index < (this.currentViewedDietPlan.weeklyPlan?.length || 0)) {
      this.selectedDayIndex = index;
    }
  }

  getSelectedDayPlan(): DietDayPlan | null {
    const totalDays = this.currentViewedDietPlan.weeklyPlan?.length || 0;
    if (totalDays === 0) {
      return null;
    }

    if (this.selectedDayIndex >= totalDays) {
      this.selectedDayIndex = 0;
    }

    return this.currentViewedDietPlan.weeklyPlan[this.selectedDayIndex];
  }

  // ========================== DIET PLAN API CALLS ========================== //

  // Open AI diet instructions modal
  openAIDietInstructionsModal(): void {
    this.aiDietInstructions = '';
    this.showAIDietInstructionsModal = true;
  }

  closeAIDietInstructionsModal(): void {
    this.showAIDietInstructionsModal = false;
    this.aiDietInstructions = '';
    this.isGeneratingDietPlan = false;
  }

  // Generate AI diet plan with instructions
  submitDietPlanGeneration(): void {
    if (!this.aiDietInstructions.trim()) {
      this.toastService.show(
        'warning',
        'Missing Instructions',
        'Please provide instructions for the AI diet plan'
      );
      return;
    }

    this.isGeneratingDietPlan = true;
    const patientId = this.patientDetails?.healthId;

    this.toastService.show(
      'info',
      'AI Generation',
      'Generating AI diet plan...'
    );

    this.patientService
      .generateAIDietPlan({
        healthId: patientId!,
        query: this.aiDietInstructions,
      })
      .subscribe({
        next: (dietPlan) => {
          this.toastService.show(
            'success',
            'Success',
            'Diet plan generated successfully!'
          );
          this.closeAIDietInstructionsModal();
          this.getPatientDietPlan(); // Refresh the diet plan
        },
        error: (error) => {
          this.toastService.show(
            'error',
            'Error',
            'Failed to generate diet plan'
          );
          console.error('Error generating diet plan:', error);
          this.isGeneratingDietPlan = false;
        },
      });
  }

  getPatientDietPlan(): void {
    if (this.patientDetails?.healthId) {
      this.patientService
        .getPatientDietPlan({
          healthId: this.patientDetails?.healthId,
        })
        .subscribe({
          next: (dietPlan) => {
            this.inactiveDietPlans = [];
            this.dietPlan = {} as any;

            // Optimise these for loops by using a single loop
            dietPlan.forEach((plan: any) => {
              if (plan.status === 1) {
                this.dietPlan = this.processDietPlan(plan);
              } else {
                this.inactiveDietPlans.push(this.processDietPlan(plan));
              }
            });
            console.log('processedPlans', this.inactiveDietPlans);
            // this.toastService.show(
            //   'success',
            //   'Success',
            //   'Diet plan fetched successfully!'
            // );
          },
        });
    }
  }

  processDietPlan(plan: any): any {
    let processedPlan = {};
    if (plan?.status) {
      const dayTake = {
        day: '',
        focus: '',
        meals: [
          {
            name: 'Breakfast',
            time: '7:30 AM',
            foods: [],
            macros: { calories: 0, protein: 0, carbs: 0, fat: 0 },
          },
          {
            name: 'Lunch',
            time: '12:45 PM',
            foods: [],
            macros: { calories: 0, protein: 0, carbs: 0, fat: 0 },
          },
          {
            name: 'Snack',
            time: '3:30 PM',
            foods: [],
            macros: { calories: 0, protein: 0, carbs: 0, fat: 0 },
          },
          {
            name: 'Dinner',
            time: '7:15 PM',
            foods: [],
            macros: { calories: 0, protein: 0, carbs: 0, fat: 0 },
          },
        ],
      };

      let weekPlan: any = {
        monday: this.cloneDayTake(dayTake),
        tuesday: this.cloneDayTake(dayTake),
        wednesday: this.cloneDayTake(dayTake),
        thursday: this.cloneDayTake(dayTake),
        friday: this.cloneDayTake(dayTake),
        saturday: this.cloneDayTake(dayTake),
        sunday: this.cloneDayTake(dayTake),
      };

      plan.plans?.forEach((singleMeal: any) => {
        const day = singleMeal.day as string;
        let index = 0;

        if (singleMeal?.type === 'breakfast') {
          index = 0;
        } else if (singleMeal?.type === 'lunch') {
          index = 1;
        } else if (singleMeal?.type === 'snack') {
          index = 2;
        } else if (singleMeal?.type === 'dinner') {
          index = 3;
        }

        console.log(`day: ${day}, index: ${index}`);
        weekPlan[day].day = day;
        weekPlan[day].meals[index].foods = singleMeal?.foodItems;
        weekPlan[day].meals[index].macros = {
          calories: 0,
          protein: 0,
          carbs: 0,
          fat: 0,
        };
      });

      processedPlan = {
        name: plan.name,
        description: plan.description,
        startDate: plan.startDate,
        notes: plan.notes,
        weeklyPlan: Object.values(weekPlan),
        dailyTargets: {
          calories: 1850,
          protein: 95,
          carbs: 150,
          fat: 58,
        },
      };
    }
    return processedPlan;
  }

  cloneDayTake(dayTake: any): any {
    return JSON.parse(JSON.stringify(dayTake));
  }
}

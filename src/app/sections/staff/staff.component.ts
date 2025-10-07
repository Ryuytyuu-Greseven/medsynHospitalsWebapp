import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataService, Staff, Patient } from '../../core/services/data.service';
import { CardComponent } from '../../shared/components/card/card.component';

@Component({
  selector: 'app-staff',
  standalone: true,
  imports: [CommonModule, CardComponent],
  templateUrl: './staff.component.html',
  styles: []
})
export class StaffComponent implements OnInit {
  staff: Staff[] = [];
  patients: Patient[] = [];
  activeFilter = 'all';

  staffFilters = [
    { key: 'all', label: 'All Staff' },
    { key: 'doctor', label: 'Doctors' },
    { key: 'nurse', label: 'Nurses' },
    { key: 'admin', label: 'Admin Staff' }
  ];

  constructor(private dataService: DataService) {}

  ngOnInit(): void {
    this.loadStaff();
    this.loadPatients();
  }

  private loadStaff(): void {
    this.dataService.getStaff().subscribe(staff => {
      this.staff = staff;
    });
  }

  private loadPatients(): void {
    this.dataService.getPatients().subscribe(patients => {
      this.patients = patients;
    });
  }

  get filteredStaff(): Staff[] {
    if (this.activeFilter === 'all') {
      return this.staff;
    }
    return this.staff.filter(s => s.role === this.activeFilter);
  }

  setActiveFilter(filter: string): void {
    this.activeFilter = filter;
  }

  getStaffCount(role: string): number {
    if (role === 'all') {
      return this.staff.length;
    }
    return this.staff.filter(s => s.role === role).length;
  }

  getRoleBadgeClasses(role: string): string {
    const baseClasses = 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium';
    const roleClasses = {
      doctor: 'bg-blue-100 text-blue-800',
      nurse: 'bg-green-100 text-green-800',
      admin: 'bg-purple-100 text-purple-800'
    };

    return `${baseClasses} ${roleClasses[role as keyof typeof roleClasses]}`;
  }

  getPatientName(patientId: number): string {
    const patient = this.patients.find(p => p.id === patientId);
    return patient ? patient.name : `Patient #${patientId}`;
  }
}

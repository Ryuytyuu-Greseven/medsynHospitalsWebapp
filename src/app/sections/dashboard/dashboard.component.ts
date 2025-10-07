import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DataService, Patient } from '../../core/services/data.service';
import { CardComponent } from '../../shared/components/card/card.component';
import { TableComponent } from '../../shared/components/table/table.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, CardComponent, TableComponent],
  templateUrl: './dashboard.component.html',
  styles: []
})
export class DashboardComponent implements OnInit {
  stats = {
    totalPatients: 0,
    totalStaff: 0,
    activeAdmissions: 0,
    recentAdmissions: [] as Patient[]
  };

  aiInsights = {
    patientInsights: [] as string[],
    systemInsights: [] as string[],
    recommendations: [] as string[]
  };

  recentAdmissionsColumns = [
    { key: 'patient', label: 'Patient', sortable: false },
    { key: 'status', label: 'Status', sortable: false },
    { key: 'date', label: 'Admission Date', sortable: true },
    { key: 'actions', label: 'Actions', sortable: false }
  ];

  constructor(private dataService: DataService) {}

  ngOnInit(): void {
    this.loadDashboardData();
  }

  private loadDashboardData(): void {
    this.dataService.getDashboardStats().subscribe(stats => {
      this.stats = stats;
    });

    this.dataService.getAIInsights().subscribe(insights => {
      this.aiInsights = insights;
    });
  }
}

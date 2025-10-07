import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataService } from '../../core/services/data.service';
import { CardComponent } from '../../shared/components/card/card.component';

@Component({
  selector: 'app-insights',
  standalone: true,
  imports: [CommonModule, CardComponent],
  templateUrl: './insights.component.html',
  styles: []
})
export class InsightsComponent implements OnInit {
  aiInsights = {
    patientInsights: [] as string[],
    systemInsights: [] as string[],
    recommendations: [] as string[]
  };

  constructor(private dataService: DataService) {}

  ngOnInit(): void {
    this.loadAIInsights();
  }

  private loadAIInsights(): void {
    this.dataService.getAIInsights().subscribe(insights => {
      this.aiInsights = insights;
    });
  }
}

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoadingComponent } from './loading.component';
import { CardComponent } from '../card/card.component';

/**
 * Showcase component for demonstrating all loading variants
 * This component can be imported into your development routes for testing
 */
@Component({
  selector: 'app-loading-showcase',
  standalone: true,
  imports: [CommonModule, LoadingComponent, CardComponent],
  template: `
    <div class="max-w-7xl mx-auto p-8 space-y-12">
      <div class="text-center mb-12">
        <h1 class="text-4xl font-bold text-gray-900 mb-4">Loading Component Showcase</h1>
        <p class="text-lg text-gray-600">All variants, sizes, and colors of the loading component</p>
      </div>

      <!-- Variants Section -->
      <section>
        <h2 class="text-2xl font-bold text-gray-900 mb-6">Loading Variants</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <app-card>
            <h3 class="text-lg font-semibold mb-4 text-center">Spinner</h3>
            <app-loading variant="spinner" text="Loading data..."></app-loading>
          </app-card>

          <app-card>
            <h3 class="text-lg font-semibold mb-4 text-center">Dots</h3>
            <app-loading variant="dots" text="Processing..."></app-loading>
          </app-card>

          <app-card>
            <h3 class="text-lg font-semibold mb-4 text-center">Pulse</h3>
            <app-loading variant="pulse" text="Analyzing..."></app-loading>
          </app-card>

          <app-card>
            <h3 class="text-lg font-semibold mb-4 text-center">Bars</h3>
            <app-loading variant="bars" text="Syncing..."></app-loading>
          </app-card>
        </div>
      </section>

      <!-- Sizes Section -->
      <section>
        <h2 class="text-2xl font-bold text-gray-900 mb-6">Sizes</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <app-card>
            <h3 class="text-lg font-semibold mb-4 text-center">Small</h3>
            <app-loading size="sm" text="Loading..."></app-loading>
          </app-card>

          <app-card>
            <h3 class="text-lg font-semibold mb-4 text-center">Medium</h3>
            <app-loading size="md" text="Loading..."></app-loading>
          </app-card>

          <app-card>
            <h3 class="text-lg font-semibold mb-4 text-center">Large</h3>
            <app-loading size="lg" text="Loading..."></app-loading>
          </app-card>

          <app-card>
            <h3 class="text-lg font-semibold mb-4 text-center">Extra Large</h3>
            <app-loading size="xl" text="Loading..."></app-loading>
          </app-card>
        </div>
      </section>

      <!-- Colors Section -->
      <section>
        <h2 class="text-2xl font-bold text-gray-900 mb-6">Color Themes</h2>
        <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          <app-card>
            <app-loading color="purple" text="Purple"></app-loading>
          </app-card>

          <app-card>
            <app-loading color="blue" text="Blue"></app-loading>
          </app-card>

          <app-card>
            <app-loading color="green" text="Green"></app-loading>
          </app-card>

          <app-card>
            <app-loading color="indigo" text="Indigo"></app-loading>
          </app-card>

          <app-card>
            <app-loading color="teal" text="Teal"></app-loading>
          </app-card>

          <app-card>
            <app-loading color="orange" text="Orange"></app-loading>
          </app-card>
        </div>
      </section>

      <!-- Combinations Section -->
      <section>
        <h2 class="text-2xl font-bold text-gray-900 mb-6">Popular Combinations</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <app-card>
            <h3 class="text-sm font-semibold mb-2 text-gray-600 text-center">AI Processing</h3>
            <app-loading variant="pulse" size="lg" color="purple" text="AI is analyzing..."></app-loading>
          </app-card>

          <app-card>
            <h3 class="text-sm font-semibold mb-2 text-gray-600 text-center">Data Loading</h3>
            <app-loading variant="spinner" size="md" color="blue" text="Loading records..."></app-loading>
          </app-card>

          <app-card>
            <h3 class="text-sm font-semibold mb-2 text-gray-600 text-center">File Upload</h3>
            <app-loading variant="bars" size="lg" color="green" text="Uploading... 75%"></app-loading>
          </app-card>

          <app-card>
            <h3 class="text-sm font-semibold mb-2 text-gray-600 text-center">Processing</h3>
            <app-loading variant="dots" size="md" color="indigo" text="Processing request..."></app-loading>
          </app-card>

          <app-card>
            <h3 class="text-sm font-semibold mb-2 text-gray-600 text-center">Analytics</h3>
            <app-loading variant="pulse" size="md" color="teal" text="Generating insights..."></app-loading>
          </app-card>

          <app-card>
            <h3 class="text-sm font-semibold mb-2 text-gray-600 text-center">Warning State</h3>
            <app-loading variant="spinner" size="md" color="orange" text="Retrying connection..."></app-loading>
          </app-card>
        </div>
      </section>

      <!-- Overlay Demo -->
      <section>
        <h2 class="text-2xl font-bold text-gray-900 mb-6">Overlay Mode</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="relative">
            <app-card>
              <h3 class="text-lg font-semibold mb-4">Card with Overlay</h3>
              <p class="text-gray-600 mb-4">This card has an overlay loading state. The content below is still visible but interaction is blocked.</p>
              <p class="text-gray-600">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
              
              <app-loading 
                overlay="true"
                text="Loading data..."
                variant="spinner"
                size="md"
                color="blue">
              </app-loading>
            </app-card>
          </div>

          <div class="relative">
            <app-card>
              <h3 class="text-lg font-semibold mb-4">Processing Overlay</h3>
              <p class="text-gray-600 mb-4">Different variant showing processing state with dots animation.</p>
              <p class="text-gray-600">Content is dimmed and user can't interact with it.</p>
              
              <app-loading 
                overlay="true"
                text="Processing..."
                variant="dots"
                size="lg"
                color="purple">
              </app-loading>
            </app-card>
          </div>
        </div>
      </section>

      <!-- Full Screen Demo -->
      <section>
        <h2 class="text-2xl font-bold text-gray-900 mb-6">Full Screen Mode</h2>
        <app-card>
          <p class="text-gray-600 mb-4">Click the button below to see the full screen loading state:</p>
          <button 
            (click)="showFullScreen = true"
            class="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            Show Full Screen Loading
          </button>
        </app-card>

        <app-loading 
          *ngIf="showFullScreen"
          fullScreen="true"
          text="Loading application..."
          variant="pulse"
          size="xl"
          color="indigo">
        </app-loading>
      </section>

      <!-- Auto-dismiss demo -->
      <div *ngIf="showFullScreen" 
           class="fixed bottom-8 right-8 bg-white px-6 py-4 rounded-lg shadow-xl border-2 border-blue-500 z-50">
        <p class="text-sm text-gray-600 mb-2">Full screen loading active</p>
        <button 
          (click)="showFullScreen = false"
          class="px-4 py-2 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition-colors">
          Close
        </button>
      </div>
    </div>
  `
})
export class LoadingShowcaseComponent {
  showFullScreen = false;
}


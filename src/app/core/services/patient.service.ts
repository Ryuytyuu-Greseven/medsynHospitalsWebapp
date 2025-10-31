import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map, Observable, pipe } from 'rxjs';

import {
  NewPatient,
  PublicPatientProfile,
  PublicStaffProfile,
} from '../interfaces';
import { ApiService } from '../../apis/api.service';

@Injectable({
  providedIn: 'root',
})
export class PatientService {
  constructor(private apiService: ApiService, private http: HttpClient) {}

  /**
   * Get list of patients
   */
  getPatients(payload: {
    page: number;
    limit: number;
  }): Observable<PublicPatientProfile[]> {
    return this.apiService
      .sendPostRequest<{ success: boolean; data: PublicPatientProfile[] }>(
        this.apiService.endpoints.patient.getPatients,
        payload
      )
      .pipe(
        map((response: { success: boolean; data: PublicPatientProfile[] }) => {
          if (response.success) {
            return response.data;
          } else {
            throw new Error('Failed to get patients');
          }
        }),
        catchError(this.apiService.handleError.bind(this))
      );
  }

  /**
   * Get single patient details
   */
  getSinglePatient(payload: { patientId: string }): Observable<any> {
    return this.apiService
      .sendGetRequest<{ success: boolean; data: any }>(
        this.apiService.endpoints.patient.getPatientById.replace(
          '{patientId}',
          payload.patientId
        )
      )
      .pipe(
        map((response: { success: boolean; data: any }) => {
          if (response.success) {
            return response.data;
          } else {
            throw new Error('Failed to get patient');
          }
        }),
        catchError(this.apiService.handleError.bind(this))
      );
  }

  /**
   * Onboard new patient
   * @returns Observable<any>
   */
  onboardPatient(payload: NewPatient): Observable<any> {
    return this.apiService
      .sendPostRequest<{ success: boolean; healthId: string }>(
        this.apiService.endpoints.patient.onboardPatient,
        payload
      )
      .pipe(
        map((response: { success: boolean; healthId: string }) => {
          if (response.healthId) {
            return response.healthId;
          } else {
            throw new Error('Failed to onboard patient');
          }
        }),
        catchError(this.apiService.handleError.bind(this))
      );
  }

  /** Upload reports */
  uploadPatientReports(payload: {
    healthId: string;
    reports: File[];
  }): Observable<any> {
    const formData = new FormData();
    formData.append('healthId', payload.healthId);
    payload.reports.forEach((report) => {
      formData.append('reports', report);
    });

    return this.apiService.sendMultipartRequest<{
      success: boolean;
      data: any;
    }>(this.apiService.endpoints.patient.uploadReports, formData);
  }

  /** Get patient reports */
  getPatientReports(payload: {
    healthId: string;
    page?: number;
    limit?: number;
  }): Observable<any> {
    return this.apiService
      .sendGetRequest<{ success: boolean; data: any }>(
        this.apiService.endpoints.patient.getReports
          .replace('{healthId}', payload.healthId)
          .replace('{page}', payload.page?.toString() || '1')
          .replace('{limit}', payload.limit?.toString() || '10')
      )
      .pipe(
        map((response: { success: boolean; data: any }) => {
          if (response.success) {
            return response.data;
          } else {
            throw new Error('Failed to get patient reports');
          }
        }),
        catchError(this.apiService.handleError.bind(this))
      );
  }

  // ========================== EVENTS API CALLS ==========================
  /** Get patient events */
  getPatientEvents(payload: {
    healthId: string;
    page?: number;
    limit?: number;
  }): Observable<any> {
    return this.apiService
      .sendGetRequest<{ success: boolean; data: any }>(
        this.apiService.endpoints.patient.getEvents
          .replace('{healthId}', payload.healthId)
          .replace('{page}', payload.page?.toString() || '1')
          .replace('{limit}', payload.limit?.toString() || '10')
      )
      .pipe(
        map((response: { success: boolean; data: any }) => {
          if (response.success) {
            return response.data;
          } else {
            throw new Error('Failed to get patient events');
          }
        }),
        catchError(this.apiService.handleError.bind(this))
      );
  }

  /** Add patient event */
  addPatientEvent(payload: any): Observable<any> {
    return this.apiService.sendPostRequest<{ success: boolean; data: any }>(
      this.apiService.endpoints.patient.addEvent,
      payload
    );
  }

  /** Update patient event */
  updatePatientEvent(payload: any): Observable<any> {
    return this.apiService.sendPostRequest<{ success: boolean; data: any }>(
      this.apiService.endpoints.patient.updateEvent.replace(
        '{healthId}',
        payload.healthId
      ),
      payload
    );
  }

  // ========================== MEDICATIONS API CALLS ========================== //
  /** Get patient medications */
  getPatientMedications(payload: {
    healthId: string;
    page?: number;
    limit?: number;
  }): Observable<any> {
    return this.apiService
      .sendGetRequest<{ success: boolean; data: any }>(
        this.apiService.endpoints.patient.getMedications
          .replace('{healthId}', payload.healthId)
          .replace('{page}', payload.page?.toString() || '1')
          .replace('{limit}', payload.limit?.toString() || '10')
      )
      .pipe(
        map((response: { success: boolean; data: any }) => {
          if (response.success) {
            return response.data;
          } else {
            throw new Error('Failed to get patient medications');
          }
        }),
        catchError(this.apiService.handleError.bind(this))
      );
  }

  /** Add patient medication */
  addPatientMedication(payload: {
    healthId: string;
    medications: File[];
  }): Observable<any> {
    const formData = new FormData();
    formData.append('healthId', payload.healthId);
    payload.medications.forEach((medication) => {
      formData.append('medications', medication);
    });

    return this.apiService.sendMultipartRequest<{
      success: boolean;
      data: any;
    }>(this.apiService.endpoints.patient.uploadMedications, formData);
  }

  /** Update patient medication */
  updatePatientMedication(payload: any): Observable<any> {
    return this.apiService.sendPostRequest<{ success: boolean; data: any }>(
      this.apiService.endpoints.patient.updateMedication.replace(
        '{healthId}',
        payload.healthId
      ),
      payload
    );
  }
}

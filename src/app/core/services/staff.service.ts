import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map, Observable } from 'rxjs';

import { PublicStaffProfile } from '../interfaces';
import { ApiService } from '../../apis/api.service';

@Injectable({
  providedIn: 'root',
})
export class StaffService {
  constructor(private apiService: ApiService, private http: HttpClient) {}

  /**
   * Get list of staff
   */
  getStaff(payload: {
    page: number;
    limit: number;
  }): Observable<PublicStaffProfile[]> {
    return this.apiService
      .sendPostRequest<{ success: boolean; data: PublicStaffProfile[] }>(
        this.apiService.endpoints.staff.getStaff,
        payload
      )
      .pipe(
        map((response: { success: boolean; data: PublicStaffProfile[] }) => {
          if (response.success) {
            return response.data;
          } else {
            throw new Error('Failed to get staff');
          }
        }),
        catchError(this.apiService.handleError.bind(this))
      );
  }

  /**
   * Get single staff details
   */
  getSingleStaff(payload: { userId: string }): Observable<any> {
    return this.apiService
      .sendGetRequest<{ success: boolean; data: any }>(
        this.apiService.endpoints.staff.getStaffById.replace(
          '{userId}',
          payload.userId
        )
      )
      .pipe(
        map((response: { success: boolean; data: any }) => {
          if (response.success) {
            return response.data;
          } else {
            throw new Error('Failed to get staff');
          }
        }),
        catchError(this.apiService.handleError.bind(this))
      );
  }
}

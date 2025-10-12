import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ApiConfigService {
  private readonly baseUrl: string;
  private readonly botBaseUrl: string;
  private readonly apiLoginUrl: string;

  private readonly SESSION_STORAGE_KEYS = environment.auth;

  constructor() {
    this.baseUrl = environment.apiUrl;
    this.botBaseUrl = environment.botApiUrl;
    this.apiLoginUrl = environment.apiLoginUrl;
  }

  /**
   * Get the full API URL for an endpoint
   * @param endpoint - The API endpoint path
   * @returns Full URL for the endpoint
   */
  getApiUrl(endpoint: string): string {
    return `${this.baseUrl}/${endpoint}`;
  }

  getApiLoginUrl(endpoint: string): string {
    return `${this.apiLoginUrl}/${endpoint}`;
  }

  /**
   * Get the full Bot API URL for an endpoint
   * @param endpoint - The Bot API endpoint path
   * @returns Full URL for the Bot API endpoint
   */
  getBotApiUrl(endpoint: string): string {
    return `${this.botBaseUrl}/${endpoint}`;
  }

  getSessionStorageKeys(): {
    tokenKey: string;
    refreshTokenKey: string;
    userProfileKey: string;
  } {
    return this.SESSION_STORAGE_KEYS;
  }

  /**
   * Get the base API URL
   * @returns Base API URL
   */
  getBaseUrl(): string {
    return this.baseUrl;
  }

  getApiLoginBaseUrl(): string {
    return this.apiLoginUrl;
  }

  /**
   * Get the base Bot API URL
   * @returns Base Bot API URL
   */
  getBotBaseUrl(): string {
    return this.botBaseUrl;
  }

  /**
   * Get API timeout configuration
   * @returns API timeout in milliseconds
   */
  getApiTimeout(): number {
    return environment.api.timeout;
  }

  /**
   * Get retry configuration
   * @returns Object with retry attempts and delay
   */
  getRetryConfig(): { attempts: number; delay: number } {
    return {
      attempts: environment.api.retryAttempts,
      delay: environment.api.retryDelay,
    };
  }

  /**
   * Check if debug mode is enabled
   * @returns True if debug mode is enabled
   */
  isDebugMode(): boolean {
    return environment.debug;
  }

  /**
   * Get current log level
   * @returns Current log level
   */
  getLogLevel(): string {
    return environment.logLevel;
  }

  /**
   * Get feature flags
   * @returns Feature flags object
   */
  getFeatures(): any {
    return environment.features;
  }

  /**
   * Get upload configuration
   * @returns Upload configuration object
   */
  getUploadConfig(): any {
    return environment.upload;
  }

  /**
   * Get authentication configuration
   * @returns Authentication configuration object
   */
  getAuthConfig(): any {
    return environment.auth;
  }

  // *IMPORTANT*
  // TODO: Update the subdomain logic
  getClient(): string | null {
    if (!environment.client) {
      // get the subdomain from the url
      const url = window.location.href;
      const subdomain = url.split('.')[0];
      return subdomain;
    } else if (environment.client?.name) {
      return environment.client.hospitalId;
    }
    return null;
  }
}

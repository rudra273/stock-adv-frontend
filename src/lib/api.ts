// src/lib/api.ts
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://0.0.0.0:8000';


class ApiClient {
 private baseURL: string;


 constructor(baseURL: string = API_BASE_URL) {
   this.baseURL = baseURL;
 }


 private async request<T>(
   endpoint: string,
   options: RequestInit = {}
 ): Promise<T> {
   const url = `${this.baseURL}${endpoint}`;
  
   const config: RequestInit = {
     headers: {
       'Content-Type': 'application/json',
       'Accept': 'application/json',
       ...options.headers,
     },
     ...options,
   };


   try {
     const response = await fetch(url, config);
    
     if (!response.ok) {
       throw new Error(`API Error: ${response.status} ${response.statusText}`);
     }


     const data = await response.json();
     return data;
   } catch (error) {
     console.error('API request failed:', error);
     throw error;
   }
 }


 async get<T>(endpoint: string, options?: RequestInit): Promise<T> {
   return this.request<T>(endpoint, { method: 'GET', ...options });
 }


 async post<T>(endpoint: string, data?: any, options?: RequestInit): Promise<T> {
   return this.request<T>(endpoint, {
     method: 'POST',
     body: data ? JSON.stringify(data) : undefined,
     ...options,
   });
 }


 async put<T>(endpoint: string, data?: any, options?: RequestInit): Promise<T> {
   return this.request<T>(endpoint, {
     method: 'PUT',
     body: data ? JSON.stringify(data) : undefined,
     ...options,
   });
 }


 async delete<T>(endpoint: string, options?: RequestInit): Promise<T> {
   return this.request<T>(endpoint, { method: 'DELETE', ...options });
 }
}


export const apiClient = new ApiClient();
export default apiClient;
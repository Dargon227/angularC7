import { Injectable } from '@angular/core';
import { Hospital } from '../models/hospital';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class HospitalService {
  apiUrl: string = 'http://localhost:3000'

  constructor(private http: HttpClient) { }

  getHospitales() {
    return this.http.get<Hospital[]>(`${this.apiUrl}/hospitales`);
  }

  getHospital(id: number) {
    return this.http.get<Hospital>(`${this.apiUrl}/hospitales/${id}`);
  }

  updateHospital(id: number, hospital: Hospital): Observable<Hospital> {
    return this.http.put<Hospital>(`${this.apiUrl}/hospitales/${id}`, hospital);
  }

  deleteHospital(id: number) {
    return this.http.delete<Hospital>(`${this.apiUrl}/hospitales/${id}`);
  }

  createHospital(hospital: Hospital): Observable<Hospital> {
    return this.http.post<Hospital>(`${this.apiUrl}/hospitales`, hospital);
  }
}
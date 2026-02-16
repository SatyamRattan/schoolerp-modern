import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Vehicle {
    id?: number;
    registration_number: string;
    driver_name: string;
    contact_number: string;
    capacity: number;
    is_active: boolean;
}

export interface Stop {
    id?: number;
    route?: number;
    name: string;
    pickup_time: string;
    drop_time?: string;
    fare: string;
    order: number;
}

export interface Route {
    id?: number;
    name: string;
    vehicle: number | null;
    vehicle_details?: Vehicle;
    start_point: string;
    end_point: string;
    description: string;
    stops?: Stop[];
}

export interface TransportAllocation {
    id?: number;
    student: number;
    student_details?: any;
    stop: number;
    stop_details?: Stop;
    start_date: string;
    end_date?: string;
    is_active: boolean;
}

@Injectable({
    providedIn: 'root'
})
export class TransportService {
    private apiUrl = 'http://localhost:8000/api/transport';

    constructor(private http: HttpClient) { }

    // Vehicles
    getVehicles(): Observable<Vehicle[]> {
        return this.http.get<Vehicle[]>(`${this.apiUrl}/vehicles/`);
    }

    createVehicle(data: Vehicle): Observable<Vehicle> {
        return this.http.post<Vehicle>(`${this.apiUrl}/vehicles/`, data);
    }

    updateVehicle(id: number, data: Vehicle): Observable<Vehicle> {
        return this.http.patch<Vehicle>(`${this.apiUrl}/vehicles/${id}/`, data);
    }

    deleteVehicle(id: number): Observable<any> {
        return this.http.delete(`${this.apiUrl}/vehicles/${id}/`);
    }

    // Routes
    getRoutes(): Observable<Route[]> {
        return this.http.get<Route[]>(`${this.apiUrl}/routes/`);
    }

    createRoute(data: Route): Observable<Route> {
        return this.http.post<Route>(`${this.apiUrl}/routes/`, data);
    }

    updateRoute(id: number, data: Route): Observable<Route> {
        return this.http.patch<Route>(`${this.apiUrl}/routes/${id}/`, data);
    }

    // Stops
    createStop(data: Stop): Observable<Stop> {
        return this.http.post<Stop>(`${this.apiUrl}/stops/`, data);
    }

    deleteStop(id: number): Observable<any> {
        return this.http.delete(`${this.apiUrl}/stops/${id}/`);
    }

    // Allocations
    getAllocations(studentId?: number): Observable<TransportAllocation[]> {
        let url = `${this.apiUrl}/allocations/`;
        if (studentId) url += `?student=${studentId}`;
        return this.http.get<TransportAllocation[]>(url);
    }

    createAllocation(data: TransportAllocation): Observable<TransportAllocation> {
        return this.http.post<TransportAllocation>(`${this.apiUrl}/allocations/`, data);
    }
}

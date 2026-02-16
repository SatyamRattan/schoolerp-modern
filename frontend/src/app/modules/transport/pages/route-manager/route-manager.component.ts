import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TransportService, Route, Stop, Vehicle } from '../../services/transport.service';
import { LucideAngularModule, Plus, Edit, Trash2, MapPin, Bus } from 'lucide-angular';

@Component({
    selector: 'app-route-manager',
    standalone: true,
    imports: [CommonModule, FormsModule, LucideAngularModule],
    templateUrl: './route-manager.html'
})
export class RouteManagerComponent implements OnInit {
    routes: Route[] = [];
    vehicles: Vehicle[] = [];

    showRouteModal = false;
    editingRoute: Route = this.getEmptyRoute();

    // For expanding stops
    expandedRouteId: number | null = null;
    newStop: Stop = this.getEmptyStop();

    readonly Plus = Plus;
    readonly Edit = Edit;
    readonly Trash2 = Trash2;
    readonly MapPin = MapPin;
    readonly Bus = Bus;

    constructor(private transportService: TransportService) { }

    ngOnInit() {
        this.loadRoutes();
        this.transportService.getVehicles().subscribe(v => this.vehicles = v);
    }

    getEmptyRoute(): Route {
        return {
            name: '',
            vehicle: null,
            start_point: '',
            end_point: '',
            description: ''
        };
    }

    getEmptyStop(): Stop {
        return {
            name: '',
            pickup_time: '',
            fare: '0.00',
            order: 0
        };
    }

    loadRoutes() {
        this.transportService.getRoutes().subscribe(data => this.routes = data);
    }

    openRouteModal(route?: Route) {
        if (route) {
            this.editingRoute = { ...route, vehicle: route.vehicle_details?.id || route.vehicle };
        } else {
            this.editingRoute = this.getEmptyRoute();
        }
        this.showRouteModal = true;
    }

    saveRoute() {
        if (this.editingRoute.id) {
            this.transportService.updateRoute(this.editingRoute.id, this.editingRoute).subscribe(() => {
                this.loadRoutes();
                this.showRouteModal = false;
            });
        } else {
            this.transportService.createRoute(this.editingRoute).subscribe(() => {
                this.loadRoutes();
                this.showRouteModal = false;
            });
        }
    }

    toggleStops(routeId: number) {
        if (this.expandedRouteId === routeId) {
            this.expandedRouteId = null;
        } else {
            this.expandedRouteId = routeId;
            this.newStop = this.getEmptyStop();
        }
    }

    addStop(routeId: number) {
        this.newStop.route = routeId;
        this.transportService.createStop(this.newStop).subscribe(() => {
            this.loadRoutes(); // Reload to see new stop
            this.newStop = this.getEmptyStop();
        });
    }

    deleteStop(stopId: number) {
        if (confirm('Delete stop?')) {
            this.transportService.deleteStop(stopId).subscribe(() => this.loadRoutes());
        }
    }
}

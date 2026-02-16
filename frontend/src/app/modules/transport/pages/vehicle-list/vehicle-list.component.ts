import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TransportService, Vehicle } from '../../services/transport.service';
import { LucideAngularModule, Plus, Edit, Trash2 } from 'lucide-angular';

@Component({
    selector: 'app-vehicle-list',
    standalone: true,
    imports: [CommonModule, FormsModule, LucideAngularModule],
    templateUrl: './vehicle-list.html'
})
export class VehicleListComponent implements OnInit {
    vehicles: Vehicle[] = [];
    showModal = false;
    isEditing = false;
    currentVehicle: Vehicle = this.getEmptyVehicle();

    readonly Plus = Plus;
    readonly Edit = Edit;
    readonly Trash2 = Trash2;

    constructor(private transportService: TransportService) { }

    ngOnInit() {
        this.loadVehicles();
    }

    getEmptyVehicle(): Vehicle {
        return {
            registration_number: '',
            driver_name: '',
            contact_number: '',
            capacity: 30,
            is_active: true
        };
    }

    loadVehicles() {
        this.transportService.getVehicles().subscribe(data => this.vehicles = data);
    }

    openAddModal() {
        this.isEditing = false;
        this.currentVehicle = this.getEmptyVehicle();
        this.showModal = true;
    }

    openEditModal(vehicle: Vehicle) {
        this.isEditing = true;
        this.currentVehicle = { ...vehicle };
        this.showModal = true;
    }

    closeModal() {
        this.showModal = false;
    }

    saveVehicle() {
        if (this.isEditing && this.currentVehicle.id) {
            this.transportService.updateVehicle(this.currentVehicle.id, this.currentVehicle).subscribe(() => {
                this.loadVehicles();
                this.closeModal();
            });
        } else {
            this.transportService.createVehicle(this.currentVehicle).subscribe(() => {
                this.loadVehicles();
                this.closeModal();
            });
        }
    }

    deleteVehicle(id: number) {
        if (confirm('Are you sure you want to delete this vehicle?')) {
            this.transportService.deleteVehicle(id).subscribe(() => this.loadVehicles());
        }
    }
}

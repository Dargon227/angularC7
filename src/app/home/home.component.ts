import { Component, OnInit, ViewChild } from '@angular/core';
import { HospitalService } from '../services/hospital.service';
import { HttpClient } from '@angular/common/http';
import { Hospital } from '../models/hospital';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { HttpClientModule } from '@angular/common/http';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    HttpClientModule,
    MatTableModule,
    MatButtonModule,
    RouterModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  providers: [HttpClient, HospitalService],
})
export class HomeComponent implements OnInit {
  displayedColumns: string[] = ['id', 'nombre', 'direccion', 'acciones'];
  dataSource = new MatTableDataSource<Hospital>();

  hospitalForm: FormGroup;
  editMode = false;
  selectedHospitalId: number | null = null;

  constructor(private http: HttpClient, private service: HospitalService, private fb: FormBuilder) {
    this.hospitalForm = this.fb.group({
      nombre: ['', Validators.required],
      direccion: ['', Validators.required]
    });
  }

  eliminarHospital(hospitalId: number): void {
    this.service.deleteHospital(hospitalId).subscribe({
      next: () => {
        this.dataSource.data = this.dataSource.data.filter(h => h.id !== hospitalId);
        console.log('Hospital eliminado exitosamente');
      },
      error: (error) => {
        console.error('Error al eliminar hospital:', error);
      }
    });
  }

  ngOnInit(): void {
    this.service.getHospitales().subscribe({
      next: (data) => {
        this.dataSource.data = data;
        console.log(this.dataSource.data);
      },
      error: (error) => {
        console.error(error);
      }
    });
  }

  guardarHospital(): void {
    const newHospital: Hospital = {
      id: 0, // El ID será asignado por el backend
      nombre: this.hospitalForm.value.nombre,
      direccion: this.hospitalForm.value.direccion
    };

    this.service.createHospital(newHospital).subscribe({
      next: (data) => {
        console.log('Hospital creado exitosamente:', data);
        this.dataSource.data = [...this.dataSource.data, data];
        this.hospitalForm.reset();
      },
      error: (error) => {
        console.error('Error al crear hospital:', error);
      }
    });
  }

  cargarHospital(hospital: Hospital): void {
    this.selectedHospitalId = hospital.id;
    this.editMode = true;
    this.hospitalForm.setValue({
      nombre: hospital.nombre,
      direccion: hospital.direccion
    });
  }

  actualizarHospital(): void {
    if (this.selectedHospitalId !== null) {
      const updatedHospital: Hospital = {
        id: this.selectedHospitalId,
        nombre: this.hospitalForm.value.nombre,
        direccion: this.hospitalForm.value.direccion
      };

      this.service.updateHospital(this.selectedHospitalId, updatedHospital).subscribe({
        next: (data) => {
          console.log('Hospital actualizado exitosamente:', data);
          const index = this.dataSource.data.findIndex(h => h.id === this.selectedHospitalId);
          if (index !== -1) {
            this.dataSource.data[index] = data;
            this.dataSource._updateChangeSubscription(); // Necesario para que la tabla se actualice
          }
          this.hospitalForm.reset();
          this.editMode = false;
          this.selectedHospitalId = null;
        },
        error: (error) => {
          console.error('Error al actualizar hospital:', error);
        }
      });
    }
  }

  onSubmit(): void {
    if (this.editMode) {
      this.actualizarHospital();
    } else {
      this.guardarHospital();
    }
  }
}

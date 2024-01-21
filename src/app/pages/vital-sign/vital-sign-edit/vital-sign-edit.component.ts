import { AsyncPipe, NgFor, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Observable, map, switchMap } from 'rxjs';
import { MaterialModule } from 'src/app/material/material.module';
import { Patient } from 'src/app/model/patient';
import { VitalSign } from 'src/app/model/vitalSign';
import { PatientService } from 'src/app/service/patient.service';
import { VitalSignService } from 'src/app/service/vital-sign.service';

@Component({
  selector: 'app-vital-sign-edit',
  standalone: true,
  templateUrl: './vital-sign-edit.component.html',
  styleUrls: ['./vital-sign-edit.component.css'],
  imports: [MaterialModule, ReactiveFormsModule, RouterLink, NgFor, NgIf, AsyncPipe, FormsModule],
})
export class VitalSignEditComponent {
  form: FormGroup;
  id: number;
  isEdit: boolean;
  patients$: Observable<Patient[]>;
  selectedPatient: any;

  constructor(
    public route: ActivatedRoute,
    private router: Router,
    private vitalSignService: VitalSignService,
    private patientService: PatientService
  ) {}

  ngOnInit(): void {
    this.form = new FormGroup({
      idVitalSign: new FormControl(0),
      patientForm: new FormControl([Validators.required]),
      dateReg: new FormControl('', [Validators.required, Validators.minLength(6)]),
      temperature: new FormControl('', [Validators.required, Validators.minLength(2), Validators.maxLength(3)]),
      pulse: new FormControl('', [Validators.required, Validators.minLength(2)]),
      respiratoryRate: new FormControl('', [Validators.required, Validators.minLength(3)]),
    });

    this.loadInitialData();

    this.route.params.subscribe((data) => {
      this.id = data['id'];
      this.isEdit = data['id'] != null;
      this.initForm();
    });
  }

  initForm() {
    if (this.isEdit) {
      this.vitalSignService.findById(this.id).subscribe((data) => {
        this.form = new FormGroup({
          idVitalSign: new FormControl(data.idVitalSign),
          patientForm: new FormControl(data.patient),
          dateReg: new FormControl(data.dateReg, [Validators.required, Validators.minLength(6)]),
          temperature: new FormControl(data.temperature, [Validators.required, Validators.maxLength(3)]),
          pulse: new FormControl(data.pulse, [Validators.required, Validators.minLength(2)]),
          respiratoryRate: new FormControl(data.respiratoryRate, [Validators.required, Validators.email]),
        });
      });
    }
  }

  loadInitialData(){
    this.patients$ = this.patientService.findAll();
  }

  compareFunction(o1: any, o2: any) {
    return (o1.idPatient == o2.idPatient);
   }

  operate() {
    const vitalSign: VitalSign = new VitalSign();
    vitalSign.idVitalSign = this.form.value['idVitalSign'];
    vitalSign.patient = this.form.value['patientForm'];
    vitalSign.dateReg = this.form.value['dateReg'];
    vitalSign.temperature = this.form.value['temperature'];
    vitalSign.pulse = this.form.value['pulse'];
    vitalSign.respiratoryRate = this.form.value['respiratoryRate'];

    if (this.isEdit) {
      console.log("update");
      this.vitalSignService.update(this.id, vitalSign).subscribe(() => {
        this.vitalSignService.findAll().subscribe((data) => {
          this.vitalSignService.setVitalSignChange(data);
          this.vitalSignService.setMessageChange('UPDATED!');
        });
      });
    } else {
      console.log("INSERT");
      this.vitalSignService
        .save(vitalSign)
        .pipe(switchMap(() => this.vitalSignService.findAll()))
        .subscribe((data) => {
          this.vitalSignService.setVitalSignChange(data);
          this.vitalSignService.setMessageChange('CREATED!');
        });
    }

    this.router.navigate(['/pages/vital-sign']);
  }

  get f(){
    return this.form.controls;
  }
}

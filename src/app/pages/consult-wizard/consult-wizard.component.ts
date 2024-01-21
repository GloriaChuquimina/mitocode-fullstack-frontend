import { NgFor, NgIf } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatStepper } from '@angular/material/stepper';
import * as moment from 'moment';
import { FlexLayoutModule } from 'ngx-flexible-layout';
import { MaterialModule } from 'src/app/material/material.module';
import { Consult } from 'src/app/model/consult';
import { ConsultDetail } from 'src/app/model/consultDetail';
import { ConsultListExamDTOI } from 'src/app/model/consultListExamDTOI';
import { Exam } from 'src/app/model/exam';
import { Medic } from 'src/app/model/medic';
import { Patient } from 'src/app/model/patient';
import { Specialty } from 'src/app/model/specialty';
import { ConsultService } from 'src/app/service/consult.service';
import { ExamService } from 'src/app/service/exam.service';
import { MedicService } from 'src/app/service/medic.service';
import { PatientService } from 'src/app/service/patient.service';
import { SpecialtyService } from 'src/app/service/specialty.service';

@Component({
  selector: 'app-consult-wizard',
  standalone: true,
  templateUrl: './consult-wizard.component.html',
  styleUrls: ['./consult-wizard.component.css'],
  imports: [MaterialModule, ReactiveFormsModule, NgFor, NgIf, FlexLayoutModule]
})
export class ConsultWizardComponent implements OnInit {

  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;

  medics: Medic[];
  patients: Patient[];
  specialties: Specialty[];
  exams: Exam[];
  details: ConsultDetail[] = [];
  examsSelected: Exam[] = [];

  minDate: Date = new Date();

  medicSelected: Medic;
  consultsArray: number[] = [];
  consultSelected: number;

  @ViewChild('stepper') stepper: MatStepper;

  constructor(
    private patientService: PatientService,
    private specialtyService: SpecialtyService,
    private examService: ExamService,
    private medicService: MedicService,
    private consultService: ConsultService,
    private _snackBar: MatSnackBar,
    private formBuilder: FormBuilder
  ){}

  ngOnInit(): void {
    this.firstFormGroup = this.formBuilder.group({
      patient: [new FormControl(), Validators.required],
      specialty: [new FormControl(), Validators.required],
      consultDate: [new FormControl(new Date()), Validators.required],
      exam: [new FormControl(), Validators.required],
      diagnosis: new FormControl('', [Validators.required]),
      treatment: new FormControl('', [Validators.required]),
    });

    this.secondFormGroup = this.formBuilder.group({});

    this.loadInitialData();
  }

  loadInitialData(){
    this.patientService.findAll().subscribe(data => this.patients = data);
    this.specialtyService.findAll().subscribe(data => this.specialties = data);
    this.examService.findAll().subscribe(data => this.exams = data);
    this.medicService.findAll().subscribe(data => this.medics = data);

    for(let i = 1; i<=100; i++){
      this.consultsArray.push(i);
    }
  }

  addDetail(){
    const det = new ConsultDetail();
    det.diagnosis = this.firstFormGroup.value['diagnosis'];
    det.treatment = this.firstFormGroup.value['treatment'];

    this.details.push(det);
  }

  removeDetail(index: number){
    this.details.splice(index, 1);
  }

  addExam(){
    if(this.firstFormGroup.value['exam'] != null){
      this.examsSelected.push(this.firstFormGroup.value['exam']);
    }else{
      this._snackBar.open('Please select an exam', 'info', {duration: 2000});
    }
  }

  selectMedic(m: Medic){
    this.medicSelected = m;
  }

  selectConsult(n: number){
    this.consultSelected = n;
  }

  nextManualStep(){
    if(this.consultSelected > 0){
      //sgte paso
      this.stepper.next();
    }else{
      this._snackBar.open('Please select a consult number', 'INFO', {duration: 2000});
    }
  }

  get f(){
    return this.firstFormGroup.controls;
  }

  save(){
    const consult = new Consult();
    consult.patient = this.firstFormGroup.value['patient'];
    consult.medic = this.medicSelected
    consult.specialty = this.firstFormGroup.value['specialty'];
    consult.details = this.details;
    consult.numConsult = `C${this.consultSelected}`

    consult.consultDate = moment(this.firstFormGroup.value['consultDate']).format('YYYY-MM-DDTHH:mm:ss');

    const dto: ConsultListExamDTOI = {
      consult: consult,
      lstExam: this.examsSelected
    };

    this.consultService.saveTransactional(dto).subscribe( () => {
      this._snackBar.open('CREATED!', 'INFO', {duration: 2000});

      setTimeout( ()=> {
        this.cleanControls();
      }, 2000);
    });
    
  }

  cleanControls(){
    this.firstFormGroup.reset();
    this.secondFormGroup.reset();
    this.stepper.reset();
    this.details = [];
    this.examsSelected = [];
    this.consultSelected = 0;
    this.medicSelected = null;
  }
}

import { NgIf } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, RouterLink, RouterOutlet } from '@angular/router';
import { switchMap } from 'rxjs';
import { MaterialModule } from 'src/app/material/material.module';
import { VitalSign } from 'src/app/model/vitalSign';
import { VitalSignService } from 'src/app/service/vital-sign.service';
@Component({
  selector: 'app-vital-sign',
  standalone: true, 
  templateUrl: './vital-sign.component.html',
  styleUrls: ['./vital-sign.component.css'],
  imports: [MaterialModule, RouterLink, RouterOutlet, NgIf]
})
export class VitalSignComponent {

  dataSource: MatTableDataSource<VitalSign>;
  displayedColumns: string[] = ['idVitalSign', 'firstName', 'dateReg', 'temperature', 'pulse', 'respiratoryRate', 'actions'];

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  totalElements: number = 0;

  constructor(
    private vitalSignService: VitalSignService,
    private _snackBar: MatSnackBar,
    public route: ActivatedRoute
    ){}
 
  ngOnInit(): void {

    this.vitalSignService.listPageable(0, 2).subscribe(data => {
      console.log("GLORIA: " + JSON.stringify(data));
      this.totalElements = data.totalElements;
      this.createTable(data.content);
    });

    this.vitalSignService.getVitalSignChange().subscribe(data => {
      this.createTable(data);
    });

    this.vitalSignService.getMessageChange().subscribe(data => {
      this._snackBar.open(data, 'INFO', {duration: 2000, horizontalPosition: 'right', verticalPosition: 'top'});
    });    
  }

  createTable(data: VitalSign[]){
    this.dataSource = new MatTableDataSource(data);
    this.dataSource.sort = this.sort;    
  }

  delete(idPatient: number){
    this.vitalSignService.delete(idPatient)
      .pipe(switchMap(()=> this.vitalSignService.findAll()))
      .subscribe(data => {
        this.vitalSignService.setVitalSignChange(data);
        this.vitalSignService.setMessageChange('DELETED!');
      });
  }

  applyFilter(e: any){
    this.dataSource.filter = e.target.value.trim();
  }

  showMore(e: any){
    this.vitalSignService.listPageable(e.pageIndex, e.pageSize).subscribe(data => {
      this.totalElements = data.totalElements;
      this.createTable(data.content);
    });    
  }
}

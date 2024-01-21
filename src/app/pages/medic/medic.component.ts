import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { MaterialModule } from 'src/app/material/material.module';
import { Medic } from 'src/app/model/medic';
import { MedicService } from 'src/app/service/medic.service';
import { MedicDialogComponent } from './medic-dialog/medic-dialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { switchMap } from 'rxjs';

@Component({
  selector: 'app-medic',
  standalone: true,
  templateUrl: './medic.component.html',
  styleUrls: ['./medic.component.css'],
  imports: [MaterialModule]
})
export class MedicComponent implements OnInit{

  displayedColumns: string[] = ['idMedic', 'primaryName', 'surname', 'cmpMedic', 'actions']
  dataSource: MatTableDataSource<Medic>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private medicService: MedicService,
    private _dialog: MatDialog,
    private _snackBar: MatSnackBar
    ){}

  ngOnInit(): void {
    this.medicService.findAll().subscribe(data => {
      this.createTable(data);
    });

    this.medicService.getMedicChange().subscribe(data => {
      this.createTable(data);
    });

    this.medicService.getMessageChange().subscribe(data => {
      this._snackBar.open(data, 'INFO', {duration: 2000});
    });
  }

  createTable(medics: Medic[]){
    this.dataSource = new MatTableDataSource(medics);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  openDialog(medic?: Medic){
    this._dialog.open(MedicDialogComponent, {
      width: '350px',
      data: medic,
      disableClose: true
    });
  }

  delete(id: number){
    this.medicService.delete(id)
      .pipe(switchMap( ()=> this.medicService.findAll()))
      .subscribe(data => {
        this.medicService.setMedicChange(data);
        this.medicService.setMessageChange('DELETED!');
      });
  }
  
}

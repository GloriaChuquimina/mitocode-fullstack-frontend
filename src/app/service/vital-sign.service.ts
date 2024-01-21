import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment.development';
import { Observable, Subject } from 'rxjs';
import { GenericService } from './generic.service';
import { VitalSign } from '../model/vitalSign';

@Injectable({
  providedIn: 'root'
})
export class VitalSignService extends GenericService<VitalSign>{

  // private url: string = `${environment.HOST}/patients`;
  private vitalSignChange: Subject<VitalSign[]> = new Subject<VitalSign[]>();
  private messageChange: Subject<string> = new Subject<string>();

  constructor(protected override http: HttpClient){
    super(http, `${environment.HOST}/vital-signs`)
  }

  listPageable(p: number, s: number){
    return this.http.get<any>(`${this.url}/pageable?page=${p}&size=${s}`);
  }
  
  setVitalSignChange(data: VitalSign[]){
    this.vitalSignChange.next(data);
  }

  getVitalSignChange(){
    return this.vitalSignChange.asObservable();
  }

  setMessageChange(data: string){
    this.messageChange.next(data);
  }

  getMessageChange(){
    return this.messageChange.asObservable();
  }
}


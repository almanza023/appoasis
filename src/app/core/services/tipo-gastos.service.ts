
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.prod';
import { TipoGasto } from '../interface/TipoGasto';

@Injectable({
  providedIn: 'root'
})
export class TipoGastosService {

  constructor(private http: HttpClient) { }

  getAll(): Observable<any> {
    const headers = { 'Authorization': 'Bearer '+localStorage.getItem('token') }
    let url=`${environment.baseURL}/tipo-gastos`;
    return this.http.get<any>(url, {headers});
  }

  getActive(): Observable<any> {
    const headers = { 'Authorization': 'Bearer '+localStorage.getItem('token') }
    let url=`${environment.baseURL}/tipo-gastos-activos`;
    return this.http.get<any>(url, {headers});
  }


  getById(id): Observable<any> {
    const headers = { 'Authorization': 'Bearer '+localStorage.getItem('token') }
    let url=`${environment.baseURL}/tipo-gastos/${id}`;
    return this.http.get<any>(url, {headers});
  }

  postData(data: TipoGasto): Observable<any> {
    const headers = { 'Authorization': 'Bearer '+localStorage.getItem('token') }
    let url=`${environment.baseURL}/tipo-gastos`;
    return this.http.post<any>(url, data, {headers});
  }

  putData(id:number, data: TipoGasto): Observable<any> {
    const headers = { 'Authorization': 'Bearer '+localStorage.getItem('token') }
    let url=`${environment.baseURL}/tipo-gastos/${id}`;
    return this.http.patch<any>(url, data, {headers});
  }

  postEstado(id:any): Observable<any> {
    const headers = { 'Authorization': 'Bearer '+localStorage.getItem('token') }
    let url=`${environment.baseURL}/tipo-gastos/cambiarEstado`;
    let data ={id};
    return this.http.post<any>(url, data, {headers});
  }




}

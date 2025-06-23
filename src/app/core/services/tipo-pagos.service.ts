
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.prod';
import { TipoPago } from '../interface/TipoPago';

@Injectable({
  providedIn: 'root'
})
export class TipoPagoService {

  constructor(private http: HttpClient) { }

  getAll(): Observable<any> {
    const headers = { 'Authorization': 'Bearer '+localStorage.getItem('token') }
    let url=`${environment.baseURL}/tipo-pagos`;
    return this.http.get<any>(url, {headers});
  }

  getActive(): Observable<any> {
    const headers = { 'Authorization': 'Bearer '+localStorage.getItem('token') }
    let url=`${environment.baseURL}/tipo-pagos-activos`;
    return this.http.get<any>(url, {headers});
  }

  getById(id): Observable<any> {
    const headers = { 'Authorization': 'Bearer '+localStorage.getItem('token') }
    let url=`${environment.baseURL}/tipo-pagos/${id}`;
    return this.http.get<any>(url, {headers});
  }

  postData(data: TipoPago): Observable<any> {
    const headers = { 'Authorization': 'Bearer '+localStorage.getItem('token') }
    let url=`${environment.baseURL}/tipo-pagos`;
    return this.http.post<any>(url, data, {headers});
  }

  putData(id:number, data: TipoPago): Observable<any> {
    const headers = { 'Authorization': 'Bearer '+localStorage.getItem('token') }
    let url=`${environment.baseURL}/tipo-pagos/${id}`;
    return this.http.patch<any>(url, data, {headers});
  }

  postEstado(id:any): Observable<any> {
    const headers = { 'Authorization': 'Bearer '+localStorage.getItem('token') }
    let url=`${environment.baseURL}/tipo-pagos/cambiarEstado`;
    let data ={id};
    return this.http.post<any>(url, data, {headers});
  }





}

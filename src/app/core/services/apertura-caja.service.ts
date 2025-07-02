import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.prod';
import { Usuario } from '../interface/Usuario';


@Injectable({
  providedIn: 'root'
})
export class AperturaCajaService {

  constructor(private http: HttpClient) { }

  getAll(): Observable<any> {
    const headers = { 'Authorization': 'Bearer '+localStorage.getItem('token') }
    let url=`${environment.baseURL}/apertura-caja`;
    return this.http.get<any>(url, {headers});
  }

  getActive(): Observable<any> {
    const headers = { 'Authorization': 'Bearer '+localStorage.getItem('token') }
    let url=`${environment.baseURL}/apertura-caja-activos`;
    return this.http.get<any>(url, {headers});
  }

  getById(id): Observable<any> {
    const headers = { 'Authorization': 'Bearer '+localStorage.getItem('token') }
    let url=`${environment.baseURL}/apertura-caja/${id}`;
    return this.http.get<any>(url, {headers});
  }

  postData(data: Usuario): Observable<any> {
    const headers = { 'Authorization': 'Bearer '+localStorage.getItem('token') }
    let url=`${environment.baseURL}/apertura-caja`;
    return this.http.post<any>(url, data, {headers});
  }

  putData(id:number, data: any): Observable<any> {
    const headers = { 'Authorization': 'Bearer '+localStorage.getItem('token') }
    let url=`${environment.baseURL}/apertura-caja/${id}`;
    return this.http.patch<any>(url, data, {headers});
  }

  postEstado(id:any): Observable<any> {
    const headers = { 'Authorization': 'Bearer '+localStorage.getItem('token') }
    let url=`${environment.baseURL}/apertura-caja/cambiarEstado`;
    let data ={id};
    return this.http.post<any>(url, data, {headers});
  }

  postDia(data:any): Observable<any> {
    const headers = { 'Authorization': 'Bearer '+localStorage.getItem('token') }
    let url=`${environment.baseURL}/apertura-caja-dia`;
    return this.http.post<any>(url, data, {headers});
  }

  getAbierto(): Observable<any> {
    const headers = { 'Authorization': 'Bearer '+localStorage.getItem('token') }
    let url=`${environment.baseURL}/apertura-caja-abierta`;
    return this.http.get<any>(url, {headers});
  }

  getEstadisticas(item:any): Observable<any> {
    const headers = { 'Authorization': 'Bearer '+localStorage.getItem('token') }
    let url=`${environment.baseURL}/apertura-estadisticas`;
    return this.http.post<any>(url, item, {headers});
  }

  getHistoricos(item:any): Observable<any> {
    const headers = { 'Authorization': 'Bearer '+localStorage.getItem('token') }
    let url=`${environment.baseURL}/apertura-historicos`;
    return this.http.post<any>(url, item, {headers});
  }

  getHistoricosCajaMenor(item:any): Observable<any> {
    const headers = { 'Authorization': 'Bearer '+localStorage.getItem('token') }
    let url=`${environment.baseURL}/apertura-caja-menor`;
    return this.http.post<any>(url, item, {headers});
  }

  getReporteCaja(item:any): Observable<any> {
    const headers = { 'Authorization': 'Bearer '+localStorage.getItem('token') }
    let url=`${environment.baseURL}/reporte-caja`;
    return this.http.post<any>(url, item, {headers});
  }

  actualizarCaja(item:any): Observable<any> {
    const headers = { 'Authorization': 'Bearer '+localStorage.getItem('token') }
    let url=`${environment.baseURL}/apertura-caja-update`;
    return this.http.post<any>(url, item, {headers});
  }








}

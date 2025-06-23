
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.prod';
import { Mesa } from '../interface/Mesa';



@Injectable({
  providedIn: 'root'
})
export class MesasService {

  constructor(private http: HttpClient) { }


  getAll(): Observable<any> {
    const headers = { 'Authorization': 'Bearer '+localStorage.getItem('token') }
    let url=`${environment.baseURL}/mesas`;
    return this.http.get<any>(url, {headers});
  }

  getActive(): Observable<any> {
    const headers = { 'Authorization': 'Bearer '+localStorage.getItem('token') }
    let url=`${environment.baseURL}/mesas-activos`;
    return this.http.get<any>(url, {headers});
  }

  getById(id): Observable<any> {
    const headers = { 'Authorization': 'Bearer '+localStorage.getItem('token') }
    let url=`${environment.baseURL}/mesas/${id}`;
    return this.http.get<any>(url, {headers});
  }

  postData(data: Mesa): Observable<any> {
    const headers = { 'Authorization': 'Bearer '+localStorage.getItem('token') }
    let url=`${environment.baseURL}/mesas`;
    return this.http.post<any>(url, data, {headers});
  }

  putData(id:number, data: Mesa): Observable<any> {
    const headers = { 'Authorization': 'Bearer '+localStorage.getItem('token') }
    let url=`${environment.baseURL}/mesas/${id}`;
    return this.http.patch<any>(url, data, {headers});
  }

  getFilter(data: Mesa): Observable<any> {
    const headers = { 'Authorization': 'Bearer '+localStorage.getItem('token') }
    let url=`${environment.baseURL}/mesas/filter`;
    return this.http.post<any>(url, data, {headers});
  }

  postEstado(id:any): Observable<any> {
    const headers = { 'Authorization': 'Bearer '+localStorage.getItem('token') }
    let url=`${environment.baseURL}/mesas/cambiarEstado`;
    let data ={id};
    return this.http.post<any>(url, data, {headers});
  }

  getMesasPedidosActivos(): Observable<any> {
    const headers = { 'Authorization': 'Bearer '+localStorage.getItem('token') }
    let url=`${environment.baseURL}/mesas-pedidos-activos`;
    return this.http.get<any>(url, {headers});
  }



}

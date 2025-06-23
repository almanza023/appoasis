
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.prod';
import { Cliente } from '../interface/Cliente';



@Injectable({
  providedIn: 'root'
})
export class ProductosService {

  constructor(private http: HttpClient) { }


  getAll(): Observable<any> {
    const headers = { 'Authorization': 'Bearer '+localStorage.getItem('token') }
    let url=`${environment.baseURL}/productos`;
    return this.http.get<any>(url, {headers});
  }

  getActive(): Observable<any> {
    const headers = { 'Authorization': 'Bearer '+localStorage.getItem('token') }
    let url=`${environment.baseURL}/productos-activos`;
    return this.http.get<any>(url, {headers});
  }

  getById(id): Observable<any> {
    const headers = { 'Authorization': 'Bearer '+localStorage.getItem('token') }
    let url=`${environment.baseURL}/productos/${id}`;
    return this.http.get<any>(url, {headers});
  }

  postData(data: any): Observable<any> {
    const headers = { 'Authorization': 'Bearer '+localStorage.getItem('token') }
    let url=`${environment.baseURL}/productos`;
    return this.http.post<any>(url, data, {headers});
  }

  putData(id:number, data: any): Observable<any> {
    const headers = { 'Authorization': 'Bearer '+localStorage.getItem('token') }
    let url=`${environment.baseURL}/productos/${id}`;
    return this.http.patch<any>(url, data, {headers});
  }

  getFilter(data: any): Observable<any> {
    const headers = { 'Authorization': 'Bearer '+localStorage.getItem('token') }
    let url=`${environment.baseURL}/productos/filter`;
    return this.http.post<any>(url, data, {headers});
  }

  postEstado(id:any): Observable<any> {
    const headers = { 'Authorization': 'Bearer '+localStorage.getItem('token') }
    let url=`${environment.baseURL}/productos/cambiarEstado`;
    let data ={id};
    return this.http.post<any>(url, data, {headers});
  }

  postMovimientos(item:any): Observable<any> {
    const headers = { 'Authorization': 'Bearer '+localStorage.getItem('token') }
    let url=`${environment.baseURL}/productos-movimientos`;
    return this.http.post<any>(url, item, {headers});
  }

  postLaboratorio(item:any): Observable<any> {
    const headers = { 'Authorization': 'Bearer '+localStorage.getItem('token') }
    let url=`${environment.baseURL}/productos-laboratorio`;
    return this.http.post<any>(url, item, {headers});
  }

  getLaboratorio(): Observable<any> {
    const headers = { 'Authorization': 'Bearer '+localStorage.getItem('token') }
    let url=`${environment.baseURL}/productos-laboratorio`;
    return this.http.get<any>(url, {headers});
  }

  postProductoBodega(item:any): Observable<any> {
    const headers = { 'Authorization': 'Bearer '+localStorage.getItem('token') }
    let url=`${environment.baseURL}/productos-bodegas`;
    return this.http.post<any>(url, item, {headers});
  }


  postProductoAVencer(item:any): Observable<any> {
    const headers = { 'Authorization': 'Bearer '+localStorage.getItem('token') }
    let url=`${environment.baseURL}/productos-proximos-avencer `;
    return this.http.post<any>(url, item, {headers});
  }

  getProductoInventario(): Observable<any> {
    const headers = { 'Authorization': 'Bearer '+localStorage.getItem('token') }
    let url=`${environment.baseURL}/productos-inventario`;
    return this.http.get<any>(url, {headers});
  }

  postImportar(item:any): Observable<any> {
    const headers = { 'Authorization': 'Bearer '+localStorage.getItem('token') }
    let url=`${environment.baseURL}/productos-cargar`;
    return this.http.post<any>(url, item, {headers});
  }








}

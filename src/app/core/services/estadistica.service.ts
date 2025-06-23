import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.prod';


@Injectable({
  providedIn: 'root'
})
export class EstadisticaService {

  constructor(private http: HttpClient) { }


  getMatriculaGrados(): Observable<any> {
    const headers = { 'Authorization': 'Bearer '+localStorage.getItem('token') }
    let url=`${environment.baseURL}/estadisticas/grados`;
    return this.http.get<any>(url, {headers});
  }

  getMatriculasSede(): Observable<any> {
    const headers = { 'Authorization': 'Bearer '+localStorage.getItem('token') }
    let url=`${environment.baseURL}/estadisticas/sedes`;
    return this.http.get<any>(url, {headers});
  }

  getContadores(): Observable<any> {
    const headers = { 'Authorization': 'Bearer '+localStorage.getItem('token') }
    let url=`${environment.baseURL}/estadisticas/contadores`;
    return this.http.get<any>(url, {headers});
  }

  getContadoresDocente(id:any): Observable<any> {
    const headers = { 'Authorization': 'Bearer '+localStorage.getItem('token') }
    let url=`${environment.baseURL}/estadisticas/contadoresDocentes/${id}`;
    return this.http.get<any>(url, {headers});
  }










}

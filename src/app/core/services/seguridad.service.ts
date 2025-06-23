import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class SeguridadService {

  constructor(private http: HttpClient) { }

  postLogin(data: any): Observable<any> {
    let url=`${environment.baseURL}/auth/login`;
    return this.http.post<any>(url, data);
  }

  cambioClave(data: any): Observable<any> {
    const headers = { 'Authorization': 'Bearer '+localStorage.getItem('token') }
    let url=`${environment.baseURL}/cambiar-clave`;
    return this.http.post<any>(url, data, {headers});
  }

  actualizarUsuario(data: any): Observable<any> {
    const headers = { 'Authorization': 'Bearer '+localStorage.getItem('token') }
    let url=`${environment.baseURL}/usuario/actualizar`;
    return this.http.post<any>(url, data, {headers});
  }


}

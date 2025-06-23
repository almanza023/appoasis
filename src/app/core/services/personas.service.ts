import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.prod';


@Injectable({
  providedIn: 'root'
})
export class PersonasService {

  constructor(private http: HttpClient) { }

  getAll(): Observable<any> {
    const headers = { 'Authorization': 'Bearer '+localStorage.getItem('token') }
    let url=`${environment.baseURL}/personas`;
    return this.http.get<any>(url, {headers});
  }

  getActive(): Observable<any> {
    const headers = { 'Authorization': 'Bearer '+localStorage.getItem('token') }
    let url=`${environment.baseURL}/personas-activos`;
    return this.http.get<any>(url, {headers});
  }

  getLideresYSublider(id): Observable<any> {
    const headers = { 'Authorization': 'Bearer '+localStorage.getItem('token') }
    let url=`${environment.baseURL}/personas/lideres/${id}`;
    return this.http.get<any>(url, {headers});
  }

  getSublider(id): Observable<any> {
    const headers = { 'Authorization': 'Bearer '+localStorage.getItem('token') }
    let url=`${environment.baseURL}/personas/sublideres/${id}`;
    return this.http.get<any>(url, {headers});
  }


  getById(id): Observable<any> {
    const headers = { 'Authorization': 'Bearer '+localStorage.getItem('token') }
    let url=`${environment.baseURL}/personas/${id}`;
    return this.http.get<any>(url, {headers});
  }

  postData(data: any): Observable<any> {
    const headers = { 'Authorization': 'Bearer '+localStorage.getItem('token') }
    let url=`${environment.baseURL}/personas`;
    return this.http.post<any>(url, data, {headers});
  }

  putData(data: any): Observable<any> {
    const headers = { 'Authorization': 'Bearer '+localStorage.getItem('token') }
    let url=`${environment.baseURL}/personas/${data.id}`;
    return this.http.put<any>(url, data, {headers});
  }

  cambiarEstado(data: any): Observable<any> {
    const headers = { 'Authorization': 'Bearer '+localStorage.getItem('token') }
    let url=`${environment.baseURL}/personas/cambiarEstado`;
    return this.http.post<any>(url, data, {headers});
  }

  validarDocumentoFuente(documento: any): Observable<any> {
    let datos={
        'numerodocumento':documento
    };
    const headers = { 'Authorization': 'Bearer '+localStorage.getItem('token') }
    let url=`${environment.baseURL}/validarDocumentoFuente`;
    return this.http.post<any>(url, datos, {headers});
  }

  validarDocumento(id): Observable<any> {
    const headers = { 'Authorization': 'Bearer '+localStorage.getItem('token') }
    let url=`${environment.baseURL}/personas/validar/${id}`;
    return this.http.get<any>(url, {headers});
  }

  detallesSublideres(id): Observable<any> {
    const headers = { 'Authorization': 'Bearer '+localStorage.getItem('token') }
    let url=`${environment.baseURL}/personas/detallesSublideres/${id}`;
    return this.http.get<any>(url, {headers});
  }

  getEstadisticas(id): Observable<any> {
    const headers = { 'Authorization': 'Bearer '+localStorage.getItem('token') }
    let url=`${environment.baseURL}/personas/getEstadisticas/${id}`;
    return this.http.get<any>(url, {headers});
  }

  getVotantes(id, tipo): Observable<any> {
    const headers = { 'Authorization': 'Bearer '+localStorage.getItem('token') }
    let url=`${environment.baseURL}/personas/getVotantes/${id}/${tipo}`;
    return this.http.get<any>(url, {headers});
  }

  eliminarPersona(id): Observable<any> {
    const headers = { 'Authorization': 'Bearer '+localStorage.getItem('token') }
    let url=`${environment.baseURL}/personas/${id}`;
    return this.http.delete<any>(url, {headers});
  }

  getCantidadVotos(data: any): Observable<any> {
    const headers = { 'Authorization': 'Bearer '+localStorage.getItem('token') }
    let url=`${environment.baseURL}/personas/getVotos`;
    return this.http.post<any>(url, data, {headers});
  }

  getdocumentosPuesto(data: any): Observable<any> {
    //const headers = { 'Authorization': 'Bearer '+localStorage.getItem('token') }
    let url=`${environment.baseURL}/personas/listado`;
    return this.http.post<any>(url, data);
  }

  enviarPuesto(data: any): Observable<any> {
    //const headers = { 'Authorization': 'Bearer '+localStorage.getItem('token') }
    let url=`${environment.baseURL}/personas/puesto`;
    return this.http.post<any>(url, data);
  }

  getDigitados(usuario): Observable<any> {
    let url=`${environment.baseURL}/totaldigitadospersonas/${usuario}`;
    return this.http.get<any>(url);
  }




}

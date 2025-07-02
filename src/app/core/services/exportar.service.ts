import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as XLSX from 'xlsx';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ExportarService {

  constructor() { }

exportarExcelOperaciones(nombreArchivo: string, data: any[]): void {
    // Filtra las propiedades requeridas de cada objeto en data
    const filteredData = data.map(item => ({
         tipo_operacion: item.tipo_operacion,
         tercero: item.nombre,
        valor: item.valor,
        fecha_creacion: item.fecha_creacion,
        tipo_pago: item.tipo_pago
    }));

    // Crea una hoja de cálculo a partir de los datos filtrados
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(filteredData);
    const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };

    // Genera un archivo Excel en formato binario
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });

    // Crea un Blob y lo descarga
    const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${nombreArchivo}.xlsx`;
    a.click();
    window.URL.revokeObjectURL(url);
}








}

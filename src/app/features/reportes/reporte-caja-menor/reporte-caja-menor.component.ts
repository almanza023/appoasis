import * as XLSX from 'xlsx'; // Asegúrate de importar la biblioteca

import { Component, SimpleChanges, ViewChild } from '@angular/core';
import { ConfirmationService, ConfirmEventType, MessageService } from 'primeng/api';
import { finalize } from 'rxjs';
import { AperturaCajaService } from 'src/app/core/services/apertura-caja.service';


@Component({
  selector: 'app-reporte-caja-menor',
  templateUrl: './reporte-caja-menor.component.html',
  providers: [MessageService, ConfirmationService],
})
export class ReporteCajaMenorComponent {

    nombreModulo:string="Reporte Historico Caja Menor"
     today:any=""
    todayF:any=""
    fecha_cierre:any="";
    data:any={};
    filter:any={};
    historialDialog:boolean=false;
    historial:any=[];
    loading:boolean=false;
    ngOnInit(): void {
        this.today = this.formatDate(new Date());
        this.today = this.formatDate(new Date(new Date().getFullYear(), new Date().getMonth(), 1));
        var lastDayOfMonth = new Date(new Date().getFullYear(), new Date().getMonth()+1, 0);
        this.todayF = this.formatDate(lastDayOfMonth);
        this.consultar();
    }

    constructor(
        private service: AperturaCajaService,
        private messageService: MessageService,
        private confirmationService: ConfirmationService
    ) {}

    formatDate(date: Date): string {
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Los meses son 0-indexados
        const year = date.getFullYear();
        return `${year}-${month}-${day}`;
    }


    consultar(){
        if(!this.today){
            this.messageService.add({
                severity: 'warn',
                summary: 'Advertencia',
                detail:"Debe seleccionar una Fecha de Inicio",
                life: 3000,
            });
            return;
        }

        if(!this.todayF){
            this.messageService.add({
                severity: 'warn',
                summary: 'Advertencia',
                detail:"Debe seleccionar una Fecha de Final",
                life: 3000,
            });
            return;
        }

        this.loading=true;
        this.filter.fechaInicio = this.today;
        this.filter.fechaFinal=this.todayF;
        this.getData(this.filter);

    }

    getData(item:any) {
        this.data=[];
        setTimeout(() => {
            this.service.getHistoricosCajaMenor(item).subscribe(
                (response) => {
                    //console.log(response.data);
                    this.data = response.data;
                    this.loading=false;
                    if(this.data.length==0){
                        this.messageService.add({
                            severity: 'warn',
                            summary: 'Advertencia',
                            detail:"No Existen Datos",
                            life: 2000,
                        });
                    }
                },
                (error) => {
                    this.messageService.add({
                        severity: 'warn',
                        summary: 'Advertencia',
                        detail:"Error al obtener datos",
                        life: 2000,
                    });
                }
            );
        }, 2000);
    }

calcularTotalVentas() {
    return this.data.reduce((acc, item) => acc + Number(item.entradas), 0);
}

calcularTotalGastos(){
    return this.data.reduce((acc, item) => acc + Number(item.salidas), 0);
}

exportarPDF() {
    const worksheet = XLSX.utils.json_to_sheet(this.data.map(item => ({
        'Fecha': item.fecha,
        'Total Ventas': item.entradas,
        'Total Gastos': item.salidas,
    })));

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Reporte de Caja');

    XLSX.writeFile(workbook, 'reporte_caja_menor.xlsx');
}

calcularDisponible() {
    return this.data.reduce((acc, item) => acc + (Number(item.entradas) - Number(item.salidas)), 0);
}







}

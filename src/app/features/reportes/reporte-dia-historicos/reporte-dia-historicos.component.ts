import * as XLSX from 'xlsx'; // Asegúrate de importar la biblioteca

import { Component, SimpleChanges, ViewChild } from '@angular/core';
import { ConfirmationService, ConfirmEventType, MessageService } from 'primeng/api';
import { finalize } from 'rxjs';
import { AperturaCajaService } from 'src/app/core/services/apertura-caja.service';


@Component({
    selector: 'app-reporte-dia-historicos',
    templateUrl: './reporte-dia-historicos.component.html',
    providers: [MessageService, ConfirmationService],
})
export class ReporteDiaHistoricosComponent {

    nombreModulo: string = "Reporte Historio Caja Diaria"
    today: any = ""
    todayF: any = ""
    fecha_cierre: any = "";
    data: any = {};
    filter: any = {};
    historialDialog: boolean = false;
    historial: any = [];
    loading: boolean = false;
    ngOnInit(): void {
        this.today = this.formatDate(new Date());
        this.today = this.formatDate(new Date(new Date().getFullYear(), new Date().getMonth(), 1));
        var lastDayOfMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0);
        this.todayF = this.formatDate(lastDayOfMonth);
        this.consultar();
    }

    constructor(
        private service: AperturaCajaService,
        private messageService: MessageService,       
    ) { }

    formatDate(date: Date): string {
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Los meses son 0-indexados
        const year = date.getFullYear();
        return `${year}-${month}-${day}`;
    }


    consultar() {
        if (!this.today) {
            this.messageService.add({
                severity: 'warn',
                summary: 'Advertencia',
                detail: "Debe seleccionar una Fecha de Inicio",
                life: 3000,
            });
            return;
        }

        if (!this.todayF) {
            this.messageService.add({
                severity: 'warn',
                summary: 'Advertencia',
                detail: "Debe seleccionar una Fecha de Final",
                life: 3000,
            });
            return;
        }

        this.filter.fechaInicio = this.today;
        this.filter.fechaFinal = this.todayF;
        this.loading = true;
        this.getData(this.filter);

    }

    getData(item: any) {
        this.data = [];
        setTimeout(() => {
            this.service.getHistoricos(item).subscribe(
                (response) => {
                    //console.log(response.data);
                    this.data = response.data;
                    if (this.data.length == 0) {
                        this.messageService.add({
                            severity: 'warn',
                            summary: 'Advertencia',
                            detail: "No Existen Datos",
                            life: 3000,
                        });
                    }
                },
                (error) => {
                    this.messageService.add({
                        severity: 'warn',
                        summary: 'Advertencia',
                        detail: "Error al obtener datos",
                        life: 3000,
                    });
                }
            );
            this.loading = false;
        }, 2000);
    }

    calcularTotalVentas() {
        return this.data.reduce((acc, item) => acc + Number(item.totalventas), 0);
    }

    calcularTotalGastos() {
        return this.data.reduce((acc, item) => acc + Number(item.totalgastos), 0);
    }
    calcularUtilidad() {
        return this.data.reduce((acc, item) => acc + Number(item.utilidad), 0);
    }

    exportarPDF() {
        const worksheet = XLSX.utils.json_to_sheet(this.data.map(item => ({
            'Fecha Apertura': item.fecha,
            'Fecha Cierre': item.fecha_cierre,
            'Base': item.monto_inicial,
            'Total Ventas': item.totalventas,
            'Total Gastos': item.totalgastos,
            'Utilidad': item.utilidad,
            'Estado': item.estado == "1" ? "ABIERTO" : item.estado == "3" ? "ANULADA" : "CERRADA"
        })));

        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Reporte de Caja');

        XLSX.writeFile(workbook, 'reporte_caja.xlsx');
    }

}

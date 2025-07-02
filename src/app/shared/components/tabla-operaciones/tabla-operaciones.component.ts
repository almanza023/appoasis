import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { ExportarService } from 'src/app/core/services/exportar.service';
import { OperacionesService } from 'src/app/core/services/operaciones.service';

@Component({
    selector: 'app-tabla-operaciones',
    templateUrl: './tabla-operaciones.component.html',
    providers: [MessageService],
})
export class TablaOperacionesComponent implements OnInit {
    constructor(
        private service: OperacionesService,
        private serviceExportar: ExportarService,
        private messageService: MessageService
    ) {}
    operaciones: any[] = [];
    loading: boolean = false;
    fechaFiltro: string = '';

    @Output() itemSeleccionado: EventEmitter<any> =
        new EventEmitter<any>();

    ngOnInit() {
        this.getAll();
        let today= this.formatDate(new Date());
        // Establecer la fecha de filtro al día actual en formato YYYY-MM-DD
        this.fechaFiltro = today;
    }


    onGlobalFilter(table: Table, event: Event) {
        table.filterGlobal(
            (event.target as HTMLInputElement).value,
            'contains'
        );
    }

    getAll() {
        this.loading=true;
        const fecha = new Date();
        // Obtener la fecha en la zona horaria de Bogotá (UTC-5)
        const fechaFormateada = this.formatDate(fecha);
       setTimeout(() => {
        this.service.postOperacionesDia(fechaFormateada).subscribe(
            (response) => {
                this.operaciones = response.data;
            },
            (error) => {
                this.messageService.add({
                    severity: 'warn',
                    summary: 'Advertencia',
                    detail: error.error.data,
                    life: 3000,
                });
            }
        );
        this.loading=false;
       }, 2000);
    }

    selectCliente(item: any) {
        this.itemSeleccionado.emit(item);
    }

     formatDate(date: Date): string {
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Los meses son 0-indexados
        const year = date.getFullYear();
        return `${year}-${month}-${day}`;
    }

    consultarPorFecha() {
        this.loading=true;
        this.service.postOperacionesDia(this.fechaFiltro).subscribe(
            (response) => {
                this.operaciones = response.data;
                this.loading=false;
            },
            (error) => {
                this.messageService.add({
                    severity: 'warn',
                    summary: 'Advertencia',
                    detail: error.error.data,
                    life: 3000,
                });
                this.loading=false;
            }
        );
    }

    exportarExcel() {
        this.loading=true;
        let fileName = `operaciones_${this.fechaFiltro}`;
        this.serviceExportar.exportarExcelOperaciones(fileName, this.operaciones);

    }
}

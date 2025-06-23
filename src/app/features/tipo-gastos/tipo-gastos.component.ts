
import { Component, ViewChild } from '@angular/core';
import { finalize } from 'rxjs';
import { Table } from 'primeng/table';
import { MessageService } from 'primeng/api';
import { TipoGastosService } from 'src/app/core/services/tipo-gastos.service';
import { TipoPago } from 'src/app/core/interface/TipoPago';


@Component({
    selector: 'app-tipo-gastos',
    templateUrl: './tipo-gastos.component.html',
    providers: [MessageService],
})
export class TipoGastosComponent {
    clienteDialog: boolean = false;
    deleteProductDialog: boolean = false;
    deleteProductsDialog: boolean = false;

    data: any[] = [];

    descripcion: string;
    tipogasto: any = {};
    selectedProducts: any[] = [];
    submitted: boolean = false;
    cols: any[] = [];
    statuses: any[] = [];
    seleccionado: any = {};
    item: any = {};
    rowsPerPageOptions = [5, 10, 20];
    nombreModulo: string = 'Módulo de Tipo de Gastos';
    tipopartidoModel: TipoPago = {};

    periodicidadOptions = [
        { label: 'Diario', value: '1' },
        { label: 'Quincenal', value: '2' },
        { label: 'Mensual', value: '3' },
    ]
    constructor(
        private tipoService: TipoGastosService,
        private messageService: MessageService
    ) {}

    ngOnInit() {
        this.getDataAll();
        this.cols = [];
        this.statuses = [];
    }

    getDataAll() {
        this.tipoService.getAll().subscribe(
            (response) => {
                //console.log(response.data);
                this.data = response.data;
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
    }

    openNew() {
        this.tipogasto = {};
        this.tipogasto.editar = false;
        this.submitted = false;
        this.clienteDialog = true;
        this.seleccionado = {};
    }

    deleteSelectedProducts() {
        this.deleteProductsDialog = true;
    }

    edit(item: any) {
        this.tipogasto = { ...item };
        this.clienteDialog = true;
        this.tipogasto.editar = true;
        const selectedPeriodicidad = this.periodicidadOptions.find(option => option.label === item.periodicidad);
        if (selectedPeriodicidad) {
            this.tipogasto.periodicidad = selectedPeriodicidad.value;
        }

    }

    bloquear(cliente: any) {
        this.deleteProductDialog = true;
        this.tipogasto = { ...cliente };
        this.tipogasto.cambio_estado = true;
        this.tipopartidoModel = this.mapearDatos(this.tipogasto, true);
    }

    confirmDelete() {
        this.deleteProductDialog = false;
        this.tipoService
            .postEstado(this.tipogasto.id)
            .pipe(finalize(() => this.getDataAll()))
            .subscribe(
                (response) => {
                    let severity = '';
                    let summary = '';
                    if (response.isSuccess == true) {
                        severity = 'success';
                        summary = 'Exitoso';
                    } else {
                        severity = 'warn';
                        summary = 'Advertencia';
                    }
                    this.messageService.add({
                        severity: severity,
                        summary: summary,
                        detail: response.message,
                        life: 3000,
                    });
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
        this.tipogasto = {};
    }
    hideDialog() {
        this.clienteDialog = false;
        this.submitted = false;
    }

    save() {
        this.submitted = true;
        if (this.tipogasto.nombre == undefined) {
            this.messageService.add({
                severity: 'warn',
                summary: 'Advertencia',
                detail: 'Debe ingresar un Nombre',
                life: 3000,
            });
            return;
        }
        if (this.tipogasto.periodicidad === undefined) {
            this.messageService.add({
                severity: 'warn',
                summary: 'Advertencia',
                detail: 'Debe seleccionar una Periodicidad',
                life: 3000,
            });
            return;
        }

        this.tipopartidoModel = this.mapearDatos(this.tipogasto, false);
        if (this.tipogasto.id == undefined) {
            this.crear(this.tipopartidoModel);
        } else {
            this.actualizar(this.tipogasto.id, this.tipopartidoModel);
        }
        //this.clientes = [...this.clientes];
        this.clienteDialog = false;
        this.tipogasto = {};
        this.tipogasto = {};
    }

    crear(item: TipoPago) {
        this.tipoService
            .postData(item)
            .pipe(finalize(() => this.getDataAll()))
            .subscribe(
                (response) => {
                    let severity = '';
                    let summary = '';
                    if (response.isSuccess == true) {
                        severity = 'success';
                        summary = 'Exitoso';
                    } else {
                        severity = 'warn';
                        summary = 'Advertencia';
                    }
                    this.messageService.add({
                        severity: severity,
                        summary: summary,
                        detail: response.message,
                        life: 3000,
                    });
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
    }

    actualizar(id: number, item: TipoPago) {
        this.tipoService
            .putData(id, item)
            .pipe(finalize(() => this.getDataAll()))
            .subscribe(
                (response) => {
                    let severity = '';
                    let summary = '';
                    if (response.isSuccess == true) {
                        severity = 'success';
                        summary = 'Exitoso';
                    } else {
                        severity = 'warn';
                        summary = 'Advertencia';
                    }
                    this.messageService.add({
                        severity: severity,
                        summary: summary,
                        detail: response.message,
                        life: 3000,
                    });
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
    }

    onGlobalFilter(table: Table, event: Event) {
        table.filterGlobal(
            (event.target as HTMLInputElement).value,
            'contains'
        );
    }

    mapearDatos(item: any, estado: boolean) {
        let model: TipoPago = {};
        model.nombre = item.nombre.toUpperCase();
        model.descripcion = item.descripcion;
        model.periodicidad = item.periodicidad;
        if (estado) {
            model.estado = !item.estado;
        }
        return model;
    }
}


import { Component, ViewChild } from '@angular/core';
import { finalize } from 'rxjs';
import { Table } from 'primeng/table';
import { MessageService } from 'primeng/api';
import { TipoPagoService } from 'src/app/core/services/tipo-pagos.service';
import { TipoPago } from 'src/app/core/interface/TipoPago';


@Component({
    selector: 'app-tipo-pagos',
    templateUrl: './tipo-pagos.component.html',
    providers: [MessageService],
})
export class TipoPagosComponent {
    clienteDialog: boolean = false;
    deleteProductDialog: boolean = false;
    deleteProductsDialog: boolean = false;

    data: any[] = [];

    descripcion: string;
    tipopartido: any = {};
    selectedProducts: any[] = [];
    submitted: boolean = false;
    cols: any[] = [];
    statuses: any[] = [];
    seleccionado: any = {};
    item: any = {};
    rowsPerPageOptions = [5, 10, 20];
    nombreModulo: string = 'Módulo de Tipo de Pagos';
    tipopartidoModel: TipoPago = {};

    constructor(
        private tipoPagoService: TipoPagoService,
        private messageService: MessageService
    ) {}

    ngOnInit() {
        this.getDataAll();
        this.cols = [];
        this.statuses = [];
    }

    getDataAll() {
        this.tipoPagoService.getAll().subscribe(
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
        this.tipopartido = {};
        this.tipopartido.editar = false;
        this.submitted = false;
        this.clienteDialog = true;
        this.seleccionado = {};
    }

    deleteSelectedProducts() {
        this.deleteProductsDialog = true;
    }

    edit(item: any) {
        this.tipopartido = { ...item };
        this.clienteDialog = true;
        this.tipopartido.editar = true;
    }

    bloquear(cliente: any) {
        this.deleteProductDialog = true;
        this.tipopartido = { ...cliente };
        this.tipopartido.cambio_estado = true;
        this.tipopartidoModel = this.mapearDatos(this.tipopartido, true);
    }

    confirmDelete() {
        this.deleteProductDialog = false;
        this.tipoPagoService
            .postEstado(this.tipopartido.id)
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
        this.tipopartido = {};
    }
    hideDialog() {
        this.clienteDialog = false;
        this.submitted = false;
    }

    save() {
        this.submitted = true;
        if (this.tipopartido.nombre == undefined) {
            this.messageService.add({
                severity: 'warn',
                summary: 'Advertencia',
                detail: 'Debe ingresar un Nombre',
                life: 3000,
            });
            return;
        }
        this.tipopartidoModel = this.mapearDatos(this.tipopartido, false);
        if (this.tipopartido.id == undefined) {
            this.crear(this.tipopartidoModel);
        } else {
            this.actualizar(this.tipopartido.id, this.tipopartidoModel);
        }
        //this.clientes = [...this.clientes];
        this.clienteDialog = false;
        this.tipopartido = {};
        this.seleccionado = {};
    }

    crear(item: TipoPago) {
        this.tipoPagoService
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
        this.tipoPagoService
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
        if (estado) {
            model.estado = !item.estado;
        }
        return model;
    }
}

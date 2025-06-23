
import { Component, ViewChild } from '@angular/core';
import { finalize } from 'rxjs';
import { Table } from 'primeng/table';
import { MessageService } from 'primeng/api';
import { BodegaService } from 'src/app/core/services/bodega.service';
import { Bodega } from 'src/app/core/interface/Bodega';



@Component({
    selector: 'app-bodegas',
    templateUrl: './bodegas.component.html',
    providers: [MessageService],
})
export class BodegasComponent {
    clienteDialog: boolean = false;
    deleteProductDialog: boolean = false;
    deleteProductsDialog: boolean = false;

    data: any[] = [];    
    bodega: any = {};
    selectedProducts: any[] = [];
    submitted: boolean = false;
    cols: any[] = [];
    statuses: any[] = [];
    seleccionado: any = {};
    item: any = {};
    rowsPerPageOptions = [5, 10, 20];
    nombreModulo: string = 'Módulo de Bodegas';
    modelo: Bodega = {};

    constructor(
        private service: BodegaService,
        private messageService: MessageService
    ) {}

    ngOnInit() {
        this.getDataAll();
        this.cols = [];
        this.statuses = [];
    }

    getDataAll() {
        this.service.getAll().subscribe(
            (response) => {
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
        this.bodega = {};
        this.bodega.editar = false;
        this.submitted = false;
        this.clienteDialog = true;
        this.seleccionado = {};
    }

    deleteSelectedProducts() {
        this.deleteProductsDialog = true;
    }

    edit(item: any) {
        this.bodega = { ...item };
        this.clienteDialog = true;
        this.bodega.editar = true;
    }

    bloquear(cliente: any) {
        this.deleteProductDialog = true;
        this.bodega = { ...cliente };
        this.bodega.cambio_estado = true;
        this.modelo = this.mapearDatos(this.bodega, true);
    }

    confirmDelete() {
        this.deleteProductDialog = false;
        this.service
            .postEstado(this.bodega.id)
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
        this.bodega = {};
    }
    hideDialog() {
        this.clienteDialog = false;
        this.submitted = false;
    }

    save() {
        this.submitted = true;
        if (this.bodega.nombre == undefined) {
            this.messageService.add({
                severity: 'warn',
                summary: 'Advertencia',
                detail: 'Debe ingresar un Nombre',
                life: 3000,
            });
            return;
        }
        this.modelo = this.mapearDatos(this.bodega, false);
        if (this.bodega.id == undefined) {
            this.crear(this.modelo);
        } else {
            this.actualizar(this.bodega.id, this.modelo);
        }
        //this.clientes = [...this.clientes];
        this.clienteDialog = false;
        this.bodega = {};
        this.seleccionado = {};
    }

    crear(item: Bodega) {
        this.service
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

    actualizar(id: number, item: Bodega) {
        this.service
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
        let model: Bodega = {};
        model.nombre = item.nombre.toUpperCase();
        model.descripcion = item.descripcion;
        model.telefono = item.telefono;
        if (estado) {
            model.estado = !item.estado;
        }
        return model;
    }
}

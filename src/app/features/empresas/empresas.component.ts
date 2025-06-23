import { Component, ViewChild } from '@angular/core';
import { finalize } from 'rxjs';
import { Table } from 'primeng/table';
import { MessageService } from 'primeng/api';


import { EmpresaService } from 'src/app/core/services/empresa.service';
import { Empresa } from 'src/app/core/interface/Empresa';


@Component({
    selector: 'app-empresas',
    templateUrl: './empresas.component.html',
    providers: [MessageService],
})
export class EmpresasComponent {
    empresaDialog: boolean = false;
    deleteProductDialog: boolean = false;
    deleteProductsDialog: boolean = false;

    data: any[] = [];

    descripcion: string;
    empresa: any = {};
    selectedProducts: any[] = [];
    submitted: boolean = false;
    cols: any[] = [];
    statuses: any[] = [];
    seleccionado: any = {};
    item: any = {};
    rowsPerPageOptions = [5, 10, 20];
    nombreModulo: string = 'Módulo de Empresas';
    empresaModel: Empresa = {};

    constructor(
        private service: EmpresaService,
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
        this.empresa = {};
        this.empresa.editar = false;
        this.submitted = false;
        this.empresaDialog = true;
        this.seleccionado = {};
    }

    deleteSelectedProducts() {
        this.deleteProductsDialog = true;
    }

    edit(item: any) {
        this.empresa = { ...item };
        this.empresaDialog = true;
        this.empresa.editar = true;
    }

    bloquear(empresa: any) {
        this.deleteProductDialog = true;
        this.empresa = { ...empresa };
        this.empresa.cambio_estado = true;
        this.empresaModel = this.mapearDatos(this.empresa, true);
    }

    confirmDelete() {
        this.deleteProductDialog = false;
        this.service
            .postEstado(this.empresa.id)
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
        this.empresa = {};
    }
    hideDialog() {
        this.empresaDialog = false;
        this.submitted = false;
    }

    save() {
        this.submitted = true;
        if (this.empresa.nombre == undefined) {
            this.messageService.add({
                severity: 'warn',
                summary: 'Advertencia',
                detail: 'Debe ingresar un Nombre',
                life: 3000,
            });
            return;
        }
        if (this.empresa.direccion == undefined || this.empresa.direccion == '') {
            this.messageService.add({
                severity: 'warn',
                summary: 'Advertencia',
                detail: 'Debe ingresar una Dirección',
                life: 3000,
            });
            return;
        }
        if (this.empresa.telefono == undefined || this.empresa.telefono == '') {
            this.messageService.add({
                severity: 'warn',
                summary: 'Advertencia',
                detail: 'Debe ingresar un Teléfono',
                life: 3000,
            });
            return;
        }
        if (this.empresa.contacto == undefined || this.empresa.contacto == '') {
            this.messageService.add({
                severity: 'warn',
                summary: 'Advertencia',
                detail: 'Debe ingresar un Contacto',
                life: 3000,
            });
            return;
        }
        this.empresaModel = this.mapearDatos(this.empresa, false);
        if (this.empresa.id == undefined) {
            //this.crear(this.empresaModel);
        } else {
            this.actualizar(this.empresa.id, this.empresaModel);
        }
        //this.clientes = [...this.clientes];
        this.empresaDialog = false;
        this.empresa = {};
        this.seleccionado = {};
    }

    crear(item: Empresa) {
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

    actualizar(id: number, item: Empresa) {
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
        let model: Empresa = {};
        model.nombre = item.nombre.toUpperCase();
        model.nit = item.nit;
        model.telefono = item.telefono;
        model.direccion = item.direccion;
        model.contacto = item.contacto;
        if (estado) {
            model.estado = !item.estado;
        }
        return model;
    }
}

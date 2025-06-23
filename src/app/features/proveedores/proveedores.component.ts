import { Component, ViewChild } from '@angular/core';
import { finalize } from 'rxjs';

import { Table } from 'primeng/table';
import { MessageService } from 'primeng/api';

import { ClientesService } from 'src/app/core/services/clientes.service';
import { Proveedor } from 'src/app/core/interface/Proveedor';
import { ProveedorService } from 'src/app/core/services/proveedor.service';


@Component({
    selector: 'app-proveedores',
    templateUrl: './proveedores.component.html',
    providers: [MessageService],
})
export class ProveedoresComponent {
    clienteDialog: boolean = false;
    deleteProductDialog: boolean = false;
    deleteProductsDialog: boolean = false;

    data: any[] = [];
    proveedor: any = {};
    selectedProducts: any[] = [];
    submitted: boolean = false;
    cols: any[] = [];
    statuses: any[] = [];
    seleccionado: any = {};
    item: any = {};
    rowsPerPageOptions = [5, 10, 20];
    jugadorModel:Proveedor={};
    nombreModulo: string = 'Módulo de Proveedores';



    constructor(
        private service: ProveedorService,
        private messageService: MessageService
    ) {}



    ngOnInit() {
        this.getDataAll();
        this.cols = [ ];
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
        this.proveedor = {};
        this.proveedor.editar = false;
        this.submitted = false;
        this.clienteDialog = true;
        this.seleccionado = {};
    }

    deleteSelectedProducts() {
        this.deleteProductsDialog = true;
    }

    editProduct(item: any) {
        this.proveedor = { ...item };
        this.clienteDialog = true;
        this.proveedor.editar = true;
    }

    bloqueoCliente(cliente: any) {
        this.deleteProductDialog = true;
        this.proveedor = { ...cliente };
        this.proveedor.cambio_estado = true;
        this.jugadorModel=this.mapearDatos(this.proveedor, true);

    }

    confirmDelete() {
        this.deleteProductDialog = false;
        this.service
            .postEstado(this.proveedor.id)
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
        this.proveedor = {};
        this.jugadorModel = {};
    }

    hideDialog() {
        this.clienteDialog = false;
        this.submitted = false;
    }

    saveProduct() {
        this.submitted = true;
        this.proveedor.user = localStorage.getItem('user_id');
        if (this.proveedor.nombre == undefined || this.proveedor.nombre == '') {
            this.messageService.add({
                severity: 'warn',
                summary: 'Advertencia',
                detail: 'Debe ingresar un Nombre',
                life: 3000,
            });
            return;
        }
        if (this.proveedor.numerodocumento == undefined || this.proveedor.numerodocumento == '') {
            this.messageService.add({
                severity: 'warn',
                summary: 'Advertencia',
                detail: 'Debe ingresar un Nombre de Visitador',
                life: 3000,
            });
            return;
        }

        this.jugadorModel=this.mapearDatos(this.proveedor, false);

        if (this.proveedor.id == undefined) {
            this.crear(this.jugadorModel);
        } else {
            this.actualizar(this.proveedor.id, this.jugadorModel);
        }
        //this.clientes = [...this.clientes];
        this.clienteDialog = false;
        this.proveedor = {};
        this.seleccionado = {};

    }

    crear(item: Proveedor) {
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

    actualizar(id:number, item: Proveedor) {
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


    mapearDatos(jugaodr:any, estado:boolean){
        let model:Proveedor={};
        model.nombre=this.proveedor.nombre.toUpperCase();
        model.numerodocumento=this.proveedor.numerodocumento;
        model.telefono=this.proveedor.telefono;
        if(estado){
            model.estado=!this.proveedor.estado;
        }
        return model
    }
}

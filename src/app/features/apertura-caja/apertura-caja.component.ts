import { Component, ViewChild } from '@angular/core';
import { finalize } from 'rxjs';

import { Table } from 'primeng/table';
import { MessageService } from 'primeng/api';


import {  AperturaCajaService } from 'src/app/core/services/apertura-caja.service';
import { AperturaCaja } from 'src/app/core/interface/AperturaCaja';
import { SelectorBodegaComponent } from 'src/app/shared/components/selector-bodega/selector-bodega.component';


@Component({
    selector: 'app-apertura-caja',
    templateUrl: './apertura-caja.component.html',
    providers: [MessageService],
})
export class AperturaCajaComponent {
    clienteDialog: boolean = false;
    deleteProductDialog: boolean = false;
    deleteProductsDialog: boolean = false;

    data: any[] = [];
    caja: any = {};
    selectedProducts: any[] = [];
    submitted: boolean = false;
    cols: any[] = [];
    statuses: any[] = [];
    seleccionado: any = {};
    item: any = {};
    rowsPerPageOptions = [5, 10, 20];
    posiciones:any[]=[];
    posicion:any={};
    objectModel:AperturaCaja={};
    loading: boolean = false;

    nombreModulo: string = 'Módulo de Apertura de Caja';
    @ViewChild(SelectorBodegaComponent) selectBodega: SelectorBodegaComponent;

    constructor(
        private service: AperturaCajaService,
        private messageService: MessageService
    ) {}



    ngOnInit() {
        this.getDataAll();
        this.cols = [ ];
        this.statuses = [];
    }

    getDataAll() {
        this.data=[];
        this.loading=true;
        setTimeout(() => {
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
            this.loading = false;
        }, 1000);
    }


    openNew() {
        this.caja = {};
        this.caja.editar = false;
        this.submitted = false;
        this.clienteDialog = true;
        this.seleccionado = {};
        this.posicion={};
        this.selectBodega.reiniciarComponente();
    }

    deleteSelectedProducts() {
        this.deleteProductsDialog = true;
    }

    edit(item: any) {
        this.caja = { ...item };
        this.clienteDialog = true;
        this.caja.editar = true;
        this.selectBodega.filtrar(this.caja.bodega_id)
    }

    bloqueoCliente(cliente: any) {
        this.deleteProductDialog = true;
        this.caja = { ...cliente };
        this.caja.cambio_estado = true;
        this.objectModel=this.mapearDatos(this.caja, true);

    }

    confirmDelete() {
        this.deleteProductDialog = false;
        this.service
            .postEstado(this.caja.id)
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
        this.caja = {};
        this.objectModel = {};
    }

    hideDialog() {
        this.clienteDialog = false;
        this.submitted = false;
    }

    save() {
        this.submitted = true;
        this.caja.user_id = localStorage.getItem('user_id');
        if (this.caja.bodega_id == undefined) {
            this.messageService.add({
                severity: 'warn',
                summary: 'Advertencia',
                detail: 'Debe seleccionar una Bodega',
                life: 3000,
            });
            return;
        }
        if (this.caja.monto_inicial == undefined) {
            this.messageService.add({
                severity: 'warn',
                summary: 'Advertencia',
                detail: 'Debe ingresar un Monto Inicial',
                life: 3000,
            });
            return;
        }

        this.objectModel=this.mapearDatos(this.caja, false);

        if (this.caja.id == undefined) {
            this.crear(this.objectModel);
        } else {
            this.actualizar(this.caja.id, this.objectModel);
        }
        //this.clientes = [...this.clientes];
        this.clienteDialog = false;
        this.caja = {};
        this.seleccionado = {};
        this.posicion={};
        this.clienteDialog=false;
    }

    crear(item: AperturaCaja) {
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

    actualizar(id:number, item: AperturaCaja) {
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
        let model:AperturaCaja={};
        model.user_id=this.caja.user_id;
        model.bodega_id=this.caja.bodega_id;
        model.fecha=this.caja.fecha;
        model.monto_inicial=this.caja.monto_inicial;
        model.descripcion=this.caja.descripcion;
        if(estado){
            model.estado=!this.caja.estado;
        }
        return model
    }
}

import { RegistrarClienteComponent } from '../../shared/components/registrar-cliente/registrar-cliente.component';
import { Component, ViewChild } from '@angular/core';
import { finalize } from 'rxjs';

import { Table } from 'primeng/table';
import { MessageService } from 'primeng/api';

import { ClientesService } from 'src/app/core/services/clientes.service';
import { Cliente } from 'src/app/core/interface/Cliente';

@Component({
    selector: 'app-clientes',
    templateUrl: './clientes.component.html',
    providers: [MessageService],
})
export class ClientesComponent {
    clienteDialog: boolean = false;
    deleteProductDialog: boolean = false;
    deleteProductsDialog: boolean = false;

    data: any[] = [];
    cliente: any = {};
    selectedProducts: any[] = [];
    cols: any[] = [];
    statuses: any[] = [];
    seleccionado: any = {};
    item: any = {};
    rowsPerPageOptions = [5, 10, 20];
    posiciones:any[]=[];
    posicion:any={};
    clienteModel:Cliente={};

    nombreModulo: string = 'Módulo de Clientes';
    @ViewChild(RegistrarClienteComponent) registrarClienteComponent!: RegistrarClienteComponent;



    constructor(
        private clienteService: ClientesService,
        private messageService: MessageService
    ) {}



    ngOnInit() {
        this.getDataAll();
        this.cols = [ ];
        this.statuses = [];
    }

    getDataAll() {
        this.clienteService.getAll().subscribe(
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
        this.cliente = {};
        this.registrarClienteComponent.openModal();
    }

    deleteSelectedProducts() {
        this.deleteProductsDialog = true;
    }

    editProduct(item: Cliente) {
        this.registrarClienteComponent.editModal(item);
    }

    bloqueoCliente(cliente: Cliente) {
        this.deleteProductDialog = true;
        this.clienteModel = { ...cliente };
    }

    confirmDelete() {
        this.deleteProductDialog = false;
        this.clienteService
            .postEstado(this.clienteModel.id)
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
        this.clienteModel = {};
    }

    hideDialog() {
        this.clienteDialog = false;
    }



    onGlobalFilter(table: Table, event: Event) {
        table.filterGlobal(
            (event.target as HTMLInputElement).value,
            'contains'
        );
    }

}

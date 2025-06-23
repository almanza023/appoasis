import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { loadavg } from 'os';
import { MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { Cliente } from 'src/app/core/interface/Cliente';
import { ClientesService } from 'src/app/core/services/clientes.service';

@Component({
    selector: 'app-buscar-cliente',
    templateUrl: './buscar-cliente.component.html',
    providers: [MessageService],
})
export class BuscarClienteComponent implements OnInit {
    constructor(
        private clienteService: ClientesService,
        private messageService: MessageService
    ) {}
    clientes: Cliente[] = [];
    clienteDialog: boolean = false;
    loading: boolean = false;

    @Output() itemSeleccionado: EventEmitter<Cliente> =
        new EventEmitter<Cliente>();

    ngOnInit() {}

    openModal() {
        this.clienteDialog = true;
        this.getAll();
    }
    onGlobalFilter(table: Table, event: Event) {
        table.filterGlobal(
            (event.target as HTMLInputElement).value,
            'contains'
        );
    }

    getAll() {
        this.loading=true;
       setTimeout(() => {
        this.clienteService.getAll().subscribe(
            (response) => {
                this.clientes = response.data;
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

    selectCliente(cliente: Cliente) {
        this.clienteDialog = false;
        this.itemSeleccionado.emit(cliente);
    }
}

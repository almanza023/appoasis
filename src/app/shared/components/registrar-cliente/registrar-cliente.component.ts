import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Cliente } from 'src/app/core/interface/Cliente';
import { ClientesService } from 'src/app/core/services/clientes.service';

@Component({
  selector: 'app-registrar-cliente',
  templateUrl: './registrar-cliente.component.html',
  providers: [MessageService],
})
export class RegistrarClienteComponent  {

    constructor(
    private clienteService: ClientesService,
    private messageService: MessageService
  ) { }

  submitted: boolean = false;
  cliente:Cliente={};
  clienteDialog:boolean=false;

  @Output() clienteSeleccionado = new EventEmitter<Cliente>();

  ngOnInit() {

  }

  openModal() {
    this.clienteDialog = true;
    this.cliente = {};
    this.submitted = false;
  }

  editModal(cliente:Cliente){
    this.clienteDialog = true;
    this.cliente=cliente;
  }

  save() {
    this.submitted = true;
    if (this.cliente.nombre == undefined) {
        this.messageService.add({
            severity: 'warn',
            summary: 'Advertencia',
            detail: 'Debe ingresar un Nombre',
            life: 3000,
        });
        return;
    }
    if (this.cliente.numerodocumento == undefined) {
        this.messageService.add({
            severity: 'warn',
            summary: 'Advertencia',
            detail: 'Debe ingresar un Número Documento',
            life: 3000,
        });
        return;
    }

    if (this.cliente.direccion == undefined || this.cliente.direccion == '') {
        this.messageService.add({
            severity: 'warn',
            summary: 'Advertencia',
            detail: 'Debe ingresar una Dirección',
            life: 3000,
        });
        return;
    }



    if (this.cliente.id == undefined) {
        this.crear(this.cliente);
    } else {
        this.actualizar(this.cliente.id, this.cliente);
    }
    //this.clientes = [...this.clientes];
    this.clienteDialog = false;
    this.cliente = {};
    this.clienteDialog=true;
}

crear(item: Cliente) {
    this.clienteService
        .postData(item)
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
                this.cliente=response.data;
                this.clienteSeleccionado.emit(this.cliente);

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

actualizar(id:number, item: Cliente) {
    this.clienteService
        .putData(id, item)
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
}

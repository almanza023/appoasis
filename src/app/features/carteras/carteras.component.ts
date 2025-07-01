import { Component, ViewChild } from '@angular/core';
import { finalize } from 'rxjs';
import { Table } from 'primeng/table';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';
import { CarteraService } from 'src/app/core/services/cartera.service';
import { SelectorClienteComponent } from 'src/app/shared/components/selector-cliente/selector-cliente.component';


@Component({
    selector: 'app-carteras',
    templateUrl: './carteras.component.html',
    providers: [MessageService],
})
export class CarterasComponent {
    clienteDialog: boolean = false;
    data: any[] = [];
    cartera: any = {};
    cols: any[] = [];
    statuses: any[] = [];
    seleccionado: any = {};
    item: any = {};
    response:any={};
    rowsPerPageOptions = [5, 10, 20];
    nombreModulo: string = 'Módulo de Cuentas por Cobrar';

    cliente_id:number=0;
    filtroEstado:number=0;
    estados:any=[
        {id:0 , nombre:"TODOS"},
        {id:1 , nombre:"PENDIENTE"},
        {id:2 , nombre:"PAGADA"},
        {id:3 , nombre:"ANULADA"},

    ]
    loading: boolean = false;
    @ViewChild('clienteFiltro') clienteFiltro: SelectorClienteComponent;
    @ViewChild('carteraCliente') carteraCliente: SelectorClienteComponent;

    constructor(
        private service: CarteraService,
        private router: Router,
        private messageService: MessageService
    ) {}



    ngOnInit() {
        this.buscar();
        this.cols = [ ];
        this.statuses = [];
    }

    buscar(){
        let data:any = {
            cliente_id: this.cliente_id ? this.cliente_id : null,
            estado:this.filtroEstado,
        };
        this.data=[];
        this.loading = true;
        setTimeout(() => {
            this.service.postFilter(data)
        .subscribe(
            (response) => {
                this.data = response.data;
                if(this.data.length==0){
                    this.messageService.add({
                        severity: 'warn',
                        summary: 'Advertencia',
                        detail: "No existen registros",
                        life: 3000,
                    });
                }
                this.loading = false;
            },
            (error) => {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Advertencia',
                    detail: "Error al Consultar datos",
                    life: 3000,
                });
                this.loading = false;
            }

        );
        }, 1000);
    }

    calcularTotalGeneral(){
        let total = 0;
        this.data.forEach((item:any) => {
            total += item.total;
        });
        return total;
    }

    calcularSaldoGeneral(){
        let total = 0;
        this.data.forEach((item:any) => {
            total += item.saldo;
        });
        return total;
    }

    calcularAbonosGeneral(){
        let total = 0;
        this.data.forEach((item:any) => {
            total += item.abonos;
        });
        return total;
    }

    redireccionar(id:string){
        this.router.navigate(['/carteras/registro-pago/'+id]);
    }
    openModal() {
        this.clienteDialog = true;
    }

    onGlobalFilter(table: Table, event: Event) {
        table.filterGlobal(
            (event.target as HTMLInputElement).value,
            'contains'
        );
    }

    calcularSaldo(event:any){
        if(this.cartera.total==undefined || this.cartera.total==0){
            this.cartera.saldo = 0;
            return;
        }
        this.cartera.saldo = Number(this.cartera.total) - Number(event.value);
    }

    buscarCliente(){
        this.clienteDialog = true;
    }
    guardarCartera(){
        if(this.cartera.cliente_id==undefined || this.cartera.cliente_id==''){
            this.messageService.add({
                severity: 'warn',
                summary: 'Advertencia',
                detail: 'Debe seleccionar un cliente',
                life: 3000,
            });
            return;
        }
        if(this.cartera.fecha==undefined || this.cartera.fecha==''){
            this.messageService.add({
                severity: 'warn',
                summary: 'Advertencia',
                detail: 'Debe ingresar una fecha',
                life: 3000,
            });
            return;
        }
        if(this.cartera.total==undefined || this.cartera.total==0){
            this.messageService.add({
                severity: 'warn',
                summary: 'Advertencia',
                detail: 'Debe ingresar un total',
                life: 3000,
            });
            return;
        }
        if(this.cartera.saldo==undefined || this.cartera.saldo==0){
            this.messageService.add({
                severity: 'warn',
                summary: 'Advertencia',
                detail: 'Debe ingresar un saldo',
                life: 3000,
            });
            return;
        }
        this.loading = true;
        setTimeout(() => {
            this.service.postData(this.cartera)
            .pipe(
                finalize(() => {
                    this.loading = false;
                    this.clienteDialog = false;
                    this.buscar();
                })
            )
        .subscribe(
            (response) => {
                this.response = response;
                if(this.response.isSuccess==true){
                    this.messageService.add({
                        severity: 'warn',
                        summary: 'Advertencia',
                        detail: this.response.message,
                        life: 3000,
                    });
                }
                this.loading = false;
            },
            (error) => {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Advertencia',
                    detail: "Error al Consultar datos",
                    life: 3000,
                });
                this.loading = false;
            }

        );
        }, 1000);
    }





}

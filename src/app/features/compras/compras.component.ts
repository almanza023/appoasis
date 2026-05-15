import { Component, ViewChild } from '@angular/core';
import { finalize } from 'rxjs';
import { format } from '@formkit/tempo';

import { Table } from 'primeng/table';
import { ConfirmEventType, ConfirmationService, MessageService } from 'primeng/api';




import { Router } from '@angular/router';
import { ComprasService } from 'src/app/core/services/compras.service';


@Component({
    selector: 'app-compras',
    templateUrl: './compras.component.html',
    providers: [MessageService, ConfirmationService],
})
export class ComprasComponent {
    clienteDialog: boolean = false;
    deleteProductDialog: boolean = false;
    deleteProductsDialog: boolean = false;

    data: any[] = [];
    pedido: any = {};
    selectedProducts: any[] = [];
    submitted: boolean = false;
    cols: any[] = [];
    statuses: any[] = [];
    seleccionado: any = {};
    item: any = {};
    rowsPerPageOptions = [5, 10, 20];
    posiciones:any[]=[];
    posicion:any={};
    detalles: any = [];
    totalpedido:any=0;
    totalcantidad:any=0;
    nombreModulo: string = 'Módulo de Compras';

    //Filtros
    fechaInicial:any;
    fechaFinal:any;
    filtroProveedor:any;
    filtroEstado:any;
    estados:any=[
        {id:0 , nombre:"TODOS"},
        {id:1 , nombre:"CREADA"},
        {id:2 , nombre:"FINALIZADA"},
        {id:3 , nombre:"ANULADA"},
    ];
    loading: boolean = false;


    constructor(
        private service: ComprasService,
        private router: Router,
        private messageService: MessageService,
        private confirmationService: ConfirmationService
    ) {}



    ngOnInit() {
        this.cols = [ ];
        this.statuses = [];

        const hoy = new Date();
        const anioActual = hoy.getFullYear();
        const mesActual = hoy.getMonth();

        this.fechaInicial = format(
            new Date(anioActual, mesActual, 1),
            'YYYY-MM-DD'
        );
        this.fechaFinal = format(
            new Date(anioActual, mesActual + 1, 0),
            'YYYY-MM-DD'
        );
        this.filtroEstado = 0;

        this.buscar();
    }

    getDataAll() {
        this.loading = true;
        this.service.getAll().subscribe(
            (response) => {
                //console.log(response.data);
                this.data = response.data;
                this.loading = false;
            },
            (error) => {
                this.messageService.add({
                    severity: 'warn',
                    summary: 'Advertencia',
                    detail: error.error.data,
                    life: 3000,
                });
                this.loading = false;
            }
        );
    }

    buscar(){
        let data={
            estado:this.filtroEstado,
            fecha_inicio:this.fechaInicial,
            fecha_fin:this.fechaFinal,
            proveedor_id:this.filtroProveedor,
        }
        this.service.postFilter(data)
        .subscribe(
            (response) => {
                this.data = response.data;
            },
            (error) => {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Advertencia',
                    detail: "Error al Consultar datos",
                    life: 3000,
                });
            }
        );
    }

    openNew(id:any) {
        this.router.navigate(['/compras/registro/'+id]); // Redirigir a la lista de pedidos
    }

    confirmEliminarCompra(item: any) {
        this.confirmationService.confirm({
            message: `¿Está seguro de eliminar la compra ${item.id}?`,
            header: 'Confirmación',
            icon: 'pi pi-exclamation-triangle',
            acceptLabel: 'Aceptar',
            rejectLabel: 'Cancelar',
            accept: () => {
                this.eliminarCompra(item.id);
            },
            reject: (type) => {
                switch (type) {
                    case ConfirmEventType.REJECT:
                        break;
                    case ConfirmEventType.CANCEL:
                        break;
                }
            },
        });
    }

    eliminarCompra(compraId: any) {
        const userId = localStorage.getItem('user_id');

        this.loading = true;
        this.service
            .deleteCompra(compraId, userId)
            .pipe(
                finalize(() => {
                    this.loading = false;
                    this.buscar();
                })
            )
            .subscribe(
                (response) => {
                    this.messageService.add({
                        severity: response?.isSuccess ? 'success' : 'warn',
                        summary: response?.isSuccess ? 'Exitoso' : 'Advertencia',
                        detail: response?.message || 'No fue posible eliminar la compra',
                        life: 3000,
                    });
                },
                (error) => {
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Advertencia',
                        detail: error?.error?.message || 'Error al eliminar la compra',
                        life: 3000,
                    });
                }
            );
    }

    deleteSelectedProducts() {
        this.deleteProductsDialog = true;
    }


    bloqueoCliente(cliente: any) {
        this.deleteProductDialog = true;
        this.pedido = { ...cliente };
        this.pedido.cambio_estado = true;


    }

    confirmDelete() {
        this.deleteProductDialog = false;
        this.service
            .postEstado(this.pedido.id)
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
        this.pedido = {};
    }

    hideDialog() {
        this.clienteDialog = false;
        this.submitted = false;
    }

    getPedido(pedido_id:any) {
        this.service.getById(pedido_id)
        .subscribe(
            (response) => {
                //console.log(response.data);
                this.clienteDialog=true;
                this.detalles = response.data.detalles;
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

    calcularTotal() {
        this.totalpedido=this.detalles.reduce(
            (total, detalle) => total + detalle.total_subtotal,
            0
        );
        this.totalcantidad=this.detalles.reduce(
            (total, detalle) => total + detalle.total_cantidad,
            0
        );
        return this.totalpedido;
    }




    onGlobalFilter(table: Table, event: Event) {
        table.filterGlobal(
            (event.target as HTMLInputElement).value,
            'contains'
        );
    }



}

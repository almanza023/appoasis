import { Component, ViewChild } from '@angular/core';
import { finalize } from 'rxjs';
import { format } from "@formkit/tempo"
import { Table } from 'primeng/table';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';
import { VentaService } from 'src/app/core/services/venta.service';


@Component({
    selector: 'app-ventas',
    templateUrl: './ventas.component.html',
    providers: [MessageService],
})
export class VentasComponent {
    clienteDialog: boolean = false;
    deleteProductDialog: boolean = false;
    deleteProductsDialog: boolean = false;

    data: any[] = [];
    venta: any = {};
    submitted: boolean = false;
    cols: any[] = [];
    statuses: any[] = [];
    seleccionado: any = {};
    item: any = {};
    rowsPerPageOptions = [5, 10, 20];
    nombreModulo: string = 'Módulo de Ventas';

    fechaInicial:any;
    fechaFinal:any;
    filtroCliente:string;
    rol:string;
    observaciones:string;
    filtroEstado:number=-1;
    estados:any=[
        {id:-1 , nombre:"TODOS"},
        {id:0 , nombre:"PENDIENTE"},
        {id:1 , nombre:"FACTURADA"},
        {id:2 , nombre:"ANULADA"},
    ]
    loading: boolean = false;
    detalles:any[]=[];
    totalfactura:any=0;
    totalcantidad:any=0;


    constructor(
        private service: VentaService,
        private router: Router,
        private messageService: MessageService
    ) {}



    ngOnInit() {
        this.rol = localStorage.getItem('rol');
        this.buscar();
        this.cols = [ ];
        this.statuses = [];

        this.fechaInicial = format(new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1), "YYYY-MM-DD"); // fecha inicial del mes anterior
        this.fechaFinal = format(new Date(), "YYYY-MM-DD"); // fecha actual

    }

    formatDate(date: Date): string {
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Los meses son 0-indexados
        const year = date.getFullYear();
        return `${year}-${month}-${day}`;
    }

    buscar(){
        let rol = localStorage.getItem('rol');
        if (this.fechaInicial && !this.fechaFinal) {
            this.messageService.add({
                severity: 'warn',
                summary: 'Advertencia',
                detail: 'Si ingresa Fecha Inicial debe ingresar también Fecha Final',
                life: 3000
            });
            return;
        }
        let data:any = {
            fecha_inicio:this.fechaInicial,
            fecha_fin: this.fechaFinal,
            estado: this.filtroEstado,
            rol:localStorage.getItem('rol'),
            cliente_id: this.filtroCliente ? this.filtroCliente : -1,
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
                        detail: "No existen ventas Pendientes",
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

    openNew(id:any) {
        this.router.navigate(['/ventas/registro/'+id]); // Redirigir a la lista de pedidos
    }

    deleteSelectedProducts() {
        this.deleteProductsDialog = true;
    }


    anularVenta(cliente: any) {
        this.deleteProductDialog = true;
        this.venta = { ...cliente };
        this.venta.cambio_estado = true;
        this.venta.user_id=localStorage.getItem('user_id');
        this.venta.observaciones='';
    }

    confirmDelete() {

        if(this.venta.observaciones==undefined || this.venta.observaciones==''){
            this.messageService.add({
                severity: 'error',
                summary: 'Advertencia',
                detail: "Debe ingresar el motivo de anulación",
                life: 3000,
            });
            return;
        }

        this.venta = {
            id: this.venta.id,
            user_id: this.venta.user_id,
            observaciones: this.venta.observaciones
        };

        this.deleteProductDialog = false;
        this.service
            .postEstado(this.venta)
            .pipe(finalize(() => this.buscar()))
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
        this.venta = {};
    }

    hideDialog() {
        this.clienteDialog = false;
        this.submitted = false;
    }

    getVenta(venta_id:any, observacion:string) {
        this.observaciones = observacion;
        this.service.getById(venta_id)
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
        this.totalfactura=this.detalles.reduce(
            (total, detalle) => Number(total) + Number(detalle.total_subtotal),
            0
        );
        this.totalcantidad=this.detalles.reduce(
            (total, detalle) => Number(total) + Number(detalle.total_cantidad),
            0
        );
        return this.totalfactura;
    }




    onGlobalFilter(table: Table, event: Event) {
        table.filterGlobal(
            (event.target as HTMLInputElement).value,
            'contains'
        );
    }

    calcularTotalGeneral() {
        return this.data.reduce(
            (total, venta) => Number(total) + Number(venta.total),
            0
        );
    }




}

import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
    ConfirmationService,
    ConfirmEventType,
    MessageService,
} from 'primeng/api';
import { Table } from 'primeng/table';
import { finalize } from 'rxjs';
import { Cliente } from 'src/app/core/interface/Cliente';
import { ReporteCarteraCliente } from 'src/app/core/interface/ReporteCarteraCliente';


import { CarteraService } from 'src/app/core/services/cartera.service';
import { PdfService } from 'src/app/core/services/pdf.service';
import { SelectorTiPoPagoComponent } from 'src/app/shared/components/selector-tipo-pago/selector-tipo-pago.component';

@Component({
    selector: 'app-registro-pago',
    templateUrl: './registro-pago.component.html',
    providers: [MessageService, ConfirmationService],
})
export class RegistroPagoComponent implements OnInit {
    pagos: any = [];
    nuevoPago: any = {};
    loading: boolean = false;
    cartera_id: string = '';
    cartera: any = {};
    id: string = '';
    @ViewChild('dt') dt: Table | undefined;
    buttonVisible: boolean = true;
    cliente: Cliente = {};
    today:string='';
    visible:boolean=false;
    caja_id: string = '';
    facturas: any = [];
    constructor(
        private carteraService: CarteraService,
        private messageService: MessageService,
        private router: Router,
        private route: ActivatedRoute,
        private confirmationService: ConfirmationService,
        private pdfService:PdfService
    ) {}
    @ViewChild(SelectorTiPoPagoComponent) selectorTipoPago: SelectorTiPoPagoComponent;

    ngOnInit() {
        this.caja_id = localStorage.getItem('caja_id') || '';
        this.today=this.formatDate(new Date());
        this.id = this.route.snapshot.paramMap.get('id');
        this.cartera_id = this.route.snapshot.paramMap.get('id');
        this.nuevoPago.fecha = this.today;
        if (this.cartera_id == '0') {
            this.cartera_id = '';
        } else {
            setTimeout(() => {
                this.getCartera();
            }, 1500);
        }
        this.buttonVisible = true;
    }

    formatDate(date: Date): string {
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Los meses son 0-indexados
        const year = date.getFullYear();
        return `${year}-${month}-${day}`;
    }

    getCartera() {
        if (this.cartera_id != '') {
            this.loading = true;
            setTimeout(() => {
                this.carteraService.getById(this.cartera_id).subscribe(
                    (response) => {
                        this.cartera = response.data;
                        this.pagos = this.cartera.pagos;
                        this.cliente = this.cartera.cliente;
                        this.facturas = this.cartera.ventas;
                        this.visible=true;
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
            }, 2000);
        }
    }

    onGlobalFilter(table: Table, event: Event) {
        table.filterGlobal(
            (event.target as HTMLInputElement).value,
            'contains'
        );
    }

    crearPago() {
        console.log(this.nuevoPago);
        if(this.today == undefined || this.today == ''){
            this.messageService.add({
                severity: 'warn',
                summary: 'Advertencia',
                detail: 'Debe Ingresar una Fecha',
                life: 3500,
            });
            return;
        }
        if(this.nuevoPago.valor == undefined || this.nuevoPago.valor == ''){
            this.messageService.add({
                severity: 'warn',
                summary: 'Advertencia',
                detail: 'Debe Ingresar un Valor',
                life: 3500,
            });
            return;
        }
        if(this.nuevoPago.tipo_pago_id == undefined || this.nuevoPago.tipo_pago_id == ''){
            this.messageService.add({
                severity: 'warn',
                summary: 'Advertencia',
                detail: 'Debe Ingresar un Tipo de Pago',
                life: 3500,
            });
            return;
        }
        this.loading = true;
        this.nuevoPago.cliente_id = this.cliente.id;
        this.nuevoPago.cartera_id = this.cartera_id;
        this.nuevoPago.caja_id = this.caja_id;

        this.nuevoPago.fecha = this.today;
        setTimeout(() => {
            this.carteraService
                .postPagos(this.nuevoPago)
                .pipe(finalize(() => this.getCartera()))
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
                            severity: 'error',
                            summary: 'Advertencia',
                            detail: 'Error al obtener datos',
                            life: 3000,
                        });
                    }
                );
            this.loading = false;
            this.nuevoPago={};
            this.selectorTipoPago.reiniciarComponente();

        }, 2000);
    }

    confirm1() {
        this.confirmationService.confirm({
            message: '¿Está seguro de registrar el Pago?',
            header: 'Confirmación',
            icon: 'pi pi-exclamation-triangle',
            acceptLabel: 'Aceptar', // Texto del botón Aceptar
            rejectLabel: 'Cancelar', // Texto del botón Cancelar
            accept: () => {
                this.crearPago();
            },
            reject: (type) => {
                switch (type) {
                    case ConfirmEventType.REJECT:
                        this.buttonVisible = false;
                        break;
                    case ConfirmEventType.CANCEL:
                        break;
                }
            },
        });
    }

    redireccionarCarteras() {
        this.router
            .navigateByUrl('/', { skipLocationChange: true })
            .then(() => {
                this.router.navigate(['carteras']);
            });
    }

    redireccionar(venta: any) {
        if (venta == '') {
            return;
        }
        this.router
            .navigateByUrl('/', { skipLocationChange: true })
            .then(() => {
                this.router.navigate(['carteras/registro-pago/' + venta]);
            });
    }

    descargarReporte(cartera_id: string) {

        let data: ReporteCarteraCliente = {};
        data.nombre = this.cliente.nombre;
        data.numerodocumento = this.cliente.numerodocumento;
        data.telefono = this.cliente.telefono;
        data.ciudad = this.cliente.ciudad;
        data.pagos = this.pagos.map((pago: any) => ({
            fecha: pago.fecha,
            tipopago: pago.tipo_pago.nombre,
            valor: pago.valor,
        }));
        data.abonos = this.cartera.abonos;
        data.saldo = this.cartera.saldo;
        data.total = this.cartera.total;
        data.facturas= this.facturas;

        this.pdfService.reporteCarteraClientPdf(data);
    }

    getTotalfacturas(): number {
        return this.facturas.reduce((total: number, factura: any) => {
            return total + factura.total;
        }, 0);
    }
    getTotalPagos(): number {
        return this.pagos.reduce((total: number, pago: any) => {
            return total + pago.valor;
        }, 0);
    }

     confirmelimianrPago(pagoId: number) {
        this.confirmationService.confirm({
            message: '¿Está seguro de eliminar el Pago?',
            header: 'Confirmación',
            icon: 'pi pi-exclamation-triangle',
            acceptLabel: 'Aceptar', // Texto del botón Aceptar
            rejectLabel: 'Cancelar', // Texto del botón Cancelar
            accept: () => {
                this.deletePago(pagoId);
            },
            reject: (type) => {
                switch (type) {
                    case ConfirmEventType.REJECT:
                        this.buttonVisible = false;
                        break;
                    case ConfirmEventType.CANCEL:
                        break;
                }
            },
        });
    }

    deletePago(pagoId: number){
        this.carteraService.eliminarPago(pagoId).subscribe({
            next: (response) => {
                this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Pago eliminado correctamente' });
                this.getCartera();
            },
            error: (error) => {
                this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error al eliminar el pago' });
            }
        });
    }
}

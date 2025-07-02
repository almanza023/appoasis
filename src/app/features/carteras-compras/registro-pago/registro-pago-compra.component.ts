import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
    ConfirmationService,
    ConfirmEventType,
    MessageService,
} from 'primeng/api';
import { Table } from 'primeng/table';
import { finalize } from 'rxjs';
import { CarteraCompraService } from 'src/app/core/services/cartera-compra.service';
import { SelectorTiPoPagoComponent } from 'src/app/shared/components/selector-tipo-pago/selector-tipo-pago.component';

@Component({
    selector: 'app-registro-pago-compra',
    templateUrl: './registro-pago-compra.component.html',
    providers: [MessageService, ConfirmationService],
})
export class RegistroPagoCompraComponent implements OnInit {
    pagos: any = [];
    nuevoPago: any = {};
    loading: boolean = false;
    cartera_id: string = '';
    cartera: any = {};
    id: string = '';
    @ViewChild('dt') dt: Table | undefined;
    buttonVisible: boolean = true;
    proveedor: any = {};
    today:string='';
    visible:boolean=false;
    caja_id: string =  '';
    constructor(
        private carteraService: CarteraCompraService,
        private messageService: MessageService,
        private router: Router,
        private route: ActivatedRoute,
        private confirmationService: ConfirmationService
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
                        this.proveedor = this.cartera.proveedor;
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
        this.nuevoPago.proveedor_id = this.proveedor.id;
        this.nuevoPago.cartera_compra_id = this.cartera_id;
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
                this.router.navigate(['carteras-compras']);
            });
    }

    redireccionar(venta: any) {
        if (venta == '') {
            return;
        }
        this.router
            .navigateByUrl('/', { skipLocationChange: true })
            .then(() => {
                this.router.navigate(['carteras-compras/registro-pago/' + venta]);
            });
    }
}

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

import { ProductosService } from 'src/app/core/services/productos.service';
import { VentaService } from 'src/app/core/services/venta.service';
import { BuscarClienteComponent } from '../../../shared/components/buscar-cliente/buscar-cliente.component';
import { RegistrarClienteComponent } from 'src/app/shared/components/registrar-cliente/registrar-cliente.component';
import { SelectorFormaVentaComponent } from 'src/app/shared/components/selector-forma-venta/selector-forma-venta.component';
import { PdfService } from 'src/app/core/services/pdf.service';

@Component({
    selector: 'app-registro-ventas',
    templateUrl: './registro-ventas.component.html',
    providers: [MessageService, ConfirmationService],
})
export class RegistroVentasComponent implements OnInit {
    venta: any = {};
    detallepedido: any = {};
    detalles: any = [];
    productosFiltrados: any[] = [];

    displayDialog: boolean = false; // Variable para controlar la visibilidad del diálogo
    productos: any[] = []; // Lista de productos disponibles para agregar
    today: any; // Inicializa la variable today con la fecha actual
    venta_id: string = '';

    infoVenta: any = {};
    totalpedido: number = 0;
    totalcantidad: number = 0;
    id: string = '';

    pagos: any = [];
    tipopago: any = {};
    loading:boolean=false;
    empresa:any={};
    @ViewChild('dt') dt: Table | undefined;
    buttonVisible: boolean = true;
    cliente:Cliente={};
    descuento:string='';
    @ViewChild(BuscarClienteComponent) buscarClienteComponent: BuscarClienteComponent;
    @ViewChild(RegistrarClienteComponent) registrarClienteComponent: RegistrarClienteComponent;
    @ViewChild(SelectorFormaVentaComponent) selectorFormaVentaComponent: SelectorFormaVentaComponent;

    constructor(
        private productoService: ProductosService,
        private ventaService: VentaService,
        private pdfService: PdfService,
        private messageService: MessageService,
        private router: Router,
        private route: ActivatedRoute,
        private confirmationService: ConfirmationService
    ) {}

    get saldo(): number {
        return (
            this.calcularTotal() -
            this.pagos.reduce((acc, pago) => acc + pago.valor, 0)
        );
    }

    ngOnInit() {
        this.id = this.route.snapshot.paramMap.get('id');
        this.venta_id = this.route.snapshot.paramMap.get('id');
        this.today = this.formatDate(new Date());
        this.getProductos();
        if (this.venta_id == '0') {
            this.venta_id = '';
        } else {
            setTimeout(() => {
                this.getVenta(this.venta_id);
            }, 1500);
        }
        this.getEmpresa();
        this.buttonVisible = true;
    }

    buscarCliente(){
        this.buscarClienteComponent.openModal();
    }

    getEmpresa(){
        if(localStorage.getItem('nombreEmpresa') && localStorage.getItem('nitEmpresa') && localStorage.getItem('direccionEmpresa') && localStorage.getItem('telefonoEmpresa')){
            return;
        }

        this.ventaService.getEmpresa().subscribe(
            (response) => {
                //console.log(response.data);
                this.empresa=response.data;
                localStorage.setItem('nombreEmpresa', this.empresa.nombre);
                localStorage.setItem('nitEmpresa', this.empresa.nit);
                localStorage.setItem('direccionEmpresa', this.empresa.direccion);
                localStorage.setItem('telefonoEmpresa', this.empresa.telefono);

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

    formatDate(date: Date): string {
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Los meses son 0-indexados
        const year = date.getFullYear();
        return `${year}-${month}-${day}`;
    }

    mostrarDialogoProductos() {
        this.venta.fecha = this.today;
        if (this.venta.fecha == undefined || this.venta.fecha == '') {
            this.messageService.add({
                severity: 'warn',
                summary: 'Advertencia',
                detail: 'Debe Seleccionar una Fecha',
                life: 3000,
            });
            return;
        }
        if (this.venta_id == '' || this.venta_id == undefined) {
            this.crear();
        } else {
            this.displayDialog = true;
        }
    }

    agregarProducto(producto: any, cantidad: number, stock_general: number) {
        // if (cantidad > stock_general) {
        //     this.messageService.add({
        //         severity: 'warn',
        //         summary: 'Advertencia',
        //         detail: `La cantidad no puede superar el stock general`,
        //         life: 3000,
        //     });
        //     return;
        // }

        if (cantidad > 0) {
            const detalle = {
                venta_id: this.venta_id,
                descuento: producto.descuento,
                producto_id: producto.id,
                cantidad: cantidad, // Usar la cantidad recibida desde la vista
                precio: producto.precio,
            };
            //console.log(detalle);
            this.crearDetalle(detalle);
            this.descuento = '';
            this.dt.filterGlobal('', 'contains');

        }
    }

    quitarProducto(producto: any, cantidad: number) {
        if (cantidad > 0) {
            const detalle = {
                venta_id: this.venta_id,
                producto_id: producto.id,
                cantidad: cantidad * -1, // Usar la cantidad recibida desde la vista
                precio: producto.precio * -1,
            };
            this.crearDetalle(detalle);
        }
    }

    calcularTotal() {
        this.totalpedido = this.detalles.reduce(
            (total, detalle) => Number(total) + Number(detalle.total_subtotal),
            0
        );
        this.totalcantidad = this.detalles.reduce(
            (total, detalle) => Number(total) + Number(detalle.total_cantidad),
            0
        );
        return this.totalpedido;
    }

    getProductos() {
        this.productoService.getActive().subscribe(
            (response) => {
                //console.log(response.data);
                this.productos = response.data.filter(
                    (producto) => producto.stock_actual > 0
                );
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

    getVenta(venta_id: any) {
        if (venta_id != '') {
            this.loading=true;
            setTimeout(() => {
                this.ventaService
                .getById(venta_id)
                .pipe(finalize(() => this.mapearDatos()))
                .subscribe(
                    (response) => {
                        this.infoVenta = response.data;
                       this.cliente=this.infoVenta.cliente;
                       this.venta=this.infoVenta.venta;
                       this.selectorFormaVentaComponent.filtrar(this.infoVenta.venta.forma_venta);
                       this.venta_id = this.infoVenta.venta.id;

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
    }

    onGlobalFilter(table: Table, event: Event) {
        table.filterGlobal(
            (event.target as HTMLInputElement).value,
            'contains'
        );
    }

    crear() {
        this.loading=true;
        this.venta.user_id = localStorage.getItem('user_id');
        this.venta.fecha = this.today;
        this.venta.cliente_id = this.cliente.id;
        setTimeout(() => {
            this.ventaService
            .postData(this.venta)
            .pipe(finalize(() => this.getVenta(this.venta_id)))
            .subscribe(
                (response) => {
                    let severity = '';
                    let summary = '';
                    if (response.isSuccess == true) {
                        severity = 'success';
                        summary = 'Exitoso';
                        this.venta_id = response.data.id;
                        this.displayDialog = true;
                    } else {
                        severity = 'warn';
                        summary = 'Advertencia';
                        //this.venta_id = response.data.id;
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
            this.loading=false;
        }, 2000);
    }

    crearDetalle(item: any) {
        this.ventaService.postDetalles(item).subscribe(
            (response) => {
                let severity = '';
                let summary = '';
                if (response.isSuccess == true) {
                    severity = 'success';
                    summary = 'Exitoso';
                    this.detalles = response.data;

                    //this.displayDialog = false;
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

    confirmEliminarDetalle(item:any) {
        this.confirmationService.confirm({
            message: '¿Está seguro de eliminar el detalle?',
            header: 'Confirmación',
            icon: 'pi pi-exclamation-triangle',
            acceptLabel: 'Aceptar',
            rejectLabel: 'Cancelar',
            accept: () => {
                this.eliminarDetalle(item);
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

    eliminarDetalle(item:any){
        this.loading=true;
       setTimeout(() => {
        this.ventaService.deleteDetalle(item.id)
        .pipe(finalize(() => this.getVenta(this.venta_id)))
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
                this.loading=false;
            },
            (error) => {
                this.loading=false;
                this.messageService.add({
                    severity: 'warn',
                    summary: 'Advertencia',
                    detail: error.error.data,
                    life: 3000,
                });
            }
        );
       }, 1000);
    }

    mapearDatos() {
        this.venta = this.infoVenta.venta;
        this.detalles = this.infoVenta.detalles;
    }

    finalizarVenta() {
        if(this.venta.forma_venta == '1'){
            if (this.pagos.length === 0) {
                this.messageService.add({
                    severity: 'warn',
                    summary: 'Medios de Pagos',
                    detail: 'Debe agregar al menos un medio de pago',
                    life: 3000,
                });
                return;
            }

            // if (
            //     (this.tipopago.id === 1 &&
            //         this.venta.dineroRecibido === undefined) ||
            //     this.venta.dineroRecibido === 0
            // ) {
            //     this.messageService.add({
            //         severity: 'warn',
            //         summary: 'Dinero Recibido',
            //         detail: 'Debe ingresar el dinero recibido',
            //         life: 3000,
            //     });
            //     return;
            // }

        }
        this.loading=true;
        this.venta.pagos = this.pagos;
        this.venta.total = this.totalpedido;
        this.venta.cantidad = this.totalcantidad;

        setTimeout(() => {
            this.ventaService
            .putData(this.venta_id, this.venta)
            .pipe(
                finalize(() => {
                    setTimeout(() => this.redireccionar(this.venta_id), 2000);
                })
            )
            .subscribe(
                (response) => {
                    let severity = '';
                    let summary = '';
                    if (response.isSuccess) {
                        severity = 'success';
                        summary = 'Venta finalizada con éxito';
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
            this.loading=false;
        }, 2000);
    }

    cancelarFinalizarPedido() {
        this.displayDialog = false; // Cerrar el diálogo de confirmación
    }
    confirm1() {
        this.confirmationService.confirm({
            message: '¿Está seguro de Finalizar la Venta?',
            header: 'Confirmación',
            icon: 'pi pi-exclamation-triangle',
            acceptLabel: 'Aceptar', // Texto del botón Aceptar
            rejectLabel: 'Cancelar', // Texto del botón Cancelar
            accept: () => {
                this.finalizarVenta();
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

    actualizarPedido() {
        this.router
            .navigateByUrl('/', { skipLocationChange: true })
            .then(() => {
                this.router.navigate(['ventas/registro/' + this.venta_id]);
            });
    }

    compararValor() {
        if (this.venta.valor > this.calcularTotal()) {
            this.messageService.add({
                severity: 'warn',
                summary: 'Advertencia',
                detail: 'El valor ingresado excede el total del pedido.',
                life: 3000,
            });
        }
    }
    agregarPago() {
        if (this.tipopago.id == '' || this.tipopago.id == undefined) {
            this.messageService.add({
                severity: 'warn',
                summary: 'Advertencia',
                detail: 'Debe Seleccionar un Tipo de Pago',
                life: 3000,
            });
            return;
        }
        if (this.venta.valor == '' || this.venta.valor == undefined) {
            this.messageService.add({
                severity: 'warn',
                summary: 'Advertencia',
                detail: 'Debe Ingresar un Valor',
                life: 3000,
            });
            return;
        }
        if (this.venta.valor <= 0) {
            this.messageService.add({
                severity: 'warn',
                summary: 'Advertencia',
                detail: 'El valor debe ser mayor que cero.',
                life: 3000,
            });
            return;
        }

        if (this.venta.valor > this.calcularTotal()) {
            this.messageService.add({
                severity: 'warn',
                summary: 'Advertencia',
                detail: 'El valor ingresado excede el total del pedido.',
                life: 3000,
            });
            return;
        }

        this.pagos.push({
            tipopago_id: this.tipopago.id, // Asumiendo que tipopago_id se establece en el componente
            tipo: this.tipopago.nombre, // Asumiendo que tipopago_id se establece en el componente
            valor: this.venta.valor,
        });

        this.venta.valor = 0; // Reiniciar el valor después de agregar el pago
        this.messageService.add({
            severity: 'success',
            summary: 'Éxito',
            detail: 'Pago agregado correctamente.',
            life: 3000,
        });
    }

    quitarPago(pago: any) {
        this.pagos = this.pagos.filter((p) => p !== pago);
        this.messageService.add({
            severity: 'success',
            summary: 'Éxito',
            detail: 'Pago eliminado correctamente.',
            life: 3000,
        });
    }

    agregarPagoTotal() {
        if (!this.tipopago.nombre) {
            this.messageService.add({
                severity: 'warn',
                summary: 'Advertencia',
                detail: 'Debe seleccionar el tipo de pago.',
                life: 3000,
            });
            return;
        }

        const totalPagos = this.pagos.reduce(
            (acc, pago) => acc + pago.valor,
            0
        );
        const saldoPendiente = this.calcularTotal() - totalPagos;

        if (saldoPendiente <= 0) {
            this.messageService.add({
                severity: 'warn',
                summary: 'Advertencia',
                detail: 'No hay saldo pendiente para agregar un pago total.',
                life: 3000,
            });
            return;
        }

        this.pagos.push({
            tipopago_id: this.tipopago.id, // Usar el tipo de pago seleccionado
            tipo: this.tipopago.nombre, // Usar el tipo de pago seleccionado
            valor: saldoPendiente,
        });
    }

    calcularCambio(): number {
        const totalPagos = this.pagos.reduce(
            (acc, pago) => acc + pago.valor,
            0
        );
        const saldoPendiente = this.calcularTotal() - totalPagos;

        if (saldoPendiente < 0) {
            return Math.abs(saldoPendiente); // Retorna el cambio a devolver
        }
        return 0; // No hay cambio si el saldo pendiente es 0 o positivo
    }

    // Implementar la lógica de cambio
    // Si el saldo pendiente es 0 o positivo, no hay cambio
    // Si el saldo pendiente es negativo, hay cambio y se devuelve el valor absoluto del saldo pendiente
    get cambio(): number {
        const saldoPendiente = this.venta.dineroRecibido - this.calcularTotal();
        if (saldoPendiente > 0) {
            this.venta.cambio = Math.abs(saldoPendiente);
            return this.venta.cambio; // Retorna el cambio a devolver
        }
        return 0; // No hay cambio si el saldo pendiente es 0 o positivo
    }

    redireccionarVentas() {
        this.router
            .navigateByUrl('/', { skipLocationChange: true })
            .then(() => {
                this.router.navigate(['ventas']);
            });
    }

    redireccionar(venta: any) {
        if(venta==''){
return;
        }
        this.router
            .navigateByUrl('/', { skipLocationChange: true })
            .then(() => {
                this.router.navigate(['ventas/registro/' + venta]);
            });
    }

    print() {
        const printContent = document.getElementById('factura');
        const windowPrint = window.open('', '', 'width=600,height=400');
        if (windowPrint) {
            windowPrint.document.write(printContent?.innerHTML || '');
            windowPrint.document.close();
            windowPrint.focus();
            windowPrint.print();
            windowPrint.close();
        }
    }

    nuevoCliente(){
        this.registrarClienteComponent.openModal();
        this.registrarClienteComponent.clienteSeleccionado.subscribe((cliente: Cliente) => {
            this.cliente = cliente;
            this.registrarClienteComponent.clienteDialog=false;
            this.registrarClienteComponent.cliente={};
        });
    }

    imprimirFactura(){
        this.pdfService.generateInvoicePDF(this.infoVenta);
    }


}

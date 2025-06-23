import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService, ConfirmEventType, MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { finalize } from 'rxjs';
import { ComprasService } from 'src/app/core/services/compras.service';

import { ProductosService } from 'src/app/core/services/productos.service';
import { SelectorBodegaComponent } from 'src/app/shared/components/selector-bodega/selector-bodega.component';
import { SelectorFormaVentaComponent } from 'src/app/shared/components/selector-forma-venta/selector-forma-venta.component';
import { SelectorProveedorComponent } from 'src/app/shared/components/selector-proveedor/selector-proveedor.component';

@Component({
    selector: 'app-registro-compras',
    templateUrl: './registro-compras.component.html',
    providers: [MessageService, ConfirmationService],
})
export class RegistroComprasComponent implements OnInit {
    compra: any = {};
    detallepedido: any = {};
    detalles: any = [];
    productosFiltrados: any[] = [];

    displayDialog: boolean = false; // Variable para controlar la visibilidad del diálogo
    productos: any[] = []; // Lista de productos disponibles para agregar
    today:any; // Inicializa la variable today con la fecha actual
    compra_id:string="";
    id:string="";

    infoPedido:any={};
    totalcompra:any=0;
    totalcantidad:any=0;

    pendienteDialog:boolean=false;
    pendientes:any=[];
    loading:boolean=false;


    constructor(
        private productoService: ProductosService,
        private service: ComprasService,
        private messageService: MessageService,
        private router: Router,
        private route: ActivatedRoute,
        private confirmationService: ConfirmationService
    ) {}

    @ViewChild(SelectorProveedorComponent) proveedorComponent: SelectorProveedorComponent;
    @ViewChild(SelectorBodegaComponent) bodegaComponent: SelectorBodegaComponent;
    @ViewChild(SelectorFormaVentaComponent) formaPagoComponent: SelectorFormaVentaComponent;

    ngOnInit() {
        this.id = this.route.snapshot.paramMap.get('id');
        this.compra_id = this.route.snapshot.paramMap.get('id');
        this.today = this.formatDate(new Date());
        this.getProductos();
        if(this.compra_id=='0'){
            this.compra_id="";
        }else{
            setTimeout(() => {
                this.getCompra(this.compra_id);
            }, 1500);
        }

    }

    formatDate(date: Date): string {
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Los meses son 0-indexados
        const year = date.getFullYear();
        return `${year}-${month}-${day}`;
    }


    mostrarDialogoProductos() {
        this.compra.fecha=this.today;
        if(this.compra.fecha==undefined || this.compra.fecha==""){
            this.messageService.add({
                severity: 'warn',
                summary: 'Advertencia',
                detail: "Debe Seleccionar una Fecha",
                life: 3000,
            });
            return;
        }
        if(this.compra.proveedor_id==undefined || this.compra.proveedor_id==""){
            this.messageService.add({
                severity: 'warn',
                summary: 'Advertencia',
                detail: "Debe Seleccionar un Proveedor",
                life: 3000,
            });
            return;
        }

        if(this.compra.bodega_id==undefined || this.compra.bodega_id==""){
            this.messageService.add({
                severity: 'warn',
                summary: 'Advertencia',
                detail: "Debe Seleccionar una Bodega",
                life: 3000,
            });
            return;
        }

       if(this.compra_id=="" || this.compra_id==undefined){
        this.crear();
       }else{
        this.displayDialog = true;
       }

    }

    agregarProducto(producto: any) {
        if (producto.precio <= 0 || producto.precio ==undefined) {
            this.messageService.add({
                severity: 'warn',
                summary: 'Advertencia',
                detail: 'El precio de Venta debe ser mayor que cero',
                life: 3000
            });
            return;
        }
        if (producto.precioCompra <= 0 || producto.precioCompra ==undefined) {
            this.messageService.add({
                severity: 'warn',
                summary: 'Advertencia',
                detail: 'El precio de compra debe ser mayor que cero',
                life: 3000
            });
            return;
        }
        if (producto.cantidad <= 0 || producto.precioCompra ==undefined) {
            this.messageService.add({
                severity: 'warn',
                summary: 'Advertencia',
                detail: 'La cantidad debe ser mayor que cero',
                life: 3000
            });
            return;
        }

        if(producto.cantidad>0){
            const detalle = {
                compra_id: this.compra_id,
                producto_id: producto.id,
                cantidad: producto.cantidad, // Usar la cantidad recibida desde la vista
                precio: producto.precioCompra,
                precio_venta: producto.precio,
            };

            this.crearDetalle(detalle);
        }
    }

    quitarProducto(detalle_id:any) {
        this.service.deleteDetalleById(detalle_id)
        .pipe(finalize(() => this.getCompra(this.compra_id)))
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

    calcularTotal() {
        if (this.detalles && this.detalles.length > 0) {
            this.totalcompra = this.detalles.reduce(
                (total, detalle) => total + detalle.total_subtotal,
                0
            );
            this.totalcantidad = this.detalles.reduce(
                (total, detalle) => total + detalle.total_cantidad,
                0
            );
            return this.totalcompra;
        }
        return 0;
    }

    getProductos() {
        this.productoService.getActive().subscribe(
            (response) => {
                //console.log(response.data);
                this.productos = response.data;
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

    getCompra(compra_id:any) {
        this.loading=true;
        setTimeout(() => {
            this.service.getById(compra_id)
        .pipe(finalize(() => this.mapearDatos()))
        .subscribe(
            (response) => {
                //console.log(response.data);
                this.infoPedido = response.data;
                this.totalcantidad='0';
                this.totalcompra='0';
            },
            (error) => {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: "Error al cargar la compra",
                    life: 3000,
                });
            }
        );
        this.loading=false;
        }, 2000);
    }

    onGlobalFilter(table: Table, event: Event) {
        table.filterGlobal(
            (event.target as HTMLInputElement).value,
            'contains'
        );
    }

    crear() {
        this.compra.user_id = localStorage.getItem('user_id');
        this.compra.fecha=this.today;
        this.service.postData(this.compra)
        .pipe(finalize(() => this.getCompra(this.compra_id)))
        .subscribe(
            (response) => {
                let severity = '';
                let summary = '';
                if (response.isSuccess == true) {
                    severity = 'success';
                    summary = 'Exitoso';
                    this.compra_id=response.data.id;
                    this.displayDialog = true;
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

    crearDetalle(item:any) {

        this.service.postDetalles(item)
        .pipe(finalize(() => this.getCompra(this.compra_id)))
        .subscribe(
            (response) => {
                let severity = '';
                let summary = '';
                if (response.isSuccess == true) {
                    severity = 'success';
                    summary = 'Exitoso';
                    this.detalles=response.data;
                    this.displayDialog = false;
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
                    detail: 'Error al Agregar Productos',
                    life: 3000,
                });
            }
        );
    }

    mapearDatos(){
        this.compra=this.infoPedido.compra;
        this.detalles=this.infoPedido.detalles;
        this.proveedorComponent.filtrar(this.infoPedido.compra.proveedor_id);
        this.bodegaComponent.filtrar(this.infoPedido.compra.bodega_id);
        this.formaPagoComponent.filtrar(this.infoPedido.compra.forma_pago);
    }

finalizarPedido() {
    this.loading=true;
    this.compra.total=this.totalcompra;
    this.compra.cantidad=this.totalcantidad;
    this.compra.user_id = localStorage.getItem('user_id');

    setTimeout(() => {
        this.service.putData(this.compra_id, this.compra).subscribe(
            (response) => {
                let severity = '';
                let summary = '';
                if (response.isSuccess) {
                    severity = 'success';
                    summary = 'Compra finalizada con éxito';
                    this.router.navigate(['/compras']); // Redirigir a la lista de pedidos
                } else {
                    severity = 'warn';
                    summary = 'Advertencia';
                    this.pendientes=response.data;
                    this.pendienteDialog=true;
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
                    summary: 'Error',
                    detail: "Error al finalizar la compra",
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
        message: '¿Está seguro de Finalizar la Compra?',
        header: 'Confirmación',
        icon: 'pi pi-exclamation-triangle',
        acceptLabel: 'Aceptar', // Texto del botón Aceptar
        rejectLabel: 'Cancelar', // Texto del botón Cancelar
        accept: () => {
            this.finalizarPedido();
        },
        reject: (type) => {
            switch (type) {
                case ConfirmEventType.REJECT:
                    break;
                case ConfirmEventType.CANCEL:
                    break;
            }
        }
    });
}


actualizarPedido() {
    location.reload(); // Recargar la página
}

crearNuevaCompra(){
    this.router
        .navigateByUrl('/', { skipLocationChange: true })
        .then(() => {
            this.router.navigate(['compras/registro/0']);
        });

        }

}

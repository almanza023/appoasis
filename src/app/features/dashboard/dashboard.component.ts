import { Component, OnInit } from '@angular/core';
import { MenuItem, MessageService } from 'primeng/api';
import { Subscription, finalize } from 'rxjs';
import { LayoutService } from 'src/app/layout/service/app.layout.service';
import { ProductosService } from 'src/app/core/services/productos.service';
import { AperturaCajaService } from 'src/app/core/services/apertura-caja.service';
import { Router } from '@angular/router';
import { MesasService } from 'src/app/core/services/mesas.service';

@Component({
    templateUrl: './dashboard.component.html',
    providers: [MessageService],
})
export class DashboardComponent implements OnInit {

    items!: MenuItem[];
    detalle:any={};
    totalPedidosPendientes: number = 0;
    totalPedidosEntregados: number = 0;
    pedidosActivos: any[] = [];
    rol = localStorage.getItem('rol');
    totalVentasDia: number = 0;
    productosBajosStock: number = 0;
    productosProximosAVencer:any=[];
    optionsDias: any[] = [
        { label: '30 días', value: 30 },
        { label: '60 días', value: 60 },
        { label: '90 días', value: 90 },
        { label: '120 días', value: 120 },
        { label: '180 días', value: 180 },
    ];
    diasFiltrar: number = 180;
    productos:any=[];
    productoTerminados:any=[];

    constructor(
        private service: AperturaCajaService,
         public layoutService: LayoutService,
         public messageService: MessageService,
         private productoService: ProductosService,
         private router: Router,
         ) {

    }

    ngOnInit() {
        this.getDataAll();
        //this.buscarProductosProximosAVencer();
        //this.getProductosInventario();

    }


    nuevaVenta(){
        this.router.navigate(['/ventas/registro/0']);
    }
    verReporteDia() {
        // Implementar navegación al reporte del día
        this.router.navigate(['/reportes/dia']);
    }

    gestionarProductos() {
        this.router.navigate(['/productos']);
    }

    gestionarUsuarios() {
        this.router.navigate(['/usuarios']);
    }

    getDataAll() {
        let rol = localStorage.getItem('rol');
        let user_id = localStorage.getItem('user_id');
        const hoy = new Date();
        const fechaActual = hoy.getFullYear() + '-' +
                           String(hoy.getMonth() + 1).padStart(2,'0') + '-' +
                           String(hoy.getDate()).padStart(2,'0');
        const manana = new Date(hoy);
        manana.setDate(manana.getDate() + 1);
        const fechaSiguiente = manana.getFullYear() + '-' +
                             String(manana.getMonth() + 1).padStart(2,'0') + '-' +
                             String(manana.getDate()).padStart(2,'0');
        let data={
            fecha_inicio:fechaActual,
            fecha_final:fechaSiguiente,
            rol:rol,
            user_id
        };

        this.service.getEstadisticas(data)
        .subscribe(
            (response) => {
                this.detalle = response.data;
                localStorage.setItem('caja_id', response.data.caja_id);
                this.totalPedidosPendientes=response.data.totalPedidos;
                this.totalVentasDia=response.data.totalVentas;
                this.totalPedidosEntregados=response.data.totalPedidosCerrados;
                this.productosBajosStock=response.data.totalProductos;
            },
            (error) => {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Advertencia',
                    detail: "Error al Obtener datos",
                    life: 3000,
                });
            }
        );
    }

    buscarProductosProximosAVencer(){
        let data={
            dias:this.diasFiltrar
        };
        this.productoService.postProductoAVencer(data)
        .subscribe(
            (response) => {
                this.productosProximosAVencer = response.data;
            },
            (error) => {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Advertencia',
                    detail: "Error al Obtener datos",
                    life: 3000,
                });
            }
        );
    }

    getProductosInventario() {
        this.productoService.getProductoInventario().pipe(
            finalize(() => {
                this.getProductosTerminados();
            })
        ).subscribe(
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

getProductosTerminados() {
    // Filter products where stock_actual is 0
    this.productoTerminados = this.productos.filter((producto: any) => producto.stock_actual == 0);
    console.log(this.productoTerminados)
}




}

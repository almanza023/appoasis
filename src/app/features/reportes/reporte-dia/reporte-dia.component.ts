import { Component, SimpleChanges, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ConfirmationService, ConfirmEventType, MessageService } from 'primeng/api';
import { finalize } from 'rxjs';
import { AperturaCajaService } from 'src/app/core/services/apertura-caja.service';
import { PdfService } from 'src/app/core/services/pdf.service';


@Component({
  selector: 'app-reporte-dia',
  templateUrl: './reporte-dia.component.html',
  providers: [MessageService, ConfirmationService],
})
export class ReporteDiaComponent {

    nombreModulo:string="Reporte Día"
     today:any=""
    todayF:any=""
    fecha_cierre:any="";
    data:any={};
    filter:any={};
    historialDialog:boolean=false;
    historial:any=[];
    dataReport:any;
    bloquear:boolean=false;
    loading:boolean=false;
    rol:string="";
    caja_id:string="";



    constructor(
        private service: AperturaCajaService,
        private messageService: MessageService,
        private pdfService: PdfService,
        private confirmationService: ConfirmationService,
        private route: ActivatedRoute,
    ) {}

    ngOnInit(): void {
        this.route.paramMap.subscribe(params => {
            if(params.get('id') =='0'){
                this.caja_id = localStorage.getItem('caja_id');
            }else{
                this.caja_id = params.get('id');
            }
        });
         this.rol = localStorage.getItem('rol');
            this.today = this.formatDate(new Date());
            this.todayF = this.formatDate(new Date(Date.now() + 86400000)); // Sumar 1 día a la fecha actual
            this.filter.fechaInicio = this.today;
            this.filter.fechaFinal = this.todayF;
            this.filter.caja_id = this.caja_id;
            this.getData(this.filter);
    }

    formatDate(date: Date): string {
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Los meses son 0-indexados
        const year = date.getFullYear();
        return `${year}-${month}-${day}`;
    }


    consultar(){
        if(!this.today){
            this.messageService.add({
                severity: 'warn',
                summary: 'Advertencia',
                detail:"Debe seleccionar una Fecha de Inicio",
                life: 3000,
            });
            return;
        }

        if(!this.todayF){
            this.messageService.add({
                severity: 'warn',
                summary: 'Advertencia',
                detail:"Debe seleccionar una Fecha de Final",
                life: 3000,
            });
            return;
        }

        if(!this.caja_id || this.caja_id == null || this.caja_id == undefined){
            this.messageService.add({
                severity: 'warn',
                summary: 'Advertencia',
                detail:"No Existe Caja Abierta",
                life: 3000,
            });
            return;
        }




    }

    getData(item:any) {
        this.data=[];
        this.loading=true;
        setTimeout(() => {
            this.service.postDia(item).subscribe(
                (response) => {
                    //console.log(response.data);
                    this.data = response.data;
                    if(this.data.length==0){
                        this.messageService.add({
                            severity: 'warn',
                            summary: 'Advertencia',
                            detail:"No Existen Datos",
                            life: 3000,
                        });
                        this.loading=false;
                        return;
                    }else{
                        this.dataReport = {
                            caja_id:this.data.caja_id,
                            fecha_inicio:this.data.fecha_inicio,
                            base_inicial:this.data.base_inicial,
                            totalventas:this.data.totalventas,
                            totalgastos:this.data.totalgastos,
                            totalneto:this.data.totalneto,
                            ventas: this.data.ventas.map((v:any) => {
                                return {
                                    id:v.id,
                                    fecha:v.created_at,
                                    total:v.total,
                                }
                            }),
                            gastos: this.data.gastos.map((g:any) => {
                                return {
                                    id:g.id,
                                    tipo:g.tipogasto?.nombre,
                                    fecha:g.created_at,
                                    total:g.valortotal,
                                }
                            }),
                            pagos:this.data.pagos,
                            ventasPorTipo:this.data.ventas.reduce((acc:any, curr:any) => {
                                const exist = acc.find((item:any) => item.forma_venta === curr.forma_venta);
                                if(exist){
                                    exist.total += curr.total;
                                }else{
                                    acc.push({
                                        forma_venta:curr.forma_venta,
                                        nombre:curr.forma_venta == 1 ? "CONTADO" : "CREDITO",
                                        total:curr.total,
                                    });
                                }
                                return acc;
                            },[]),


                        };
                        this.loading=false;
                        console.log(this.dataReport);
                    }

                },
                (error) => {
                    this.messageService.add({
                        severity: 'warn',
                        summary: 'Advertencia',
                        detail:"Error al obtener datos",
                        life: 3000,
                    });
                    this.loading=false;

                }
            );
        }, 2000);
    }


    cerrarCaja(item:any){
        console.log(item);

        this.loading=true;
        let user_id=localStorage.getItem('user_id');
        let data={
            user_id,
            fecha_cierre:this.today,
            caja_id:item.caja_id,
            monto_final:item.totalneto,
            totalgastos:item.totalgastos,
            totalventas:item.totalventasGeneral,
            totalabonos:item.totalabonosefectivo,
            totalpagocompras:item.totalcomprascontado,
            utilidad:item.totalneto,
            ventasefectivo:item.totalventascontado,
            pagosefectivo:item.totalabonosefectivo,
            compracontado:item.totalpagoscompraefectivo
        }

        setTimeout(() => {
        this.service.putData(data.caja_id, data)
        //.pipe(finalize(() => this.getData(this.filter)))
        .subscribe(
            (response) => {
                let severity = '';
                let summary = '';
                if (response.isSuccess == true) {
                    severity = 'success';
                    summary = 'Exitoso';
                    this.bloquear=true;
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
                    detail: "Error al Enviar Datos",
                    life: 3000,
                });
            }
        );
        this.loading=false;
        }, 2000);
    }

    confirm1(item:any) {

        this.confirmationService.confirm({
            message: '¿Está seguro de CERRAR la Caja ?',
            header: 'Confirmación',
            icon: 'pi pi-exclamation-triangle',
            acceptLabel: 'Aceptar', // Texto del botón Aceptar
            rejectLabel: 'Cancelar', // Texto del botón Cancelar
            accept: () => {
                this.cerrarCaja(item);
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

    verHistorialVentas(){
        this.historialDialog=true;
        this.historial=this.data.ventas;
    }

    verHistorialGastos(){
        this.historialDialog=true;
        this.historial=this.data.gastos;
    }


    reloadPage(){
        this.getData(this.filter);
    }

    descargarPDF(){
        this.pdfService.cierreCajaPDF(this.dataReport);
    }

    getTotalPagos(): number {
        let total = 0;
        if (this.dataReport && this.dataReport.pagos.length > 0) {
            total = this.dataReport.pagos.reduce((sum, item) => {
                return sum + item.total;
            }, 0);
        }
        return total;
    }

    descargarImagen(){
        import('html2canvas').then(html2canvas => {
            const element = document.querySelector('.picture'); // Usa una clase específica para las tablas
            if (element) {
            html2canvas.default(element as HTMLElement).then(canvas => {
                const link = document.createElement('a');
                link.href = canvas.toDataURL('image/png');
                link.download = `reporte-dia-${this.today}.png`;
                link.click();
            });
            } else {
            this.messageService.add({
                severity: 'warn',
                summary: 'Advertencia',
                detail: "No se encontraron las tablas para exportar.",
                life: 3000,
            });
            }
        });
    }

}

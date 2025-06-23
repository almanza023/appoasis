
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

//Modulos de la plantilla
import { DropdownModule } from 'primeng/dropdown';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { TableModule } from 'primeng/table';
import { MultiSelectModule } from "primeng/multiselect";
import { ToastModule } from 'primeng/toast';
import { RatingModule } from 'primeng/rating';
import { SelectButtonModule } from 'primeng/selectbutton';
import { InputMaskModule } from "primeng/inputmask";
import { InputNumberModule } from "primeng/inputnumber";
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { AccordionModule } from 'primeng/accordion';
import { KeyFilterModule } from 'primeng/keyfilter';
import { FileUploadModule } from 'primeng/fileupload';
import { DialogModule } from 'primeng/dialog';
import { TabViewModule } from 'primeng/tabview';
import { ToolbarModule  } from 'primeng/toolbar';
import { MessageService } from 'primeng/api';
import { CheckboxModule } from 'primeng/checkbox';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { LoadingComponent } from './loading/loading.component';
import { SelectorFiltroComponent } from './selector-filtro/selector-filtro.component';
import { SelectorEstadoComponent } from './selector-estado/selector-estado.component';

import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { SelectorCategoriaComponent } from './selector-categoria/selector-categoria.component';

import { SelectorTiPoPagoComponent } from './selector-tipo-pago/selector-tipo-pago.component';
import { SelectorTiPoGastoComponent } from './selector-tipo-gasto/selector-tipo-gasto.component';
import { SelectorProveedorComponent } from './selector-proveedor/selector-proveedor.component';
import { SelectorUserComponent } from './selector-user/selector-user.component';
import { SelectorUbicacionComponent } from './selector-ubicacion/selector-ubicacion.component';
import { TicketPosComponent } from 'src/app/shared/components/ticket-pos/ticket-pos.component';
import { SelectorBodegaComponent } from './selector-bodega/selector-bodega.component';
import { TicketCierreCajaComponent } from './ticket-cierre-caja/ticket-cierre-caja.component';
import { TicketPosProductosComponent } from './ticketpos-productos/ticketpos-productos.component';
import { RegistrarClienteComponent } from './registrar-cliente/registrar-cliente.component';
import { BuscarClienteComponent } from './buscar-cliente/buscar-cliente.component';
import { SelectorFormaVentaComponent } from './selector-forma-venta/selector-forma-venta.component';
import { SelectorClienteComponent } from './selector-cliente/selector-cliente.component';

@NgModule({
  declarations: [

    SelectorCategoriaComponent,
    SelectorFiltroComponent,
    SelectorEstadoComponent,
    SelectorProveedorComponent,
    LoadingComponent,
    SelectorUbicacionComponent,
    SelectorTiPoPagoComponent,
    SelectorTiPoGastoComponent,
    SelectorUserComponent,
    SelectorBodegaComponent,
    TicketPosComponent,
    TicketCierreCajaComponent,
    TicketPosProductosComponent,
    RegistrarClienteComponent,
    BuscarClienteComponent,
    SelectorFormaVentaComponent,
    SelectorClienteComponent
  ],
  imports: [
    CommonModule,
    DropdownModule,
    FormsModule, ButtonModule,
    CalendarModule, TableModule,KeyFilterModule,
    ToastModule, RatingModule, MultiSelectModule, SelectButtonModule,
    InputMaskModule, InputNumberModule, InputTextModule, AccordionModule, FileUploadModule,AutoCompleteModule,
    DialogModule, TabViewModule, ToolbarModule, InputTextareaModule, CheckboxModule, ConfirmDialogModule
  ],
  exports: [
    SelectorCategoriaComponent,
    CommonModule, CheckboxModule, InputMaskModule, InputNumberModule, DropdownModule, InputTextModule,
    FormsModule, ButtonModule, CalendarModule, SelectButtonModule, AccordionModule,AutoCompleteModule,
    TableModule, ToastModule, RatingModule, MultiSelectModule,KeyFilterModule, FileUploadModule,
    DialogModule, TabViewModule,
    ToolbarModule, InputTextareaModule, SelectorFiltroComponent,
    SelectorEstadoComponent,
    SelectorProveedorComponent, SelectorTiPoGastoComponent,
    LoadingComponent, SelectorUbicacionComponent, ConfirmDialogModule, SelectorTiPoPagoComponent,
    SelectorBodegaComponent,
    SelectorUserComponent, TicketPosComponent,TicketCierreCajaComponent,TicketPosProductosComponent,
    RegistrarClienteComponent,
    BuscarClienteComponent,
    SelectorFormaVentaComponent,
    SelectorClienteComponent
  ]
})
export class ComponentModule { }

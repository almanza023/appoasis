import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { CarterasComprasComponent } from './carteras-compras.component';
import { RegistroPagoCompraComponent } from './registro-pago/registro-pago-compra.component';


const routes: Routes = [
    { path: '', component: CarterasComprasComponent },
    { path: 'registro-pago-compra/:id', component: RegistroPagoCompraComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CarterasComprasRoutingModule { }

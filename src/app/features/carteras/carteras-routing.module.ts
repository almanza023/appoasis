import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { CarterasComponent } from './carteras.component';
import { RegistroPagoComponent } from './registro-pago/registro-pago.component';


const routes: Routes = [
    { path: '', component: CarterasComponent },
    { path: 'registro-pago/:id', component: RegistroPagoComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CarterasRoutingModule { }

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AperturaCajaComponent } from './apertura-caja.component';
import { VerCajaComponent } from './ver-caja/ver-caja.component';



const routes: Routes = [
    { path: '', component: AperturaCajaComponent },
    { path: 'ver-caja', component: VerCajaComponent },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AperturaCajaRoutingModule { }

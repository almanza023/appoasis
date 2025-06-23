import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VentasComponent } from './ventas.component';
import { RegistroComprasComponent } from '../compras/registro-compras/registro-compras.component';
import { RegistroVentasComponent } from './registro-ventas/registro-ventas.component';



const routes: Routes = [
    { path: '', component: VentasComponent },
    { path: 'registro/:id', component: RegistroVentasComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VentasRoutingModule { }

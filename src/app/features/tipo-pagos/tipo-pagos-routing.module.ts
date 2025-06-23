import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TipoPagosComponent } from './tipo-pagos.component';


const routes: Routes = [{ path: '', component: TipoPagosComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TipoPagoRoutingModule { }

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TipoGastosComponent } from './tipo-gastos.component';


const routes: Routes = [{ path: '', component: TipoGastosComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TipoGastoRoutingModule { }

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BodegasComponent } from './bodegas.component';




const routes: Routes = [{ path: '', component: BodegasComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BodegasRoutingModule { }

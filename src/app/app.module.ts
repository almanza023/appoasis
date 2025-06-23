import { NgModule } from '@angular/core';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { AppLayoutModule } from './layout/app.layout.module';
import { NotfoundComponent } from './shared/components/notfound/notfound.component';
import { SharedModule } from './shared/shared.module';


@NgModule({
    declarations: [
        AppComponent, NotfoundComponent
    ],
    imports: [
        AppRoutingModule,
        SharedModule,
    ],
    providers: [
        { provide: LocationStrategy, useClass: HashLocationStrategy  },
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }

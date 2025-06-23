import { Component, ElementRef, ViewChild } from '@angular/core';
import { MenuItem, MegaMenuItem } from 'primeng/api';
import { LayoutService } from "./service/app.layout.service";


@Component({
    selector: 'app-topbar',
    templateUrl: './app.topbar.component.html'
})
export class AppTopBarComponent {

    items!: MenuItem[];

    @ViewChild('menubutton') menuButton!: ElementRef;

    @ViewChild('topbarmenubutton') topbarMenuButton!: ElementRef;

    @ViewChild('topbarmenu') menu!: ElementRef;

    constructor(public layoutService: LayoutService) { }
    breadcrumbItems: MenuItem[] = [];
    tieredItems: MenuItem[] = [];
    routeItems: MenuItem[] = [];
    nombreUsuario:string="";


    pageIndex: number = 0;
    ngOnInit() {
        this.nombreUsuario=localStorage.getItem('username')
        this.tieredItems = [];
        //this.layoutService.onMenuToggle()
    }
}

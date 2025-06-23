
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-selector-forma-venta',
  templateUrl: './selector-forma-venta.component.html',
})
export class SelectorFormaVentaComponent {

  items:any=[];
  seleccionado:any={};
  @Input() valor:any={};
  @Input() disabled:boolean=false;

  @Output() itemSeleccionado:EventEmitter<any> =new EventEmitter<any>();
  selectedCliente:string="";
  constructor() { }

  ngOnInit(): void {
    this.seleccionado={};
    this.items=[
      {id:1,nombre:'CONTADO'},
      {id:2,nombre:'CREDITO'}
    ]
  }

  onChange(event) {
    this.itemSeleccionado.emit(event.value);
  }

  reiniciarComponente(): void {
    this.seleccionado = {}; // Reiniciar el estado del componente hijo
  }

  filtrar(valor:any) {
    if(valor){
     this.seleccionado= this.items.find(objeto => objeto['id'] == valor);
    }
   }




}

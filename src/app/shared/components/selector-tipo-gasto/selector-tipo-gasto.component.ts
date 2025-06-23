
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TipoGastosService } from 'src/app/core/services/tipo-gastos.service';


@Component({
  selector: 'app-selector-tipo-gasto',
  templateUrl: './selector-tipo-gasto.component.html',
})
export class SelectorTiPoGastoComponent {

  items:any=[];
  seleccionado:any={};
  arraySeleccionado:any=[];
  @Input() valor:any={};
  @Input() disabled:boolean=false;

  @Output() itemSeleccionado:EventEmitter<any> =new EventEmitter<any>();
  selectedCliente:string="";
  constructor(private service: TipoGastosService) { }

  ngOnInit(): void {
    this.getData();
    this.seleccionado={};
  }
  getData(){
    this.service.getActive()
    .subscribe(response => {
      this.items=response.data;
      //console.log(response.data)
      } ,error => {
        //console.log( error.error)
      });
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

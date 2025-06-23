
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CategoriaService } from 'src/app/core/services/categoria.service';
import { TipoGastosService } from 'src/app/core/services/tipo-gastos.service';

@Component({
  selector: 'app-selector-categoria',
  templateUrl: './selector-categoria.component.html',
})
export class SelectorCategoriaComponent {

  items:any=[];
  seleccionado:any={};
  arraySeleccionado:any=[];
  @Input() valor:any={};
  @Input() lider:string;

  @Output() itemSeleccionado:EventEmitter<any> =new EventEmitter<any>();
  selectedCliente:string="";
  constructor(private service: CategoriaService) { }

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

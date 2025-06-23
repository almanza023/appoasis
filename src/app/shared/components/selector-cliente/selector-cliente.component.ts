
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ClientesService } from 'src/app/core/services/clientes.service';


@Component({
  selector: 'app-selector-cliente',
  templateUrl: './selector-cliente.component.html',
})
export class SelectorClienteComponent {

  items:any=[];
  seleccionado:any={};

  @Output() itemSeleccionado:EventEmitter<any> =new EventEmitter<any>();
  selectedCliente:string="";
  constructor(private service: ClientesService) { }

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

  onClear() {
    this.onChange({value: null});
  }




}

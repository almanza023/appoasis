
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ProveedorService } from 'src/app/core/services/proveedor.service';



@Component({
  selector: 'app-selector-proveedor',
  templateUrl: './selector-proveedor.component.html',
})
export class SelectorProveedorComponent {

  items:any=[];
  seleccionado:any={};
  arraySeleccionado:any=[];
  @Input() valor:any={};
  @Input() disabled:boolean=false;
  @Input() lider:string;

  @Output() itemSeleccionado:EventEmitter<any> =new EventEmitter<any>();
  selectedCliente:string="";
  constructor(private service: ProveedorService) { }

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

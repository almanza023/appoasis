
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { UsuarioService } from 'src/app/core/services/usuario.service';


@Component({
  selector: 'app-selector-user',
  templateUrl: './selector-user.component.html',
})
export class SelectorUserComponent {

  items:any=[];
  seleccionado:any={};
  arraySeleccionado:any=[];
  @Input() tipo:number=2;
  @Input() disabled:boolean=false;


  @Output() itemSeleccionado:EventEmitter<any> =new EventEmitter<any>();
  selectedCliente:string="";
  constructor(private service: UsuarioService) { }

  ngOnInit(): void {
    this.getData();
    this.seleccionado={};
  }
  getData(){
    this.service.getActive()
    .subscribe(response => {
      this.items=response.data;
      // Filtrar usuarios por el tipo de rol especificado
      this.items = [{ id: null, nombre: 'TODOS' }, ...this.items.filter(item => item.rol == this.tipo)];
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

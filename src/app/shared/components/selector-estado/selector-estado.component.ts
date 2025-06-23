import { Component, Input, Output, EventEmitter  } from '@angular/core';

@Component({
  selector: 'app-selector-estado',
  templateUrl: './selector-estado.component.html',
  styleUrls: ['./selector-estado.component.scss']
})
export class SelectorEstadoComponent {
  seleccionado:any={};
  @Input() valor:any={};
  @Input() estados:any=[];
 
  @Output() estadoSeleccionado:EventEmitter<any> =new EventEmitter<any>();
  selectedCliente:string="";
  constructor() { }

  ngOnInit(): void {      
    this.seleccionado=this.valor; 
  }
  
  onChange(event) {      
    this.estadoSeleccionado.emit(event.value);
  }
}

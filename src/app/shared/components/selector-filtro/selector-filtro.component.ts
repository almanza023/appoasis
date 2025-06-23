import { Component, OnInit, Output, EventEmitter, SimpleChanges, Input  } from '@angular/core';


@Component({
  selector: 'app-selector-filtro',
  templateUrl: './selector-filtro.component.html',
  styleUrls: ['./selector-filtro.component.scss']
})
export class SelectorFiltroComponent implements OnInit  {

  
  valores:any=[];
  seleccionado:any={};
  @Input() valor:any={};
  @Output() filtroSeleccionado:EventEmitter<any> =new EventEmitter<any>();

  
  constructor() { }
 
  onChange(event) {   
    this.filtroSeleccionado.emit(event.value);        
  }

  ngOnInit(): void {
      this.obtenerEmpresas();     
      this.seleccionado=this.valor;
  }

  obtenerEmpresas(){
  this.valores=[
    { codigo: '1', nombre:"Número Documento", columna:"documento" },
    { codigo: '2', nombre:"Número Contrato", columna:"contrato" },   
  ];
  }
}

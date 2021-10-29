import { Component, Input, OnInit } from '@angular/core';
import { Rutas } from 'src/app/models/rutas';
import { ZonasService } from '../../services/zonas.service';

@Component({
  selector: 'app-ruta-zona',
  templateUrl: './ruta-zona.page.html',
  styleUrls: ['./ruta-zona.page.scss'],
})
export class RutaZonaPage implements OnInit {
  @Input() rutaItem: Rutas;
  constructor(private zonas: ZonasService) { }
  textoBuscarZona = '';
  textoBuscarRuta = '';
  ngOnInit() {
    console.log(this.rutaItem)
  }
  onSearchChangeZona(event){
    console.log(event.detail.value);
    this.textoBuscarZona = event.detail.value;
 
  }

    onSearchChangeRuta(event){
    console.log(event.detail.value);
    this.textoBuscarRuta = event.detail.value;
  }
  zonaRadioButtuon(ev: any){
    const zona = ev.target.value;
console.log(zona)
  }

}

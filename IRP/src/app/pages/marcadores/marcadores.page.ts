import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { MapaService } from 'src/app/services/componentes/mapas/mapa.service';
import { ClientesService } from 'src/app/services/paginas/clientes/clientes.service';
interface Marcadores{
  id:string,
  funcion: string,
  cliente:any,
  color: string,
  nombre: string,
  marker?: mapboxgl.Marker,
  centro?:[number,number]
}


@Component({
  selector: 'app-marcadores',
  templateUrl: './marcadores.page.html',
  styleUrls: ['./marcadores.page.scss'],
})

export class MarcadoresPage implements OnInit {
  @Input() marcadores:Marcadores[];
  
@Input() funcion:string;
textoBuscar = '';
  constructor(public clientes: ClientesService, public mapa: MapaService, public modalCtrl: ModalController) { }

  ngOnInit() {
  console.log(this.marcadores)
  }
  cerrarModal(){
    this.modalCtrl.dismiss();
  }

  onSearchChange(event){

    // alert('h')
     //console.log(event.detail.value);
     this.textoBuscar = event.detail.value;
   }

   
}

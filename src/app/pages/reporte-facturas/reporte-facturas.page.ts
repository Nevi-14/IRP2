import { Component, Input, OnInit } from '@angular/core';
import { GuiasService } from '../../services/guias.service';
import { ModalController } from '@ionic/angular';
import { ActualizaFacLinService } from '../../services/actualizaFacLin';
import { GuiaEntrega } from '../../models/guiaEntrega';
import { PdfService } from 'src/app/services/pdf.service';
import { HttpClient } from '@angular/common/http';
import { GestionCamionesService } from '../../services/gestion-camiones.service';

@Component({
  selector: 'app-reporte-facturas',
  templateUrl: './reporte-facturas.page.html',
  styleUrls: ['./reporte-facturas.page.scss'],
})

export class ReporteFacturasPage implements OnInit {
  @Input() guias :GuiaEntrega[]
  textoBuscar = '';
  constructor(
   public guiasService:GuiasService,
   public modalCtrl:ModalController,
   public actualizaFacLinService: ActualizaFacLinService ,
   public pdfService:PdfService,
   public http:HttpClient,
   public camionesService:GestionCamionesService
  ) { }

  ngOnInit() {

    if(this.guias){


      this.guiasService.guiasArrayRuta = []
      this.guiasService.guiasArrayRuta = this.guias;
    }else{

      this.guiasService.syncGuiasRutaToPtomise('RUTA').then(guias =>{

        this.guiasService.guiasArrayRuta = guias
  
        console.log('guias', guias)
        this.camionesService.syncCamiones();
    
      })

    }

   
   
  }

  cerrarModal(){

    this.modalCtrl.dismiss();
  }

  onSearchChange(event){

    this.textoBuscar = event.detail.value;
  }

 async  retornarFacturas(guia:GuiaEntrega){
  let img = await this.http.get('../assets/islena.png', { responseType: 'blob' }).toPromise();
    this.actualizaFacLinService.syncGetManifiesto(guia.idGuia).then(facturas =>{

      const reader = new FileReader();
      reader.readAsDataURL(img); 
    
     
     reader.onloadend =  () => {
      var base64data = reader.result;          

      this.pdfService.rellenarpdf('test',base64data,guia,facturas).then(pdf =>{
    
        pdf.create().print()
      })
      
    
    };

    })

    




   
  }
}

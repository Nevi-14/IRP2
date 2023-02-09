import { Injectable } from '@angular/core';
import {Img, PageReference, PdfMakeWrapper, Table, TextReference, Txt} from 'pdfmake-wrapper';

// npm i pdfmake-wrapper && npm i pdfmake --save-dev

import { HttpClient } from '@angular/common/http';
import { GuiaEntrega } from '../models/guiaEntrega';
import { GestionCamionesService } from './gestion-camiones.service';
import { Manifiesto } from '../models/manieifiesto';
import { format } from 'date-fns';
import { RutasService } from './rutas.service';



@Injectable({
  providedIn: 'root'
})
export class PdfService {

  constructor(

public http: HttpClient,
public camionesService:GestionCamionesService,
public rutasService:RutasService

  ) { }

  getFormattedDate(date) {


    let year = date.getFullYear();
    let month = (1 + date.getMonth()).toString().padStart(2, '0');
    let day = date.getDate().toString().padStart(2, '0');
  
    return day + '/' + month + '/' + year;
}

 


  async rellenarpdf(titulo,image,guia:GuiaEntrega,facturas:Manifiesto[]){

  await this.camionesService.syncCamionesToPromise().then(resp => {this.camionesService .camiones = resp});
  await this.rutasService.syncRutasToPromise().then(resp => {this.rutasService.rutas = resp});

    let i =  this.camionesService.camiones.findIndex(camion => camion.idCamion == guia.idCamion);
    let r =  this.rutasService.rutas.findIndex(ruta => ruta.RUTA == guia.ruta);
    let choferCamion = '';
    let nombreRuta = '';



if(i >=0){
  choferCamion =  this.camionesService.camiones[i].chofer
}
if(r >=0){
  nombreRuta = this.rutasService.rutas[r].DESCRIPCION
}

    const pdf = new PdfMakeWrapper();
    pdf.pageMargins(20);

    pdf.info({
      title:'Manifiesto '+ guia.idGuia,
      author: 'usuario',
      subject: titulo +' de compra',
  });

    let data = [];


    let header = {
      layout: 'noBorders', // optional
      table: {
      headerRows: 1,
      widths: [ '*', '*' ],
      body: [
        [ { image: image,width: 120}, [

          { text: 'REPORTE DE FACTURAS',bold: true},
          { text: 'RUTA / RESPONSABLE',bold: true},

        ]]
      ]
    }
    }

    let encabezado = {
      layout: 'Borders', // optional
      table: {
      headerRows: 1,
      widths: [ '*', 'auto', '*' ],
      body: [
        [  { text: 'Consecutivo',bold: true}, [

          {text: 'Fecha',bold: true}

        ],[

         {text: 'RUTA',bold: true},
        


        ] ],
        [  guia.idGuia, format( new Date( guia.fecha),'yyy-MM-dd') ,nombreRuta + `(${guia.ruta})` ]
      ]
    }
    }
 
    let chofer = {
      layout: 'Borders', // optional
      table: {
      headerRows: 1,
      widths: [ '*', '*' ],
      body: [
 
        [  { text: 'Chofer',bold: true}, [

          {text: 'Placa',bold: true}

        ] ],
        [ choferCamion, guia.idCamion, ]
      ]
    }
    }

    let body = {
      layout: 'lightHorizontalLines', // optional
      table: {
      headerRows: 1,
      widths: [140, 120,40,140, 30 ],
      body: [
        ['FACTURAS','Condicion de Pago', 'Cliente', 'Nombre Del Cliente', 'N/D']
      ]
    }
    }
 

    for(let a =0; a < facturas.length ; a++){

      body.table.body.push(
        
        [
          
          
          facturas[a].FACTURA,facturas[a].CONDICION_PAGO + ' D', facturas[a].idCliente ,facturas[a].nombre,''],
          
        
        
        
        
        
        )
      if( a == facturas.length -1){
   
    
        pdf.add(
          [
          header,
          [{ text: '', margin: [ 10, 10, 10, 10 ]}],
          encabezado,
          [{ text: '', margin: [ 10, 10, 10, 10 ]}],
          chofer,
          [{ text: '', margin: [ 10, 10, 10, 10 ]}],
          body
          
        ]
      
        );
// margin: [left, top, right, bottom]
        pdf.footer(function(currentPage, pageCount) { 
          return [{text: 'Página ' +' ' +currentPage.toString() + ' de ' + pageCount  +' ' + 'total facturas ' + facturas.length, alignment: 'center', margin:[ 100, 0]}];  }           
          );
        
       return  pdf;
    

      }
    }




 



  }


}
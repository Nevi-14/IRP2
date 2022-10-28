import { Component, OnInit } from '@angular/core';
import { ModalController, PopoverController } from '@ionic/angular';
import { RutaZonaService } from '../../services copy/ruta-zona.service';
import { CalendarioPopoverPage } from '../calendario-popover/calendario-popover.page';

@Component({
  selector: 'app-consultar-facturas',
  templateUrl: './consultar-facturas.page.html',
  styleUrls: ['./consultar-facturas.page.scss'],
})
export class ConsultarFacturasPage implements OnInit {
  textoBuscar = '';
  cliente = null;
  clientes = []
  date = new Date();
  constructor(
   public modalCtrl: ModalController,
   public rutaZonasService: RutaZonaService,
   public popOverCtrl:PopoverController
  ) { }
  testList: any = [
    {testID: 1, testName: " test1", checked: false},
    {testID: 2, testName: " test2", checked: false},
    {testID: 3, testName: "dgdfgd", checked: false},
    {testID: 4, testName: "UricAcid", checked: false}
 ]
 clientList: any = [
  {testID: 1, testName: " client1", checked: false},
  {testID: 2, testName: " client2", checked: false},
  {testID: 3, testName: "client3", checked: false},
 
  

]
selectedArray :any = [];
  ngOnInit() {
    this.cargarListaClientes();
  }

  cerrarModal(){
    this.modalCtrl.dismiss();
  }

  seleccionarCliente($event){
let cliente = $event.detail.value;
 this.cliente = cliente;
  }

  cargarListaClientes(){
    this.cliente = null;
    this.rutaZonasService.syncRutasToPromise().then(resp =>{


      resp.forEach(element => {
        let cliente =
        {Ruta: element.Ruta, Zona: element.Zona,Descripcion:element.Descripcion, checked: false}
        this.clientes.push(cliente)
      });
     
     
    })
 
     //this.unCheckAll();
      }
checkAll(){
  for(let i =0; i <= this.testList.length; i++) {
    this.testList[i].checked = true;
  }
 console.log(this.testList);
}

unCheckAll(){

  for(let i =0; i <= this.testList.length; i++) {
    this.testList[i].checked = false;
  }

}

selectMember(data){
 if (data.checked == true) {
    this.selectedArray.push(data);
  } else {
   let newArray = this.selectedArray.filter(function(el) {
     return el.testID !== data.testID;
  });
   this.selectedArray = newArray;
 }
 console.log(this.selectedArray);
}



  onSearchChange(event){
    this.textoBuscar = event.detail.value;
    
   }
   async calendarioPopover() {
    const popover = await this.popOverCtrl.create({
      component: CalendarioPopoverPage,
      cssClass: 'no-class',
      translucent: true,
      componentProps : {
        fecha:this.date
      }
    });
    await popover.present();
  
    const { data } = await popover.onDidDismiss();
    console.log('onDidDismiss resolved with role', data);
    if(data != undefined){
      this.date  = new Date(data.fecha)
      
    }
   
      
    
  }

}

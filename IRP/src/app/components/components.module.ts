import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './encabezados/header.component';
import { FullScreenComponent } from './mapas/pages/full-screen/full-screen.component';
import { MiniMapaComponent } from './mapas/components/mini-mapa/mini-mapa.component';
import { MapaComponent } from './mapa/mapa.component';



@NgModule({
  declarations: [HeaderComponent,FullScreenComponent,MiniMapaComponent,MapaComponent],
  imports: [
    CommonModule
  ],
  exports: [
    HeaderComponent,FullScreenComponent,MiniMapaComponent,FullScreenComponent,MapaComponent

  ]
})
export class ComponentsModule { }

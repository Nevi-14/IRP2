import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './header/header.component';
import { FullScreenComponent } from '../mapas/pages/full-screen/full-screen.component';
import { MiniMapaComponent } from '../mapas/components/mini-mapa/mini-mapa.component';
import { MarcadoresComponent } from '../mapas/pages/marcadores/marcadores.component';



@NgModule({
  declarations: [HeaderComponent,FullScreenComponent,MiniMapaComponent,MarcadoresComponent],
  imports: [
    CommonModule
  ],
  exports: [
    HeaderComponent,FullScreenComponent,MiniMapaComponent,MarcadoresComponent

  ]
})
export class ComponentsModule { }

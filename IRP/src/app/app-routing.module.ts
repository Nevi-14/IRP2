import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { MapaComponent } from './components/mapa/mapa.component';


const routes: Routes = [
  {
    path: 'log-in',
    loadChildren: () => import('./pages/log-in/log-in.module').then( m => m.LogInPageModule)
  },
  {
    path: '',
    redirectTo: '/log-in',
    pathMatch: 'full'
  },
  {
    path: 'home',
    loadChildren: () => import('./pages/home/home.module').then( m => m.HomePageModule)
  },
  {
    path: 'menu-clientes',
    loadChildren: () => import('./pages/menu-clientes/menu-clientes.module').then( m => m.MenuClientesPageModule)
  },
  {
    path: 'detalle-clientes',
    loadChildren: () => import('./pages/detalle-clientes/detalle-clientes.module').then( m => m.DetalleClientesPageModule)
  },
  {
    path: 'log-in',
    loadChildren: () => import('./pages/log-in/log-in.module').then( m => m.LogInPageModule)
  },
  {
    path: 'rutas',
    loadChildren: () => import('./pages/rutas/rutas.module').then( m => m.RutasPageModule)
  },
  {
    path: 'planificacion-rutas',
    loadChildren: () => import('./pages/planificacion-rutas/planificacion-rutas.module').then( m => m.PlanificacionRutasPageModule)
  },
  {
    path:'**',
    redirectTo: 'mapas'
  },
  {
    path: 'mantenimiento-rutas',
    loadChildren: () => import('./pages/mantenimiento-rutas/mantenimiento-rutas.module').then( m => m.MantenimientoRutasPageModule)
  },
  {
    path: 'ruta-facturas',
    loadChildren: () => import('./pages/ruta-facturas/ruta-facturas.module').then( m => m.RutaFacturasPageModule)
  },
  {
    path: 'cliente-factura',
    loadChildren: () => import('./pages/cliente-factura/cliente-factura.module').then( m => m.ClienteFacturaPageModule)
  },
  
  {
    path: 'marcadores',
    loadChildren: () => import('./pages/marcadores/marcadores.module').then( m => m.MarcadoresPageModule)
  },
  {
    path: 'configuracion-mapa',
    loadChildren: () => import('./pages/configuracion-mapa/configuracion-mapa.module').then( m => m.ConfiguracionMapaPageModule)
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }

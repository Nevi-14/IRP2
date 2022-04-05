import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { MapaComponent } from './components/mapa/mapa.component';
import { InicioPageModule } from './pages/inicio/inicio.module';


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
    path: 'inicio',
    loadChildren: () => import('./pages/inicio/inicio.module').then( m => m.InicioPageModule)
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
    path: 'cliente-factura',
    loadChildren: () => import('./pages/cliente-factura/cliente-factura.module').then( m => m.ClienteFacturaPageModule)
  },
  
  {
    path: 'marcadores',
    loadChildren: () => import('./pages/marcadores/marcadores.module').then( m => m.MarcadoresPageModule)
  },

  {
    path: 'busqueda-mapa',
    loadChildren: () => import('./pages/busqueda-mapa/busqueda-mapa.module').then( m => m.BusquedaMapaPageModule)
  },
  {
    path: 'lista-clientes-ruta-facturas',
    loadChildren: () => import('./pages/lista-clientes-ruta-facturas/lista-clientes-ruta-facturas.module').then( m => m.ListaClientesRutaFacturasPageModule)
  },
  {
    path: 'planificacion-entregas',
    loadChildren: () => import('./pages/planificacion-entregas/planificacion-entregas.module').then( m => m.PlanificacionEntregasPageModule)
  },
  {
    path: 'gestion-camiones',
    loadChildren: () => import('./pages/gestion-camiones/gestion-camiones.module').then( m => m.GestionCamionesPageModule)
  },

  {
    path: 'guia-detalles',
    loadChildren: () => import('./pages/guia-detalles/guia-detalles.module').then( m => m.GuiaDetallesPageModule)
  },
  {
    path: 'lista-guias',
    loadChildren: () => import('./pages/lista-guias/lista-guias.module').then( m => m.ListaGuiasPageModule)
  },
  {
    path: 'lista-clientes-guias',
    loadChildren: () => import('./pages/lista-clientes-guias/lista-clientes-guias.module').then( m => m.ListaClientesGuiasPageModule)
  },
  {
    path: 'servicio-cliente',
    loadChildren: () => import('./pages/servicio-cliente/servicio-cliente.module').then( m => m.ServicioClientePageModule)
  },
  {
    path: 'guias-ruta',
    loadChildren: () => import('./pages/guias-ruta/guias-ruta.module').then( m => m.GuiasRutaPageModule)
  },
  {
    path: 'clientes-rutas',
    loadChildren: () => import('./pages/clientes-rutas/clientes-rutas.module').then( m => m.ClientesRutasPageModule)
  },

  {
    path: 'lista-camiones-modal',
    loadChildren: () => import('./pages/lista-camiones-modal/lista-camiones-modal.module').then( m => m.ListaCamionesModalPageModule)
  },
  {
    path: 'calendario-modal',
    loadChildren: () => import('./pages/calendario-modal/calendario-modal.module').then( m => m.CalendarioModalPageModule)
  },
  {
    path: 'lista-rutas-zonas-modal',
    loadChildren: () => import('./pages/lista-rutas-zonas-modal/lista-rutas-zonas-modal.module').then( m => m.ListaRutasZonasModalPageModule)
  },
  {
    path: 'lista-guias-modal',
    loadChildren: () => import('./pages/lista-guias-modal/lista-guias-modal.module').then( m => m.ListaGuiasModalPageModule)
  },
  {
    path: 'servicio-cliente-marcadores',
    loadChildren: () => import('./pages/servicio-cliente-marcadores/servicio-cliente-marcadores.module').then( m => m.ServicioClienteMarcadoresPageModule)
  },
  {
    path: 'servicio-cliente-marcadores',
    loadChildren: () => import('./pages/servicio-cliente-marcadores/servicio-cliente-marcadores.module').then( m => m.ServicioClienteMarcadoresPageModule)
  },
  {
    path: 'gestor-errores-modal',
    loadChildren: () => import('./pages/gestor-errores-modal/gestor-errores-modal.module').then( m => m.GestorErroresModalPageModule)
  },
  {
    path: 'lista-guias-post',
    loadChildren: () => import('./pages/lista-guias-post/lista-guias-post.module').then( m => m.ListaGuiasPostPageModule)
  },


 
 
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }

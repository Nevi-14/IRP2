import { Injectable } from '@angular/core';
import { PlanificacionEntregas } from '../models/planificacionEntregas';
import { AlertasService } from './alertas.service';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { ConfiguracionesService } from './configuraciones.service';
import { Rutas } from '../models/rutas';
import { ClientesGuia, Guias, Cliente } from '../models/guia';
import {RuteroMH } from '../models/Rutero';
import { GestionCamionesService } from './gestion-camiones.service';
import * as  mapboxgl from 'mapbox-gl';
import { RuteroService } from './rutero.service';
import { AlertController, ModalController } from '@ionic/angular';
import { GuiaEntrega } from '../models/guiaEntrega';
import { Camiones } from '../models/camiones';
import { FacturasNoAgregadasPage } from '../pages/facturas-no-agregadas/facturas-no-agregadas.page';
import { ActualizaFacturaGuia } from '../models/actualizaFacturaGuia';
import { FacturasService } from './facturas.service';
import { Manifiesto } from '../models/manieifiesto';
import { ReporteGuiasPage } from '../pages/reporte-guias/reporte-guias.page';
import { format } from 'date-fns';

@Injectable({
  providedIn: 'root'
})
export class PlanificacionEntregasService {

  // Varibles Globles

  arregloPlanificacionEntrega: PlanificacionEntregas[] = [];
  errorArray = []


  // variables Globales Guias
  listaGuias: Guias[] = [];
  rutas: Rutas[] = []
  rutaZona = null;
  fecha: string;
  clientes: ClientesGuia[] = []
  clientesSinPuntear: RuteroMH[] = []
  facturasOriginal: ClientesGuia[] = []
  cargarMapa: boolean = false;
  guiasGeneradas: GuiaEntrega[] = [];
  complete = 0;
  facturasNoAgregadas: ClientesGuia[] = [];
  continuarRutaOptima = true;
  horaFinalAnterior = null;
  totalSinPuntear = null;
  // Variables proceso de ordenamiento MAURICIO HERRA

  listos: number = 1;
  total: number = 1;
  actual: number = 0;
  menor: number = 0;
  i: number = 0;
  p: number = 0;
  rutero: RuteroMH[] = [];
  ruteros = []
  idGuiasArray = [];
  contadorPost = 0;
  totalFacturas: number = 0;
  pesoTotal: number = 0;
  totalBultos: number = 0;
  volumenTotal: number = 0;
  bultosTotales: number = 0;
  totalClientes: number = 0;





  constructor(
    private modalCtrl: ModalController,
    public alertCtrl: AlertController,
    private http: HttpClient,
    public alertasService: AlertasService,
    public configuracionesService: ConfiguracionesService,
    public gestionCamionesService: GestionCamionesService,
    public facturasService: FacturasService,
    public ruteroService: RuteroService


  ) { }





  limpiarDatos() {
    this.arregloPlanificacionEntrega = [];
    this.errorArray = []

    this.rutas = [];
    this.clientes = [];
    this.facturasOriginal = [];
    this.facturasNoAgregadas = [];

    this.listaGuias = [];


    this.rutaZona = null;
    this.fecha = null;


    this.complete = 0;

    // Variables proceso de ordenamiento MAURICIO HERRA

    this.listos = 1;
    this.total = 1;
    this.actual = 0;
    this.menor = 0;
    this.i = 0;
    this.p = 0;
    this.rutero = [];

    this.ruteros = []
    this.idGuiasArray = [];
    this.contadorPost = 0;
    this.totalFacturas = 0;
    this.pesoTotal = 0;
    this.totalBultos = 0;
    this.volumenTotal = 0;
    this.bultosTotales = 0;
    this.totalClientes = 0;


    this.ruteroService.limpiarDatos();



  }


  getAPI(api: string) {
    let test: string = ''

    if (!environment.prdMode) test = environment.TestURL;
    let URL = this.configuracionesService.company.preURL + test + this.configuracionesService.company.postURL + api;
    this.configuracionesService.api = URL;

    return URL;

  }




  //   GET  POST  PUT APIS

  private getGuiaEstado(estado: string) {
    // GET
    // https://apiirp.di-apps.co.cr/api/Guias/?estado=INI
    // ESTADOS
    // INI: Inicio
    // SYN: Sincronizada
    // RUTA: Ruta
    //FIN: Liquidada
    let test: string = ''
    if (!environment.prdMode) test = environment.TestURL;
    let URL = this.getAPI(environment.guiasURL);
    URL = URL + environment.guiasURLEstadoParam + estado;
    console.log('estado:string', estado)
    console.log('getGuiaEstado', URL)
    return this.http.get<GuiaEntrega[]>(URL);


  }
  private getGuiaEstadoRangoFecha(estado: string, fechaInicio: string, fechaFin: string) {
    // GET
    // http://apiirp.di-apps.co.cr/api/guias-estado-rango-fecha?estado=INI&fechaInicio=2023-01-01&fechaFin=2023-02-20
    // ESTADOS
    // INI: Inicio
    // SYN: Sincronizada
    // RUTA: Ruta
    //FIN: Liquidada
    let test: string = ''
    if (!environment.prdMode) test = environment.TestURL;
    let URL = this.getAPI(environment.guiasRangoFecha);
    URL = URL + estado + environment.fechaInicio + fechaInicio + environment.fechaFin + fechaFin;
    console.log('estado:string, fechaInicio:string,fechaFin:string', estado, fechaInicio, fechaFin)
    console.log('getGuiaEstadoRangoFecha', URL)
    return this.http.get<GuiaEntrega[]>(URL);


  }


  private postGuia(guia: GuiaEntrega) {
    // POST
    // https://apiirp.di-apps.co.cr/api/Guias
    const URL = this.getAPI(environment.guiasURL);
    const options = {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    };
    console.log('guia:GuiaEntrega', guia)
    console.log('postGuia', URL)
    return this.http.post(URL, JSON.stringify(guia), options);

  }

  private putGuia(guia: GuiaEntrega, id: string) {
    // PUT
    // https://apiirp.di-apps.co.cr/api/Guias?ID=20230123CT01V3683
    let URL = this.getAPI(environment.guiasURL);
    URL = URL + environment.idParam + id
    const options = {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    };
    console.log('guia:GuiaEntrega', guia)
    console.log('putGuia', URL)
    return this.http.put(URL, JSON.stringify(guia), options);

  }

  private getManifiestoIdGuia(idGuia: string) {
    // GET
    // https://apiirp.di-apps.co.cr/api/Manifiesto/?ID=20221201AJ01V7718
    let URL = this.getAPI(environment.manifiestoURL);
    URL = URL + idGuia;
    console.log('getManifiestoIdGuia', URL);
    return this.http.get<Manifiesto[]>(URL);
  }

  private getConsultarGuia(id: string) {
    // GET
    // https://apiirp.di-apps.co.cr/api/consultar-guia/?ID=20230123CT01V3683
    let URL = this.getAPI(environment.consultarGuia);
    URL = URL + id;
    console.log('getConsultarGuia', URL);
    return this.http.get<GuiaEntrega[]>(URL);
  }



  syncGetConsultarGuia(id: string) {
    return this.getConsultarGuia(id).toPromise();
  }


  syncGetManifiesto(idGuia: string) {
    return this.getManifiestoIdGuia(idGuia).toPromise();
  }


  getGuiaEstadoToPromise(estado: string) {
    return this.getGuiaEstado(estado).toPromise();
  }

  getGuiaEstadoRangoFechaToPromise(estado: string, fechaInicio: string, fechaFin: string) {
    return this.getGuiaEstadoRangoFecha(estado, fechaInicio, fechaFin).toPromise();
  }

  postGuiaToPromise(guia: GuiaEntrega) {
    return this.postGuia(guia).toPromise();
  }

  putGuiaToPromise(guia: GuiaEntrega) {
    let id = guia.idGuia;
    return this.putGuia(guia, id).toPromise();

  }




  generarIDGuia() {

    let consecutivo = null,
      date = new Date(this.fecha),  // FECHA HOY
      year = date.getFullYear(),  // AÑO
      month = (date.getMonth() + 1).toString().padStart(2, "0"), // MES ACTUAL FORMATO 2 DIGITOS EJEMPLO 01
      day = date.getDate().toString().padStart(2, "0"), // DIA ACTUAL FORMATO FECHA
      ramdomNumber = Math.floor(1000 + Math.random() * 9000);  // DEVUELVE NUMERO ALEATORIO DE 4 DIGITOS
    consecutivo = year + '' + month + '' + day + this.rutaZona.RUTA + 'V' + ramdomNumber; // CONCATENAMOS LOS VALORES Y GENERAMOS CONSECUTIVO

    return consecutivo; // DEVUELVE CONSECUTIVO

  }


  async generarPreListaGuias(camiones: Camiones[]) {
    let data = [];
    for (let i = 0; i < camiones.length; i++) {

      data.push(this.generarGuia(camiones[i]));
      if (i == camiones.length - 1) {


        return data;
      }
    }

  }


  generarGuia(camion: Camiones) {

    let capacidad = camion.capacidadPeso;
    let id = null; //this.generarIDGuia();
    let guia: Guias = {
      idGuia: id,
      guiaExistente: false,
      verificada: false,
      totalFacturas: 0,
      distancia: 0,
      duracion: 0,
      zona: this.rutaZona.RUTA,
      nombreRuta: this.rutaZona.DESCRIPCION,
      ruta: this.rutaZona.RUTA,
      fecha: this.fecha,
      numClientes: 0,
      camion: {
        numeroGuia: id,
        chofer: camion.chofer,
        idCamion: camion.idCamion,
        capacidad: capacidad,
        pesoRestante: capacidad,
        peso: 0,
        estado: 'INI',
        HH: 'nd',
        bultos: 0,
        volumen: camion.capacidadVolumen,
        frio: camion.frio,
        seco: camion.seco,
        HoraInicio: '08:00',
        HoraFin: '20:00'

      },
      clientes: [],
      facturas: []
    }

    return guia;

  }


  async agregarFacturaGuia(idGuia, factura: PlanificacionEntregas) {

    let i = this.listaGuias.findIndex(guia => guia.idGuia == idGuia);
    let cliente: Cliente = {
      id: factura.CLIENTE_ORIGEN,
      idGuia: null,
      cliente: factura.NOMBRE_CLIENTE,
      latitud: factura.LATITUD,
      longitud: factura.LONGITUD,
      distancia: 0,
      duracion: 0,
      direccion: factura.DIRECCION_FACTURA,
      bultosTotales: 0,
      orden_visita: 0,
      HoraInicio: null,
      HoraFin: null
    }

    let noAgregado = {
      id: factura.CLIENTE_ORIGEN,
      idGuia: null,
      nombre: factura.NOMBRE_CLIENTE,
      marcador: null,
      color: null,
      cambioColor: '#00FF00',
      latitud: factura.LATITUD,
      longitud: factura.LONGITUD,
      seleccionado: false,
      cargarFacturas: true,
      frio: false,
      seco: false,
      frioSeco: false,
      totalFrio: 0,
      totalSeco: 0,
      totalBultos: 0,
      totalPeso: 0,
      direccion: factura.DIRECCION_FACTURA,
      facturas: [factura]
    }

    if (i >= 0) {
      this.listaGuias[i].verificada = false;
      cliente.idGuia = this.listaGuias[i].idGuia;
      factura.ID_GUIA = this.listaGuias[i].idGuia;;
      let c = this.listaGuias[i].clientes.findIndex(clientes => clientes.id == factura.CLIENTE_ORIGEN);

      let capacidadCamion = this.listaGuias[i].camion.capacidad;
      let pesoActual = this.listaGuias[i].camion.peso;
      let pesoFactura = factura.TOTAL_PESO;
      let consultarPesoAntesDeAgregarFactura = pesoActual + pesoFactura;


      if (consultarPesoAntesDeAgregarFactura > capacidadCamion) {

        factura.ID_GUIA = null;
        let guia = this.listaGuias.findIndex(guia => guia.idGuia == idGuia);

        if (guia >= 0) {
          if (this.listaGuias[guia].clientes.length == 0 || this.listaGuias[guia].facturas.length == 0) {
            this.listaGuias.splice(guia, 1);

          }
        }

        this.facturasNoAgregadas.push(noAgregado)
      } else if (consultarPesoAntesDeAgregarFactura < capacidadCamion) {

        if (c < 0) {

          this.listaGuias[i].clientes.push(cliente)
          this.listaGuias[i].numClientes += 1;


        }
        let f = this.listaGuias[i].facturas.findIndex(fa => fa.FACTURA == factura.FACTURA);
        if (f < 0) {
          this.listaGuias[i].facturas.push(factura)
          this.listaGuias[i].totalFacturas += 1;
          this.listaGuias[i].camion.bultos += Number(factura.RUBRO1);
          this.listaGuias[i].camion.peso += factura.TOTAL_PESO;
          this.listaGuias[i].camion.pesoRestante = this.listaGuias[i].camion.capacidad - this.listaGuias[i].camion.peso

        }


      }

    }


  }
  async borrarFacturaGuia(factura: PlanificacionEntregas) {
    let i = this.listaGuias.findIndex(guia => guia.idGuia == factura.ID_GUIA);

    if (i >= 0) {
      this.listaGuias[i].verificada = false;
      this.listaGuias[i].camion.peso -= factura.TOTAL_PESO;
      this.listaGuias[i].camion.bultos -= Number(factura.RUBRO1);
      this.listaGuias[i].camion.pesoRestante += factura.TOTAL_PESO
      let facturaEliminar = this.listaGuias[i].facturas.findIndex(fact => fact.CLIENTE_ORIGEN == factura.CLIENTE_ORIGEN)
      if (facturaEliminar >= 0) {
        this.listaGuias[i].facturas[facturaEliminar].ID_GUIA = null;
        this.listaGuias[i].facturas.splice(facturaEliminar, 1)
        this.listaGuias[i].totalFacturas -= 1;
        let cliente = this.listaGuias[i].clientes.findIndex(clientes => clientes.id == factura.CLIENTE_ORIGEN);
        let conteoFacturasCliente = this.listaGuias[i].facturas.filter(cliente => cliente.CLIENTE_ORIGEN == factura.CLIENTE_ORIGEN);

        if (cliente >= 0) {
          if (conteoFacturasCliente.length == 0) {
            this.listaGuias[i].clientes.splice(cliente, 1)
            this.listaGuias[i].numClientes -= 1;

          }
        }

      }




      if (this.listaGuias[i].numClientes == 0 && this.listaGuias[i].totalFacturas == 0) {
        this.listaGuias.splice(i, 1);
      }


    }

    return true
  }


  importarFacturas(factura: PlanificacionEntregas, seleccionado?: boolean) {
    let cliente = {
      id: factura.CLIENTE_ORIGEN,
      idGuia: null,
      nombre: factura.NOMBRE_CLIENTE,
      marcador: null,
      color: null,
      cambioColor: '#00FF00',
      latitud: factura.LATITUD,
      longitud: factura.LONGITUD,
      seleccionado: seleccionado,
      cargarFacturas: true,
      frio: false,
      seco: false,
      frioSeco: false,
      totalFrio: 0,
      totalSeco: 0,
      totalBultos: 0,
      totalPeso: 0,
      direccion: factura.DIRECCION_FACTURA,
      facturas: [factura]
    }
    let c = this.clientes.findIndex(client => client.id == factura.CLIENTE_ORIGEN);
    factura.SELECCIONADO = true;
    if (c >= 0) {
      this.cargarMapa = true;
      let facturaIndex = this.clientes[c].facturas.findIndex(fact => fact.FACTURA == factura.FACTURA)
      this.clientes[c].seleccionado = seleccionado ? seleccionado : false;
      if (facturaIndex < 0) {

        this.clientes[c].facturas.push(factura);

      } else {

        this.clientes[c].facturas[facturaIndex].SELECCIONADO = true;
      }

    } else {
      this.totalFacturas += 1;
      this.clientes.push(cliente)
    }

    this.clientes.forEach(cliente => {
      cliente.totalBultos = 0;
      cliente.totalPeso = 0;

      let frio = cliente.facturas.filter(f => f.FRIO_SECO == 'F').length
      let seco = cliente.facturas.filter(f => f.FRIO_SECO == 'N').length

      cliente.totalSeco = seco;
      cliente.totalFrio = frio;
      cliente.frio = frio > 0 ? true : false
      cliente.seco = seco > 0 ? true : false
      cliente.frioSeco = frio > 0 && seco > 0 ? true : false
      cliente.color = frio > 0 ? '#0000FF' : '#eed202'


      for (let f = 0; f < cliente.facturas.length; f++) {

        cliente.totalBultos += Number(cliente.facturas[f].RUBRO1);
        cliente.totalPeso += cliente.facturas[f].TOTAL_PESO;

        if (f == cliente.facturas.length - 1) {

          this.actualizarTotales();
        }
      }


    })


  }


  actualizarTotales() {

    this.totalFacturas = 0;
    this.pesoTotal = 0;
    this.totalBultos = 0;
    this.volumenTotal = 0;
    this.bultosTotales = 0;
    this.totalClientes = 0;
 this.totalSinPuntear = 0;
    this.clientes.forEach(clientes => {
      if(!clientes.longitud || !clientes.latitud) this.totalSinPuntear ++
      if (clientes.seleccionado) {
        let facturas = clientes.facturas;
        facturas.forEach(factura => {
          this.pesoTotal += factura.TOTAL_PESO;
          this.volumenTotal += factura.TOTAL_VOLUMEN;
          this.totalClientes = this.clientes.length;
          this.totalBultos += Number(factura.RUBRO1);
          this.bultosTotales += Number(factura.RUBRO1);
          this.totalFacturas += 1;

        })
      }
    })
  }

  borrarGuia(idGuia) {

    let i = this.listaGuias.findIndex(guia => guia.idGuia == idGuia);

    if (i >= 0) {
      this.listaGuias.splice(i, 1);
    }

  };
  borrarCliente(cliente: ClientesGuia) {

    for (let f = 0; f < cliente.facturas.length; f++) {
      if (cliente.facturas[f].ID_GUIA) {
        cliente.facturas[f].ID_GUIA = null;
        console.log(this.listaGuias)
        this.borrarFacturaGuia(cliente.facturas[f])
      }
      if (f == cliente.facturas.length - 1) {
        // this.clientes.splice(i,1)

      }


    }

  }
  async importarClientes(facturas: PlanificacionEntregas[]) {
    let data: ClientesGuia[] = [];


    facturas.forEach(factura => {
      let cliente = {
        id: factura.CLIENTE_ORIGEN,
        idGuia: null,
        nombre: factura.NOMBRE_CLIENTE,
        marcador: null,
        color: null,
        cambioColor: '#00FF00',
        latitud: factura.LATITUD,
        longitud: factura.LONGITUD,
        seleccionado: false,
        cargarFacturas: true,
        frio: false,
        seco: false,
        frioSeco: false,
        totalFrio: 0,
        totalSeco: 0,
        totalBultos: 0,
        totalPeso: 0,
        direccion: factura.DIRECCION_FACTURA,
        facturas: [factura]
      }
      let c = data.findIndex(client => client.id == factura.CLIENTE_ORIGEN);
      if (c >= 0) {
        let f = data[c].facturas.findIndex(fact => fact.FACTURA == factura.FACTURA)
        if (f < 0) {
          data[c].facturas.push(factura)
        }
      } else {
        data.push(cliente)
      }

      cliente.totalBultos += Number(factura.RUBRO1)
      cliente.totalPeso += Number(factura.TOTAL_PESO)
      let frio = cliente.facturas.filter(f => f.FRIO_SECO == 'F').length
      let seco = cliente.facturas.filter(f => f.FRIO_SECO == 'N').length

      cliente.totalSeco = seco;
      cliente.totalFrio = frio;
      cliente.frio = frio > 0 ? true : false
      cliente.seco = seco > 0 ? true : false
      cliente.frioSeco = frio > 0 && seco > 0 ? true : false
      cliente.color = frio > 0 ? '#0000FF' : '#eed202'


    })
    return data;

  }
  async llenarRutero(guia: Guias) {
    this.continuarRutaOptima = true;
    this.alertasService.presentaLoading('Calculando ruta optima...')
    this.rutero = [];
    this.clientesSinPuntear = [];



    let item = new RuteroMH(0, guia.idGuia, this.configuracionesService.company.company, this.configuracionesService.company.latitud, this.configuracionesService.company.longitud, 0, 0, '', 0, 0, true, null, null);
    this.rutero.push(item);
    for (let i = 0; i < guia.clientes.length; i++) {

      let cliente = guia.clientes[i];
   

 
      item = new RuteroMH(cliente.id, guia.idGuia, cliente.cliente, cliente.latitud, cliente.longitud, cliente.distancia, cliente.duracion, cliente.direccion, cliente.bultosTotales, cliente.orden_visita, false, null, null);
      if (cliente.latitud && cliente.longitud) {
        this.rutero.push(item);
      } else {
        this.clientesSinPuntear.push(item);
      }


      if (i == guia.clientes.length - 1) {

        if (this.rutero.length == 0) {
        //  this.alertasService.loadingDissmiss();
       return  this.funcionClientesSinPuntear()
          
        }
        this.ordenaMH(0, guia)
        console.log('Rutero: ', this.rutero);

      }

    }


  }


  ordenaMH(a: number, guia) {

    let m: number;
    let o: number;

    this.getDistancia(a)
      .then(x => console.log(x, 'final'))
      .then(x => {
        m = this.calcularMenor();
        console.log(m);
        this.rutero[m].asignado = true;
        o = this.sumarOrdenados();
        this.rutero[m].orden_visita = o


        if (o < this.rutero.length - 1) {
          this.ordenaMH(m, guia);
        }
        if (o == this.rutero.length - 1) {

          this.rutero.sort((a, b) => a.orden_visita - b.orden_visita)

          console.log('this.rutero', this.rutero)
          //   return
          this.agregarTiempo(guia);



        }
      }, error => {
        this.alertasService.loadingDissmiss();
        this.alertasService.message('IRP', 'Lo sentimos algo salio mal.')

      })

  }


  async getDistancia(a: number) {
    // NOS AYUDA ENCONTRAR LA DISTANCIA Y DURACION

    let start: string;
    let end: string;
    let URL: string;
    console.log(URL);

    for (let i = 1; i < this.rutero.length; i++) {
      if (!this.rutero[i].asignado) {
        start = this.rutero[a].longitud + ',' + this.rutero[a].latitud;
        end = this.rutero[i].longitud + ',' + this.rutero[i].latitud;
        URL = `https://api.mapbox.com/directions/v5/mapbox/driving/${start};${end}?steps=true&geometries=geojson&access_token=${mapboxgl.accessToken}`;
        console.log('ettt2', a, this.rutero[a], URL, 'URL')
        const query = await fetch(
          URL,
          { method: 'GET' }
        );
        const json = await query.json();

        if (json.routes) {
          this.rutero[i].distancia = Number((json.routes[0].distance / 1000).toFixed(2));

          this.rutero[i].duracion = Number((json.routes[0].duration / 60).toFixed(2));
        }
      }

    }





    return this.rutero;
  }

  calcularMenor() {
    let menor: number = 100000;
    let indice: number = 0;

    for (let i = 0; i < this.rutero.length; i++) {
      if (!this.rutero[i].asignado) {
        if (this.rutero[i].distancia < menor) {
          menor = this.rutero[i].distancia;
          indice = i;
        }
      }
    }
    return indice;
  }



  sumarOrdenados() {
    let c: number = 0;

    this.rutero.forEach(x => {
      if (x.asignado) {
        c += 1;
      }
    });
    return c - 1;
  }

  async agregarTiempo(guia: Guias) {

    let start = guia.camion.HoraInicio.substring(0, 2)
    let end = guia.camion.HoraFin.substring(0, 2)


    for (let t = 1; t < this.rutero.length; t++) {

      let date = new Date(guia.fecha);
      let defaultStartTime = new Date(guia.fecha);
      let defaultEndTime = new Date(guia.fecha);

      if (t == 1) {

        defaultStartTime.setHours(Number(start))
        defaultStartTime.setMinutes(date.getMinutes() + Number(this.rutero[t].duracion.toFixed(0)));
        defaultEndTime.setHours(defaultStartTime.getHours())
        defaultEndTime.setMinutes(defaultStartTime.getMinutes() + 20);

      } else {
        defaultStartTime.setHours(this.rutero[t - 1].HoraFin.getHours())
        defaultStartTime.setMinutes(this.rutero[t - 1].HoraFin.getMinutes() + Number(this.rutero[t].duracion.toFixed(0)));
        defaultEndTime.setHours(defaultStartTime.getHours())
        defaultEndTime.setMinutes(defaultStartTime.getMinutes() + 20);
      }


      if (defaultStartTime.getHours() >= Number(end) && this.continuarRutaOptima || defaultEndTime.getHours() >= Number(end) && this.continuarRutaOptima) {
        this.alertasService.loadingDissmiss();

        const subHeader = 'Ups!. ha excedido el tiempo limite de la guia, ¿Como desea proceder?';

        const alert = await this.alertCtrl.create({
          header: 'Alerta IRP',
          subHeader: subHeader,
          cssClass: 'custom-alert',
          mode: 'ios',
          buttons: [

            {
              text: 'Continuar con la guia',
              cssClass: 'alert-button-dark',
              handler: () => {
                this.continuarRutaOptima = false;
                this.horaFinalAnterior = guia.camion.HoraFin;
                this.agregarTiempo(guia)
                alert.dismiss();
              }
            },
            {
              text: 'Crear nueva guia',
              cssClass: 'alert-button-dark',
              handler: () => {
                guia.verificada = true;
                let remaining = this.rutero.splice(t);
                this.horaFinalAnterior = null;
                // Para revemover los que exceden de la guia this.rutero.splice(t);
                this.gestionCamionesService.syncCamionesToPromise().then(resp => {
                  let facturas = [];
                  remaining.forEach(cliente => {

                    let facturasCliente = guia.facturas.filter((b) => { return b.CLIENTE_ORIGEN == Number(cliente.id); });
                    facturas.push(...facturasCliente);

                  })

                  facturas.forEach((factura, index) => {
                    this.borrarFacturaGuia(factura)
                    if (index == facturas.length - 1) {
                      this.facturaNoAgregadas(facturas)
                   return   this.funcionClientesSinPuntear()

                    }


                  })
                })




              }
            }
          ]
        })

        await alert.present();
      
        return
      }

      console.log('start', defaultStartTime);
      console.log('end', defaultEndTime);
      this.rutero[t].HoraInicio = defaultStartTime;
      this.rutero[t].HoraFin = defaultEndTime;

      if (t == this.rutero.length - 1) {
        guia.verificada = true;
        if (!this.continuarRutaOptima) {
          guia.camion.HoraFin = String(this.rutero[this.rutero.length - 1].HoraFin.getHours()).padStart(2, '0') + ':' + String(this.rutero[this.rutero.length - 1].HoraFin.getMinutes()).padStart(2, '0')
        }
        console.log('end asigning time')
         return this.funcionClientesSinPuntear()
    
      }
    }
  }

  async presentarAlertaFacturas(facturas, subHeader) {

    const alert = await this.alertCtrl.create({
      header: 'Alerta IRP',
      subHeader: subHeader,
      cssClass: 'custom-alert',
      mode: 'ios',
      buttons: [

        {
          text: 'Cambiar La Hora Inicio y Fin en la guia',
          cssClass: 'alert-button-dark',
          handler: () => {

            alert.dismiss();
          }
        },
        {
          text: 'Crear nueva guia',
          cssClass: 'alert-button-dark',
          handler: () => {
            this.facturaNoAgregadas(facturas)
            console.log('new')
          }
        }
      ]
    })

    await alert.present();

  }
  async facturaNoAgregadas(facturas) {
    const modal = await this.modalCtrl.create({
      component: FacturasNoAgregadasPage,
      cssClass: 'ui-modal',
      componentProps: {
        facturas: await this.importarClientes(facturas)
      }
    })
    await modal.present();

  }

  async funcionClientesSinPuntear() {

 if(this.clientesSinPuntear.length == 0){
  return this.exportarRuteros();
  
 }
    for (let i = 0; i < this.clientesSinPuntear.length; i++) {
      let cliente = this.clientesSinPuntear[i];
      let index = this.rutero.findIndex(client => client.id == cliente.id)
      if (index < 0) {
        cliente.orden_visita = this.rutero.length
        this.rutero.push(cliente)
      }
      if (i == this.clientesSinPuntear.length - 1) {
      return   this.exportarRuteros();
      }
    }



  }

  async exportarRuteros() {
    let distancia = 0;
    let duracion = 0;
    for (let i = 0; i < this.rutero.length; i++) {
      distancia += this.rutero[i].distancia
      duracion += this.rutero[i].duracion
      if (i == this.rutero.length - 1) {
        let index = this.listaGuias.findIndex(guia => guia.idGuia == this.rutero[i].idGuia)
        if (index >= 0) {
          this.listaGuias[index].clientes = [];
          this.listaGuias[index].distancia = distancia;
          this.listaGuias[index].duracion = duracion;
          this.listaGuias[index].clientes = this.rutero.slice(1);
        }
      }
      if (i == this.rutero.length - 1) {
        this.alertasService.loadingDissmiss();
        console.log('finish exporting')
        return this.rutero;

      }
    }

  }
  exportarGuias() {

    this.idGuiasArray = [];

    let verificarGuias = this.listaGuias.filter(guia => guia.verificada == false);
    if (verificarGuias.length > 0) {
      this.alertasService.message('Planificación de entregas', 'Ups!. Todas las guias deben de ser verificadas!. Guias pendientes : ' + verificarGuias.length)

      return
    }

    for (let i = 0; i < this.listaGuias.length; i++) {

      if (this.listaGuias[i].verificada) {
        let guia = this.listaGuias[i];
        let facturas = [];
        this.listaGuias[i].facturas.forEach(factura => {
          facturas.push(factura)
        })

        let rutero = this.listaGuias[i].clientes;
        console.log('guia', guia)
        console.log('facturas', facturas)
        console.log('rutero', rutero)
        this.completePost(guia, facturas, rutero);
      }

    }

  }


 async completePost(guia: Guias, facturas: PlanificacionEntregas[], ruteros: Cliente[]) {
  this.alertasService.presentaLoading('Guardando guias..')
    let postFacturas = [];
    let postRutero = [];
    let putRutero = [];

    let fecha = new Date(format(new Date(guia.fecha), 'yyy-MM-dd')).toISOString();
    let guiaaa: GuiaEntrega = {
      idGuia: guia.idGuia,
      fecha: fecha,
      zona: guia.zona,
      ruta: guia.ruta,
      idCamion: guia.camion.idCamion,
      numClientes: guia.clientes.length,
      peso: guia.camion.peso,
      estado: '',
      HH: '',
      volumen: 0
    }
    this.guiasGeneradas.push(guiaaa)
    const guiaCamion: GuiaEntrega = {
      idGuia: guia.idGuia,
      fecha: fecha,
      zona: guia.zona,
      ruta: guia.ruta,
      idCamion: guia.camion.idCamion,
      numClientes:  guia.clientes.length,
      peso: guia.camion.peso,
      estado: guia.camion.estado,
      HH: guia.camion.HH,
      volumen: guia.camion.volumen
    }

    this.idGuiasArray.push(guiaCamion.idGuia)

    for (let i = 0; i < facturas.length; i++) {

      const actualizarFactura: ActualizaFacturaGuia = {
        numFactura: facturas[i].FACTURA,
        tipoDocumento: facturas[i].TIPO_DOCUMENTO,
        Fecha: new Date(),
        despachado: 'S',
        rubro3: guia.idGuia,
        U_LATITUD: facturas[i].LATITUD,
        U_LONGITUD: facturas[i].LONGITUD,
        Fecha_Entrega: facturas[i].FECHA_ENTREGA,
        U_ESTA_LIQUIDADO: 'N',

      }
      postFacturas.push(actualizarFactura)
    }

    for (let j = 0; j < ruteros.length; j++) {

      console.log(ruteros[j].distancia)

      const rut = {
        idGuia: guia.idGuia,
        idCliente: ruteros[j].id,
        nombre: ruteros[j].cliente,
        direccion: ruteros[j].direccion,
        latitud: ruteros[j].latitud,
        longitud: ruteros[j].longitud,
        checkin: null,
        latitud_check: null,
        longitud_check: null,
        observaciones: null,
        estado: 'P',
        bultos: ruteros[j].bultosTotales,
        checkout: null,
        distancia: ruteros[j].distancia,
        Duracion: ruteros[j].duracion,
        orden_Visita: ruteros[j].orden_visita
      }
   
    //  if(this.rutero[j].cliente)

    let ruterosExistentos = await this.ruteroService.syncRutero(guia.idGuia);
    let r = ruterosExistentos.findIndex(rutero => rutero.idCliente == rut.idCliente);

      
   if(r >=0){
    putRutero.push(rut)
   }else{
    postRutero.push(rut)
   }

      if (j === ruteros.length - 1) {
    
        console.log(postRutero, 'postRutero')
        console.log(putRutero, 'putRutero')
        console.log(postFacturas, 'postFacturas')
      
        let index = this.listaGuias.findIndex(filtrar => filtrar.idGuia == guia.idGuia);
        if (index >= 0) {
          //   this.listaGuias.splice(index,1)

          if (this.listaGuias[index].guiaExistente) {
            this.putGuiaToPromise(guiaCamion).then(resp => {  
              if(postRutero.length > 0){
                this.ruteroService.insertarPostRutero(postRutero).then(resp =>{
                  if(putRutero.length == 0){
            if(postFacturas.length > 0){
              this.facturasService.insertarFacturas(postFacturas).then(resp => {
                this.complete += 1;
                console.log('completado')
  
                if (this.complete == this.listaGuias.length) {
                  this.guiasPost();
                  this.limpiarDatos();
                  this.alertasService.loadingDissmiss();
                }
              });
            }
                    return
                  }
                  for(let r = 0;  r < putRutero.length ; r++){
                    this.ruteroService.putRuteroToPromise(putRutero[r]).then(resp => {
               console.log('ruteto actualziado', resp)
  
                    }, error =>{
                      console.log('error actualizando rutero', error, putRutero[r])
                   
                        
                    })
                    if(r == putRutero.length -1){
                      if(postFacturas.length > 0){
                      this.facturasService.insertarFacturas(postFacturas).then(resp => {
                        this.complete += 1;
                        console.log('completado')
      
                        if (this.complete == this.listaGuias.length) {
                          this.guiasPost();
                          this.limpiarDatos();
                          this.alertasService.loadingDissmiss();
                        }
                      });
                    }
  
                    }
                  }
                })
              }else{
              if(postFacturas.length > 0){
                this.facturasService.insertarFacturas(postFacturas).then(resp => {
                  this.complete += 1;
                  console.log('completado')
    
                  if (this.complete == this.listaGuias.length) {
                    this.guiasPost();
                    this.limpiarDatos();
                    this.alertasService.loadingDissmiss();
                  }
                });

              }else{
                if (this.complete == this.listaGuias.length) {
                  this.guiasPost();
                  this.limpiarDatos();
                  this.alertasService.loadingDissmiss();
                }
              }
          
              }
      



          
           
            });
          } else {
            this.postGuiaToPromise(guiaCamion).then(resp => {
              this.ruteroService.insertarPostRutero(postRutero).then(resp => {
                this.facturasService.insertarFacturas(postFacturas).then(resp => {
                  this.complete += 1;
                  console.log('completado')

                  if (this.complete == this.listaGuias.length) {

                    this.guiasPost();
                    this.limpiarDatos();
                    this.alertasService.loadingDissmiss();

                  }
                });
              })
            })
          }
          console.log(guiaCamion, this.listaGuias[index])

          return
        }
        //  postFacturas = []
        //postRutero = [];

      }
    }
  }

  async guiasPost() {
    const modal = await this.modalCtrl.create({
      component: ReporteGuiasPage,
      mode: 'ios',
      cssClass: 'ui-modal',
      componentProps: {
        guias: this.guiasGeneradas
      }
    });

    return modal.present();
  }



}

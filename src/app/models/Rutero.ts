export class Rutero {
    constructor(
        public idGuia: string,
        public idCliente: string,
        public nombre: string,
        public direccion:string,
        public latitud:number,
        public longitud:number,
        public checkin: Date,
        public latitud_check: number,
        public longitud_check: number,
        public observaciones:string,
        public estado: string,
        public bultos: number,
        public checkout:Date,
        public orden_Visita: number,
        public Duracion: number,
        public distancia: number,
        public estado_guia: string
    ){}
}

export class RuteroMH {
    constructor( 
        public id: number,
        public idGuia: string,
        public cliente: string,
        public latitud: number,
        public longitud:number,
        public distancia: number,
        public duracion:number,
        public direccion:string,
        public bultosTotales:number,
        public orden_visita: number,
        public asignado: boolean,
        public HoraInicio:Date,
        public HoraFin:Date){}
}

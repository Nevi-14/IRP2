export class Clientes {
    constructor(
        public CLIENTE: string,
        public NOMBRE: string,
        public ALIAS: string ,
        public CATEGORIA_CLIENTE: number,
        public NOMBRE_CATEGORIA_CLIENTE: string,
        public  TRADE_CLIENTE: string,
        public CANAL: string,
        public CANAL_VENDEDOR: string,
        public NUM_PROVINCIA: number,
        public PROVINCIA: string,
        public NUM_CANTON: number,
        public CANTON: string,
        public NUM_DISTRITO: number,
        public DISTRITO: string,
        public NUM_BARRIO: number,
        public BARRIO: string,
        public VENDEDOR_ACTUAL: number,
        public NOMBRE_VENDEDOR_ACTUAL: string,
        public RUTA: number,
        public NOMBRE_RUTA: string,
        public ZONA: number,
        public NOMBRE_ZONA: string,
        public ACTIVO: string,
        public LONGITUD: number,
        public LATITUD: number,
        public FECHA_ACTUALIZACION_UBICACION: Date
    ){}
}


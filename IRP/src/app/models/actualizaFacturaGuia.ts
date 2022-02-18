export class ActualizaFacturaGuia{
    constructor(
       public numFactura: string,
        public tipoDocumento: string,
        public despachado: string,
        public rubro3: string,
        public U_LATITUD: string,
        public U_LONGITUD: number

    ){}
}

// http://api_irp.di-apps.co.cr/api/ActualizaFacturas/00100001010000122852
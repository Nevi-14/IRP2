export class ActualizaFacturaGuia{
    constructor(
        public numFactura: string,
        public tipoDocumento: string,
        public despachado: string,
        public rubro3: string,
        public U_LATITUD: number,
        public U_LONGITUD: number,
        public Fecha_Entrega: Date,
        public  Fecha:Date,
        public U_ESTA_LIQUIDADO:string

    ){}
}

// http://api_irp.di-apps.co.cr/api/ActualizaFacturas/00100001010000122852
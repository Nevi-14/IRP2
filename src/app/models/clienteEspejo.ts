export class ClienteEspejo{
    constructor(
       public IdCliente: string,
        public Fecha: string,
        public Usuario: string,
        public Zona: string,
        public Ruta: string,
        public Latitud: number,
        public Longitud: number
    ){}
}

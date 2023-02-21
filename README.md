# Project Name

IRP

## Table of contents
- APIS
- Requirements
- Recommended modules
- Installation
- Configuration
- Troubleshooting
- FAQ
- Maintainers
## APIS

clientes
-------------------------------------
- GET
https://apiirp.di-apps.co.cr/api/ClientesCierre/?fecha=2023-02-01
- GET
https://apiirp.di-apps.co.cr/api/ClientesGuia/20230123CT01V3683
- GET
https://apiirp.di-apps.co.cr/api/Clientes2/7636
- GET
https://apiirp.di-apps.co.cr/api/Clientes/AJ01
- POST
https://apiirp.di-apps.co.cr/api/ActualizaClientes/

facturas
-------------------------------------
- GET
https://apiirp.di-apps.co.cr/api/Facturas/?id=00100102010000050020
- GET
https://apiirp.di-apps.co.cr/api/FactGuias?id=20230201AJ01V8215
- GET
https://apiirp.di-apps.co.cr/api/Facturas/?ruta=HE01&entrega=2023-02-18
- POST
https://apiirp.di-apps.co.cr/api/ActFac
- PUT
https://apiirp.di-apps.co.cr/api/ActFac
- GET
API https://apiirp.di-apps.co.cr/api/ActualizaFacLin/20221201AJ01V7718
- GET
https://apiirp.di-apps.co.cr/api/ActualizaFacLin/20221201AJ01V7718

gestion-camiones
-------------------------------------
- GET
https://apiirp.di-apps.co.cr/api/Camiones


planificacion-entregas
-------------------------------------
- GET
https://apiirp.di-apps.co.cr/api/consultar-guia/?ID=20230123CT01V3683
- GET
https://apiirp.di-apps.co.cr/api/Manifiesto/?ID=20221201AJ01V7718
- GET
https://apiirp.di-apps.co.cr/api/Guias/?estado=INI
- GET
http://apiirp.di-apps.co.cr/api/guias-estado-rango-fecha?estado=INI&fechaInicio=2023-01-01&fechaFin=2023-02-20
ESTADOS
- INI: Inicio
- SYN: Sincronizada
- RUTA: Ruta
- FIN: Liquidada

- POST
https://apiirp.di-apps.co.cr/api/Guias
- PUT
https://apiirp.di-apps.co.cr/api/Guias?ID=20230123CT01V3683


provincias-cantones-distritos
-------------------------------------
- GET
https://apiirp.di-apps.co.cr/api/Provincias/
- GET
https://apiirp.di-apps.co.cr/api/Cantones/4
- GET
https://apiirp.di-apps.co.cr/api/Distritos/?IdP=4&IdC=04


rutas-zonas
-------------------------------------
- GET
https://apiirp.di-apps.co.cr/api/Rutas
- PUT
https://apiirp.di-apps.co.cr/api/Ruta_Zona
- GET
https://apiirp.di-apps.co.cr/api/Zonas


rutero
-------------------------------------
- GET
https://apiirp.di-apps.co.cr/api/Rutero/20230123CT01V3683
- POST
https://apiirp.di-apps.co.cr/api/Rutero/20230123CT01V3683
- PUT
https://apiirp.di-apps.co.cr/api/Rutero/?ID=20230123CT01V3683&idCliente=1482

## Requirements

The requirements section describes whether this project requires anything outside of Dev For Business core to work


## Installation 

The installation section describes how to install the module.

## Configuration

The configuration section describes how to configure the module – including, but not limited to, permissions. 

## Troubleshooting

The Troubleshooting and FAQ sections address questions that are asked frequently in the issue queue. 

## FAQ

## Maintainers

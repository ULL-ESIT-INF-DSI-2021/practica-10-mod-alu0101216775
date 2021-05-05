import * as net from 'net';
import { RequestType, ResponseType } from './infoTypes'

let req: RequestType = { type: "command", command: "" };
if (process.argv.length === 3 || process.argv.length === 4) {
    if (process.argv.length === 3) {
        if (typeof process.argv[2] == 'string') {
            console.log(process.argv[2]);
            req.command = process.argv[2];
        } else {
            console.error("El comando debe ser un string");
        }
    } else if (process.argv.length === 4) {
        if (typeof process.argv[2] == 'string' && typeof process.argv[3] == 'string') {
            req.command = process.argv[2];
            req.args = process.argv[3];
        } else {
            console.error("El comando y argumentos deben ser string");
        }
    }
    const client = net.connect({ port: 60300 });
    let data: string = "";
    client.write(JSON.stringify(req)+'\n');

    client.on('data', (dataJSON) => {
        data += dataJSON.toString();
    });

    client.on('end', () => {
        const message: ResponseType = JSON.parse(data);
        console.log(data);
        //console.log(dataJSON.toString());
        if (message.type === 'plainText') {
            console.log(`Salida del comando en el servidor:\n${message.message}`);
        } else if (message.type === 'errcode') {
            console.log('Ha habido un error ejecutando el comando en el servidor.');
            console.log(`EL mensaje de error es el siguiente: \n${message.message}`);
        } else {
            console.log(`El tipo de la respuesta no es válido. (${message.type})`);
        }
    })
} else {
    console.error("Necesitas indicar un comando.");
}




//ifbuffer contiene '\n'
//emitir evento request
//socket.on(request)
//atender todo

//configurando
//directamente socket.on end
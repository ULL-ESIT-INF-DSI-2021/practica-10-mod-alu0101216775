import * as net from 'net';
import { RequestType, ResponseType } from './infoTypes'
import { spawn } from 'child_process';
import { Socket } from 'dgram';

net.createServer((connection) => {
    console.log('A client has connected.');
    let fullRequest = "", command = "", args = "";
    connection.on('data', (dataJSON) => {
        fullRequest += dataJSON;
        console.log("ondata connection")
        if (fullRequest.indexOf('\n') !== -1) {
            connection.emit('request', fullRequest);
        }
    })

    connection.on('request', (req) => {
        console.log("onrequest");
        let jsonrequest: RequestType = JSON.parse(req);
        command = jsonrequest.command;
        console.log(command);
        if (jsonrequest.type === "argCommand") args = jsonrequest.args!;
        const child = spawn(command, [args]);
        let svresponse: ResponseType = { type: "plainText", success: false, message: "" };
        let out: string = "";
        ///////////////////////////////////
        child.stdout.on('data', (buff) => {
            out += buff;
            console.log("End");
        });
        
        child.on('close', (err) => {
            if (err) {
                svresponse.success = false;
                svresponse.type = "errcode";
                svresponse.message = "No se ha podido ejecutar el comando";
                connection.write(JSON.stringify(svresponse), () => {
                    connection.end();
                });
            } else {
                svresponse.success = true;
                svresponse.type = "plainText";
                svresponse.message = out;
                connection.write(JSON.stringify(svresponse), () => {
                    connection.end();
                });
            }
        });
    })


    connection.on('close', () => {
        console.log('A client has disconnected.');
    });
}).listen(60300, () => {
    console.log('Waiting for clients to connect.');
});

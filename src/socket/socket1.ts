// require('dotenv').config();
import { config } from 'dotenv';
import { Observable, Subject, interval } from 'rxjs';
import { Server } from "socket.io";
import { MongoConnectionService } from '../services/mongo.service';
import { AuthService } from '../services/auth.service';

config() // Just for reading .env file

let incomingMessage: Subject<any> = new Subject()
let notificationSubject = interval(1000)
let authService: AuthService = new AuthService(new MongoConnectionService())
let mongoService: MongoConnectionService = new MongoConnectionService()

incomingMessage.subscribe({
    next: (message: any) => {
        checkMessage(message).then((res) => {

        })
    }
})
// Connect to mongoDB server && Create Socket io server
// connectMongo('usersDatabase', process.env.MONGO + '/users').then(() => {
//     return connectMongo('database2', process.env.MONGO + '/database2')
// }).then(() => {
//     return createIOserver(parseInt(process.env.PORT as string), notificationSubject).subscribe({
//         next: (message: any) => checkMessage(message).then((res) => processMessage(res))
//     })
// }).then(() => {
//     console.log(mongoService.getAllConnectionStatus())
// }).catch((error) => {
//     console.error(`Error: ${error}`)
// })

setTimeout(() => {
    console.log(`Getting status for usersdDatabse`)
    // mongoService.getConnectionStatusDetails('database2').subscribe((element: string) => console.log(element))
    // console.log(mongoService.getAllConnectionStatus())
}, 3000)

function createIOserver(port: number, notificationSubject?: Subject<any> | Observable<any>): Subject<any> {
    let responseSubject: Subject<any> = new Subject()
    notificationSubject?.subscribe({
        next: (element) => { ioServer.emit('message', `notification: ${element}`) },
        error: (err) => { console.error(err) },
        complete: () => { }
    })
    // Creating IO Server
    const ioServer = new Server();
    ioServer.listen(port);
    console.log(`Socket.IO server is running on port ${port}`);

    // Define a connection event handler
    ioServer.on(`connection`, (socket) => {
        console.log(`Client connected with ID: ${socket.id}`);
        ioServer.emit('message', `Connection Established: ${socket.id}`)

        // Handle messages from clients
        socket.on('message', (message) => {
            responseSubject.next(message)
            let acknowledge = `any${message.id || ''} received. Instructions acknowledged`
            ioServer.to(socket.id).emit('acknowledgement', acknowledge)
        });

        // Handle disconnection
        socket.on('disconnect', () => {
            console.log("A user disconnected");
        });

    });
    return responseSubject
}

/* ---------------------------------------------------------------------------------------------------------------------------------------------------------- */
/* ---------------------------------------------------------------------------------------------------------------------------------------------------------- */


async function checkMessage(message: any): Promise<any> {
    /* Check the messages. What is it and how to reply them */
    return new Promise((resolve, reject) => {
        if (message.action.action == 'login') {
            console.log(`Login Request processing...`)
            resolve(message)
        }
        if (message.action.action == 'register') {
            console.log(`Registeration Request processing...`)
            resolve(message)
        }
    })
}

async function processMessage(res: any): Promise<any> {
    return new Promise((resolve, reject) => {

    })
}


function connectMongo(dbName: string, dbURI: string): void {
    // mongoService.manageMongoConnection(dbName, dbURI)
}






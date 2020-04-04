import io from 'socket.io-client'

class GameController {
    constructor(ip, port, errorFunction) {
        this.client = io.connect(`http://[${ip}]:${port}`, {
            transports: ['websocket'],
        })

        this.usernames = []
        this.errorFunction = errorFunction

        this.client.on('connect', () => console.log('Connection succesful!'))
        this.client.on('error', () => {console.log(); this.errorFunction("Connection error.")})
        this.client.on('JoinRoom', (usernames) => {this.usernames = usernames; this.playerListUpdateFunction(usernames) })
    }

    createRoom(username, callback) {
        this.client.emit('CreateRoom', username, (roomCode) => {this.usernames = [username]; callback(roomCode)})
    }

    joinRoom(username, roomCode, callback) {
        this.client.emit('JoinRoom', roomCode, username, (usernames) => { this.usernames = usernames; callback() })
    }

}

export default GameController
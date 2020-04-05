import io from 'socket.io-client'



class GameController {
    constructor(ip, port, errorFunction) {
        this.client = io.connect(`http://[${ip}]:${port}`, {
            transports: ['websocket'],
        })

        this.usernames = []
        this.errorFunction = errorFunction

        this.client.on('connect', () => this.setConnectedFunction(true))
        this.client.on('error', () => {console.log(); this.errorFunction("Connection error.")})
        this.client.on('RoomChange', (res) => {
            if (res.success) {
                this.usernames = res.room.players
                this.menuScreenRef.setState({gameOwner: (res.room.players[0] === this.menuScreenRef.username)})
                this.playerListUpdateFunction(this.usernames)
            }
            console.log(res);
        })
    }

    createRoom(username, callback) {
        this.client.emit('CreateRoom', username, (res) => {
            if (res.success) {
                this.usernames = res.room.players
                callback(res.room.id)
            } else {
                //TODO
            }
        })
    }

    joinRoom(username, roomCode, callback) {
        this.client.emit('JoinRoom', roomCode, username, (res) => {
            if (res.success) {
                this.usernames = res.room.players
                callback()
            } else {
                this.menuScreenRef.setState({joinError: "This room does not exist."})
            }
        })
    }

}

export default GameController
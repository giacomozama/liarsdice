import io from 'socket.io-client'

class GameController {
    constructor(ip, port) {
        this.client = io.connect(`http://[${ip}]:${port}`, {
            transports: ['websocket'],
        })

        this.usernames = []

        this.client.on('connect', () => this.app.menuScreenRef.current.setState({'connected': true}))
        this.client.on('error', () => this.app.menuScreenRef.current.showError("Connection Error."))
        this.client.on('RoomChange', (res) => {
            if (res.success) {
                this.usernames = res.room.players
                this.app.setState({usernames: this.usernames})
                this.menuScreenRef.setState({gameOwner: (res.room.owner === this.app.menuScreenRef.current.username)})
                //this.app.menuScreenRef.current.setState({gameOwner: (res.room.players[0] === this.menuScreenRef.username)})
            }
            console.log(res);
        })
    }

    createRoom(username, callback) {
        this.app.playerName = username
        this.client.emit('CreateRoom', username, (res) => {
            if (res.success) {
                this.usernames = res.room.players
                this.app.setState({usernames: this.usernames})
                callback(res.room.id)
            } else {
                this.app.menuScreenRef.current.showError("Connection Error.")
            }
        })
    }

    joinRoom(username, roomCode, callback) {
        this.app.playerName = username
        this.client.emit('JoinRoom', roomCode, username, (res) => {
            if (res.success) {
                this.usernames = res.room.players
                this.app.setState({usernames: this.usernames})
                callback()
            } else {
                this.app.menuScreenRef.current.setState({joinError: "This room does not exist."})
            }
        })
    }

}

export default GameController
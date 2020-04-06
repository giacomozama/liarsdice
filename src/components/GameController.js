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
                console.log(res)
                if (this.app.menuScreenRef.current != null) {
                    this.app.menuScreenRef.current.setState({canStart: res.room.status === 'ready'})
                    this.app.menuScreenRef.current.setState({gameOwner: (res.room.owner === this.app.menuScreenRef.current.username)})
                }
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

    leaveRoom() {
        this.client.emit('LeaveRoom', () => {})
    }

}

export default GameController
import io from 'socket.io-client'

class GameController {
    constructor(server_host) {

        this.client = io.connect(server_host, {
            transports: ['websocket'],
        })

        this.gid = -1
        this.localPlayerDice = []
        this.playerOrder = []
        this.activePlayer = -1

        this.client.on('connect', () => { if (this.app.menuScreenRef.current !== null)
             this.app.menuScreenRef.current.setState({'connected': true}) } )
        this.client.on('error', () => { if (this.app.menuScreenRef.current !== null)
            this.app.menuScreenRef.current.showError("Connection Error.")
        })
        this.client.on('GameStarted', (res) => {
            console.log(res)
            if (res.success) {
                this.gid = res.gid
                this.localPlayerDice = res.dice
                this.playerOrder = res.order
                this.activePlayer = res.active_player
                this.app.switchInGame()
                this.app.setState({dice: 
                    this.playerOrder.map((po, i) => (i === this.gid) ? res.dice : [0, 0, 0, 0, 0, 0])} )
            }
        })
        this.client.on('RoomChange', (res) => {
            console.log(res)
            if (res.success) {
                const players = {}
                res.room.players.forEach((v, i) => players[i] = v)
                this.app.setState({players: players})
                if (this.app.menuScreenRef.current != null) {
                    this.app.menuScreenRef.current.setState({canStart: res.room.status === 'ready'})
                    this.app.menuScreenRef.current.setState({gameOwner: (res.room.owner === this.app.menuScreenRef.current.username)})
                }
            }
        })
        this.client.on('NewChatMessage', (res) => {
            if (res.success) {
                if (this.app.chatBarRef.current !== null) {
                    this.app.chatBarRef.current.setState({
                        chatHistory: [
                            ...this.app.chatBarRef.current.state.chatHistory,
                            { name: res.from, message: res.message }]})
                }
            }
            console.log(res)
        })
    }

    createRoom(username, callback) {
        this.app.playerName = username
        this.client.emit('CreateRoom', username, (res) => {
            if (res.success) {
                const players = {}
                res.room.players.forEach((v, i) => players[i] = v)
                this.app.setState({players: players})
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
                const players = {}
                res.room.players.forEach((v, i) => players[i] = v)
                this.app.setState({players: players})
                callback()
            } else {
                if (this.app.menuScreenRef.current !== null)
                    this.app.menuScreenRef.current.setState({joinError: "This room does not exist."})
            }
        })
    }

    sendChatMessage(message) {
        this.client.emit('SendChatMessage', message, (res) => {
            if (res.success) {
                if (this.app.chatBarRef.current != null) {
                    this.app.chatBarRef.current.setState({
                        chatHistory: [
                            ...this.app.chatBarRef.current.state.chatHistory,
                            { name: res.from, message: res.message }]})
                }
            }
            console.log(res)
        })
    }

    startGame() {
        this.client.emit('StartGame', (res) => {})
    }

    leaveRoom() {
        this.client.emit('LeaveRoom', () => {})
    }

}

export default GameController
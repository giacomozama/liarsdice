import io from 'socket.io-client'
import Player from '../model/Player'

class GameController {
    constructor(server_host) {

        this.client = io.connect(server_host, {
            transports: ['websocket'],
        })

        this.client.on('connect', () => { if (this.app.menuScreenRef.current !== null)
             this.app.menuScreenRef.current.setState({'connected': true}) } )
        this.client.on('error', () => { if (this.app.menuScreenRef.current !== null)
            this.app.menuScreenRef.current.showError("Connection Error.")
        })
        this.client.on('GameStarted', (res) => {
            console.log(res)
            if (res.success) {
                this.myGid = res.gid
                this.localPlayerDice = res.dice
                this.activePlayer = res.active_player
                this.app.state.players.find(p => p.gid === res.gid).dice = res.dice

                this.app.setState({
                    inGame: true,
                    players: this.app.state.players.sort((a, b) => res.order.findIndex(o => o === a.gid) - res.order.findIndex(o => o === b.gid)),
                    myGid: res.gid,
                    activePlayerGid: res.active_player
                } )
            }
        })
        this.client.on('RoomChange', (res) => {
            console.log(res)
            if (res.success && !this.app.state.inGame) {
                this.app.setState({players: res.room.players.map((u, i) => new Player(u, i))})
                this.app.menuScreenRef.current.setState({
                    canStart: res.room.status === 'ready',
                    gameOwner: (res.room.owner === this.app.menuScreenRef.current.username)
                })
            }
        })
        this.client.on('NewChatMessage', (res) => {
            if (res.success && this.app.state.inGame) {
                this.app.chatBarRef.current.setState({
                    chatHistory: [
                        ...this.app.chatBarRef.current.state.chatHistory,
                        { player: this.app.state.players.find( p => p.username === res.from ), message: res.message }]})
            }
            console.log(res)
        })
    }

    createRoom(username, callback) {
        this.app.playerName = username
        this.client.emit('CreateRoom', username, (res) => {
            if (res.success) {
                this.app.setState({players: res.room.players.map((u, i) => new Player(u, i))})
                callback(res.room.id)
            } else {
                if (!this.app.state.inGame)
                    this.app.menuScreenRef.current.showError("Connection Error.")
            }
        })
    }

    joinRoom(username, roomCode, callback) {
        this.app.playerName = username
        this.client.emit('JoinRoom', roomCode, username, (res) => {
            if (res.success) {
                this.app.setState({players: res.room.players.map((u, i) => new Player(u, i))})
                callback()
            } else {
                if (!this.app.state.inGame)
                    this.app.menuScreenRef.current.setState({joinError: "This room does not exist."})
            }
        })
    }

    sendChatMessage(message) {
        this.client.emit('SendChatMessage', message, (res) => {
            if (res.success && this.app.state.inGame) {
                this.app.chatBarRef.current.setState({
                    chatHistory: [ ...this.app.chatBarRef.current.state.chatHistory,
                        { player: this.app.state.players.find( p => p.username === res.from ), message: res.message }]})
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
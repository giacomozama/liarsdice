import io from 'socket.io-client'
import Player from '../model/Player'
import React from 'react'
import Die from '../components/Die'


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
                this.app.state.players.find(p => p.gid === res.gid).dice = res.dice

                this.app.setState({
                    inGame: true,
                    players: this.app.state.players.sort((a, b) => 
                        res.order.findIndex(o => o === a.gid) - res.order.findIndex(o => o === b.gid)),
                    myGid: res.gid,
                    activePlayerGid: res.active_player
                } )

                this.addEvent("Game started!")

                if (this.app.localPlayerPanelRef.current)
                    this.app.localPlayerPanelRef.current.rollAllDice(res.dice)

                setTimeout(() => {
                    if (this.app.playerInputPanelRef.current && this.app.state.myGid === res.active_player)
                        this.app.playerInputPanelRef.current.showInputDialog(null, null, null)}, 5000)
                
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
            console.log(res)
            if (res.success && this.app.state.inGame) {
                this.app.chatBarRef.current.setState({
                    chatHistory: [
                        ...this.app.chatBarRef.current.state.chatHistory,
                        { player: this.app.state.players.find( p => p.username === res.from ), message: res.message }]})
            }
        })

        this.client.on('NextTurn', (res) => {
            console.log(res)
            /*
                'success': true,
                'active_player': game.current_player.gid,
                'claim': {'gid': game.last_player, 'amount': amount, 'pips': pips}
             */
            if (res.success && this.app.state.inGame) {
                const previousPlayer = this.app.findPlayerByGid(res.claim.gid)
                this.addEvent(`${previousPlayer.username} claims there's ${res.claim.amount} x ${this.unicodePips(res.claim.pips)}`)
                this.app.setState({
                    activePlayerGid: res.active_player  
                })
                setTimeout(() => {
                    if (this.app.playerInputPanelRef.current && this.app.state.myGid === res.active_player)
                        this.app.playerInputPanelRef.current.showInputDialog(
                            res.claim.amount, 
                            res.claim.pips,
                            previousPlayer.username) }, 2000)
            }
        })

        this.client.on('NextRound', (res) => {
            /*
                'success': true,
                'dice': game.getDice(p.gid),
                'active_player': game.current_player.gid,
                'doubter': obj.doubter,
                'doubted': obj.doubted,
                'loser': obj.loser,
                'keepsOnPlaying': obj.keepsOnPlaying,
             */
            console.log(res)
            if (res.success && this.app.state.inGame) {
                const doubter = this.app.findPlayerByGid(res.doubter)
                const doubted = this.app.findPlayerByGid(res.doubted)
                const loser = (doubter.gid === res.loser) ? doubter : doubted

                const eventString = `${doubter.username} doubted ${doubted.username}, ${loser.username} was wrong and lost 1 dice`
                const eliminatedString = (res.keepsOnPlaying) ? "" : `${loser.username} was eliminated`

                this.addEvent(`${eventString}`)
                if (eliminatedString !== "") this.addEvent(`${eliminatedString}`)

                this.app.setState({
                    activePlayerGid: res.active_player  
                })

                setTimeout(() => {
                    if (this.app.state.myGid === res.active_player) {
                        if (this.app.playerInputPanelRef.current)
                            this.app.playerInputPanelRef.current.showInputDialog( null, null, null)
                    } 
                }, 5000)

                if (this.app.localPlayerPanelRef.current)
                this.app.localPlayerPanelRef.current.rollAllDice(res.dice)
            }
        })

        this.client.on('GameOver', (res) => {
            console.log(res)
            /*
                success: true,
                winner: obj.winner.gid, 
            */
            if (res.success && this.app.state.inGame) {
                if (this.app.errorScreenRef.current)
                    this.app.errorScreenRef.current.showError(
                        `${this.app.findPlayerByGid(res.winner.username)} wins!`
                    )
            }
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

    claim(amount, pips) {
        this.client.emit('Claim', amount, pips)
    }

    doubt() {
        this.client.emit('Doubt')
    }

    startGame() {
        this.client.emit('StartGame')
    }

    leaveRoom() {
        this.client.emit('LeaveRoom')
    }

    addEvent(event) {
        this.app.gameEventListRef.current.setState({
            eventList: [event, ...this.app.gameEventListRef.current.state.eventList]
        })
    }

    unicodePips(pips) {
        switch (pips) {
            case 1:
                return "⚀"
            case 2:
                return "⚁"
            case 3:
                return "⚂"
            case 4:
                return "⚃"
            case 5:
                return "⚄"
            case 6:
                return "⚅"
        }
    }
}

export default GameController
import io from 'socket.io'

class GameController {
    constructor(ip, port) {
        this.client = io.connect(`http://[${address}]:${port}`, {
            'reconnection delay': 0,
            'reopen delay': 0,
            'force new connection': true,
            transports: ['websocket'],
        })
    }
}

export default GameController
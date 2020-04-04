import React from 'react'


class PlayerList extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            playerList: this.props.usernames
        }
    }

    render() {
        return (
            <div className='player-list'>
                {this.state.playerList.map((pN, i) => <div key={"plitem"+i} pid={i} className="player-list-item">{pN}</div>)}
            </div>
        )
    }
}

export default PlayerList
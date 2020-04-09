import React from 'react'


class PlayerList extends React.Component {
    render() {
        return (
            <div className='player-list'>
                {this.props.players.map(p => <div key={"plitem"+p.gid} pid={p.gid} className="player-list-item">{p.username}</div>)}
            </div>
        )
    }
}

export default PlayerList
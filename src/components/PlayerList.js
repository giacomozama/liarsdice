import React from 'react'


class PlayerList extends React.Component {
    render() {
        return (
            <div className='player-list'>
                {this.props.usernames.map((pN, i) => <div key={"plitem"+i} pid={i} className="player-list-item">{pN}</div>)}
            </div>
        )
    }
}

export default PlayerList
import React from 'react'


class GameEventList extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            eventList: []
        }
    }

    componentDidUpdate() {
        document.getElementsByClassName('game-event-list')[0].scrollIntoView(false);
    }

    render() {
        return (
            <div className='game-event-list'>
                {this.state.eventList.map((eC, i) => <div key={"geitem"+i} className="game-event-list-item">{eC}</div>)}
            </div>
        )
    }
}

export default GameEventList
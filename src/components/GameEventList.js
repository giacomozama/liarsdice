import React from 'react'


class GameEventList extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            eventList: ['test0', 'test1', 'test2', 'test3', 'test4', 'test5', 'test0', 'test1', 'test2', 'test3', 'test4', 'test5', 'test0', 'test1', 'test2', 'test3', 'test4', 'test5']
        }
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
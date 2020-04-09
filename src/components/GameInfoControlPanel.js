import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faDice, faClock, faVolumeUp } from '@fortawesome/free-solid-svg-icons';


class GameInfoControlPanel extends React.Component {
    constructor(props) {
        super(props)

        this.state = { 
            gameTimeSecs: 0,
            numberOfDice: 36,
        };
    }

    componentDidMount() {
        setInterval(() => this.setState({ gameTimeSecs: this.state.gameTimeSecs + 1 }), 1000)
    }

    render () {
        const date = new Date(0);
        date.setSeconds(this.state.gameTimeSecs); // specify value for SECONDS here

        return (
            <div className='game-info-control-panel'>
                <div className='info-bar'>
                        <div className='total-dice'>
                            <FontAwesomeIcon icon={faDice}></FontAwesomeIcon><div className='no-of-dice'>{
                                this.props.app.state.players.reduce((acc, p) => acc + p.dice.filter(d => d !== -1).length, 0)}</div></div>
                        <div className='game-time'><FontAwesomeIcon icon={faClock}></FontAwesomeIcon>
                        <div className='game-clock'>{[...date.toISOString().substr(11, 8)].map((c,i) => <span key={'clock-char' + i} className="clock-char">{c}</span>)}</div>
                    </div>
                </div>
                <div className='sound-control'>
                    <FontAwesomeIcon icon={faVolumeUp}></FontAwesomeIcon>
                    <input type="range" onInput={(e) => this.props.audioRef.current.volume = e.target.value/100.0} className="volume-slider" ></input>
                </div>
            </div>)
    }
}

export default GameInfoControlPanel;
import React from "react"
import { faDiceOne, 
    faDiceTwo, 
    faDiceThree, 
    faDiceFour, 
    faDiceFive, 
    faDiceSix,
    faQuestion,
    faTimes} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

class Die extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            icon: this.getIconForPips(this.props.pips)
        }
    }

    getIconForPips(noOfPips) {
        switch (noOfPips) {
            case -1:
                return faTimes
            case 0:
                return faQuestion
            case 1:
                return faDiceOne
            case 2:
                return faDiceTwo
            case 3:
                return faDiceThree
            case 4:
                return faDiceFour
            case 5:
                return faDiceFive
            case 6:
                return faDiceSix
            default:
                return null
        }
    }

    rollDieWithStandardParams() {
        this.rollDie(512, 16, 0, 6);
    }

    rollDie(max, millis, curFrames, maxFrames) {
        if (millis >= max) 
            this.setState({
                icon: this.getIconForPips(this.props.pips)
            })
        else {
            this.setState({ icon: this.getIconForPips(Math.floor(Math.random() * Math.floor(6)) + 1) })
            const newMillis = (curFrames === maxFrames) ? millis*2: millis
            setTimeout(() => this.rollDie(max,  newMillis, (curFrames === maxFrames) ? 0 : curFrames + 1, maxFrames), newMillis)
        }
    }

    render() {
        return (
            <div className="die">
                <FontAwesomeIcon icon={this.state.icon} />
            </div>)
    }
}

export default Die
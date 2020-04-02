import React from "react"
import { faDiceOne, 
    faDiceTwo, 
    faDiceThree, 
    faDiceFour, 
    faDiceFive, 
    faDiceSix, } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

class Die extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            pips: this.props.pips,
            icon: this.getIconForPips(this.props.pips)
        }
    }

    getIconForPips(noOfPips) {
        switch (noOfPips) {
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

    changePips(noOfPips) {
        if (noOfPips >= 1 && noOfPips <= 6)
            this.setState({
                pips: noOfPips,
                icon: this.getIconForPips(noOfPips)
            })
    }

    render() {
        return <FontAwesomeIcon className="die" icon={this.state.icon} />
    }
}

export default Die
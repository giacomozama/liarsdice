import React, { Component } from 'react'
import '../App.css'

class Dimmer extends Component {
    constructor(props) {
        super(props)

        this.state = {
            visible: false
        }

        this.dim = this.dim.bind(this)
        this.undim = this.undim.bind(this)
    }

    render () {
        return ( 
            this.state.visible ?
                <div id="dimmer"></div>
                : null
        )
    }

    dim () { 
        this.setState({
            visible: true
        }) 
    }

    undim () { 
        this.setState({
            visible: false
        }) 
    }
}

export default Dimmer
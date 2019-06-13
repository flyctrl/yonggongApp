import React, { Component } from 'react'
import * as tooler from 'Contants/tooler'

class Skip extends Component {
  constructor(props) {
    super(props)
    this.state = {
    }
  }
  componentDidMount() {
    setTimeout(() => {
      window.location.href = decodeURIComponent(tooler.getQueryString('url'))
    }, 100)
  }

  render() {
    return <div></div>
  }
}

export default Skip

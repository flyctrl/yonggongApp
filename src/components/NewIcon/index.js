import React, { Component } from 'react'
import style from './style.css'
import classnames from 'classnames'

class NewIcon extends Component {
  render() {
    return <svg onClick={this.props.onClick} className={classnames(style.default, this.props.className)} aria-hidden='true'>
      <use xlinkHref={'#' + this.props.type}/>
    </svg>
  }
}

export default NewIcon

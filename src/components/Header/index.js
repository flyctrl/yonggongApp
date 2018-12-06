import React, { Component } from 'react'
import { NavBar, SearchBar } from 'antd-mobile'
import style from './style.css'
// import { isIphoneX } from 'Util/ua'
import NewIcon from 'Components/NewIcon'
import classnames from 'classnames'

class Header extends Component {
  componentDidMount() {
    this.props.autoFocusInst ? this.autoFocusInst.focus() : null
  }
  render() {
    const { title, titleClick, leftIcon, leftTitle1, leftClick1, leftClick2, leftTitle2, rightIcon, rightTitle, rightClick, searchTitle, onSearchSubmit, cancelText, autoFocusInst, onSearchFocus, onSearchCancel } = this.props
    return <div className={classnames(style.header, this.props.className)}>
      {
        // isIphoneX ? <div className={style['fix-iphoneX-top']}/> : null
      }
      <NavBar
        mode='light'
        className={`${style['nav-bar']}`}
        leftContent={[
          leftIcon && <span className='leftBox' key={1} ><NewIcon type={leftIcon === 'icon-back' ? 'icon-back-default' : leftIcon} onClick={leftClick1} className='leftIcon' /></span>, leftTitle1 && <span key={2} className='usr-hdleft-title-first' onClick={leftClick1} >{leftTitle1 === '返回' ? null : leftTitle1}</span>, leftTitle2 && <span key={3} onClick={leftClick2} className='usr-hdleft-title-second'>{leftTitle2}</span>]}
        rightContent={[rightIcon && <span key={4} className='rightBox' ><NewIcon type={rightIcon} onClick={rightClick} className='rightIcon'/></span>, rightTitle && <span key={5} onClick={rightClick} className='usr-hdright-title'>{rightTitle}</span>]}
      >{searchTitle ? <SearchBar onFocus={onSearchFocus} onCancel={onSearchCancel} ref={ (ref) => { autoFocusInst ? this.autoFocusInst = ref : null }} cancelText={cancelText} key={6} onSubmit={onSearchSubmit} className='search' placeholder={searchTitle} maxLength={8}/> : <span key={7} onClick={titleClick} className='title'>{title}
        </span>}</NavBar>
    </div>
  }
}

export default Header

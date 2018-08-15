/*
* @Author: baosheng
* @Date:   2018-04-02 22:36:11
* @Last Modified by:   baosheng
* @Last Modified time: 2018-06-25 22:39:18
*/
import React from 'react'
import ReactDOM from 'react-dom'
import MainRouter from './Router'
import registerServiceWorker from './registerServiceWorker'
import { AppContainer } from 'react-hot-loader'
import 'Src/assets/iconfont.js'
import './global.css'

ReactDOM.render(
  <AppContainer>
    <MainRouter/>
  </AppContainer>,
  document.getElementById('root')
)

if (module.hot) {
  module.hot.accept('./Router', () => {
    const NextApp = require('./Router').default
    ReactDOM.render(
      <AppContainer>
        <NextApp/>
      </AppContainer>,
      document.getElementById('root')
    )
  })
}

registerServiceWorker()

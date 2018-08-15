/*
* @Author: baosheng
* @Date:   2018-04-02 22:29:52
* @Last Modified by:   chengbs
* @Last Modified time: 2018-05-22 14:15:14
*/
import React from 'react'
import {
  Router,
  Switch
} from 'react-router-dom'
import history from 'Util/history'
import XLayout from '../models/layout'
import routes from './routerConf'

const RouteConfig = () => (
  <Router history={history}>
    <Switch>
      <XLayout routes={routes}>
      </XLayout>
    </Switch>
  </Router>
)

export default RouteConfig

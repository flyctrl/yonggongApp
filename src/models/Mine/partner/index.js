import React, { Component } from 'react'
import { SearchBar } from 'antd-mobile'
import { Header, Content } from 'Components'
import history from 'Util/history'
import * as urls from 'Contants/urls'
import style from './style.css'

class Partner extends Component {
  render() {
    return (
      <div className='pageBox'>
        <Header
          title='合作方'
          leftIcon='icon-back'
          leftTitle1='返回'
          leftClick1={() => {
            history.push(urls.MINE)
          }}
          rightTitle='添加'
          rightClick={() => {
            history.push(urls.ADDPARTNER)
          }}
        />
        <Content>
          <div className={style['partner-box']}>
            <div className={style['partner-search']}>
              <SearchBar placeholder='搜索姓名/拼音/电话' maxLength={8} />
            </div>
            <ul className={style['partner-list']}>
              <li className='my-bottom-border'>
                <section>
                  <h4>杭州亚雀科技有限公司</h4>
                  <p>未知状态 于文文</p>
                  <p>9:43更新 | 成单指数<em>4</em></p>
                </section>
                <footer>
                  <a>1</a>
                  <a>2</a>
                </footer>
              </li>
              <li className='my-bottom-border'>
                <section>
                  <h4>杭州亚雀科技有限公司</h4>
                  <p>未知状态 于文文</p>
                  <p>9:43更新 | 成单指数<em>4</em></p>
                </section>
                <footer>
                  <a>1</a>
                  <a>2</a>
                </footer>
              </li>
              <li className='my-bottom-border'>
                <section>
                  <h4>杭州亚雀科技有限公司</h4>
                  <p>未知状态 于文文</p>
                  <p>9:43更新 | 成单指数<em>4</em></p>
                </section>
                <footer>
                  <a>1</a>
                  <a>2</a>
                </footer>
              </li>
            </ul>
          </div>
        </Content>
      </div>
    )
  }
}

export default Partner

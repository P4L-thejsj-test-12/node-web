import React from 'react'
import { render } from 'react-dom'
import git from './git.json'

window.React = React

class App extends React.Component {

  constructor (props) {
    super(props)
    this.state = {
      branch: git['name'],
      commit: git['shortSHA'],
      author: git['lastCommitAuthor']
    }
  }

  render () {
    return (
      <div>
        <section className='splash'>
          <div className='content'>
            <h2>Hello World!</h2>
            <p>
              Runnable is a sandbox service that creates <b>full-stack environments</b> for your GitHub branches, so your team can integrate and test more often.
            </p>
          </div>
        </section>
        <section className='info'>
          <p>Current branch: <b>{ this.state.branch }</b></p>
          <p>Latest commit: <b>{ this.state.commit }</b></p>
          <p>Last commit author: <b>{ this.state.author }</b></p>
        </section>
      </div>)
  }

}

render(
  (<App />), document.getElementById('content')
)

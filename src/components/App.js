import React from 'react'
import git from '../git.json'

class App extends React.Component {

  constructor (props) {
    super(props)
    console.log(git.local)
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
            <h4>Your web application is running!</h4>
            <p>
              Make sure to <b>commit</b> or add a <b>branch</b> to see your changes show up below.
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

export default App

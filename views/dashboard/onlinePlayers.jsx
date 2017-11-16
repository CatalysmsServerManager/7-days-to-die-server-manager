import React from 'react';

class OnlinePlayers extends React.Component {
  constructor(props) {
    super(props);
    this.state = {players: []}
  }

  componentWillMount() {
  }

  render() {
    return <h1>{this.props.data}</h1>
  }

}

module.exports = OnlinePlayers
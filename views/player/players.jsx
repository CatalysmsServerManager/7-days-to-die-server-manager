import React from 'react';

class Players extends React.Component {
  constructor(props) {
    super(props);
    this.state = {players: []}
  }

  componentWillMount() {
    
  }

  render() {

    return <h1>{this.props.players.id}</h1>
  }

}

module.exports = Players
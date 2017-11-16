import React from 'react';

class Console extends React.Component {
  render() {
    console.log(this.props.server)
    return <h1>Console {this.props.server.name}</h1>
  }


}

module.exports = Console
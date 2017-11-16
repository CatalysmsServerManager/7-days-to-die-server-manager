import React from 'react';

class Dashboard extends React.Component {
  render() {
    return <h1>{this.props.server.name}</h1>
  }
}

module.exports = Dashboard
import React, { Component } from 'react';
import { connect } from 'react-redux';


class SecondaryHeader extends Component {
  constructor(props) {
    super(props);

    this.state = {};
    this.clickBack = this.clickBack.bind(this);
  }

  clickBack() {
    const view = this.props.currentView;
    this.props.goToPreviousView();
  }

  render() {
    return (
      <div className="votify-secondary-header">
          <p className="votify-back-btn" onClick={this.clickBack} >	Back</p>
      </div>
    );
  }
}

const MapState = null

export default connect(MapState, null)(SecondaryHeader);

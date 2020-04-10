import React, { Commponent } from 'react';
import { subscribeToDrawings } from './api';

class DrawingList extends React.Component {
  constructor(props) {
    super(props);

    subscribeToDrawings((drawing) => {
      this.setState((prevState) => ({
        drawings: prevState.drawings.concat([drawing]),
      }));
    });
  }

  state = {
    drawings: [],
  };

  render() {
    const drawings = this.state.drawings.map((d) => {
      return (
        <li className="DrawingList-item" key={d.id}>
          {d.name}
        </li>
      );
    });

    return <ul className="DrawingList">{drawings}</ul>;
  }
}

export default DrawingList;

import * as React from 'react';
import * as PropTypes from 'prop-types';

export class Line extends React.PureComponent {
  render() {
    const {
      x1, x2, y1, y2,
    } = this.props;
    return (
      <line
        style={{ stroke: 'lightgray', strokeWidth: '1px' }}
        x1={x1}
        x2={x2}
        y1={y1}
        y2={y2}
      />
    );
  }
}

Line.propTypes = {
  x1: PropTypes.number.isRequired,
  x2: PropTypes.number.isRequired,
  y1: PropTypes.number.isRequired,
  y2: PropTypes.number.isRequired,
};

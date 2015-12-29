import React, {Component} from 'react';
import rest from 'rest';

export default class PageableTable extends Component {
  constructor(props) {
    super(props);

    this.state = {
      data: []
    };
  }

  componentDidMount() {
    rest(this.props.dataPath).then((data) => this.setState({data: data}));
  }

  render() {
    let data = this.state.data.map(this.props.dataMapper);
    return (
      <div>
        <Pagination/>
        <table className="pageable-table">
          <tbody>{data}</tbody>
        </table>
      </div>
    );
  }
}
PageableTable.defaultProps = {
  dataMapper: function() {},
  dataPath: '/'
};

export class Pagination extends Component {
  render() {
    return (
      <ul className="pagination">
        <li className="pagination-link">First</li>
        <li className="pagination-link">Previous</li>
        <li className="pagination-link">Next</li>
        <li className="pagination-link">Last</li>
      </ul>
    );
  }
}
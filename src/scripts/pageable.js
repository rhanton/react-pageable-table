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
    let path = this.props.dataPath;
    path += path.indexOf('?') > -1 ? '&' : '?';
    path += 'page=0' + (this.props.sort.length > 0 ? '&sort=' + this.props.sort.join('&sort=') : '');
    rest(path).then((data) => this.setState({data: JSON.parse(data.entity).content}));
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.dataPath !== this.props.dataPath) {
      let path = nextProps.dataPath;
      path += path.indexOf('?') > -1 ? '&' : '?';
      path += 'page=0' + (nextProps.sort.length > 0 ? '&sort=' + nextProps.sort.join('&sort=') : '');
      rest(path).then(data => this.setState({data: JSON.parse(data.entity).content}));
    }
  }

  render() {
    let data = this.state.data.map(this.props.dataMapper);
    return (
      <div>
        <Pagination/>
        <table className={'pageable-table ' + this.props.className}>
          <thead>{this.props.tableHeader()}</thead>
          <tbody>{data}</tbody>
        </table>
      </div>
    );
  }
}
PageableTable.defaultProps = {
  dataMapper: function() {},
  dataPath: '/',
  sort: [],
  tableHeader: function() {}
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
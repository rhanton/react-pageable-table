import React from 'react';
import {render} from 'react-dom';
import PageableTable from 'react-pageable-table';

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      dataPath: 'data/data.json'
    };
  }

  tableHeader() {
    return (
      <tr>
        <th>ID</th>
        <th>Name</th>
        <th>Description</th>
      </tr>
    );
  }

  dataMapper(sw, idx) {
    return (
      <tr key={idx}>
        <td>{sw.id}</td>
        <td>{sw.name}</td>
        <td>{sw.description}</td>
      </tr>
    );
  }

  handlePageChange = page => {
    // This example page change handler is probably too simplistic for most apps,
    // you probably want to keep track of the current page somehow.
    this.setState({dataPath: this.state.dataPath + '?page=' + page});
  };

  render() {
    return (
      <div className="row">
        <h1>Table Wars</h1>
        <PageableTable dataPath={this.state.dataPath} dataMapper={this.dataMapper} tableHeader={this.tableHeader} onPageChange={this.handlePageChange}/>
      </div>
    );
  }
}

render(<App/>, document.getElementById('app'));
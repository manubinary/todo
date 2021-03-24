import React from 'react';
import './Home.css';
import {Row, Col} from 'react-bootstrap';
import data from './data.json';
import ToDo from './ToDo.js'

function Home() {

  return (
      <div className="mainHome">
        <Row className="mainHeader">
          <Col className="header">
            <h1>ToDo List</h1>
          </Col>
        </Row>
        <div className="mainContent">
          <ToDo data={data} />
        </div>
      </div>
    );
}

export default Home;

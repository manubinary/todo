import React, {useState, Fragment, useEffect} from 'react';
import './Home.css';
import SaveIcon from '@material-ui/icons/Save';
import moment from 'moment'
import Timer from './Timer'
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import TextField from '@material-ui/core/TextField';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Button from '@material-ui/core/Button';
import {Col, Row} from 'react-bootstrap';
import firebase from "firebase/app";
import firestore from  "firebase/firestore";
import {config} from '../config.js'
import Tooltip from '@material-ui/core/Tooltip';

function ToDo(props) {

  const [open, setOpen] = useState(false);
  const [addModal, setAddModal] = useState(false);
  const [selectedToDo, setSelectedToDo] = useState({});
  const [contentCritical, setContentCritical] = useState([]);
  const [contentHigh, setContentHigh] = useState([]);
  const [contentMedium, setContentMedium] = useState([]);
  const [contentLow, setContentLow] = useState([]);
  const [newToDo, setNewToDo] = useState({});
  const [selectedDocId, setSelectedDocId] = useState('');
  const [test, setTest] = useState(false);
  useEffect(() => {
    getList();
  }, []);
  if (!firebase.apps.length) {
   firebase.initializeApp(config);
  } else {
     firebase.app();
  }
  const db = firebase.firestore();
  const deleteDoc = (docId) => {
    db.collection("DataList").doc(docId).delete().then(() => {
      getList();
      }).catch((error) => {
        console.error("Error removing document: ", error);
    });
  }

  const getList = () => {
    const outputCritical = [];
    const outputHigh = [];
    const outputMedium = [];
    const outputLow = [];
    db.collection("DataList").where("priority", "==", 'critical').get().then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        outputCritical.push(getEachRow(doc));
      });
    setContentCritical (outputCritical);
    });
    db.collection("DataList").where("priority", "==", 'high').get().then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        outputHigh.push(getEachRow(doc));
      });
    setContentHigh (outputHigh);
    });
    db.collection("DataList").where("priority", "==", 'medium').get().then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        outputMedium.push(getEachRow(doc));
      });
    setContentMedium (outputMedium);
    });
    db.collection("DataList").where("priority", "==", 'low').get().then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        outputLow.push(getEachRow(doc));
      });
    setContentLow (outputLow);
    });
  }

  const getAlertClass = (date) => {
    const difference = +new Date(date) - +new Date();
    const alertClass = (difference <= 1800000 && difference > 0) ? 'blink' : difference <= 0 ? 'expired' : '';
    return alertClass;
  };

  const getEachRow = (doc) => {
    return(
      <div className={"content " + doc.data().priority + " " + getAlertClass(doc.data().date)}>
        <Tooltip title={"Update " + doc.data().title}><EditIcon onClick={() => editModalOpen(open, doc.data(), doc.id)} className='iconStyle editIcon'/></Tooltip>
        <Tooltip title={"Delete " + doc.data().title}><DeleteIcon onClick={() => deleteDoc(doc.id)} className='iconStyle editIcon'/></Tooltip>
        <div className="title">{doc.data().title}</div>
        <div className="description">{doc.data().content}</div>
        <div className="date">On {moment(doc.data().date).format('MMMM Do YYYY')}</div>
        <div className="remains"><Timer date={doc.data().date}/></div>
      </div>);
  }
  const editModalOpen = (open, eachElelment, docId) => {
    setOpen(true);
    setSelectedToDo(eachElelment);
    setSelectedDocId(docId);
  }

  const editDetails = () => {
    return(
      <Dialog onClose={() => setOpen(!open)} aria-labelledby="simple-dialog-title" open={open} >
        <DialogTitle id="simple-dialog-title">Edit ToDo</DialogTitle>
        <DialogContent className="editContainer">
          <Fragment>
            <TextField id="standard-basic formElement" label="Title" autoFocus fullWidth value={selectedToDo.title} onChange={(event) => updateFormElement(event, 'title')} error={selectedToDo.title.length === 0 ? true : false}/>
            <TextField id="standard-multiline-static formElement" label="Description" multiline rows={4} fullWidth  value={selectedToDo.content} onChange={(event) => updateFormElement(event, 'content')}/>
            <InputLabel id="demo-simple-select-label formElement">Date and Time</InputLabel>
            <TextField id="datetime-local" label="Next appointment" type="datetime-local" defaultValue={moment(selectedToDo.date).format('yyyy-MM-DThh:mm:ss')} fullWidth onChange={(event) => updateFormElement(event, 'date')} InputLabelProps={{ shrink: true, }} />
            <InputLabel id="demo-simple-select-label formElement">Priority</InputLabel>
            <Select labelId="demo-simple-select-label" id="demo-simple-select" value={selectedToDo.priority} fullWidth onChange={(event) => updateFormElement(event, 'priority')} >
              <MenuItem value='critical'>Critical</MenuItem>
              <MenuItem value='high'>High</MenuItem>
              <MenuItem value='medium'>Medium</MenuItem>
              <MenuItem value='low'>Low</MenuItem>
            </Select>
            <Button variant="contained" color="primary" size="small" onClick={() => { updateToDo() }} startIcon={<SaveIcon />} disabled ={(selectedToDo.title && selectedToDo.priority) ? false : true}> Save </Button>
            <Button variant="contained" color="secondary" size="small" onClick={() => { setOpen(false) }} > Cancel </Button>
          </Fragment>
        </DialogContent>
      </Dialog>
      );
  }
  const addDetails = () => {
    return(
      <Dialog onClose={() => setAddModal(!addModal)} aria-labelledby="simple-dialog-title" open={addModal}>
        <DialogTitle id="simple-dialog-title">Add ToDo</DialogTitle>
        <DialogContent className="editContainer">
          <Fragment>
            <TextField id="standard-basic formElement" label="Title" autoFocus fullWidth onChange={(event) => addFormElement(event, 'title')} error={(newToDo.title && newToDo.title.length === 0) ? true : false}/>
            <TextField id="standard-multiline-static formElement" label="Description" multiline rows={4} fullWidth onChange={(event) => addFormElement(event, 'content')}/>
            <TextField id="datetime-local" label="Date and Time" type="datetime-local" defaultValue={moment().format('yyyy-MM-DThh:mm:ss')} fullWidth onChange={(event) => addFormElement(event, 'date')} InputLabelProps={{ shrink: true }} />
            <InputLabel id="demo-simple-select-label formElement" className="formElement" >Priority</InputLabel>
            <Select labelId="demo-simple-select-label" id="demo-simple-select" fullWidth onChange={(event)=>addFormElement(event, 'priority')} >
              <MenuItem value='critical'>Critical</MenuItem>
              <MenuItem value='high'>High</MenuItem>
              <MenuItem value='medium'>Medium</MenuItem>
              <MenuItem value='low'>Low</MenuItem>
            </Select>
            <Button variant="contained" color="primary" size="small" onClick={() => { addToDo() }} startIcon={<SaveIcon />} disabled ={(newToDo.title && newToDo.priority) ? false : true}> Save </Button>
            <Button variant="contained" color="secondary" size="small" onClick={() => { setAddModal(false)}} > Cancel </Button>
          </Fragment>
        </DialogContent>
      </Dialog>
      );
  }

  const updateToDo = () => {
    db.collection("DataList").doc(selectedDocId).update(selectedToDo)
      .then(() => {
          setOpen(false)
          setSelectedToDo({});
          getList();
      })
      .catch((error) => {
          console.error("Error adding document: ", error);
      });
  }

  const addToDo = () => {
    db.collection("DataList").add(newToDo)
      .then((docRef) => {
          console.log("Document written with ID: ", docRef.id);
          setAddModal(false);
          setNewToDo({});
          getList();
      })
      .catch((error) => {
          console.error("Error adding document: ", error);
      });
  }

  const addFormElement = (event, name) => {
    const dataUpdate = newToDo;
    dataUpdate[name] = event.target.value;
    setNewToDo(newToDo);
    setTest(!test);
  }

  const updateFormElement = (event, name) => {
    const dataUpdate = selectedToDo;
    dataUpdate[name] = event.target.value;
    setSelectedToDo(dataUpdate);
    setTest(!test);
  }

  return (
    <Col md={12} xs={12} lg={12} sm={12} className="mainHome">
      <Tooltip title="Add New ToDo"><AddCircleIcon onClick={() => setAddModal(true)} className='iconStyle createToDo'/></Tooltip>
      <Row className="contentHeaderRow">
        <Col md={3} xs={3} lg={3} sm={3}><p className="critical contentHeader">Critical</p></Col>
        <Col md={3} xs={3} lg={3} sm={3}><p className="high contentHeader">High</p></Col>
        <Col md={3} xs={3} lg={3} sm={3}><p className="medium contentHeader">Medium</p></Col>
        <Col md={3} xs={3} lg={3} sm={3}><p className="low contentHeader">Low</p></Col>
      </Row>
      <Row>
        <Col md={3} xs={3} lg={3} sm={3}>{contentCritical}</Col>
        <Col md={3} xs={3} lg={3} sm={3}>{contentHigh}</Col>
        <Col md={3} xs={3} lg={3} sm={3}>{contentMedium}</Col>
        <Col md={3} xs={3} lg={3} sm={3}>{contentLow}</Col>
      </Row>
      <div>{open && editDetails()}</div>
      <div>{addModal && addDetails()}</div>
    </Col>
    );
}

export default ToDo;

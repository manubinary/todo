import React, {useState, Fragment, useEffect} from 'react';
import './Home.css';
import SaveIcon from '@material-ui/icons/Save';
import StackGrid from 'react-stack-grid';
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

import firebase from "firebase/app";
import firestore from  "firebase/firestore";
import {config} from '../config.js'
function ToDo(props) {

  const [open, setOpen] = useState(false);
  const [addModal, setAddModal] = useState(false);
  const [selectedToDo, setSelectedToDo] = useState({});
  const [content, setContent] = useState([]);
  const [newToDo, setNewToDo] = useState({});
  const [selectedDocId, setSelectedDocId] = useState('');
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
    const content = [];
    db.collection("DataList").get().then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        content.push(
          <div className={"content " + doc.data().priority}>
            <EditIcon onClick={() => editModalOpen(open, doc.data(), doc.id)} className='iconStyle editIcon'/>
            <DeleteIcon onClick={() => deleteDoc(doc.id)} className='iconStyle editIcon'/>
            <div className="title">{doc.data().title}</div>
            <div className="description">{doc.data().content}</div>
            <div className="date">On {moment(doc.data().date).format('MMMM Do YYYY')}</div>
            <div className="remains"><Timer date={doc.data().date}/></div>
          </div>
        );
      });
    setContent (content);
    });
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
            <TextField id="standard-basic formElement" label="Title" autoFocus fullWidth value={selectedToDo.title}  onChange={(event) => updateFormElement(event, 'title')}/>
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
            <Button variant="contained" color="primary" size="small" onClick={() => { updateToDo() }} startIcon={<SaveIcon />} > Save </Button>
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
            <TextField id="standard-basic formElement" label="Title" autoFocus fullWidth onChange={(event) => addFormElement(event, 'title')} />
            <TextField id="standard-multiline-static formElement" label="Description" multiline rows={4} fullWidth onChange={(event) => addFormElement(event, 'content')}/>
            <TextField id="datetime-local" label="Date and Time" type="datetime-local" defaultValue={moment().format('yyyy-MM-DThh:mm:ss')} fullWidth onChange={(event) => addFormElement(event, 'date')} InputLabelProps={{ shrink: true }} />
            <InputLabel id="demo-simple-select-label formElement" className="formElement" >Priority</InputLabel>
            <Select labelId="demo-simple-select-label" id="demo-simple-select" fullWidth onChange={(event)=>addFormElement(event, 'priority')} >
              <MenuItem value='critical'>Critical</MenuItem>
              <MenuItem value='high'>High</MenuItem>
              <MenuItem value='medium'>Medium</MenuItem>
              <MenuItem value='low'>Low</MenuItem>
            </Select>
            <Button variant="contained" color="primary" size="small" onClick={() => { addToDo() }} startIcon={<SaveIcon />} > Save </Button>
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
  }

  const updateFormElement = (event, name) => {
    const dataUpdate = selectedToDo;
    dataUpdate[name] = event.target.value;
    setSelectedToDo(dataUpdate);
  }

  return (
    <div className="mainHome">
      <AddCircleIcon onClick={() => setAddModal(true)} className='iconStyle'/>
      <StackGrid columnWidth={400}>
        {content}
      </StackGrid>
      <div>{open && editDetails()}</div>
      <div>{addModal && addDetails()}</div>
    </div>
    );
}

export default ToDo;

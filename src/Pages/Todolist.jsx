/* eslint-disable no-unused-vars */
import React from 'react'
import { Box, TextField, Button, Typography, Alert } from '@mui/material'
import './css/Todolist.css'
import { useState } from 'react'
import axios from 'axios'
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { useEffect } from 'react'
const Todolist = () => {
  const[todo,setTodo]=useState('')
  const[status,setStatus]=useState(false)
  const[todoArray,setTodoArray]=useState([])
  const[editId,setEditId]=useState(null)
  const[editText,setEditText]=useState('')
  //console.log(todoArray)
  //add data to database
  const postTodo=async()=>{
    try{
       await axios.post('https://todo-server-ec2-k78z.onrender.com/addtodo', {todo}).then(
        (response)=>{console.log(response);
        });
       setTodo('') 
       setStatus(true)
       getTodo()
       setTimeout(()=>setStatus(false),3000)
    }
    catch(err){
      console.log(err)
    }
  }
  const getTodo=async()=>{
    try{
      await axios.get('https://todo-server-ec2-k78z.onrender.com/gettodo').then(
        (response)=>{setTodoArray(response.data)}
      )
    }
    catch(err){
      console.log(err)
    }
  }
  const deleteTodo=async(id)=>{
    try{
      await axios.delete(`https://todo-server-ec2-k78z.onrender.com/deletetodo/${id}`).then(
        (response)=>{console.log(response)}
      )
      getTodo()
    }
    catch(err){
      console.log(err)
    }
  }
  const startEdit=(id,currentText)=>{
    setEditId(id)
    setEditText(currentText)
  }
  
  const cancelEdit=()=>{
    setEditId(null)
    setEditText('')
  }
  
  const updateTodo=async(id)=>{
    try{
      await axios.put(`https://todo-server-ec2-k78z.onrender.com/updatetodo/${id}`,{todo:editText})
      setEditId(null)
      setEditText('')
      getTodo()
    }
    catch(err){
      console.log(err)
    }
  }
  useEffect(()=>{
    getTodo();
  })
  return (
    <div className='Todolist'>
      <Typography variant="h3" gutterBottom>
        TODOLIST APP
      </Typography>
      <Box sx={{ width: 700, maxWidth: '100%' }} className='box'>
        <TextField fullWidth label="ToDoWork" id="todo" value={todo}
        onChange={(e)=>setTodo(e.target.value)}/>
        <Button variant="contained" className='button' onClick={postTodo}>Add Work</Button>
      </Box>
      {
        status && (
        <div style={{position:"fixed",top:"20px",right:"20px",zIndex:9999}}>
          <Alert severity="success">
            Todo has been added
          </Alert>
        </div>
        )
      }
      <h4 className="list-title">List to be Done:</h4>
      <ul className="todo-list">
        {
          todoArray.map((res)=>{
            return <li key={res._id} className="todo-item">
              {editId === res._id ? (
                <div className="edit-mode">
                  <TextField 
                    value={editText} 
                    onChange={(e)=>setEditText(e.target.value)}
                    size="small"
                    className="edit-field"
                    variant="outlined"
                  />
                  <div className="edit-buttons">
                    <Button className="save-btn" size="small" onClick={() => updateTodo(res._id)}>Save</Button>
                    <Button className="cancel-btn" size="small" onClick={cancelEdit}>Cancel</Button>
                  </div>
                </div>
              ) : (
                <>
                  <h5 className="todo-text">{res.todo}</h5>
                  <div className="button-group">
                    <IconButton aria-label="edit" size="large" onClick={() => startEdit(res._id, res.todo)}>
                        <EditIcon />
                    </IconButton>
                    <IconButton aria-label="delete" size="large" onClick={() => deleteTodo(res._id)}>
                        <DeleteIcon />
                    </IconButton>
                  </div>
                </>
              )}
            </li>
          })//map is used to iterate through the series of objects in a array
          //keys to identify which items changed, added, or removed
        }
      </ul>
    </div>
  )
}

export default Todolist;


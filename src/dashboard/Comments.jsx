import React, { Component } from 'react';
import {Modal, ModalBody, ModalFooter,Table, ModalHeader, Col, Button,Form} from 'reactstrap';
import axios from 'axios';
let baseUrl = "http://localhost:3000"

function findeUserId(newCommentObject)
{
        fetch(baseUrl+"/users")
         .then(res => res.json())
         .then(response => {
                 response.forEach(userObject => {
                        if(userObject.userName === newCommentObject.owner)
                        {
                                     newCommentObject.userId = userObject.id;
                                      axios.post(baseUrl+"/comments",newCommentObject)
                                
                        }
                 })
         })
}
class Comments extends Component {
  state = {
    comments:[],
    newComment:{
      title:"",
      body:"",
      postId:"",
      owner:""
    },
    emptyField:false,
    modalOpen: false,
    editIsOn:false
  }
  toggle = () => {
    this.setState({
      modalOpen: !this.state.modalOpen
    })
  }
  reset = () => {
    this.setState({
      newComment:{
        title:"",
        body:"",
        postId:"",
        owner:""
      }
    })
  }
  isEditing()
  { 
      if(!this.state.editIsOn)
       return null;

       return <Button color="success" className="mt-2" onClick={this.saveChanges.bind(this)}>Save</Button>
  }
  saveChanges()
  {
    let updatedCommentObject = this.state.newComment;
    axios.put(baseUrl+"/comments/"+updatedCommentObject.id,updatedCommentObject)
     .then(() => {
      fetch(baseUrl+"/comments")
      .then(res => res.json())
      .then(response =>{
        this.setState({
          comments:response,
          newComment:{
            title:"",
            body:"",
            postId:"",
            owner:""
         },
         emptyField:false
        })
        this.toggle();
      })
     })
  }
  getReadOnlyId()
  {
    if(!this.state.editIsOn)
     return null;

     return <input className="form-control" type="text" value={this.state.newComment.id} readOnly></input>
  }
  disableOnEdit()
  {
    if(!this.state.editIsOn)
     return false
    
     return true
  }
  componentDidMount()
  {
    fetch(baseUrl+"/comments")
     .then(res => res.json())
     .then(response => {
       this.setState({
         comments:response
       })
     })
  }
  postComment()
  {
       for(const key in this.state.newComment)
        if(this.state.newComment[key]==="")
        {
         this.setState({emptyField:true})
         return;
        }
        let newCommentObject = {
          title:this.state.newComment.title,
          body:this.state.newComment.body,
          postId:this.state.newComment.postId,
          owner:this.state.newComment.owner,
          userId:"",
      }
      axios.get(baseUrl+"/comments")
       .then((res) => {
        findeUserId(newCommentObject);
        return res;
       })
       .then(res => {
          this.setState({
            comments:res.data,
            newComment:{
              title:"",
              body:"",
              postId:"",
              owner:""
            },
            editIsOn:false
          })
          this.toggle();
      })
}
editComment(commentToEdit)
{
  this.setState({
    newComment:commentToEdit,
    editIsOn:true
  })
  this.toggle();
}
deleteComment(commentToDelete)
{
       this.setState((prevState) => ({
         comments:prevState.comments.filter((comment) => comment!==commentToDelete)
       }))
       axios.delete(baseUrl+"/comments/"+commentToDelete.id);
}
addClassOnEdit()
{
  if(!this.state.editIsOn)
   return "";
  
   return "blurIt"
}
  render() {
    let span="";
    if(this.state.emptyField)
     span = <span>Please Fill All Fields</span>
    return (
      <div className="row">
      <Col md={12}>
      <Button className="btn my-1 new-post"   onClick={() => {
        this.setState({
          newComment:{ 
          title:"",
          body:"",
          postId:"",
          owner:""},
          editIsOn:false
        })
        this.toggle();
      }}>New Comment</Button>
    </Col>
      <Modal isOpen={this.state.modalOpen} toggle={this.toggle}>
      <ModalHeader toggle={this.toggle}>New User {span}</ModalHeader>
      <ModalBody>
        <Form>
        {this.getReadOnlyId()}
        <input value={this.state.newComment.title} 
        onChange={(e) => {
          this.setState(
            {newComment:{...this.state.newComment,title:e.target.value},
          emptyField:false}
          )}
        }
        type="text" placeholder="Title" className="form-control commentTitle"  />
        <input value={this.state.newComment.postId} disabled={this.disableOnEdit()}
        onChange={(e) => {
          this.setState(
            {newComment:{...this.state.newComment,postId:e.target.value},
          emptyField:false}
          )}
        }
        type="numebr" placeholder="Post ID" className="form-control postId" />
        <input value={this.state.newComment.owner} disabled={this.disableOnEdit()}
        onChange={(e) => {
          this.setState(
            {newComment:{...this.state.newComment,owner:e.target.value},
          emptyField:false })
        }}
        type="text" placeholder="UserName" className="form-control" />
        <textarea value={this.state.newComment.body}
        onChange={(e) => {
          this.setState(
            {newComment:{...this.state.newComment,body:e.target.value},
          emptyField:false})
          }}
        className="form-control"></textarea>
        </Form>
      </ModalBody>
      <ModalFooter>
         {this.isEditing()}
        <Button disabled={this.disableOnEdit()}  
        className={`btn btn-info mt-2 mr-1 ${this.addClassOnEdit()}`} 
        onClick={this.postComment.bind(this)}>Post</Button>
        <Button disabled={this.disableOnEdit()}  
        className={`btn btn-reset mt-2 ${this.addClassOnEdit()}`} 
        onClick={this.reset}>Clear</Button>
        <Button color="warning" className="mt-2" onClick={() => {
          this.reset();
          this.toggle();
        }}>Cancel</Button>
      </ModalFooter>
      </Modal>
      <Table>
         <thead className="custom">
           <th>Id</th>
           <th>Posted By</th>
           <th>body</th>
           <th>Actions</th>
         </thead>
         <tbody>
           {this.state.comments.map((comment,i) => (
             <tr key={i}>
               <td>{comment.id}</td>
               <td>{comment.owner}</td>
               <td>{comment.body.substring(0,30).concat("....")}</td>
               <td>
               <Button className="editBtn mx-1 far fa-edit" 
               onClick={() => this.editComment(comment)}> Edit</Button>
                 <Button className="delBtn mx-1 fas fa-trash-alt" 
                 onClick={() => this.deleteComment(comment)}> Delete</Button>
               </td>
             </tr>
           ))}
         </tbody>
      </Table>
      </div>
    );
  }
}

export default Comments;

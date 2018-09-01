import React, { Component } from 'react';
import axios from 'axios';
import {Modal, ModalBody, ModalFooter,Table, ModalHeader, Col, Button,Form} from 'reactstrap';
let rootUrl = "http://localhost:3000"
function deletePostsMadeByUser(userToBeDeleted)
{
   fetch(rootUrl+"/posts")
    .then(res => res.json())
    .then(response => {
      response.forEach(post => {
        if(post.userId === userToBeDeleted.id)
         axios.delete(rootUrl+"/posts/"+post.id)
      })
    })
}
function deleteCommentsMadeByUser(userToBeDeleted)
{
  fetch(rootUrl+"/comments")
  .then(res => res.json())
  .then(response => {
    response.forEach(comment => {
      if(comment.userId === userToBeDeleted.id)
       axios.delete(rootUrl+"/comments/"+comment.id);
    })
  })
}
class Users extends Component {

  state = {
    users: [],
    newUser:{
      newUserName:"",
    newUserUserName:"",
    newUserEmail:""
    },
    modalOpen: false
  }
  toggle = () => {
    this.setState({
      modalOpen: !this.state.modalOpen
    })
  }
  componentDidMount() {
    axios.get(rootUrl+"/users")
      .then(res => {
        this.setState({
          users: res.data
        })
      })
  }
  addNewUser()
  {
     let userObject = {
       name:this.state.newUser.newUserName,
       userName:this.state.newUser.newUserUserName,
       email:this.state.newUser.newUserEmail
     }
     axios.post(rootUrl+"/users",userObject)
     .then(() =>{
      fetch(rootUrl+"/users")
      .then(res => res.json())
      .then(res=>{
        this.toggle()
        this.setState({
          users:res
        })
      })
     })
     
  }
   deleteUser(user)
   {
      this.setState((prevState) => ({
        users:prevState.users.filter((currentUser) => currentUser!==user)
      }))
      deletePostsMadeByUser(user);
      deleteCommentsMadeByUser(user);
      axios.delete(rootUrl+"/users/"+user.id);
   }
   editUser(user)
   {
     this.setState({
       newUser:{
        newUserName:user.name,
        newUserEmail:user.email,
        newUserUserName:user.userName
       }
     })
     this.toggle();
   }
  render() {
    return (
      <div className="row">
      <Col md={12}>
      <Button className="btn  my-1" classID="new-post"  onClick={this.toggle}>New User</Button>
    </Col>
      <Modal isOpen={this.state.modalOpen} toggle={this.toggle}>
      <ModalHeader toggle={this.toggle}>New User</ModalHeader>
      <ModalBody>
          <Form>
          <input  value={this.state.newUser.newUserName} 
          onChange={(e) => this.setState({newUser:{...this.state.newUser,newUserName:e.target.value}})}
          type="text" placeholder="Your Name" className="form-control" />
          <input value={this.state.newUser.newUserEmail} 
          onChange={(e) => this.setState({newUser:{...this.state.newUser,newUserEmail:e.target.value}})} 
          type="email" placeholder="Your Email" className="form-control" />
          <input value={this.state.newUser.newUserUserName} 
          onChange={(e) => this.setState({newUser:{...this.state.newUser,newUserUserName:e.target.value}})}
          type="text" placeholder=" Your User Name" className="form-control"/>
          </Form>
      </ModalBody>
      <ModalFooter>
        <div>
          Footer
        </div>
        <Button type="button" onClick= {this.addNewUser.bind(this)}
          className="btn btn-info mt-2 mr-1" id="createUser">Create</Button>
          <Button type="reset" onClick={() => {this.setState({newUserName:"",newUserEmail:"",newUserUserName:""})}}
          className="btn btn-reset mt-2" id="clear">Clear</Button>
        <Button color="warning" className="mt-2" onClick={() => {
          this.setState(
            {newUser:{
              newUserName:"",
            newUserEmail:"",
            newUserUserName:""
            }
          })
          this.toggle();
        }}>Cancel</Button>
      </ModalFooter>
      </Modal>
      <Table md={12}>
        <thead className="custom" >
          <th>id</th>
          <th>Name</th>
          <th>UserName</th>
          <th>Actions</th>
        </thead>
        <tbody md={12}>
          {this.state.users.map((user,i) => (
            <tr key={i}>
            <td>{user.id}</td>
            <td>{user.name}</td>
            <td>{user.userName}</td>
            <td>
               <Button className="editBtn mx-1 far fa-edit" 
               onClick={() => this.editUser(user)}> Edit</Button>
               <Button className="delBtn mx-1 fas fa-trash-alt" 
               onClick={() => this.deleteUser(user)}> Delete</Button>
            </td>
            </tr>
          ))}
        </tbody>
      </Table>
      </div>
    );
  }
}

export default Users;

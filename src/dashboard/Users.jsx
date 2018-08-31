import React, { Component } from 'react';
import axios from 'axios';
import {Modal, ModalBody, ModalFooter,Table, ModalHeader, Col, Button,Form} from 'reactstrap';
let rootUrl = "http://localhost:3000"
class Users extends Component {

  state = {
    users: [],
    newUserName:"",
    newUserUserName:"",
    newUserEmail:"",
    modalOpen: false
  }
  toggle = () => {
    this.setState({
      modalOpen: !this.state.modalOpen
    })
  }
  componentDidMount() {
    // Ofc, you should use the local not this link
    axios.get(rootUrl+"/users")
      .then(res => {
        this.setState({
          users: res.data
        })
        // Now the state will be updated with the data received from response
      })
  }
  addNewUser()
  {
     let userObject = {
       name:this.state.newUserName,
       userName:this.state.newUserUserName,
       email:this.state.newUserEmail
     }
     axios.post(rootUrl+"/users",userObject);
  }
   deleteButton(user)
   {
      this.setState((prevState) => ({
        users:prevState.users.filter((currentUser) => currentUser!==user)
      }))
      axios.delete(rootUrl+"/users/"+user.id);
   }
   editButton(user)
   {
     this.setState({
       newUserName:user.name,
       newUserEmail:user.email,
       newUserUserName:user.userName
     })
     this.toggle;
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
          <input  value={this.state.newUserName} onChange={(e) => this.setState({newUserName:e.target.value})}
          type="text" placeholder="Your Name" className="form-control" />
          <input value={this.state.newUserEmail} onChange={(e) => this.setState({newUserEmail:e.target.value})} 
          type="email" placeholder="Your Email" className="form-control" />
          <input value={this.state.newUserUserName} onChange={(e) => this.setState({newUserUserName:e.target.value})}
          type="text" placeholder=" Your User Name" className="form-control"/>
          <Button type="button" onClick= {this.addNewUser.bind(this)}
          className="btn btn-info mt-2 mr-1" id="createUser">Create</Button>
          <Button type="button" onClick={() => {this.setState({newUserName:"",newUserEmail:"",newUserUserName:""})}}
           className="btn btn-warning mt-2 mr-1" id="cancelButton ">Cancel</Button>
          <Button type="reset" onClick={() => {this.setState({newUserName:"",newUserEmail:"",newUserUserName:""})}}
          className="btn btn-reset mt-2" id="clear">Clear</Button>
          </Form>
      </ModalBody>
      <ModalFooter>
        <div>
          Footer
        </div>
        <Button color="primary" onClick={this.toggle}>Do Something</Button>{' '}
        <Button color="secondary" onClick={this.toggle}>Cancel</Button>
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
               <Button className="editBtn" onClick={() => this.editButton(user)}>Edit</Button>
               <Button className="delBtn" onClick={() => this.deleteButton(user)}>Delete</Button>
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

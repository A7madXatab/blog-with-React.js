import React, { Component } from 'react';
import {Modal, ModalBody, ModalFooter,Table,Input, ModalHeader, Col, Button,Form} from 'reactstrap';
import axios from "axios"
let baseUrl = "http://localhost:3000"
function findUserId(postObject)
{
        fetch(baseUrl+"/users")
         .then(res =>res.json())
         .then(response => {
                 response.forEach(userObject => {
                        if(userObject.userName === postObject.userName)
                        {
                                      postObject.userId = userObject.id;
                                       findCategoryId(postObject);
                        }
                 })
         })
}
function findCategoryId(postObject)
{
        fetch(baseUrl+"/categories")
        .then(res =>res.json())
         .then(response => {
                 response.forEach(category => {
                         if(category.name === postObject.category)
                         {
                                 postObject.categoryId = category.id;
                                 axios.post(baseUrl+"/posts",postObject)
                         }
                 })
         })
}
class Posts extends Component {
   state = {
     posts:[],
     newPost:{
       body:"",
       title:"",
       categorey:"",
       userName:""
     },
     categories:[],
     modalOpen: false,
     emptyField:false,
     editIsOn:false,
     disable:false
   }
   toggle = () => {
    this.setState({
      modalOpen: !this.state.modalOpen
    })
  }
  postPost()
  {
      for(const key in this.state.newPost)
       {
         if(this.state.newPost[key]==="")
         {
           this.setState({emptyField:true})
           return;
         }
       }
       let newPostObject = {
         title:this.state.newPost.title,
         body:this.state.newPost.body,
         owner:this.state.newPost.userName,
         category:this.state.newPost.categorey,
         categoryId:"",
         userId:""
       }
         findUserId(newPostObject)
  }
   componentDidMount()
   {
     fetch(baseUrl+"/posts")
      .then(res => res.json())
      .then(response => {
        this.setState({
          posts:response
        })
      })

      fetch(baseUrl+"/categories")
       .then(res =>res.json())
       .then(response => {
         this.setState({
           categories:response
         })
       })
   }
   deletePost(post)
   {
      this.setState((prevState) => ({
        posts:prevState.posts.filter((currentPost) => currentPost!==post)
      }))
   }
   editPost(post)
   {
     this.setState({
       newPost:{
         title:post.title,
         owner:post.owner,
         body:post.body,
       },
       modalOpen:true,
       editIsOn:true
     })
   }
   isEditing()
   { 
       if(!this.state.editIsOn)
        return null;

        return <Button color="success" className="mt-2">Save</Button>
   }
   editIsOn()
   {
     if(!this.disable)
      return null;

      else return true
   }
   saveChangesToPost()
   {
   
   }
  render() {
    let span="";
    let button="";
    if(this.state.emptyField)
     span =<span>Please Fill all Fields</span>;
    return (
      <div className="row">
      <Col md={12}>
      <Button className="btn  my-1" classID="new-post"  onClick={() =>{
         this.setState({
          newPost:{
            body:"",
            title:"",
            categorey:"",
            userName:""
          }
         })
        ;this.toggle()}}>New User</Button>
    </Col>
    <div className="col-lg-12">
    <Modal isOpen={this.state.modalOpen} toggle={this.toggle} className="cc">
      <ModalHeader toggle={this.toggle}>New Post {span}
      </ModalHeader>
      <ModalBody>
      <Form action="" classID="cc" className="card">
      <div className="card-header">
       <h3 className="text-center">Catigories</h3>
       </div>
       {this.state.categories.map((categorey,i) => (
         <div key={i} className="border-bottom">
         <Input value={categorey.name}
         onClick={(e) =>this.setState({newPost:{...this.state.newPost,categorey:e.target.value}})} 
         className="col-lg-3 col-sm-1 col-md-3" type="radio" name="categorey" />
         <label className="ml-5">{categorey.name}</label>
         </div>
       ))}
     </Form>
      <Form>
      <input value={this.state.newPost.title} 
      onChange={(e) => this.setState({newPost:{...this.state.newPost,title:e.target.value}})}
      type="text" placeholder="Title" className="form-control" classID="title" />
      <input value={this.state.newPost.owner} 
      onChange={(e) => this.setState({newPost:{...this.state.newPost,userName:e.target.value}})}
      type="text" placeholder="UserName" className="form-control" classID="owner-of-post" />
      <textarea  value={this.state.newPost.body} 
      onChange={(e) =>this.setState({newPost:{...this.state.newPost,body:e.target.value}})}
      className="form-control" placeholder="What Do You Want to Say?"></textarea>
      </Form>
      </ModalBody>
      <ModalFooter>
      {this.isEditing()}
        <Button onClick={this.postPost.bind(this)} disabled={this.editIsOn()}
       type="button" className="btn btn-info mt-2 mr-1" classID="postButton">Post</Button>
       <Button type="reset" className="btn mt-2 clear" classID="clear">Clear</Button>
        <Button color="warning" className="mt-2" onClick={this.toggle}>Cancel</Button>
      </ModalFooter>
      </Modal>
      </div>
        <Table>
          <thead className="custom">
            <th>Id</th>
            <th>Title</th>
            <th>Body</th>
            <th>Actions</th>
          </thead>
          <tbody>
           {this.state.posts.map((post,i) =>(
             <tr>
             <td>{post.id}</td>
             <td>{post.title}</td>
             <td>{post.body.substring(0,30).concat(".....")}</td>
             <td>
             <Button className="editBtn mx-1" onClick={() => this.editPost(post)}>Edit</Button>
             <Button className="delBtn mx-1" onClick={() => this.deletePost(post)}>Delete</Button>
             </td>
             </tr>
           ))}
          </tbody>
        </Table>
      </div>
    );
  }
}

export default Posts;

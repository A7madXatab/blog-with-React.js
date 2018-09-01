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
                        if(userObject.userName === postObject.owner)
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
function deleteCommentsMadeOnPost(postToDelete)
{
   fetch(baseUrl+"/comments")
    .then(res => res.json())
    .then(response => {
      response.forEach(comment => {
        if(comment.postId === postToDelete.postId)
         axios.delete(baseUrl+"/comments/"+comment.id);
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
       owner:""
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
            this.toggle();
            axios.get(baseUrl+"/posts")
             .then(() => {
              fetch(baseUrl+"/posts")
              .then(res => res.json())
              .then(response =>{
                this.setState({
                  posts:response,
                  newPost:{
                   title:"",
                   body:"",
                   owner:"",
                   categorey:""
                 },
                 emptyField:false
                })
                this.toggle();
              })
             })
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
      deleteCommentsMadeOnPost(post);
      axios.delete(baseUrl+"/posts/"+post.id)
   }
   editPost(post)
   {
     this.setState({
       newPost:post,
       modalOpen:true,
       editIsOn:true
     })
   }
   isEditing()
  {
    if(!this.state.editIsOn)
     return null;
    
    return <Button className="mt-2 btn" color="success" onClick={this.saveChanges.bind(this)}>Save</Button>
  }
  saveChanges()
  {
    let updatedPostObject = this.state.newPost;
    axios.put(baseUrl+"/posts/"+updatedPostObject.id,updatedPostObject)
     .then(() => {
      fetch(baseUrl+"/posts")
      .then(res => res.json())
      .then(response =>{
        this.setState({
          posts:response,
          newPost:{
           title:"",
           body:"",
           owner:"",
           categorey:""
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

     return <input className="form-control" type="text" value={this.state.newPost.id} readOnly></input>
  }
  render() {
    let span="";
    if(this.state.emptyField)
     span =<span>Please Fill all Fields</span>;
    return (
      <div className="row container-fluid">
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
      {this.getReadOnlyId()}
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
        <Button onClick={this.postPost.bind(this)}
       type="button" className="btn btn-info mt-2 mr-1" classID="postButton">Post</Button>
       <Button type="reset" className="btn mt-2 clear" classID="clear">Clear</Button>
        <Button color="warning" className="mt-2" onClick={() => {
          this.setState({
            newPost:{
              body:"",
              title:"",
              categorey:"",
              owner:""
            },
            editIsOn:false
          })
          this.toggle();
        }}>Cancel</Button>
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
             <Button className="editBtn mx-1  far fa-edit" onClick={() => this.editPost(post)}>Edit</Button>
             <Button className="delBtn mx-1 fa-trash-alt" onClick={() => this.deletePost(post)}> Delete</Button>
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

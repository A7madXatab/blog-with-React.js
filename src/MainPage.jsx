import React, { Component } from 'react';
import {Modal, ModalBody, ModalFooter, ModalHeader, Input,Form,Col, Row, Button} from 'reactstrap';
import axios from 'axios';
const baseUrl = "http://localhost:3000"

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
class MainPage extends Component {

  state = {
    categories:[],
    posts:[],
    newPost:{
      body:"",
      title:"",
      categorey:"",
      owner:""
    },
    comments:[], 
    modalOpen: false,
    showByCategory:"All",
    editIsOn:false
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
         owner:this.state.newPost.owner,
         category:this.state.newPost.categorey,
         categoryId:"",
         userId:""
       }
         findUserId(newPostObject)
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
                 editIsOn:false,
                 emptyField:false
                })
                this.toggle();
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
  disableOnEdit()
  {
    if(!this.state.editIsOn)
     return false;

     return true;
  }
  addClassOnEdit()
  {
    if(!this.state.editIsOn)
     return "";
    
     return "blurIt"
  }
  componentDidMount()
  {
     axios.get(baseUrl+"/posts")
     .then(response => {
       this.setState({
         posts:response.data
       })
     })   
     axios.get(baseUrl+"/categories")
      .then(response => {
        this.setState({
          categories:response.data
        })
      })
      axios.get(baseUrl+"/comments") 
       .then(response => {
         this.setState({
           comments:response.data
         })
       })
  }
  render() {
    let span="";
    if(this.state.emptyField)
     span =<span>Please Fill all Fields</span>;
    return (
      <Row>
        {/* <Col md={12}> is same as <div className="col-md-12">  */}
        <Col md={12}>
          <Button className="new-post" onClick={this.toggle}>New Post</Button>
        </Col>
        <Col md={12}>
        <Modal isOpen={this.state.modalOpen} toggle={this.toggle} className="cc">
        <ModalHeader toggle={this.toggle}>New Post {span}
        </ModalHeader>
        <ModalBody>
        <Form action=""  className="card">
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
        <Form className="mx-2">
        {this.getReadOnlyId()}
        <input value={this.state.newPost.title} 
        onChange={(e) => this.setState({newPost:{...this.state.newPost,title:e.target.value}})}
        type="text" placeholder="Title" className="form-control" classID="title" />
        <input value={this.state.newPost.owner} disabled={this.disableOnEdit()}
        onChange={(e) => this.setState({newPost:{...this.state.newPost,owner:e.target.value}})}
        type="text" placeholder="UserName" className="form-control" classID="owner-of-post" />
        <textarea  value={this.state.newPost.body} 
        onChange={(e) =>this.setState({newPost:{...this.state.newPost,body:e.target.value}})}
        className="form-control" placeholder="What Do You Want to Say?"></textarea>
        </Form>
        </ModalBody>
        <ModalFooter>
          {this.isEditing()}
          <Button onClick={this.postPost.bind(this)} disabled={this.disableOnEdit()}
         type="button" className={`btn btn-info mt-2 mr-1 ${this.addClassOnEdit()}`} classID="postButton">Post</Button>
         <Button  disabled={this.disableOnEdit()} 
         type="reset" className={`btn mt-2 clear ${this.addClassOnEdit()}`}>Clear</Button>
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
        </Col>
        <div className="col-lg-3 col-md-6 col-sm-12">
        <div className="card-header text-center pb-2">
                <h4>Catigories</h4>
                </div>
        <div className="col-lg-12 card text-right" id="catigoriesList">
                  <div className="border-bottom">
                     <label className="mr-1">All</label>
                     <input  type="radio" name="category" onClick={(e) =>this.setState({showByCategory:"All"})}/>
                  </div>
                {this.state.categories.map((category,i) => (
                    <div className="border-bottom">
                    <label className="mr-1">{category.name}</label>
                    <input onClick={(e) => this.setState({showByCategory:e.target.value})}
                    type="radio" name="category" value={category.name}/>
                    </div>
                ))}
          </div>
      </div>
      <div class="col-lg-8 col-md-12 col-sm-12" id="posts">
      <h1>Showing {this.state.showByCategory} posts</h1>
        {this.state.posts.map((post,i) => {
            if(this.state.showByCategory === "All")
             return ( <div key={i} className="col-lg-12 col-md-6 col-sm-12 postDiv">
             <h3 className="mt-1 ml-2">{post.title}</h3>
             <h5 className="ml-2">@{post.owner}</h5>
             <p className="ml-2">{post.body}</p>
             <Button className="editBtn mx-1 my-1 far fa-edit"  onClick={() => this.editPost(post)}>Edit</Button>
             <Button className="delBtn mx-1 my-1 fas fa-trash-alt" onClick={() => this.deletePost(post)}> Delete</Button>
             {this.state.comments.map((comment,i) => {
               if(comment.postId === post.id.toString())
                return (
                  <div key={i} className="commentsDiv my-1">
                      <h4 className="ml-1">{comment.title}</h4>
                      <h6 className="ml-1">Made By     @{comment.owner}</h6>
                      <p className="ml-1">{comment.body}</p>
                  </div>
                )
             })}
          </div>)
          else {
            if(post.category === this.state.showByCategory)
             return ( <div key={i} className="col-lg-12 col-md-6 col-sm-12 postDiv">
             <h3 className="mt-1 ml-2">{post.title}</h3>
             <h5 className="ml-2">@{post.owner}</h5>
             <p className="ml-2">{post.body}</p>
             {this.state.comments.map((comment,i) => {
               if(comment.postId === post.id.toString())
                return (
                  <div key={i} className="commentsDiv my-1">
                      <h4 className="ml-1">{comment.title}</h4>
                      <h6 className="ml-1">Made By     @{comment.owner}</h6>
                      <p className="ml-1">{comment.body}</p>
                  </div>
                )
             })}
          </div>)
          }
         })}
      </div>
      </Row>
    );
  }
}

export default MainPage;

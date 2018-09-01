import React, { Component } from 'react';
import {Modal, ModalBody, ModalFooter, ModalHeader, Col, Row, Button} from 'reactstrap';
import axios from 'axios';
const baseUrl = "http://localhost:3000"
class MainPage extends Component {

  state = {
    categories:[],
    posts:[],
    comments:[], 
    modalOpen: false,
    showByCategory:"All"
  }

  toggle = () => {
    this.setState({
      modalOpen: !this.state.modalOpen
    })
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
    return (
      <Row>
        {/* <Col md={12}> is same as <div className="col-md-12">  */}
        <div className="col-md-12">
          Main Page
        </div>

        <Col md={12}>
          <Button color="success" onClick={this.toggle}>Toggle Modal</Button>
        </Col>

        <Col md={12}>
        <Modal isOpen={this.state.modalOpen} toggle={this.toggle}>
          <ModalHeader toggle={this.toggle}>Modal title</ModalHeader>
          <ModalBody>
            You may use form here :)
          </ModalBody>
          <ModalFooter>
            <div>
              Footer
            </div>
            <Button color="primary" onClick={this.toggle}>Do Something</Button>{' '}
            <Button color="secondary" onClick={this.toggle}>Cancel</Button>
          </ModalFooter>
        </Modal>
        </Col>
        <div className="col-lg-3 col-md-6 col-sm-12">
        <div className="col-lg-12 card text-right" id="catigoriesList">
                <h4>Catigories</h4>
                  <div className="border-bottom">
                     <label className="mr-1">All</label>
                     <input type="radio" name="category" onClick={(e) =>this.setState({showByCategory:"All"})}/>
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

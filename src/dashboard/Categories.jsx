import React, { Component } from 'react';
import {Modal, ModalBody, ModalFooter,Table, ModalHeader, Col, Button,Form} from 'reactstrap';
import axios from 'axios';
let rootUrl = "http://localhost:3000"
function updatePostsCategoryToDate(updateCategoryObject)
{
  fetch(rootUrl+"/posts")
   .then(res => res.json())
   .then(response => {
     response.forEach(post => {
       if(post.categoryId === updateCategoryObject.id)
        {
          post.category = updateCategoryObject.name;
          axios.put(rootUrl+"/posts/"+post.id,post);
        }
     })
   })
}

function resetPostCategory(categoryToBeDeleted)
{
  fetch(rootUrl+"/posts")
   .then(res => res.json())
   .then(response => {
     response.forEach(post => {
       if(post.categoryId === categoryToBeDeleted.id)
       {
         post.category = "Uncatagorized";
         post.categoryId = 1;
         axios.put(rootUrl+"/posts/"+post.id,post);
       }
     })
   })
}
class Categories extends Component {
  state= {
    categories:[],
    newCategory:{
      name:""
    },
    categoryId:"",
    modalOpen: false,
    emptyField:false,
    editIsOn:false
  }
  toggle = () => {
    this.setState({
      modalOpen: !this.state.modalOpen
    })
  }
  componentDidMount()
  {
     fetch(rootUrl+"/categories")
     .then(res =>res.json())
       .then(res =>{
         this.setState({categories:res})
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
    let updateCategoryObject = {
      name:this.state.newCategory.name,
      id:this.state.newCategory.id
    }
    axios.put(rootUrl+"/categories/"+this.state.newCategory.id,updateCategoryObject)
     .then(() => {
       updatePostsCategoryToDate(updateCategoryObject);
       this.toggle();
       fetch(rootUrl+"/categories")
       .then(res => res.json())
       .then(response =>{
         this.setState({
           categories:response,
           newCategory:{
            name:""
          },
          emptyField:false
         })
       })
      })
  }
  addNewCategory()
  {
    if(this.state.newCategory.name==="")
     this.setState({emptyField:true})
     else{
        let newCategoryObject= {
          name:this.state.newCategory.name
       }
       axios.post(rootUrl+"/categories",newCategoryObject)
       .then(() =>{
        this.toggle();
        fetch(rootUrl+"/categories")
        .then(res => res.json())
        .then(response =>{
          this.setState({
            categories:response,
            newCategory:{
             name:""
           },
           emptyField:false
          })
        })
       })
      }
  }
  deleteCategory(categoryObject)
  {
    this.setState(
      {categories:this.state.categories.filter((category) =>category !== categoryObject)
      })
      resetPostCategory(categoryObject);
      axios.delete(rootUrl+"/categories/"+categoryObject.id)
  }
  editCategory(categoryObject)
  {
    this.setState({
      newCategory:{
        name:categoryObject.name,
        id:categoryObject.id
      },
      editIsOn:true
    })
    this.toggle();
  }
  reset()
  {
    this.setState({
      newCategory:{...this.state.newCategory,name:""}
    })
  }
  getReadOnlyId()
  {
    if(!this.state.editIsOn)
     return null;

     return <input className="form-control" type="text" value={this.state.newCategory.id} readOnly></input>
  }
  getPostId()
  {
         fetch(rootUrl+"/categories")
          .then(res => res.json())
          .then(response => {
            response.forEach(category => {
              if(category.name === this.state.newCategory.name)
               return category.name
            })
          })
  }
  render() {
    let span=""
     if(this.state.emptyField)
      span = <span>Please fill The input</span>
    return (
      <div className="row">
      <Col md={12}>
      <Button className="btn mb-4 new-post" onClick={() => {
        this.setState({newCategory:{
          name:""
        }})
        this.toggle()
      }}>New Categorey</Button>
    </Col>
      <Modal isOpen={this.state.modalOpen} toggle={this.toggle}>
      <ModalHeader toggle={this.toggle}>New Categorey {span}</ModalHeader>
      <ModalBody>
          <Form>
            {this.getReadOnlyId()}
            <input value={this.state.newCategory.name} 
            onChange={(e) => this.setState({newCategory:{...this.state.newCategory,name:e.target.value}})}
            type="text" placeholder="Catigorey Name" className="form-control catigoreyTitle" />
          </Form>
      </ModalBody>
      <ModalFooter>
      {this.isEditing()}
        <Button onClick={this.addNewCategory.bind(this)}
        type="button" className="btn btn-info mt-2 mr-1">Add</Button>
        <Button onClick={this.reset.bind(this)}
        type="reset" className="btn btn-reset mt-2"
        >Clear</Button>
        <Button color="warning" className="mt-2" onClick={() => {
          this.reset()
          this.toggle();
          this.setState({editIsOn:false})
        }}>Cancel</Button>
      </ModalFooter>
      </Modal>
         <Table>
            <thead className="custom">
              <th>Id</th>
              <th>Name</th>
              <th>Actions</th>
            </thead>
            <tbody>
              {this.state.categories.map((category,i) => (
                <tr key={i}>
                  <td>{category.id}</td>
                  <td>{category.name}</td>
                  <td>
                  <Button className="editBtn mx-1 far fa-edit" 
                  onClick={() => this.editCategory(category)}> Edit</Button>
                    <Button className="delBtn mx-1 fa-trash-alt" 
                    onClick={() => this.deleteCategory(category)}> Delete</Button>
                  </td>
                </tr>
              ))}
            </tbody>
         </Table>
      </div>
    );
  }
}

export default Categories;

//eslint-disable-next-line
import React, { Component } from 'react';
//eslint-disable-next-line
import { Route, NavLink } from 'react-router-dom';
import { Navbar, Nav, NavItem, Collapse, NavbarToggler } from 'reactstrap';
//NavbarBrand,

class Layout extends Component {
    state = {
        isOpen: false
    }

    toggle = () => {
        this.setState({
            isOpen: !this.state.isOpen
        });
    }

    render() {
        return (
            <div>
                <Navbar color="light" light expand="md">
                    <NavLink className="navbar-brand" to="/">Re:Coded Blog</NavLink>
                    <NavbarToggler onClick={this.toggle} />
                    <Collapse isOpen={this.state.isOpen} navbar>
                        <Nav className="ml-auto" navbar>
                            <NavItem>
                                <NavLink  to="/posts" className="nav-link" activeClassName="active">Posts</NavLink>
                            </NavItem>
                            <NavItem>
                                <NavLink  to="/MainPage" className="nav-link" activeClassName="active">MainPage</NavLink>
                            </NavItem>
                            <NavItem>
                                <NavLink to="/comments" className="nav-link" activeClassName="active">Comments</NavLink>
                            </NavItem>
                            <NavItem>
                                <NavLink to="/categories" className="nav-link" activeClassName="active">Categories</NavLink>
                            </NavItem>
                            <NavItem>
                                <NavLink to="/users" className="nav-link" activeClassName="active">Users</NavLink>
                            </NavItem>
                        </Nav>
                    </Collapse>
                </Navbar>
                {this.props.children}
            </div>
        );
    }
}

export default Layout;

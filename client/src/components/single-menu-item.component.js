import 'bootstrap/dist/css/bootstrap.css';

import {Button, Card, ListGroupItem, ListGroup } from 'react-bootstrap'

import React from 'react'

import "./orders.css"
// display of single menu item... when pressed, it automatically updates the "currentItem" state to the currently selected dish's name and chef
//also decided to update the newOrder state (for sending post request to add order) here...might as well..
const Menu = ({menuData, updateCurrent, updateNewOrder, updateOrder, deleteSingleItem}) => {
    
    return (
        <div className='container'>
            <div className='cardContainer' >

                <Card style={{ width: '18rem'}} onClick={() => updateCurrentDish()} >
                    <Card.Img variant="top" src="holder.js/100px180?text=Image cap" />
                    <Card.Body>
                        <Card.Title>{ menuData !== undefined && menuData.dish}</Card.Title>
                        <Card.Text>
                            { menuData !== undefined && menuData.description}  
                        </Card.Text>
                    </Card.Body>
                        <ListGroup className="list-group-flush">
                            <ListGroupItem>location: {menuData !== undefined && menuData.zipcode}</ListGroupItem>
                            <ListGroupItem>Chef: { menuData !== undefined && menuData.chef}</ListGroupItem>
                            <ListGroupItem>{ menuData !== undefined && menuData.price}</ListGroupItem>
                        </ListGroup>
                        
                </Card>
            </div>
            <Button onClick={() => deleteSingleItem(menuData._id)}>delete item</Button>
        </div>


        
    )
    function updateCurrentDish(){
        
        updateCurrent({
            "zipcode": menuData.zipcode,
            "dish": menuData.dish,
            
        });
        updateOrder({
            "dish": menuData.dish,  
            "chef": menuData.chef, 
            "price": menuData.price, 
        }
        );
        updateNewOrder(true)
        
        
    }


}

export default Menu
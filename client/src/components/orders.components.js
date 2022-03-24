import React, {useState, useEffect} from 'react';

import axios from "axios";

import {Row, Button, Form, Container, Modal } from 'react-bootstrap'

import Order from './single-order.component';

import Menu from './single-menu-item.component'


const Orders = () => {

    const [orders, setOrders] = useState([]) //list of orders
    const [refreshData, setRefreshData] = useState(false) //refreshing data
    const [menu, setMenu] = useState([]); //list of menu items in the database
    const [addNewOrder, setAddNewOrder] = useState(false) //when an item is selected, this will be set to true to trigger the popup modal that puts in your info
    const [addNewItem, setAddNewItem]  = useState({"dish": "", "description":"", "price": 0, "chef":"", "zipcode": ""}) //used for post request to add a new item onto the menu
    const [newOrder, setNewOrder] = useState({"dish": "", "name":"", "chef": "", "price": 0, "zipcode":""}) //used for post request to add a new ORDER 
    const [currentItem, setCurrentItem] = useState({"dish": "", "zipcode":""}) //this is a bit confusing but when an item is selected, it updates the state to currently selected dish and its chef's zip code..used later for comparing if the buyer's zipcode is same as chef's
    const [showOrders, setShowOrders] = useState(false) //when "see current order" button is clicked, this gets set to true to trigger the popup modal that shows all the orders
    const [showAddNewItem, setShowAddNewItem] = useState(false) //when "add new menu item" button is pressed, this gets set to true to trigger the modal to add new menu item and its info
    //gets run at initial loadup
    useEffect(() => {
        getAllMenuItems();
        getAllOrders();
    }, [])

    //refreshes the page
    if(refreshData){
        setRefreshData(false);
        getAllMenuItems();
        getAllOrders();
    }
    
    return (
        <div>
            {/* button to see all the current orders */}
            <Container>
                <Button onClick={() => orders !== null?setShowOrders(true):alert("You don't have any orders currently")}>See current orders</Button>
            </Container>

            {/* button to add new dish onto the menu */}
            <Container>
                <Button onClick={() => setShowAddNewItem(true)}>add new menu item</Button>
            </Container>

            {/* pop up for displaying all the current orders */}
            <Modal show={showOrders} onHide={() => setShowOrders(false)} centered >
                Orders:
                {orders != null && orders.map((order, i) => (
                        <Order key = {order._id} orderData={order} deleteSingleOrder={deleteSingleOrder}/>
                ))}
                
            </Modal>

            {/* displaying all the menu dishes */}
            <Container>

                {menu != null && menu.map((menuItem, i) => (
                    <Menu key={menuItem._id}  menuData={menuItem} updateCurrent = {setCurrentItem} updateNewOrder = {setAddNewOrder} updateOrder = {setNewOrder} deleteSingleItem = {deleteSingleItem}/>
                ))}
            </Container>
            
            {/* pop up to add order when user clicks on a dish */}
            <Modal show={addNewOrder} onHide={() => setAddNewOrder(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Order {currentItem.dish} </Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <Form.Group>
                        {/* forms, name and zipcode to check if user's zipcode matches with the chef's */}
                        <Form.Label>your name </Form.Label>
                        <Form.Control onChange={(event) => {newOrder.name = event.target.value}}/>
                        <Form.Label>your zipcode</Form.Label>
                        <Form.Control onChange={(event) => {newOrder.zipcode = event.target.value}}/>
                        
                    </Form.Group>
                    <Button onClick={() => addSingleOrder()}>Add</Button>
                    <Button onClick={() => setAddNewOrder(false)}>Cancel</Button>
                </Modal.Body>
            </Modal> 
            {/* popupp modal to add new dish onto the menu with its infos */}
            <Modal show={showAddNewItem} onHide={() => setShowAddNewItem(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>add new dish </Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <Form.Group>
                        
                        <Form.Label>dish </Form.Label>
                        <Form.Control onChange={(event) => {addNewItem.dish = event.target.value}}/>
                        <Form.Label>description</Form.Label>
                        <Form.Control onChange={(event) => {addNewItem.description = event.target.value}}/>
                        <Form.Label>price</Form.Label>
                        <Form.Control onChange={(event) => {addNewItem.price = event.target.value}}/>
                        <Form.Label>chef name</Form.Label>
                        <Form.Control onChange={(event) => {addNewItem.chef = event.target.value}}/>
                        <Form.Label>chef's zipcode</Form.Label>
                        <Form.Control onChange={(event) => {addNewItem.zipcode = event.target.value}}/>
                        
                        
                        
                        
                    </Form.Group>
                    <Button onClick={() => addMenuItem()}>Add</Button>
                    <Button onClick={() => setShowAddNewItem(false)}>Cancel</Button>
                </Modal.Body>
            </Modal> 
        </div>
        
    );
    //  add menu item POST
    function addMenuItem(){
        setShowAddNewItem(false)
        var url = "http://localhost:3000/menu/create"
        if(addNewItem.price === 0 || addNewItem.dish === ""||addNewItem.dish === "" || addNewItem.zipcode === "" || addNewItem.chef === ""){
            alert("All of the fields must be filled")
        }
        else{
            axios.post(url,{
                "dish": addNewItem.dish, 
                "description":addNewItem.description, 
                "price": parseFloat(addNewItem.price), 
                "chef":addNewItem.chef, 
                "zipcode": addNewItem.zipcode
            }).then(response => {
                if(response.status === 200){
                    setRefreshData(true)
                }
            })
        }
        
    }
    //creates a new order POST
    function addSingleOrder(){
        setAddNewOrder(false)
        var url = "http://localhost:3000/order/create"
        
        if(currentItem.zipcode != newOrder.zipcode){
            // console.log("the neworder zipcode is " + newOrder.zipcode)
            // console.log("the newitem zipcode is " + newItem.zipcode)
            alert("zip code must allign with chef's")
        }
        else{
            axios.post(url, {
                "customername": newOrder.name,
                "dish": newOrder.dish,
                "price": parseFloat(newOrder.price),
                "chef": newOrder.chef,
                "zipcode":newOrder.zipcode
                    
            }).then(response => {
                if(response.status === 200){
                    setRefreshData(true)
                }
            })

        }
        
        
    }

    //gets all the menu items GET
    function getAllMenuItems(){
        var url = "http://localhost:3000/menu"
        axios.get(url, {
            responseType: 'json'
        }).then(response => {
            if(response.status === 200){
                setMenu(response.data)
            }
        })
    }
    //gets all the orders GET
    function getAllOrders(){
        var url = "http://localhost:3000/orders"
        axios.get(url, {
            responseType: 'json'
        }).then(response => {
            if(response.status === 200){
                setOrders(response.data)
            }
        })
    }

    //deletes a single order DELETE
    function deleteSingleOrder(id){
        var url = "http://localhost:3000/order/delete/" + id
        axios.delete(url, {

        }).then(response => {
            if(response.status === 200){
                setRefreshData(true)
            }
        })
    }
    // deletes a single menu item from the menu DELETE
    function deleteSingleItem(id){
        var url = "http://localhost:3000/menu/delete/" + id
        axios.delete(url, {

        }).then(response => {
            if(response.status === 200){
                setRefreshData(true)
            }
        })
    }

}

export default Orders
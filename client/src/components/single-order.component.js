import React from 'react';
import 'bootstrap/dist/css/bootstrap.css';

import {Button, Card, Row, Col} from 'react-bootstrap'
//display of single order
const Order = ({orderData,  deleteSingleOrder}) => {

    return (
        <Card>
            <Row>
                <Col>Dish:{ orderData !== undefined && orderData.dish}</Col>
                <Col>Price: ${orderData !== undefined && orderData.price}</Col>
                <Col>Buyer: { orderData !== undefined && orderData.customername}</Col>
                <Col><Button onClick={() => deleteSingleOrder(orderData._id)}>delete order</Button></Col>
               
            </Row>
        </Card>
    )

}

export default Order
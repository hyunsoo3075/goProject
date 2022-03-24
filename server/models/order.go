package models

import (
	"go.mongodb.org/mongo-driver/bson/primitive"
)

//order json format
type Order struct {
	ID           primitive.ObjectID `bson:"_id"`
	CustomerName *string            `json:"customername" binding:"required"`
	Dish         *string            `json:"dish" binding:"required"`
	Price        *float64           `json:"price" binding:"required"`
	Chef         *string            `json:"chef" binding:"required"`
	Zipcode      *string            `json:"zipcode" binding:"required"`
}

package models

import (
	"go.mongodb.org/mongo-driver/bson/primitive"
)

// Item json format
type Item struct {
	ID          primitive.ObjectID `bson:"_id"`
	Dish        *string            `json:"dish" binding:"required"`
	Description *string            `json:"description" binding:"required"`
	Price       *float64           `json:"price" binding:"required"`
	Chef        *string            `json:"chef" binding:"required"`
	Zipcode     *string            `json:"zipcode" binding:"required"`
}

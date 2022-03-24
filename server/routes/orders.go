package routes

import (
	"context"
	"fmt"
	"net/http"
	"time"

	"server/models"

	"github.com/gin-gonic/gin"
	"github.com/go-playground/validator/v10"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

var validate = validator.New()

//collection of orders. now somehow use mongos' api to manipulate this data
var orderCollection *mongo.Collection = OpenCollection(Client, "orders")
var menuCollection *mongo.Collection = OpenCollection(Client, "menu")

//add an order POST
func AddOrder(c *gin.Context) {
	//context used to cut off the service if it takes way to long
	var ctx, cancel = context.WithTimeout(context.Background(), 100*time.Second)
	//instantiate class models.order struct
	var order models.Order
	//bind returns a pointer to the POST body message to the address of the var called "order", if theres an error, it returns nil
	if err := c.BindJSON(&order); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		fmt.Println(err)
		return
	}
	//validates the structure of received body message to match with our predefined order.go in models
	validationErr := validate.Struct(order)
	if validationErr != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": validationErr.Error()})
		fmt.Println(validationErr)
		return
	}
	//generate object id
	order.ID = primitive.NewObjectID()
	//mongos api inserone() insert a object into their database
	result, insertErr := orderCollection.InsertOne(ctx, order)
	if insertErr != nil {
		msg := fmt.Sprintf("order item was not created")
		c.JSON(http.StatusInternalServerError, gin.H{"error": msg})
		fmt.Println(insertErr)
		return
	}

	//defer statements delay the execution of the function or method or an anonymous method until the nearby functions returns
	defer cancel()

	c.JSON(http.StatusOK, result)
}

func AddItem(c *gin.Context) {
	//context used to cut off the service if it takes way to long
	var ctx, cancel = context.WithTimeout(context.Background(), 100*time.Second)
	//instantiate class models.order struct
	var menu models.Item
	//bind returns a pointer to the POST body message to the address of the var called "menu", if theres an error, it returns nil
	if err := c.BindJSON(&menu); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		fmt.Println(err)
		return
	}
	//validates the structure of received body message to match with our predefined item.go in models
	validationErr := validate.Struct(menu)
	if validationErr != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": validationErr.Error()})
		fmt.Println(validationErr)
		return
	}
	//generate object id
	menu.ID = primitive.NewObjectID()
	//mongos api inserone() insert a object into their database
	result, insertErr := menuCollection.InsertOne(ctx, menu)
	if insertErr != nil {
		msg := fmt.Sprintf("order item was not created")
		c.JSON(http.StatusInternalServerError, gin.H{"error": msg})
		fmt.Println(insertErr)
		return
	}

	//defer statements delay the execution of the function or method or an anonymous method until the nearby functions returns
	defer cancel()

	c.JSON(http.StatusOK, result)
}

//get all orders GET
func GetMenu(c *gin.Context) {
	var ctx, cancel = context.WithTimeout(context.Background(), 100*time.Second)
	var menu []bson.M
	cursor, err := menuCollection.Find(ctx, bson.M{})
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		fmt.Println(err)
		return
	}
	if err = cursor.All(ctx, &menu); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		fmt.Println(err)
		return
	}
	defer cancel()

	fmt.Println(menu)
	c.JSON(http.StatusOK, menu)
}

func GetOrders(c *gin.Context) {

	var ctx, cancel = context.WithTimeout(context.Background(), 100*time.Second)
	//instantiate orders = a list
	var orders []bson.M
	//find is reading all the data
	cursor, err := orderCollection.Find(ctx, bson.M{})

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		fmt.Println(err)
		return
	}

	if err = cursor.All(ctx, &orders); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		fmt.Println(err)
		return
	}

	defer cancel()

	//fmt.Println(orders)

	c.JSON(http.StatusOK, orders)
}

//get an order by its id GET
func GetOrderById(c *gin.Context) {

	orderID := c.Params.ByName("id")
	docID, _ := primitive.ObjectIDFromHex(orderID)

	var ctx, cancel = context.WithTimeout(context.Background(), 100*time.Second)

	var order bson.M

	if err := orderCollection.FindOne(ctx, bson.M{"_id": docID}).Decode(&order); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		fmt.Println(err)
		return
	}

	defer cancel()

	fmt.Println(order)

	c.JSON(http.StatusOK, order)
}

//delete an order given the id
func DeleteOrder(c *gin.Context) {

	orderID := c.Params.ByName("id")
	docID, _ := primitive.ObjectIDFromHex(orderID)

	var ctx, cancel = context.WithTimeout(context.Background(), 100*time.Second)

	result, err := orderCollection.DeleteOne(ctx, bson.M{"_id": docID})

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		fmt.Println(err)
		return
	}

	defer cancel()

	c.JSON(http.StatusOK, result.DeletedCount)

}

func DeleteMenu(c *gin.Context) {

	orderID := c.Params.ByName("id")
	docID, _ := primitive.ObjectIDFromHex(orderID)

	var ctx, cancel = context.WithTimeout(context.Background(), 100*time.Second)

	result, err := menuCollection.DeleteOne(ctx, bson.M{"_id": docID})

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		fmt.Println(err)
		return
	}

	defer cancel()

	c.JSON(http.StatusOK, result.DeletedCount)

}

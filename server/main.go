package main

import (
	"os"
	"server/routes"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func main() {

	port := os.Getenv("PORT")

	if port == "" {
		port = "3000"
	}

	router := gin.New()
	router.Use(gin.Logger())

	router.Use(cors.Default())

	router.POST("/order/create", routes.AddOrder)
	router.POST("/menu/create", routes.AddItem)
	router.GET("/orders", routes.GetOrders)
	router.GET("/order/:id/", routes.GetOrderById)
	router.GET("/menu", routes.GetMenu)

	router.DELETE("/order/delete/:id", routes.DeleteOrder)
	router.DELETE("/menu/delete/:id", routes.DeleteMenu)
	//this runs the server and allows it to listen to requests.
	router.Run(":" + port)
}

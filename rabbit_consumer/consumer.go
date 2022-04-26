package main

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"time"

	"github.com/go-redis/redis/v8"
	_ "github.com/go-sql-driver/mysql"
	"github.com/streadway/amqp"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

/*

!New Struct
* Request_number
* game
* gamename
* winner
* players

*/

type Winner struct {
	Game_id   int
	Players   string
	Game_name string
	Winner    int
	Queue     string
}

type Log struct {
	Request_number int
	Game           int
	Gamename       string
	winner         string
	players        int
	worker         string
}

var ctx = context.Background()
var redisClient *redis.Client

func main() {

	conn, err := amqp.Dial("amqp://AdminSO1:admin@34.125.65.198:5672/")

	if err != nil {
		log.Fatal(err)
	}
	defer conn.Close()

	ch, err := conn.Channel()

	if err != nil {
		log.Fatal(err)
	}

	defer ch.Close()

	chDelivery, err := ch.Consume(
		"cola_ganadores",
		"",
		true,
		false,
		false,
		false, nil)

	if err != nil {
		log.Fatal(err)
	}

	noStop := make(chan bool)

	go func() {
		for delivery := range chDelivery {

			fmt.Println("message: " + string(delivery.Body))
			var winner Winner
			json.Unmarshal([]byte(delivery.Body), &winner)
			//!fmt.Println(winner.Game_id)
			fmt.Println(winner)
			addMongo(winner)
		}
	}()

	<-noStop
}

// * Agregar a mongo DB
func addMongo(winner Winner) {
	fmt.Println("******MONGO********")
	var MONGO = "mongodb://34.125.254.18:27017/"

	client, err := mongo.NewClient(options.Client().ApplyURI(MONGO))
	if err != nil {
		log.Fatal(err)
	}

	ctx, _ := context.WithTimeout(context.Background(), 10*time.Second)
	err = client.Connect(ctx)
	if err != nil {
		log.Fatal(err)
	}
	defer client.Disconnect(ctx)

	// winnerBytes, err := json.Marshal(winner)
	// if err != nil {
	// 	panic(err)
	// }

	collection := client.Database("Practica2").Collection("logs")
	res, insertErr := collection.InsertOne(ctx, winner)
	if insertErr != nil {
		log.Fatal(insertErr)
	}
	fmt.Println(res)
	fmt.Println("Información Almacenada en Mongodb")

}

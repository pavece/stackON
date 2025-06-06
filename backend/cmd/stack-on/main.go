package main

import (
	"fmt"
	"net/http"

	"github.com/go-chi/chi/v5"
	"github.com/pavece/stackON/internal/api/routes"
)


func main() {
	fmt.Println("Hello stackON")

	
	//Setup http server + chi
	chiRouter := chi.NewRouter()
	routes.MountRoutes(chiRouter)

	http.ListenAndServe(":3000", chiRouter)
}
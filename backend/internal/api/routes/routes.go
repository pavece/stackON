package routes

import (
	"github.com/go-chi/chi/v5"
	testcontrollers "github.com/pavece/stackON/internal/api/controllers/test"
)

func MountRoutes(router *chi.Mux) {
	
	//Temporary
	router.Get("/", testcontrollers.TestController)
}
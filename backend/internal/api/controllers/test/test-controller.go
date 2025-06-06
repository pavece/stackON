package testcontrollers

import "net/http"

func TestController(w http.ResponseWriter, r *http.Request) {
	w.Write([]byte("Welcome"));
}
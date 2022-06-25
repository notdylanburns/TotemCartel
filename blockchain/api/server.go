package api

import (
	"fmt"
	"net/http"

	"github.com/gorilla/mux"
	"github.com/notdylanburns/TotemCartel/blockchain/api/handlers"
	"github.com/notdylanburns/TotemCartel/blockchain/internal"
	"github.com/notdylanburns/TotemCartel/blockchain/pkg/lock"
)

func Start() {
	fsbc := internal.OpenBlockChain("/var/mr_blockchain")
	hc := handlers.CreateContext(lock.Create(fsbc))

	m := mux.NewRouter()

	m.HandleFunc("/view/{fmt}", hc.View).Methods("GET")
	m.HandleFunc("/add", hc.Add).Methods("POST")

	fmt.Print(http.ListenAndServe(":8080", m))
}

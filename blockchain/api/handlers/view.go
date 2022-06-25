package handlers

import (
	"fmt"
	"net/http"

	"github.com/gorilla/mux"
	"github.com/notdylanburns/TotemCartel/blockchain/internal"
	"github.com/notdylanburns/TotemCartel/blockchain/pkg/util"
)

// path=/view

func hex(bc *internal.FSBlockChain) string {
	s := ""
	for _, blk := range bc.GetAllBlocks() {
		block_bytes := blk.GetBytes()
		hexstring := util.U8ToHexString(block_bytes[:])
		for j := 0; j < 16; j++ {
			s += fmt.Sprintln(hexstring[j*16 : 16+j*16])
		}
	}

	return s
}

func (hc *HandlerContext) View(res http.ResponseWriter, req *http.Request) {
	res.WriteHeader(200)
	res.Header().Add("content-type", "text/html")
	fmt.Println(mux.Vars(req)["fmt"])

	hc.bc.Acquire()
	bc, ok := hc.bc.Value.(*internal.FSBlockChain)
	if !ok {
		panic("Corrupted blockchain")
	}

	res.Write([]byte(fmt.Sprintf(`
	<!DOCTYPE html>
	<html>
		<head>
			<title>View Blockchain</title>
		</head>
		<body>
			%s
		</body>
	</html>
	`, hex(bc))))

	hc.bc.Release()

}

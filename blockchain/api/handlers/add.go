package handlers

import (
	"net/http"

	"github.com/notdylanburns/TotemCartel/blockchain/internal"
	"github.com/notdylanburns/TotemCartel/blockchain/pkg/blockchain"
	"github.com/notdylanburns/TotemCartel/blockchain/pkg/util"
)

// path=/

func (hc *HandlerContext) Add(res http.ResponseWriter, req *http.Request) {
	body := make([]byte, 80)
	n, err := req.Body.Read(body)

	if n != 80 {
		res.WriteHeader(400)
		res.Header().Add("content-type", "application/json")
		res.Write([]byte("{\"err\": \"request too short\"}"))
		return
	} else if err != nil {
		panic(err)
	}

	success := (body[0] & 0b10000000) > 0

	u64 := [8]byte{}

	copy(u64[:], body[0:])
	typenum := util.U8ToU64(u64)

	copy(u64[:], body[8:])
	subtype := util.U8ToU64(u64)

	copy(u64[:], body[16:])
	user := util.U8ToU64(u64)

	data := [56]byte{}
	copy(data[:], body[24:])

	blk := blockchain.CreateBlock(success, typenum, subtype, user)
	blk.AddData(data)

	hc.bc.Acquire()
	bc, ok := hc.bc.Value.(*internal.FSBlockChain)
	if !ok {
		panic("Corrupted blockchain")
	}

	bc.AddBlock(blk)

	res.WriteHeader(200)
	res.Header().Add("content-type", "application/json")
	res.Write([]byte("{\"err\": null}"))

	hc.bc.Release()
}

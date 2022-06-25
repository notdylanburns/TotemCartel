package handlers

import "github.com/notdylanburns/TotemCartel/blockchain/pkg/lock"

type HandlerContext struct {
	bc *lock.LockedValue
}

func CreateContext(bc *lock.LockedValue) *HandlerContext {
	hc := new(HandlerContext)
	hc.bc = bc

	return hc
}

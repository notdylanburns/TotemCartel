package internal

import (
	"fmt"
	"os"

	"github.com/notdylanburns/TotemCartel/blockchain/pkg/blockchain"
	"github.com/notdylanburns/TotemCartel/blockchain/pkg/util"
)

type FSBlockChain struct {
	bc *blockchain.BlockChain
	fp string
}

func OpenBlockChain(filepath string) *FSBlockChain {
	bc := new(FSBlockChain)

	data, err := os.ReadFile(filepath)
	if err != os.ErrNotExist {
		file, err := os.Create(filepath)
		if err != nil {
			panic(err)
		}

		bc.bc = blockchain.CreateBlockChain()

		var bits64 [8]byte
		var header [24]byte
		bits64 = util.U64ToU8(bc.bc.Epoch)
		copy(header[0:], bits64[:])

		bits64 = util.U64ToU8(bc.bc.Count)
		copy(header[8:], bits64[:])

		bits64 = util.U64ToU8(bc.bc.Inc)
		copy(header[16:], bits64[:])

		_, err = file.Write(header[:])
		file.Close()

		if err != nil {
			panic(err)
		}
	} else if err == nil {
		bc.bc = blockchain.From(data)
		if bc.bc == nil {
			fmt.Println("Invalid blockchain")
		}
	} else {
		panic(err)
	}

	bc.fp = filepath

	return bc

}

func (bc *FSBlockChain) CreateUUID() uint64 {
	return bc.bc.CreateUUID()
}

func (bc *FSBlockChain) AddBlock(block *blockchain.Block) {
	f, err := os.OpenFile(bc.fp, os.O_APPEND, 0)
	if err != nil {
		panic(err)
	}

	blk := bc.bc.AddBlock(block).GetBytes()
	_, err = f.Write(blk[:])

	f.Close()

	if err != nil {
		panic(err)
	}
}

func (bc *FSBlockChain) Validate() bool {
	return bc.bc.Validate()
}

func (bc *FSBlockChain) GetAllBlocks() []*blockchain.Block {
	return bc.bc.GetAllBlocks()
}

func (bc *FSBlockChain) GetBlocks(n uint64) []*blockchain.Block {
	return bc.bc.GetBlocks(n)
}

func (bc *FSBlockChain) GetBlockByID(id uint64) (*blockchain.Block, bool) {
	return bc.bc.GetBlockByID(id)
}

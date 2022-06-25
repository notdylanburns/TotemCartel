package blockchain

import (
	"crypto/sha256"
	"time"

	"github.com/notdylanburns/TotemCartel/blockchain/pkg/hash"
	"github.com/notdylanburns/TotemCartel/blockchain/pkg/util"
)

type BlockChain struct {
	blocks []*Block
	Count  uint64
	Epoch  uint64
	Inc    uint64
}

func CreateBlockChain() *BlockChain {
	bc := new(BlockChain)
	bc.Epoch = uint64(time.Now().Unix())
	return bc
}

func From(bytes []byte) *BlockChain {
	bc := new(BlockChain)

	var epoch [8]byte
	copy(epoch[:], bytes[0:])
	bc.Epoch = util.U8ToU64(epoch)

	var count [8]byte
	copy(count[:], bytes[0:])
	bc.Count = util.U8ToU64(count)

	var inc [8]byte
	copy(inc[:], bytes[0:])
	bc.Inc = util.U8ToU64(inc)

	for i := uint64(0); i < bc.Count; i++ {
		bc.blocks = append(bc.blocks, BlockFrom(bytes[24+i*1024:1048+i*1024]))
	}

	return bc
}

func (bc *BlockChain) CreateUUID() uint64 {
	t := time.Now()
	// 42 bit number
	elapsed := uint64(t.Unix()) - bc.Epoch
	// 10 bit number 0 - 999
	ms := uint64(t.Nanosecond() / 1000000)

	uuid := uint64(0)
	uuid |= (elapsed & 0x000003ffffffffff) << 22
	uuid |= (ms & 0x3ff) << 12
	uuid |= (bc.Inc & 0xfff)

	//fmt.Printf("uuid: %064b\n", uuid)
	//fmt.Println("      ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^                        Timestamp")
	//fmt.Println("                                                ^^^^^^^^^^              Millisecs")
	//fmt.Println("                                                          ^^^^^^^^^^^^  Increment")

	//fmt.Println((uuid & 0x3ff000) >> 12)

	bc.Inc++

	return uuid
}

func (bc *BlockChain) AddBlock(block *Block) *Block {

	uuid := bc.CreateUUID()

	if bc.Count == 0 {
		block.Finalise(hash.Hash256{0}, uuid)
	} else {
		block.Finalise(bc.blocks[bc.Count-1].CreateHash(), uuid)
	}

	bc.blocks = append(bc.blocks, block)

	bc.Count++

	util.PrintBlock(block.GetBytes())

	return block

}

func (bc *BlockChain) Validate() bool {
	var prev_bytes [128]byte
	var new_bytes [128]byte
	var new_hash [32]byte
	for i := 0; i < int(bc.Count); i++ {
		new_bytes = bc.blocks[i].GetBytes()
		if i != 0 {
			copy(new_hash[:], new_bytes[32:])
			if sha256.Sum256(prev_bytes[:]) != new_hash {
				return false
			}
		}
		prev_bytes = new_bytes
	}

	return true
}

func (bc *BlockChain) GetAllBlocks() []*Block {
	return bc.blocks
}

func (bc *BlockChain) GetBlocks(n uint64) []*Block {
	if n == 0 {
		return []*Block{}
	} else if n > bc.Count {
		return bc.GetAllBlocks()
	}

	return bc.blocks[bc.Count-n:]
}

func (bc *BlockChain) GetBlockByID(id uint64) (*Block, bool) {
	for _, block := range bc.blocks {
		if block.UUID == id {
			return block, true
		}
	}

	return nil, false
}

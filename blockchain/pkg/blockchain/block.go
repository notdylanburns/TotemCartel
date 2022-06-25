package blockchain

import (
	"time"

	"crypto/sha256"

	"github.com/notdylanburns/TotemCartel/blockchain/pkg/hash"
	"github.com/notdylanburns/TotemCartel/blockchain/pkg/util"
)

type Block struct {
	Success  bool
	Type     uint64
	Subtype  uint64
	User     uint64
	Epoch    uint64
	PrevHash hash.Hash256
	UUID     uint64
	Data     [56]byte
}

func CreateBlock(success bool, type_num uint64, subtype_num uint64, user uint64) *Block {
	blk := new(Block)

	blk.Success = success
	blk.Type = type_num
	blk.Subtype = subtype_num
	blk.User = user

	return blk
}

func BlockFrom(bytes []uint8) *Block {
	if len(bytes) != 1024 {
		panic("BlockFrom(): len(bytes) != 1024")
	}

	blk := new(Block)
	blk.Success = (bytes[0] & 0b10000000) > 0

	var type_bytes [8]byte
	copy(type_bytes[:], bytes[0:])
	type_bytes[0] &= 0b01111111

	var subtype_bytes [8]byte
	copy(subtype_bytes[:], bytes[8:])

	var user_bytes [8]byte
	copy(user_bytes[:], bytes[16:])

	var epoch_bytes [8]byte
	copy(epoch_bytes[:], bytes[24:])

	var prev_hash [32]byte
	copy(prev_hash[:], bytes[32:])

	var uuid [8]byte
	copy(uuid[:], bytes[64:])

	var data [56]byte
	copy(data[:], bytes[72:])

	blk.Type = util.U8ToU64(type_bytes)
	blk.Subtype = util.U8ToU64(subtype_bytes)
	blk.User = util.U8ToU64(user_bytes)
	blk.Epoch = util.U8ToU64(epoch_bytes)
	blk.PrevHash = prev_hash
	blk.UUID = util.U8ToU64(uuid)
	blk.Data = data

	return blk
}

func (b *Block) GetBytes() [128]byte {
	bytes := [128]byte{0}
	for i, v := range util.U64ToU8(b.Type) {
		bytes[i] = v
	}

	if b.Success {
		bytes[0] |= 0b10000000
	} else {
		bytes[0] &= 0b01111111
	}

	for i, v := range util.U64ToU8(b.Subtype) {
		bytes[i+8] = v
	}

	for i, v := range util.U64ToU8(b.User) {
		bytes[i+16] = v
	}

	//fmt.Println(b.Epoch)
	//fmt.Println(util.U64ToU8(b.Epoch))
	//fmt.Printf("%016x\n", b.Epoch)
	for i, v := range util.U64ToU8(b.Epoch) {
		bytes[i+24] = v
	}

	for i, v := range b.PrevHash {
		bytes[i+32] = v
	}

	for i, v := range util.U64ToU8(b.UUID) {
		bytes[i+64] = v
	}

	// bytes[72] and onwards are unused by this block type

	return bytes
}

func (b *Block) Finalise(prev_hash hash.Hash256, uuid uint64) {
	b.Epoch = uint64(time.Now().Unix())
	b.UUID = uuid
	b.PrevHash = prev_hash
}

func (b *Block) CreateHash() hash.Hash256 {
	prev_bytes := b.GetBytes()
	return sha256.Sum256(prev_bytes[:])
}

func (b *Block) AddData(data [56]byte) {
	copy(b.Data[:], data[:])
}

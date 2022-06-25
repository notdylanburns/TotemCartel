package util

import "fmt"

func U64ToU8(n uint64) [8]uint8 {
	bytes := [8]uint8{0}
	for i := 0; i < 8; i++ {
		shift := 8 * (7 - i)
		bytes[i] = uint8((n & (0xff << shift) >> shift))
	}

	return bytes
}

func U8ToU64(bytes [8]uint8) uint64 {
	n := uint64(0)
	for i := 0; i < 8; i++ {
		shift := uint64(8 * (7 - i))
		n += uint64(bytes[i]) << shift
	}

	return n
}

func U8ToHexString(bytes []uint8) string {
	var str []byte
	nib_lkup := map[uint8]byte{
		0: '0', 1: '1', 2: '2', 3: '3',
		4: '4', 5: '5', 6: '6', 7: '7',
		8: '8', 9: '9', 10: 'a', 11: 'b',
		12: 'c', 13: 'd', 14: 'e', 15: 'f',
	}
	for _, b := range bytes {
		str = append(str, nib_lkup[(b&0xf0)>>4])
		str = append(str, nib_lkup[(b&0x0f)])
	}

	return string(str)
}

func PrintBlock(bytes [128]byte) {
	var success_bit byte
	if (bytes[0] & 0x80) > 0 {
		success_bit = '1'
	} else {
		success_bit = '0'
	}

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

	prev_hash_str := U8ToHexString(prev_hash[:])

	fmt.Printf("Block %s:\n", U8ToHexString(uuid[:]))
	fmt.Printf("    Success:    %c\n", success_bit)
	fmt.Printf("    Type:       %d\n", U8ToU64(type_bytes))
	fmt.Printf("    Subtype:    %d\n", U8ToU64(subtype_bytes))
	fmt.Printf("    User:       %s\n", U8ToHexString(user_bytes[:]))
	fmt.Printf("    Timestamp:  %d\n", U8ToU64(epoch_bytes))
	fmt.Printf("    Prev. Hash: %s....%s\n", prev_hash_str[:6], prev_hash_str[58:])
	fmt.Printf("    Block ID:   %s\n", U8ToHexString(uuid[:]))

	data_str := U8ToHexString(data[:])
	fmt.Println("")

	for i := 0; i < 7; i++ {
		fmt.Printf("    %s\n", data_str[16*i:16*i+16])
	}

	fmt.Print("\n\n")
}

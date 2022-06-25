package main

import "github.com/notdylanburns/TotemCartel/blockchain/api"

func main() {
	/*bc := blockchain.CreateBlockChain()

	time.Sleep(5 * time.Second)

	for i := 0; i < 3; i++ {
		block := blockchain.CreateBaseBlock(true, 0, 0, 45623425436345)
		bc.AddBlock(block)

		time.Sleep(1 * time.Second)
	}

	fmt.Printf("Blockchain valid? %v\n", bc.Validate())*/
	api.Start()
}

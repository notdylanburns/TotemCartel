package main

import (
	"fmt"
	"time"
)

func main() {
	ch := make(chan int, 1)

	ch <- 0

	fmt.Printf("%T\n", ch)

	for i := 0; i < 3; i++ {
		go (func(id int) {
			v := <-ch
			fmt.Printf("i: %v v: %v\n", id, v)
			time.Sleep(1 * time.Second)
			ch <- v + 1
		})(i)
	}

	time.Sleep(10 * time.Second)

}

package lock

type LockedValue struct {
	lock  chan int
	Value interface{}
}

func Create(value interface{}) *LockedValue {
	lv := new(LockedValue)
	lv.lock = make(chan int, 1)
	lv.Value = value

	lv.lock <- 0

	return lv
}

func (lv *LockedValue) Acquire() {
	<-lv.lock
}

func (lv *LockedValue) Release() {
	lv.lock <- 1
}

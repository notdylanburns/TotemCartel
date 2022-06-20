export class CachedValue {
    constructor(ttl, retrieve) {
        this.ttl = ttl;
        this.last_retrieve = 0;
        this.last_value = null;
        this.retrieve = retrieve;
    }

    get value() {
        const calledAt = (new Date).getTime();
        if (calledAt > this.last_retrieve + this.ttl) {
            this.last_value = this.retrieve();
            this.last_retrieve = calledAt;
        }

        return this.last_value;
    }
}
class Deque {
    constructor() {
        this.frontQ = [];
        this.backQ = [];
    }

    size() {
        return this.frontQ.length + this.backQ.length;
    }

    front() {
        if (this.frontQ.length > 0) {
            return this.frontQ[this.frontQ.length - 1];
        } else {
            return this.backQ[0];
        }
    }

    back() {
        if (this.backQ.length > 0) {
            return this.backQ[this.backQ.length - 1];
        } else {
            return this.frontQ[0];
        }
    }

    push_front(x) {
        this.frontQ.push(x);
    }

    push_back(x) {
        this.backQ.push(x);
    }

    pop_front() {
        if (this.frontQ.length == 0) {
            this.frontQ = this.backQ;
            this.backQ = [];
            this.frontQ.reverse();
        }
        return this.frontQ.pop();
    }

    pop_back() {
        if (this.backQ.length == 0) {
            this.backQ = this.frontQ;
            this.frontQ = [];
            this.backQ.reverse();
        }
        return this.backQ.pop();
    }
}

module.exports = Deque;

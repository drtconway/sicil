class List {
    constructor() {
        this.K = new Map();
        this.nextKey = 0;
        this.Z = 0;
        this.nexts = new Map();
        this.prevs = new Map();
        this.firstKey = -1;
        this.lastKey = -1;
    }

    size() {
        return this.Z;
    }

    push(val) {
        let k = this.nextKey;
        this.nextKey += 1;
        this.K[k] = val;
        this.K.set(k, val);

        let l = this.lastKey;

        this.prevs.set(k, l);
        this.nexts.set(k, -1);
        if (l >= 0) {
            this.nexts.set(l, k);
        }
        if (this.firstKey < 0) {
            this.firstKey = k;
        }
        this.lastKey = k;

        this.Z += 1;
        return k;
    }
    
    front() {
        return this.K.get(this.firstKey);
    }

    back() {
        return this.K.get(this.lastKey);
    }

    get(k) {
        return this.K.get(k);
    }

    set(k, v) {
        return this.K.set(k, v);
    }

    prev(k) {
        return this.prevs.get(k);
    }

    next(k) {
        return this.nexts.get(k);
    }

    erase(k) {
        let p = this.prevs.get(k);
        let n = this.nexts.get(k);
        if (p >= 0) {
            this.nexts.set(p, n);
        }
        if (n >= 0) {
            this.prevs.set(n, p);
        }
        this.K.delete(k);
        this.nexts.delete(k);
        this.prevs.delete(k);
        if (this.firstKey == k) {
            this.firstKey = n;
        }
        if (this.lastKey == k) {
            this.lastKey = p;
        }
        this.Z -= 1;
    }
}

module.exports = List;

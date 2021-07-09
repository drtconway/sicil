
class Bitvec {
    constructor(z) {
        this.W = (z + 31) >>> 5;
        this.words = new Uint32Array(this.W);
    }

    get(i) {
        let w = i >>> 5;
        let b = i & 31;
        return (this.words[w] >>> b) & 1;
    }

    set(i, x) {
        let w = i >>> 5;
        let b = i & 31;
        let m = (-1 >>> 0) ^ (1 << b);
        this.words[w] = (this.words[w] & m) | (x << b);
    }
}

module.exports = Bitvec;

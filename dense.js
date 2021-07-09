const Bitvec = require('./bitvec');

const popc0 = function(x) {
    let r = 0;
    while (x > 0) {
        r += (x&1);
        x >>>= 1;
    }
    return r;
}

const popcounts8 = new Uint8Array(256);
for (let i = 0; i < 256; i++) {
    popcounts8[i] = popc0(i);
}

const popcount_impl = function(x) {
    x = x >>> 0;
    let r = 0;
    while (x > 0) {
        r += popcounts8[x & 0xff];
        x >>>= 8;
    }
    return r;
}

class Dense {
    constructor(xs) {
        this.count = xs.length >>> 0;
        this.size = (xs[this.count - 1] + 1) >>> 0;
        this.bits = new Bitvec(this.size);
        this.sums = new Uint32Array((this.size + 31) >>> 5);
        for (let i = 0; i < xs.length; i++) {
            this.bits.set(xs[i], 1);
            this.sums[xs[i] >>> 5] += 1;
        }
        let cum = 0;
        for (let i = 0; i < this.sums.length; i++) {
            let cum0 = cum;
            cum += this.sums[i];
            this.sums[i] = cum0;
        }
    }

    rank(x) {
        x = x >>> 0;
        let blk = x >>> 5;
        let bit = x & 31;
        let msk = (1 << x) - 1;
        let w = this.bits.words[blk];
        return this.sums[blk] + Dense.popcount(w & msk);
    }

    rank2(x1, x2) {
        return [this.rank(x1), this.rank(x2)];
    }

    contains(x) {
        return this.bits.get(x) == 1;
    }

    select(i) {
        let blk = this.select_block(i);
        let j = i - this.sums[blk];
        let w = this.bits.words[blk];
        return (blk << 5) + Dense.selectw(w, j);
    }

    select_block(i) {
        let lo = 0;
        let n = this.sums.length;
        while (n > 0) {
            let stp = n >>> 1;
            let j = lo + stp;
            if (this.sums[j] <= i) {
                lo = j + 1;
                n -= stp + 1;
            } else {
                n = stp;
            }
        }
        if (lo > 0) {
            lo -= 1;
        }
        return lo;
    }

    static selectw = function(w, j) {
        let p = 0;
        j += 1;
        while (j > 0) {
            if (w & 1) {
                j -= 1;
            }
            p += 1;
            w >>>= 1;
        }
        return p - 1;
    }

    static popcount = popcount_impl;
}

module.exports = Dense;

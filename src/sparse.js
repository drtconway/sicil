
class Sparse {
    constructor(xs) {
        this.xs = Uint32Array.from(xs);
        this.count = this.xs.length;
        this.size = this.xs[this.count - 1] + 1;
    }

    rank(x) {
        let lo = 0;
        let n = this.xs.length;
        while (n > 0) {
            let stp = n >>> 1;
            let i = lo + stp;
            if (this.xs[i] < x) {
                lo = i + 1;
                n -= stp + 1;
            } else {
                n = stp;
            }
        }
        return lo;
    }

    rank2(x1, x2) {
        let r1 = this.rank(x1);
        let r2 = r1;
        while (r2 < this.xs.length && this.xs[r2] < x2) {
            r2 += 1;
        }
        return [r1, r2];
    }

    contains(x) {
        let r = this.rank2(x, x+1);
        return r[0] < r[1];
    }

    select(i) {
        return this.xs[i];
    }
}

module.exports = Sparse;

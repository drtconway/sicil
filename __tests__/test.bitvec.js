const Bitvec = require('../src/bitvec');

class Rnd {
    constructor(x) {
        this.x = x >>> 0;
        this.a = 1103515245 >>> 0;
        this.c = 12345 >>> 0;
        this.m = ((1 << 31) - 1) >>> 0;
    }

    next() {
        this.x = ((this.a * this.x) + this.c) & this.m;
        this.x ^= (this.x << 5) ^ (this.x >>> 13);
        this.x &= this.m;
        return this.x;
    }
}

test('simple bitvec', () => {
    const N = 1024;
    const Nmsk = (N - 1) >>> 0;

    const M = 384;

    let X = new Set();
    let B = new Bitvec(N);

    let rng = new Rnd(19);
    while (X.size < M) {
        let x = rng.next() & Nmsk;
        X.add(x);
        B.set(x, 1);
    }

    for (let x = 0; x < N; x++) {
        expect(B.get(x) == 1).toBe(X.has(x));
    }
});



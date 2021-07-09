const Dense = require('../dense');

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

test('test popcount', () => {
    expect(Dense.popcount(0)).toBe(0);
    expect(Dense.popcount(1)).toBe(1);
    expect(Dense.popcount(3)).toBe(2);
    expect(Dense.popcount(12)).toBe(2);
    expect(Dense.popcount(-1)).toBe(32);
    expect(Dense.popcount((-1 >>> 0) ^ 256)).toBe(31);
});

test('selectw test', () => {
    let w = 0xff >>> 0;
    expect(Dense.selectw(w, 0)).toBe(0);
    expect(Dense.selectw(w, 1)).toBe(1);
    expect(Dense.selectw(w, 7)).toBe(7);
    w <<= 8;
    expect(Dense.selectw(w, 0)).toBe(8);
    expect(Dense.selectw(w, 1)).toBe(9);
    expect(Dense.selectw(w, 7)).toBe(15);
});

test('basic dense vector test', () => {
    const N = 1024;
    const Nmsk = (N - 1) >>> 0;

    const M = 384;

    let X = new Set();
    let rng = new Rnd(19);
    while (X.size < M) {
        let x = rng.next() & Nmsk;
        X.add(x);
    }
    X = Uint32Array.from(X);
    X.sort();

    let D = new Dense(X);
    expect(D.count).toBe(M);
    expect(D.size).toBe(X[X.length - 1] + 1);

    for (let i = 0; i < X.length; i++) {
        let x = X[i];
        let r = D.rank(x);
        expect(r).toBe(i);
        expect(D.contains(x)).toBe(true);
        let y = D.select(i);
        expect(y).toBe(x);
    }
});

test('dense vector with gap test', () => {
    let X = Uint32Array.from([11, 1011, 1012]);
    let D = new Dense(X);
    expect(D.count).toBe(3);
    expect(D.size).toBe(1013);
    expect(D.select(0)).toBe(11);
    expect(D.select(1)).toBe(1011);
    expect(D.select(2)).toBe(1012);
});


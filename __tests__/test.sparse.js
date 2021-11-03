const Sparse = require('../src/sparse');

const X = [
    5, 40, 8579, 8600, 8601, 8603, 8682, 9033, 9184, 10440, 10536,
    10586, 11542, 11667, 12292, 12364, 12784, 12881, 13296, 13376,
    14259, 14378, 14562, 14733, 15724, 15836, 16381, 16482, 16592,
    16608, 16762, 17924, 17951, 18015, 18393, 18507, 18508, 18510,
    18763, 19539, 19545, 19749, 19938, 20104, 20200, 20421, 20760,
    20825, 20903, 21058, 21177, 23682, 23869, 23961, 24060, 24590,
    24813, 24989, 25087, 25088, 25090, 25683, 25684];

test('basic sparse test', () => {
    const s = new Sparse(X);
    expect(s.count).toBe(63);
    expect(s.size).toBe(25685);

    for (let i = 0; i < X.length; i++) {
        let r = s.rank(X[i]);
        expect(r).toBe(i);
        let x = s.select(i);
        expect(x).toBe(X[i]);
    }
});

test('more exhaustive sparse test', () => {
    const s = new Sparse(X);
    expect(s.count).toBe(63);
    expect(s.size).toBe(25685);

    let x = 0;
    for (let i = 0; x < 10000 & i < X.length; i++) {
        let x0 = X[i];
        while (x < x0) {
            expect(s.rank(x)).toBe(i);
            expect(s.contains(x)).toBe(false);
            x++;
        }
        expect(x).toBe(X[i]);
        expect(s.contains(x)).toBe(true);
        x++;
    }
});

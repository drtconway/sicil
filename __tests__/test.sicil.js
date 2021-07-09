const Sicil = require('../sicil');

const fcsk = [
    [5,40], [5,25683], [5,25684], [8579,8600],
    [8579,8682], [8601,8603], [8601,8682], [9033,9184],
    [10440,10586], [10536,10586], [11542,11667], [12292,12364],
    [12784,12881], [13296,13376], [14259,14378], [14562,14733],
    [15724,15836], [16381,16482], [16592,16762], [16608,16762],
    [17924,18015], [17951,18015], [18393,18507], [18393,18763],
    [18508,18510], [18508,18763], [19539,19749], [19545,19749],
    [19938,20104], [20200,20421], [20760,20825], [20760,20903],
    [21058,21177], [23682,23869], [23961,24060], [24590,24813],
    [24989,25087], [24989,25683], [24989,25684], [25088,25090],
    [25088,25683], [25088,25684]];

const between = function(x, a) {
    return a[0] <= x && x <= a[1];
}

const overlaps = function(a, b) {
    return between(a[0], b) || between(a[1], b) || between(b[0], a) || between(b[1], a);
}

const expected = function(a) {
    let ex = [];
    for (let i = 0; i < fcsk.length; i++) {
        let b = fcsk[i];
        if (overlaps(a, b)) {
            ex.push(b);
        }
    }
    return ex;
}

test('Sicil.unique test', () => {
    let X = Uint32Array.from([1,1,2,3,3,3,3,3,4,4,4,5]);
    X = Sicil.unique(X);
    expect(X.length).toBe(5);
    expect(X[0]).toBe(1);
    expect(X[1]).toBe(2);
    expect(X[2]).toBe(3);
    expect(X[3]).toBe(4);
    expect(X[4]).toBe(5);
});

describe('basic test', () => {
    let S = new Sicil(fcsk);
    test('test before', () => {
        let xs = S.find(1);
        expect(xs.length).toBe(0);
    });
    test('test after', () => {
        let ys = S.find(1000000);
        expect(ys.length).toBe(0);
    });
    test('test at 10535', () => {
        let zs = S.find(10535);
        expect(zs.length).toBe(3);
        expect(zs[0]).toEqual([5, 25683]);
        expect(zs[1]).toEqual([5, 25684]);
        expect(zs[2]).toEqual([10440, 10586]);
    });
    test('test at 10536', () => {
        let zs = S.find(10536);
        expect(zs.length).toBe(4);
        expect(zs[0]).toEqual([5, 25683]);
        expect(zs[1]).toEqual([5, 25684]);
        expect(zs[2]).toEqual([10440, 10586]);
        expect(zs[3]).toEqual([10536, 10586]);
    });
    test('test at 10537', () => {
        let zs = S.find(10537);
        expect(zs.length).toBe(4);
        expect(zs[0]).toEqual([5, 25683]);
        expect(zs[1]).toEqual([5, 25684]);
        expect(zs[2]).toEqual([10440, 10586]);
        expect(zs[3]).toEqual([10536, 10586]);
    });
    test('test at 10586', () => {
        let zs = S.find(10586);
        expect(zs.length).toBe(4);
        expect(zs[0]).toEqual([5, 25683]);
        expect(zs[1]).toEqual([5, 25684]);
        expect(zs[2]).toEqual([10440, 10586]);
        expect(zs[3]).toEqual([10536, 10586]);
    });
    test('test at 10587', () => {
        let zs = S.find(10587);
        expect(zs.length).toBe(2);
        expect(zs[0]).toEqual([5, 25683]);
        expect(zs[1]).toEqual([5, 25684]);
    });
});

describe('range query test', () => {
    let S = new Sicil(fcsk);
    test('test [10530, 10535]', () => {
        let a = [10530, 10535];
        let zs0 = expected(a);
        let zs = S.findRange(a);
        expect(zs).toEqual(zs0);
    });
    test('test [10530, 10587]', () => {
        let a = [10530, 10587];
        let zs0 = expected(a);
        let zs = S.findRange(a);
        expect(zs).toEqual(zs0);
    });
    test('test [18000, 25000]', () => {
        let a = [18000, 25000];
        let zs0 = expected(a);
        let zs = S.findRange(a);
        expect(zs).toEqual(zs0);
    });
});

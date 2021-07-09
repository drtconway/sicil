const List = require('./list');
const Sparse = require('./sparse');
const Dense = require('./dense');
const Deque = require('./deque');

const cmp_interval = function(a, b) {
    if (a[0] > b[0]) return 1;
    if (a[0] < b[0]) return -1;
    if (a[1] > b[1]) return 1;
    if (a[1] < b[1]) return -1;
    return 0;
}

const unique_impl = function(a) {
    let i = 0;
    let j = 0;
    while (i < a.length) {
        let i0 = i;
        while (i < a.length && a[i] == a[i0]) {
            i++;
        }
        if (j != i0) {
            a[j] = a[i0];
        }
        j++;
    }
    return a.subarray(0, j);
}

class Sicil {
    constructor(intervals) {
        let ps = new Uint32Array(2*intervals.length);
        for (let i = 0; i < intervals.length; i++) {
            ps[2*i+0] = intervals[i][0];
            ps[2*i+1] = intervals[i][1];
        }
        ps.sort();
        ps = Sicil.unique(ps);

        let qs = new Uint32Array(ps.length+1);
        let q = 0;
        for (let i = 0; i < ps.length; i++) {
            if (i == 0 || ps[i-1] + 1 < ps[i]) {
                q += 1;
            }
            qs[i] = q;
            q += 1;
        }
        q += 1;
        qs[qs.length - 1] = q;
        this.Q = q;

        this.sparse = new Sparse(ps);
        this.dense = new Dense(qs);

        let tmp = [];
        for (let j = 0; j < intervals.length; j++) {
            let x = intervals[j];
            let y0 = this.sparse_to_dense(x[0]);
            let y1 = this.sparse_to_dense(x[1]);
            tmp.push([y0, y1]);
        }
        tmp.sort(cmp_interval);

        // Make Smaller
        //
        this.intervals = [];
        this.smaller = {};
        let i = 0;
        while (i < tmp.length) {
            let k = i;
            while (i < tmp.length && tmp[i][0] == tmp[k][0]) {
                i += 1;
            }
            let l = i - 1;
            let lItem = tmp[l];
            if (k != l) {
                this.smaller[lItem] = [];
                while (k != l) {
                    let kItem = tmp[k];
                    this.smaller[lItem].push(kItem);
                    k += 1;
                }
            }
            this.intervals.push(lItem);
        }

        // Now execute the main construction algorithm
        //
        let E = {};
        for (let j in this.intervals) {
            let x = this.intervals[j];

            if (!(x[0] in E)) {
                E[x[0]] = [];
            }
            E[x[0]].push(x);
            if (!(x[1] in E)) {
                E[x[1]] = [];
            }
            E[x[1]].push(x);
        }

        this.start = new Array(this.Q);
        this.start2 = new Array(this.Q);
        this.parent = {};
        this.last = {};
        this.left = {};

        let L = new List();
        let saved = {};
        let rml = 0;
        for (let q = 0; q <= this.Q; q++) {

            if (L.size() > 0) {
                this.start[q] = L.back();
            }

            if (q in E) {
                E[q].reverse();
                for (let j in E[q]) {
                    let a = E[q][j];
                    if (a[0] == q && !(a in saved)) {
                        this.start[q] = a;
                        saved[a] = L.push(a);
                    } else {
                        let p = null;
                        if (saved[a] != L.firstKey) {
                            p = L.get(L.prev(saved[a]));
                        }
                        this.parent[a] = p;
                        if (p in this.last) {
                            this.left[a] = this.last[p];
                        }
                        this.last[p] = a;
                        L.erase(saved[a]);
                        delete saved[a];
                    }
                }
            }

            while (rml+1 < this.intervals.length && this.intervals[rml+1][0] <= q) {
                rml += 1;
            }
            if (this.intervals[rml][0] <= q) {
                this.start2[q] = this.intervals[rml];
            };
        }
    }

    find(p) {
        let q = this.sparse_to_dense(p);
        let xs = this.stab(q);
        let ys = [];
        for (let i = 0; i < xs.length; i++) {
            let x = xs[i];
            let y0 = this.dense_to_sparse(x[0]);
            let y1 = this.dense_to_sparse(x[1]);
            ys.push([y0, y1]);
        }
        return ys;
    }

    stab(q) {
        if (!this.start[q]) {
            return [];
        }

        let res = [];
        let kew = new Deque();

        for (let v = this.start[q]; v; v = this.parent[v]) {
            kew.push_front(v);
        }

        while (kew.size() > 0) {
            let a = kew.pop_back();
            res.push(a);

            if (this.smaller[a]) {
                let s = this.smaller[a];
                for (let i = s.length - 1; i >= 0; i--) {
                    if (s[i][1] < q) {
                        break;
                    }
                    res.push(s[i]);
                }
            }

            if (this.left[a]) {
                let t = this.left[a];
                while (t) {
                    if (t[1] < q) {
                        break;
                    }
                    kew.push_back(t);
                    t = this.last[t];
                }
            }
        }
        res.reverse();
        return res;
    }

    findRange(p) {
        let q0 = this.sparse_to_dense(p[0]);
        let q1 = this.sparse_to_dense(p[1]);
        let xs = this.stabRange(q0, q1);
        let ys = [];
        for (let i = 0; i < xs.length; i++) {
            let x = xs[i];
            let y0 = this.dense_to_sparse(x[0]);
            let y1 = this.dense_to_sparse(x[1]);
            ys.push([y0, y1]);
        }
        return ys;
    }

    stabRange(lq, rq) {
        let t = undefined;
        if (this.start[lq]) {
            t = this.start[lq];
        }
        if (this.start2[rq]) {
            let u = this.start2[rq];
            if (!t || t[0] < u[0]) {
                t = u;
            }
        }
        if (!t || t[1] < lq) {
            return [];
        }

        let res = [];
        let kew = new Deque();

        for (let v = t; v; v = this.parent[v]) {
            kew.push_front(v);
        }

        while (kew.size() > 0) {
            let a = kew.pop_back();
            res.push(a);

            if (this.smaller[a]) {
                let s = this.smaller[a];
                for (let i = s.length - 1; i >= 0; i--) {
                    if (s[i][1] < lq) {
                        break;
                    }
                    res.push(s[i]);
                }
            }

            if (this.left[a]) {
                let t = this.left[a];
                while (t) {
                    if (t[1] < lq) {
                        break;
                    }
                    kew.push_back(t);
                    t = this.last[t];
                }
            }
        }
        res.reverse();
        return res;
    }

    sparse_to_dense(p) {
        let rs = this.sparse.rank2(p, p+1);
        let q = this.dense.select(rs[0]);
        if (rs[1] > rs[0]) {
            return q;
        } else {
            return q - 1;
        }
    }

    dense_to_sparse(q) {
        let r = this.dense.rank(q);
        return this.sparse.select(r);
    }

    static unique = unique_impl;
}

module.exports = Sicil;

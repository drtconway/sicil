const List = require('../list');

test('size of empty list', () => {
    let l = new List();
    expect(l.size()).toBe(0);
});

test('properties of unit list', () => {
    let l = new List();
    expect(l.size()).toBe(0);
    let p = l.push('qux');
    expect(l.size()).toBe(1);
    expect(l.get(p)).toBe('qux');
    expect(l.front()).toBe('qux');
    expect(l.back()).toBe('qux');
    l.erase(p);
    expect(l.size()).toBe(0);
});

test('properties of two element list (1)', () => {
    let l = new List();
    expect(l.size()).toBe(0);
    let p1 = l.push('baz');
    let p2 = l.push('qux');
    expect(l.size()).toBe(2);
    expect(l.get(p1)).toBe('baz');
    expect(l.get(p2)).toBe('qux');
    expect(l.front()).toBe('baz');
    expect(l.back()).toBe('qux');
    l.erase(p1);
    expect(l.size()).toBe(1);
    expect(l.front()).toBe('qux');
    expect(l.back()).toBe('qux');
});

test('properties of two element list (2)', () => {
    let l = new List();
    expect(l.size()).toBe(0);
    let p1 = l.push('baz');
    let p2 = l.push('qux');
    expect(l.size()).toBe(2);
    expect(l.get(p1)).toBe('baz');
    expect(l.get(p2)).toBe('qux');
    expect(l.front()).toBe('baz');
    expect(l.back()).toBe('qux');
    l.erase(p2);
    expect(l.size()).toBe(1);
    expect(l.front()).toBe('baz');
    expect(l.back()).toBe('baz');
});

test('properties of three element list (1)', () => {
    let l = new List();
    expect(l.size()).toBe(0);
    let p1 = l.push('baz');
    let p2 = l.push('qux');
    let p3 = l.push('bar');
    expect(l.size()).toBe(3);
    expect(l.get(p1)).toBe('baz');
    expect(l.get(p2)).toBe('qux');
    expect(l.get(p3)).toBe('bar');
    expect(l.front()).toBe('baz');
    expect(l.back()).toBe('bar');
    l.erase(p2);
    expect(l.size()).toBe(2);
    expect(l.front()).toBe('baz');
    expect(l.back()).toBe('bar');
});

test('properties of three element list (2)', () => {
    let l = new List();
    expect(l.size()).toBe(0);
    let p1 = l.push('baz');
    let p2 = l.push('qux');
    let p3 = l.push('bar');
    expect(l.size()).toBe(3);
    expect(l.get(p1)).toBe('baz');
    expect(l.get(p2)).toBe('qux');
    expect(l.get(p3)).toBe('bar');
    expect(l.prev(p1)).toBe(-1);
    expect(l.prev(p2)).toBe(p1);
    expect(l.prev(p3)).toBe(p2);
    expect(l.next(p1)).toBe(p2);
    expect(l.next(p2)).toBe(p3);
    expect(l.next(p3)).toBe(-1);
});

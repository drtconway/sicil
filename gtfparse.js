const { once } = require('events');
const fs     = require('fs');
const zlib     = require('zlib');
const readline = require('readline');
const { performance, PerformanceObserver } = require('perf_hooks');

const key_val_expr = new RegExp(/([a-zA-Z0-9_-]+)[ ]+(.*)/);
const number_value = new RegExp(/^([0-9]+)$/);
const string_value = new RegExp(/^"([^"]+)"$/);
const parse_line = function(line) {
    let flds = line.split('\t');
    flds[3] = Number(flds[3]);
    flds[4] = Number(flds[4]);
    if (flds[5] == '.') { flds[5] = null }
    if (flds[6] == '.') { flds[6] = null }
    if (flds[7] == '.') { flds[7] = null }
    let props_text = flds[8].split(';');
    let props = {};
    for (let i = 0; i < props_text.length; i++) {
        let kv = props_text[i].trim();
        if (kv.length == 0) {
            continue;
        }
        let m = key_val_expr.exec(kv);
        if (!m) {
            // Bad format!
            continue;
        }
        let k = m[1];
        let v = null;
        let v_txt = m[2];
        m = number_value.exec(v_txt);
        if (m) {
            v = Number(m[1]);
            props[k] = v;
            continue;
        }
        m = string_value.exec(v_txt);
        if (m) {
            v  = m[1];
            props[k] = v;
            continue;
        }
        props[k] = v_txt;
    }
    flds[8] = props;
    return flds;
}

function gzip_str_inner(data) {
    return new Promise((resolve, reject) => {
        zlib.gzip(data, (err, buffer) => {
            if (err) {
                return reject(err)
            }
            resolve(buffer.toString('binary'))
        })
    })
}

async function gzip_str(data) {
    let x = await gzip_str_inner(data);
    console.log(x);
    return x;
}

async function process_the_lines() {
    let lineReader = readline.createInterface({
      input: fs.createReadStream('gencode.v38.genes.gtf.gz').pipe(zlib.createGunzip())
    });

    let n = 0;
    let res = {};
    lineReader.on('line', async (line) => {
        n += 1
        if (line.startsWith('#')) {
            return;
        }
        let x = parse_line(line);
        let chrom = x[0];
        if (!(chrom in res)) {
            res[chrom] = [];
        }
        res[chrom].push(x);
    });
    await once(lineReader, 'close');

    console.log(res);
}

process_the_lines();

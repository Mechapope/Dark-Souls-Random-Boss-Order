/*
  SeededShuffle - Node.js & Browser
  By Louis T. <louist@ltdev.im>
  https://github.com/LouisT/SeededShuffle/
*/
(function(Setup){
   var proto = {
       strSeed: null,
       shuffle: function (arr, seed, copy) {
             if (this.getType(arr) == "Array") {
                if (this.setSeed(seed)) {
                   var shuff = (copy?arr.slice(0):arr),
                       size = shuff.length,
                       map = this.genMap(size);
                   for (var i = size - 1; i > 0; i--) {
                       shuff[i] = shuff.splice(map[size-1-i],1,shuff[i])[0];
                   }
                   return shuff;
                };
             };
             return null;
       },
       unshuffle: function (arr, seed, copy) {
             if (this.getType(arr) == "Array") {
                if (this.setSeed(seed)) {
                   var shuff = (copy?arr.slice(0):arr),
                       size = shuff.length,
                       map = this.genMap(size);
                   for (var i = 1; i < size; i++) {
                       shuff[i] = shuff.splice(map[size-1-i],1,shuff[i])[0];
                   }
                   return shuff;
                };
             };
             return null;
       },
       genMap: function (size) {
             var map = new Array(size);
             for (var x = 0; x < size; x++) {
                 //Don't change these numbers.
                 map[x] = ((this.__seed = (this.__seed*9301+49297)%233280)/233280.0)*size|0;
             };
             return map;
       },
       setSeed: function (seed) {
             if (!/(number|string)/i.test(this.getType(seed))) {
                return false;
             };
             if (isNaN(seed)) {
                var seed = String((this.strSeed = seed)).split('').map(function(x){return x.charCodeAt(0)}).join('');
             };
             return this.__seed = this.seed = Number(seed);
       },
       getType: function (obj) {
             return Object.prototype.toString.call(obj).match(/^\[object (.*)\]$/)[1];
       },
   };
   Setup((function(){
        return Object.create(proto);
   })());
})((typeof exports!=='undefined'?function(fn){module.exports=fn;}:function(fn){this['SeededShuffle']=fn;}));



!function (a, b, c, d, e, f, g, h, i) { function j(a) { var b, c = a.length, e = this, f = 0, g = e.i = e.j = 0, h = e.S = []; for (c || (a = [c++]) ; d > f;) h[f] = f++; for (f = 0; d > f; f++) h[f] = h[g = s & g + a[f % c] + (b = h[f])], h[g] = b; (e.g = function (a) { for (var b, c = 0, f = e.i, g = e.j, h = e.S; a--;) b = h[f = s & f + 1], c = c * d + h[s & (h[f] = h[g = s & g + b]) + (h[g] = b)]; return e.i = f, e.j = g, c })(d) } function k(a, b) { var c, d = [], e = typeof a; if (b && "object" == e) for (c in a) try { d.push(k(a[c], b - 1)) } catch (f) { } return d.length ? d : "string" == e ? a : a + "\0" } function l(a, b) { for (var c, d = a + "", e = 0; e < d.length;) b[s & e] = s & (c ^= 19 * b[s & e]) + d.charCodeAt(e++); return n(b) } function m(c) { try { return o ? n(o.randomBytes(d)) : (a.crypto.getRandomValues(c = new Uint8Array(d)), n(c)) } catch (e) { return [+new Date, a, (c = a.navigator) && c.plugins, a.screen, n(b)] } } function n(a) { return String.fromCharCode.apply(0, a) } var o, p = c.pow(d, e), q = c.pow(2, f), r = 2 * q, s = d - 1, t = c["seed" + i] = function (a, f, g) { var h = []; f = 1 == f ? { entropy: !0 } : f || {}; var o = l(k(f.entropy ? [a, n(b)] : null == a ? m() : a, 3), h), s = new j(h); return l(n(s.S), b), (f.pass || g || function (a, b, d) { return d ? (c[i] = a, b) : a })(function () { for (var a = s.g(e), b = p, c = 0; q > a;) a = (a + c) * d, b *= d, c = s.g(1); for (; a >= r;) a /= 2, b /= 2, c >>>= 1; return (a + c) / b }, o, "global" in f ? f.global : this == c) }; if (l(c[i](), b), g && g.exports) { g.exports = t; try { o = require("crypto") } catch (u) { } } else h && h.amd && h(function () { return t }) }(this, [], Math, 256, 6, 52, "object" == typeof module && module, "function" == typeof define && define, "random");
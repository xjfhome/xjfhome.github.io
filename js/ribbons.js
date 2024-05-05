﻿! function(a, b) {
    "object" == typeof window && (window[a] = b())
}("Ribbons", function() {
    var h, a = window,
        b = document.body,
        c = document.documentElement,
        d = function() {
            if (1 === arguments.length) {
                if (Array.isArray(arguments[0])) {
                    var a = Math.round(d(0, arguments[0].length - 1));
                    return arguments[0][a]
                }
                return d(0, arguments[0])
            }
            return 2 === arguments.length ? Math.random() * (arguments[1] - arguments[0]) + arguments[0] : 0
        },
        e = function() {
            var e = Math.max(0, a.innerWidth || c.clientWidth || b.clientWidth || 0),
                f = Math.max(0, a.innerHeight || c.clientHeight || b.clientHeight || 0),
                g = Math.max(0, a.pageXOffset || c.scrollLeft || b.scrollLeft || 0) - (c.clientLeft || 0),
                h = Math.max(0, a.pageYOffset || c.scrollTop || b.scrollTop || 0) - (c.clientTop || 0);
            return {
                width: e,
                height: f,
                ratio: e / f,
                centerx: e / 2,
                centery: f / 2,
                scrollx: g,
                scrolly: h
            }
        },
        g = function(a, b) {
            this.x = 0, this.y = 0, this.set(a, b)
        };
    return g.prototype = {
        constructor: g,
        set: function(a, b) {
            this.x = a || 0, this.y = b || 0
        },
        copy: function(a) {
            return this.x = a.x || 0, this.y = a.y || 0, this
        },
        multiply: function(a, b) {
            return this.x *= a || 1, this.y *= b || 1, this
        },
        divide: function(a, b) {
            return this.x /= a || 1, this.y /= b || 1, this
        },
        add: function(a, b) {
            return this.x += a || 0, this.y += b || 0, this
        },
        subtract: function(a, b) {
            return this.x -= a || 0, this.y -= b || 0, this
        },
        clampX: function(a, b) {
            return this.x = Math.max(a, Math.min(this.x, b)), this
        },
        clampY: function(a, b) {
            return this.y = Math.max(a, Math.min(this.y, b)), this
        },
        flipX: function() {
            return this.x *= -1, this
        },
        flipY: function() {
            return this.y *= -1, this
        }
    }, h = function(a) {
        this._canvas = null, this._context = null, this._sto = null, this._width = 0, this._height = 0, this._scroll = 0, this._ribbons = [], this._options = {
            id: "bgCanvas",
            backgroundColor: "whitesmoke",
            colorSaturation: "80%",
            colorBrightness: "60%",
            colorAlpha: .2,
            colorCycleSpeed: 6,
            verticalPosition: "center",
            horizontalSpeed: 200,
            ribbonCount: 3,
            strokeSize: 0,
            parallaxAmount: -.5,
            animateSections: !0
        }, this._onDraw = this._onDraw.bind(this), this._onResize = this._onResize.bind(this), this._onScroll = this._onScroll.bind(this), this.setOptions(a), this.init()
    }, h.prototype = {
        constructor: h,
        setOptions: function(a) {
            if ("object" == typeof a)
                for (var b in a) a.hasOwnProperty(b) && (this._options[b] = a[b])
        },
        init: function() {
            try {
                this._canvas = document.createElement("canvas"), this._canvas.style["display"] = "block", this._canvas.style["position"] = "fixed", this._canvas.style["margin"] = "0", this._canvas.style["padding"] = "0", this._canvas.style["border"] = "0", this._canvas.style["outline"] = "0", this._canvas.style["left"] = "0", this._canvas.style["top"] = "0", this._canvas.style["width"] = "100%", this._canvas.style["height"] = "100%", this._canvas.style["z-index"] = "-1", this._canvas.style["background-color"] = this._options.backgroundColor, this._canvas.id = this._options.id, this._onResize(), this._context = this._canvas.getContext("2d"), this._context.clearRect(0, 0, this._width, this._height), this._context.globalAlpha = this._options.colorAlpha, window.addEventListener("resize", this._onResize), window.addEventListener("scroll", this._onScroll), document.body.appendChild(this._canvas)
            } catch (a) {
                return console.warn("Canvas Context Error: " + a.toString()), void 0
            }
            this._onDraw()
        },
        addRibbon: function() {
            var l, m, n, o, p, q, a = Math.round(d(1, 9)) > 5 ? "right" : "left",
                b = 1e3,
                c = 200,
                e = 0 - c,
                f = this._width + c,
                h = 0,
                i = 0,
                j = "right" === a ? e : f,
                k = Math.round(d(0, this._height));
            for (/^(top|min)$/i.test(this._options.verticalPosition) ? k = 0 + c : /^(middle|center)$/i.test(this._options.verticalPosition) ? k = this._height / 2 : /^(bottom|max)$/i.test(this._options.verticalPosition) && (k = this._height - c), 0 !== this._options.parallaxAmount && (k += this._scroll), l = [], m = new g(j, k), n = new g(j, k), o = null, p = Math.round(d(0, 360)), q = 0;;) {
                if (0 >= b) break;
                if (b--, h = Math.round((1 * Math.random() - .2) * this._options.horizontalSpeed), i = Math.round((1 * Math.random() - .5) * .25 * this._height), o = new g, o.copy(n), "right" === a) {
                    if (o.add(h, i), n.x >= f) break
                } else if ("left" === a && (o.subtract(h, i), n.x <= e)) break;
                l.push({
                    point1: new g(m.x, m.y),
                    point2: new g(n.x, n.y),
                    point3: o,
                    color: p,
                    delay: q,
                    dir: a,
                    alpha: 0,
                    phase: 0
                }), m.copy(n), n.copy(o), q += 4, p += this._options.colorCycleSpeed
            }
            this._ribbons.push(l)
        },
        _drawRibbonSection: function(a) {
            var b, c, d, e;
            if (a) {
                if (a.phase >= 1 && a.alpha <= 0) return !0;
                a.delay <= 0 ? (a.phase += .02, a.alpha = 1 * Math.sin(a.phase), a.alpha = a.alpha <= 0 ? 0 : a.alpha, a.alpha = a.alpha >= 1 ? 1 : a.alpha, this._options.animateSections && (b = .1 * Math.sin(1 + a.phase * Math.PI / 2), "right" === a.dir ? (a.point1.add(b, 0), a.point2.add(b, 0), a.point3.add(b, 0)) : (a.point1.subtract(b, 0), a.point2.subtract(b, 0), a.point3.subtract(b, 0)), a.point1.add(0, b), a.point2.add(0, b), a.point3.add(0, b))) : a.delay -= .5, c = this._options.colorSaturation, d = this._options.colorBrightness, e = "hsla(" + a.color + ", " + c + ", " + d + ", " + a.alpha + " )", this._context.save(), 0 !== this._options.parallaxAmount && this._context.translate(0, this._scroll * this._options.parallaxAmount), this._context.beginPath(), this._context.moveTo(a.point1.x, a.point1.y), this._context.lineTo(a.point2.x, a.point2.y), this._context.lineTo(a.point3.x, a.point3.y), this._context.fillStyle = e, this._context.fill(), this._options.strokeSize > 0 && (this._context.lineWidth = this._options.strokeSize, this._context.strokeStyle = e, this._context.lineCap = "round", this._context.stroke()), this._context.restore()
            }
            return !1
        },
        _onDraw: function() {
            var a, b, c, d, e, f, g;
            for (a = 0, b = this._ribbons.length; b > a; ++a) this._ribbons[a] || this._ribbons.splice(a, 1);
            for (this._context.clearRect(0, 0, this._width, this._height), c = 0; c < this._ribbons.length; ++c) {
                for (d = this._ribbons[c], e = d ? d.length : 0, f = 0, g = 0; e > g; ++g) this._drawRibbonSection(d[g]) && f++;
                f >= e && (this._ribbons[c] = null)
            }
            this._ribbons.length < this._options.ribbonCount && Math.random() > .99 && this.addRibbon(), requestAnimationFrame(this._onDraw)
        },
        _onResize: function(a) {
            var b = e(a);
            this._width = b.width, this._height = b.height, this._canvas && (this._canvas.width = this._width, this._canvas.height = this._height, this._context && (this._context.globalAlpha = this._options.colorAlpha))
        },
        _onScroll: function(a) {
            var b = e(a);
            this._scroll = b.scrolly
        }
    }, h
}), new Ribbons({
    ribbonCount: 5,
    parallaxAmount: -.99
});
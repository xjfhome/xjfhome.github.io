$(".fa-info-circle").on("touchstart", function(a) {
    $(".fa-info-circle").removeClass("touched");
    $(this).addClass("touched");
    a.preventDefault()
});
var Sketch = function() {
    function ah(a) {
        return "[object Array]" == Object.prototype.toString.call(a)
    }

    function Q(a) {
        return "function" == typeof a
    }

    function Z(a) {
        return "number" == typeof a
    }

    function Y(a) {
        return "string" == typeof a
    }

    function V(a) {
        return N[a] || String.fromCharCode(a)
    }

    function ad(b, a, d) {
        for (var c in a) {
            (d || !b.hasOwnProperty(c)) && (b[c] = a[c])
        }
        return b
    }

    function M(b, a) {
        return function() {
            b.apply(a, arguments)
        }
    }

    function al(a) {
        var c = {};
        for (var b in a) {
            c[b] = Q(a[b]) ? M(a[b], a) : a[b]
        }
        return c
    }

    function aj(aK) {
        function aD(b) {
            Q(b) && b.apply(aK, [].splice.call(arguments, 1))
        }

        function az(b) {
            for (aN = 0; aN < ao.length; aN++) {
                aq = ao[aN], Y(aq) ? I[(b ? "add" : "remove") + "EventListener"].call(I, aq, aF, !1) : Q(aq) ? aF = aq : I = aq
            }
        }

        function aL() {
            D(t), t = G(aL), r || (aD(aK.setup), r = Q(aK.setup), aD(aK.resize)), aK.running && !aG && (aK.dt = (av = +new Date()) - aK.now, aK.millis += aK.dt, aK.now = av, aD(aK.update), aK.autoclear && an && aK.clear(), aD(aK.draw)), aG = ++aG % aK.interval
        }

        function aE() {
            I = d ? aK.style : aK.canvas, at = d ? "px" : "", aK.fullscreen && (aK.height = J.innerHeight, aK.width = J.innerWidth), I.height = aK.height + at, I.width = aK.width + at, aK.retina && an && i && (I.height = aK.height * i, I.width = aK.width * i, I.style.height = aK.height + "px", I.style.width = aK.width + "px", aK.scale(i, i)), r && aD(aK.resize)
        }

        function aA(c, b) {
            return L = b.getBoundingClientRect(), c.x = c.pageX - L.left - J.scrollX, c.y = c.pageY - L.top - J.scrollY, c
        }

        function aJ(b, c) {
            return aA(b, aK.element), c = c || {}, c.ox = c.x || b.x, c.oy = c.y || b.y, c.x = b.x, c.y = b.y, c.dx = c.x - c.ox, c.dy = c.y - c.oy, c
        }

        function aI(b) {
            if (b.preventDefault(), m = al(b), m.originalEvent = b, m.touches) {
                for (am.length = m.touches.length, aN = 0; aN < m.touches.length; aN++) {
                    am[aN] = aJ(m.touches[aN], am[aN])
                }
            } else {
                am.length = 0, am[0] = aJ(m, o)
            }
            return ad(o, am[0], !0), m
        }

        function aH(b) {
            for (b = aI(b), aB = (y = ao.indexOf(ax = b.type)) - 1, aK.dragging = /down|start/.test(ax) ? !0 : /up|end/.test(ax) ? !1 : aK.dragging; aB;) {
                Y(ao[aB]) ? aD(aK[ao[aB--]], b) : Y(ao[y]) ? aD(aK[ao[y++]], b) : aB = 0
            }
        }

        function aC(b) {
            ar = b.keyCode, ap = "keyup" == b.type, a[ar] = a[V(ar)] = !ap, aD(aK[b.type], b)
        }

        function ay(b) {
            aK.autopause && ("blur" == b.type ? aM : au)(), aD(aK[b.type], b)
        }

        function au() {
            aK.now = +new Date(), aK.running = !0
        }

        function aM() {
            aK.running = !1
        }

        function E() {
            (aK.running ? aM : au)()
        }

        function aw() {
            an && aK.clearRect(0, 0, aK.width, aK.height)
        }

        function w() {
            x = aK.element.parentNode, aN = H.indexOf(aK), x && x.removeChild(aK.element), ~aN && H.splice(aN, 1), az(!1), aM()
        }
        var t, aF, I, x, L, aN, at, av, aq, m, ax, ar, ap, aB, y, aG = 0,
            am = [],
            r = !1,
            i = J.devicePixelRatio,
            d = aK.type == aa,
            an = aK.type == ai,
            o = {
                x: 0,
                y: 0,
                ox: 0,
                oy: 0,
                dx: 0,
                dy: 0
            },
            ao = [aK.element, aH, "mousedown", "touchstart", aH, "mousemove", "touchmove", aH, "mouseup", "touchend", aH, "click", F, aC, "keydown", "keyup", J, ay, "focus", "blur", aE, "resize"],
            a = {};
        for (ar in N) {
            a[N[ar]] = !1
        }
        return ad(aK, {
            touches: am,
            mouse: o,
            keys: a,
            dragging: !1,
            running: !1,
            millis: 0,
            now: 0 / 0,
            dt: 0 / 0,
            destroy: w,
            toggle: E,
            clear: aw,
            start: au,
            stop: aM
        }), H.push(aK), aK.autostart && au(), az(!0), aE(), aL(), aK
    }
    for (var ab, R, ag = "E LN10 LN2 LOG2E LOG10E PI SQRT1_2 SQRT2 abs acos asin atan ceil cos exp floor log round sin sqrt tan atan2 pow max min".split(" "), af = "__hasSketch", ae = Math, ai = "canvas", X = "webgl", aa = "dom", F = document, J = window, H = [], K = {
            fullscreen: !0,
            autostart: !0,
            autoclear: !0,
            autopause: !0,
            container: F.body,
            interval: 1,
            globals: !0,
            retina: !1,
            type: ai
        }, N = {
            8: "BACKSPACE",
            9: "TAB",
            13: "ENTER",
            16: "SHIFT",
            27: "ESCAPE",
            32: "SPACE",
            37: "LEFT",
            38: "UP",
            39: "RIGHT",
            40: "DOWN"
        }, U = {
            CANVAS: ai,
            WEB_GL: X,
            WEBGL: X,
            DOM: aa,
            instances: H,
            install: function(a) {
                if (!a[af]) {
                    for (var b = 0; b < ag.length; b++) {
                        a[ag[b]] = ae[ag[b]]
                    }
                    ad(a, {
                        TWO_PI: 2 * ae.PI,
                        HALF_PI: ae.PI / 2,
                        QUATER_PI: ae.PI / 4,
                        random: function(c, d) {
                            return ah(c) ? c[~~(ae.random() * c.length)] : (Z(d) || (d = c || 1, c = 0), c + ae.random() * (d - c))
                        },
                        lerp: function(d, c, f) {
                            return d + f * (c - d)
                        },
                        map: function(f, c, h, g, d) {
                            return (f - c) / (h - c) * (d - g) + g
                        }
                    }), a[af] = !0
                }
            },
            create: function(a) {
                return a = ad(a || {}, K), a.globals && U.install(self), ab = a.element = a.element || F.createElement(a.type === aa ? "div" : "canvas"), R = a.context = a.context || function() {
                    switch (a.type) {
                        case ai:
                            return ab.getContext("2d", a);
                        case X:
                            return ab.getContext("webgl", a) || ab.getContext("experimental-webgl", a);
                        case aa:
                            return ab.canvas = ab
                    }
                }(), a.container.appendChild(ab), U.augment(R, a)
            },
            augment: function(b, a) {
                return a = ad(a || {}, K), a.element = b.canvas || b, a.element.className += " sketch", ad(b, a, !0), aj(b)
            }
        }, ak = ["ms", "moz", "webkit", "o"], z = self, W = 0, q = "AnimationFrame", j = "request" + q, ac = "cancel" + q, G = z[j], D = z[ac], B = 0; B < ak.length && !G; B++) {
        G = z[ak[B] + "Request" + q], D = z[ak[B] + "Cancel" + j]
    }
    return z[j] = G = G || function(b) {
        var a = +new Date(),
            d = ae.max(0, 16 - (a - W)),
            c = setTimeout(function() {
                b(a + d)
            }, d);
        return W = a + d, c
    }, z[ac] = D = D || function(a) {
        clearTimeout(a)
    }, U
}();
if (document.getElementById("clickCanvas")) {
    function Particle(b, c, a) {
        this.init(b, c, a)
    }
    Particle.prototype = {
        init: function(b, c, a) {
            this.alive = true;
            this.radius = a || 10;
            this.wander = 0.15;
            this.theta = random(TWO_PI);
            this.drag = 0.92;
            this.color = "#ffeb3b";
            this.x = b || 0;
            this.y = c || 0;
            this.vx = 0;
            this.vy = 0
        },
        move: function() {
            this.x += this.vx;
            this.y += this.vy;
            this.vx *= this.drag;
            this.vy *= this.drag;
            this.theta += random(-0.5, 0.5) * this.wander;
            this.vx += sin(this.theta) * 0.1;
            this.vy += cos(this.theta) * 0.1;
            this.radius *= 0.96;
            this.alive = this.radius > 0.5
        },
        draw: function(a) {
            a.beginPath();
            a.arc(this.x, this.y, this.radius, 0, TWO_PI);
            a.fillStyle = this.color;
            a.fill()
        }
    };
    var MAX_PARTICLES = 50;
    var COLOURS = ["#5ee4ff", "#f44033", "#ffeb3b", "#F38630", "#FA6900", "#f403e8", "#F9D423"];
    var particles = [];
    var pool = [];
    var clickparticle = Sketch.create({
        container: document.getElementById("clickCanvas")
    });
    clickparticle.spawn = function(a, b) {
        if (particles.length >= MAX_PARTICLES) {
            pool.push(particles.shift())
        }
        particle = pool.length ? pool.pop() : new Particle();
        particle.init(a, b, random(2, 4));
        particle.wander = random(0.5, 2);
        particle.color = random(COLOURS);
        particle.drag = random(0.9, 0.99);
        theta = random(TWO_PI);
        force = random(2, 3);
        particle.vx = sin(theta) * force;
        particle.vy = cos(theta) * force;
        particles.push(particle)
    };
    clickparticle.update = function() {
        var a, b;
        for (a = particles.length - 1; a >= 0; a--) {
            b = particles[a];
            if (b.alive) {
                b.move()
            } else {
                pool.push(particles.splice(a, 1)[0])
            }
        }
    };
    clickparticle.draw = function() {
        clickparticle.globalCompositeOperation = "lighter";
        for (var a = particles.length - 1; a >= 0; a--) {
            particles[a].draw(clickparticle)
        }
    };
    document.addEventListener("mousedown", function(c) {
        var a, b;
        "TEXTAREA" !== c.target.nodeName && "INPUT" !== c.target.nodeName && "A" !== c.target.nodeName && "I" !== c.target.nodeName && "IMG" !== c.target.nodeName && function() {
            for (a = random(15, 20), b = 0; b < a; b++) {
                clickparticle.spawn(c.clientX, c.clientY)
            }
        }()
    })
};
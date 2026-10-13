import CoreText
import CoreGraphics
import Foundation

let OUT = "/Users/vimalshetty/TradeTrack/webpage/dr_srinivasa_c/logo-designs"
let GREEN = "#1C7E4E", BLUE = "#047BCA", DGREEN = "#145C38", DBLUE = "#0369A1", INK = "#111827", GRAY = "#4B5563"

func f(_ v: CGFloat) -> String { String(format: "%.2f", v) }

struct G { var d: String; var box: CGRect }

func svgPath(_ path: CGPath, _ transform: (CGPoint) -> CGPoint) -> G {
    var d = ""
    var box = CGRect.null
    func acc(_ p: CGPoint) { box = box.union(CGRect(origin: p, size: .zero)) }
    path.applyWithBlock { ep in
        let e = ep.pointee
        switch e.type {
        case .moveToPoint:
            let p = transform(e.points[0]); acc(p); d += "M\(f(p.x)) \(f(p.y))"
        case .addLineToPoint:
            let p = transform(e.points[0]); acc(p); d += "L\(f(p.x)) \(f(p.y))"
        case .addQuadCurveToPoint:
            let c = transform(e.points[0]), p = transform(e.points[1]); acc(c); acc(p)
            d += "Q\(f(c.x)) \(f(c.y)) \(f(p.x)) \(f(p.y))"
        case .addCurveToPoint:
            let a = transform(e.points[0]), b = transform(e.points[1]), p = transform(e.points[2]); acc(a); acc(b); acc(p)
            d += "C\(f(a.x)) \(f(a.y)) \(f(b.x)) \(f(b.y)) \(f(p.x)) \(f(p.y))"
        case .closeSubpath:
            d += "Z"
        @unknown default: break
        }
    }
    return G(d: d, box: box)
}

struct Run {
    var glyphs: [G]
    var d: String { glyphs.map { $0.d }.joined() }
    var box: CGRect { glyphs.reduce(CGRect.null) { $0.union($1.box) } }
}

func shape(_ text: String, _ font: String, _ size: CGFloat, _ tracking: CGFloat) -> (CTFont, [CGGlyph], [CGFloat]) {
    let ft = CTFontCreateWithName(font as CFString, size, nil)
    let u = Array(text.utf16)
    var gs = [CGGlyph](repeating: 0, count: u.count)
    _ = CTFontGetGlyphsForCharacters(ft, u, &gs, u.count)
    var adv = [CGSize](repeating: .zero, count: gs.count)
    CTFontGetAdvancesForGlyphs(ft, .horizontal, gs, &adv, gs.count)
    return (ft, gs, adv.map { $0.width + tracking })
}

func measure(_ text: String, _ font: String, _ size: CGFloat, _ tracking: CGFloat) -> CGFloat {
    shape(text, font, size, tracking).2.reduce(0, +) - tracking
}

func run(_ text: String, _ font: String, _ size: CGFloat, _ tracking: CGFloat, x: CGFloat, baseline: CGFloat) -> Run {
    let (ft, gs, adv) = shape(text, font, size, tracking)
    var cx = x
    var out: [G] = []
    for i in 0..<gs.count {
        if let p = CTFontCreatePathForGlyph(ft, gs[i], nil) {
            let ox = cx
            let g = svgPath(p) { CGPoint(x: $0.x + ox, y: baseline - $0.y) }
            if !g.d.isEmpty { out.append(g) }
        }
        cx += adv[i]
    }
    return Run(glyphs: out)
}

func centered(_ text: String, _ font: String, _ size: CGFloat, _ tracking: CGFloat, cx: CGFloat, baseline: CGFloat) -> Run {
    let r = run(text, font, size, tracking, x: 0, baseline: baseline)
    return run(text, font, size, tracking, x: cx - r.box.midX, baseline: baseline)
}

func colorLine(_ parts: [(String, String)], _ font: String, _ size: CGFloat, _ tracking: CGFloat, gap: CGFloat, x: CGFloat? = nil, cx: CGFloat? = nil, baseline: CGFloat) -> (String, CGRect) {
    let widths = parts.map { measure($0.0, font, size, tracking) }
    let total = widths.reduce(0, +) + gap * CGFloat(parts.count - 1)
    var px = x ?? (cx! - total / 2)
    var svg = ""
    var box = CGRect.null
    for (i, p) in parts.enumerated() {
        let r = run(p.0, font, size, tracking, x: px, baseline: baseline)
        svg += "<path d=\"\(r.d)\" fill=\"\(p.1)\"/>"
        box = box.union(r.box)
        px += widths[i] + gap
    }
    return (svg, box)
}

func pt(_ cx: CGFloat, _ cy: CGFloat, _ r: CGFloat, _ deg: CGFloat) -> CGPoint {
    let a = deg * .pi / 180
    return CGPoint(x: cx + r * sin(a), y: cy - r * cos(a))
}

func arcText(_ text: String, _ font: String, _ size: CGFloat, _ tracking: CGFloat, cx: CGFloat, cy: CGFloat, r: CGFloat, top: Bool, fill: String) -> String {
    let (ft, gs, adv) = shape(text, font, size, tracking)
    let total = adv.reduce(0, +) - tracking
    var cum: CGFloat = 0
    var d = ""
    for i in 0..<gs.count {
        let w = adv[i] - tracking
        let off = cum + w / 2 - total / 2
        cum += adv[i]
        guard let p = CTFontCreatePathForGlyph(ft, gs[i], nil) else { continue }
        let deg = top ? off / r * 180 / .pi : 180 - off / r * 180 / .pi
        let rot = (top ? deg : deg - 180) * .pi / 180
        let anchor = pt(cx, cy, r, deg)
        let c = cos(rot), sn = sin(rot)
        d += svgPath(p) { q in
            let x = q.x - w / 2, y = -q.y
            return CGPoint(x: anchor.x + x * c - y * sn, y: anchor.y + x * sn + y * c)
        }.d
    }
    return "<path d=\"\(d)\" fill=\"\(fill)\"/>"
}

func sun(cx: CGFloat, cy: CGFloat, r: CGFloat, s: CGFloat, stroke: String) -> String {
    var out = ""
    let rays: [CGFloat] = [-78, -64, -50, -36, -22, -8, 8, 22, 36, 50, 64, 78]
    for (i, deg) in rays.enumerated() {
        let long = i % 2 == 0
        let p1 = pt(cx, cy, r + 6 * s, deg), p2 = pt(cx, cy, r + (long ? 58 : 38) * s, deg)
        out += "<line x1=\"\(f(p1.x))\" y1=\"\(f(p1.y))\" x2=\"\(f(p2.x))\" y2=\"\(f(p2.y))\" stroke=\"\(stroke)\" stroke-width=\"\(f((long ? 7 : 5.5) * s))\" stroke-linecap=\"round\"/>"
    }
    let a0 = pt(cx, cy, r, -86), a1 = pt(cx, cy, r, 86)
    out += "<path d=\"M\(f(a0.x)) \(f(a0.y)) A\(f(r)) \(f(r)) 0 0 1 \(f(a1.x)) \(f(a1.y))\" fill=\"none\" stroke=\"\(stroke)\" stroke-width=\"\(f(9 * s))\" stroke-linecap=\"round\"/>"
    return out
}

func swoosh(L: CGFloat, R: CGFloat, Y: CGFloat, s: CGFloat, dark: String, light: String) -> String {
    let mid = (L + R) / 2
    func P(_ x: CGFloat, _ y: CGFloat) -> String { "\(f(x)) \(f(y))" }
    let a = "M\(P(L - 8 * s, Y - 28 * s)) C\(P(L + 30 * s, Y + 78 * s)) \(P(R - 20 * s, Y + 86 * s)) \(P(R + 18 * s, Y - 18 * s)) C\(P(R - 36 * s, Y + 48 * s)) \(P(L + 46 * s, Y + 42 * s)) \(P(L + 6 * s, Y - 18 * s))Z"
    let b = "M\(P(L + 18 * s, Y - 8 * s)) C\(P(L + 70 * s, Y + 36 * s)) \(P(mid + 40 * s, Y + 28 * s)) \(P(R - 30 * s, Y - 6 * s)) C\(P(mid + 10 * s, Y + 8 * s)) \(P(L + 80 * s, Y + 10 * s)) \(P(L + 28 * s, Y - 2 * s))Z"
    return "<path d=\"\(a)\" fill=\"\(dark)\"/><path d=\"\(b)\" fill=\"\(light)\"/>"
}

func joint(x: CGFloat, y: CGFloat, scale: CGFloat, bone: String, knuckle: String, core: String) -> String {
    "<g transform=\"translate(\(f(x)) \(f(y))) scale(\(f(scale)))\"><path d=\"M0 -26 C8 -26 12 -18 10 -8 C8 -2 6 0 0 0 C-6 0 -8 -2 -10 -8 C-12 -18 -8 -26 0 -26Z\" fill=\"\(bone)\"/><circle cx=\"0\" cy=\"2\" r=\"9\" fill=\"\(knuckle)\"/><circle cx=\"0\" cy=\"2\" r=\"4.2\" fill=\"\(core)\"/><path d=\"M0 10 C7 10 11 16 10 26 C8 32 4 34 0 34 C-4 34 -8 32 -10 26 C-11 16 -7 10 0 10Z\" fill=\"\(bone)\"/></g>"
}

struct Mark { var svg: String; var letters: CGRect; var bounds: CGRect }

func arcMark(cx: CGFloat, baseline: CGFloat, size: CGFloat, letterFill: String, sunStroke: String, dots: String, swooshColors: (String, String)) -> Mark {
    let s = size / 248
    let L = centered("ARC", "Baskerville-Bold", size, -16 * s, cx: cx, baseline: baseline)
    let box = L.box
    let a = L.glyphs[0].box, rr = L.glyphs[1].box
    var out = swoosh(L: box.minX, R: box.maxX, Y: box.maxY, s: s, dark: swooshColors.0, light: swooshColors.1)
    let acy = box.minY + box.height * 0.58, ar = box.width * 0.46, acx = box.midX + 6 * s
    out += sun(cx: acx, cy: acy, r: ar, s: s, stroke: sunStroke)
    out += "<path d=\"\(L.d)\" fill=\"\(letterFill)\"/>"
    for i in 0..<7 {
        let t = (CGFloat(i) + 0.35) / 7
        let x = a.minX + a.width * (0.46 - t * 0.24), y = a.minY + 28 * s + t * (a.height - 52 * s)
        out += "<circle cx=\"\(f(x))\" cy=\"\(f(y))\" r=\"\(f(5.2 * s))\" fill=\"\(dots)\"/>"
    }
    out += joint(x: rr.minX + rr.width * 0.58, y: rr.minY + rr.height * 0.33, scale: 0.52 * s, bone: dots, knuckle: dots == GREEN ? DGREEN : DBLUE, core: "#FFFFFF")
    let ext = ar + 60 * s
    let bounds = box
        .union(CGRect(x: acx - ext, y: acy - ar - 62 * s, width: 2 * ext, height: 1))
        .union(CGRect(x: box.minX - 10 * s, y: box.maxY + 70 * s, width: box.width + 30 * s, height: 1))
    return Mark(svg: out, letters: box, bounds: bounds)
}

func defs(_ x1: CGFloat, _ x2: CGFloat) -> String {
    "<defs><linearGradient id=\"brand\" gradientUnits=\"userSpaceOnUse\" x1=\"\(f(x1))\" y1=\"0\" x2=\"\(f(x2))\" y2=\"0\"><stop offset=\"0\" stop-color=\"\(GREEN)\"/><stop offset=\"1\" stop-color=\"\(BLUE)\"/></linearGradient><linearGradient id=\"wave\" gradientUnits=\"userSpaceOnUse\" x1=\"\(f(x1))\" y1=\"0\" x2=\"\(f(x2))\" y2=\"0\"><stop offset=\"0\" stop-color=\"\(BLUE)\"/><stop offset=\"1\" stop-color=\"\(DBLUE)\"/></linearGradient></defs>"
}

func write(_ name: String, _ vb: CGRect, _ body: String) {
    let s = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"\(f(vb.minX)) \(f(vb.minY)) \(f(vb.width)) \(f(vb.height))\" role=\"img\" aria-label=\"Artho Rheuma Care\">" + body + "</svg>\n"
    try! s.write(toFile: OUT + "/" + name, atomically: true, encoding: String.Encoding.utf8)
    print("wrote", name)
}

try! FileManager.default.createDirectory(atPath: OUT, withIntermediateDirectories: true)

// 1. Sunrise: the original layout in website colours
do {
    let m = arcMark(cx: 400, baseline: 470, size: 248, letterFill: "url(#brand)", sunStroke: GREEN, dots: BLUE, swooshColors: ("url(#wave)", "#7CC4F0"))
    let wmBase = m.letters.maxY + 118
    let (wm, wmBox) = colorLine([("ARTHO", INK), ("RHEUMA", GREEN), ("CARE", BLUE)], "Baskerville", 34, 3.2, gap: 16, cx: 400, baseline: wmBase)
    let tag = centered("CARE  ·  RELIEF  ·  MOBILITY", "Baskerville", 15, 2.4, cx: 400, baseline: wmBase + 36)
    let ry = wmBase + 31
    let rules = "<line x1=\"\(f(tag.box.minX - 66))\" y1=\"\(f(ry))\" x2=\"\(f(tag.box.minX - 12))\" y2=\"\(f(ry))\" stroke=\"\(GREEN)\" stroke-width=\"1.4\"/><line x1=\"\(f(tag.box.maxX + 12))\" y1=\"\(f(ry))\" x2=\"\(f(tag.box.maxX + 66))\" y2=\"\(f(ry))\" stroke=\"\(BLUE)\" stroke-width=\"1.4\"/>"
    let vb = m.bounds.union(wmBox).union(tag.box).insetBy(dx: -30, dy: -24)
    write("design-1-sunrise.svg", vb, defs(m.letters.minX, m.letters.maxX) + m.svg + wm + rules + "<path d=\"\(tag.d)\" fill=\"\(GRAY)\"/>")
}

// 2. Badge: round seal with the name around the ring
do {
    let cx: CGFloat = 400, cy: CGFloat = 400, R1: CGFloat = 370, R2: CGFloat = 282
    var body = defs(cx - R1, cx + R1)
    body += "<path fill-rule=\"evenodd\" fill=\"url(#brand)\" d=\"M\(f(cx - R1)) \(f(cy)) a\(f(R1)) \(f(R1)) 0 1 0 \(f(2 * R1)) 0 a\(f(R1)) \(f(R1)) 0 1 0 \(f(-2 * R1)) 0Z M\(f(cx - R2)) \(f(cy)) a\(f(R2)) \(f(R2)) 0 1 0 \(f(2 * R2)) 0 a\(f(R2)) \(f(R2)) 0 1 0 \(f(-2 * R2)) 0Z\"/>"
    body += "<circle cx=\"\(f(cx))\" cy=\"\(f(cy))\" r=\"\(f(R2))\" fill=\"#FFFFFF\"/>"
    body += "<circle cx=\"\(f(cx))\" cy=\"\(f(cy))\" r=\"\(f(R2 - 12))\" fill=\"none\" stroke=\"url(#brand)\" stroke-width=\"2\"/>"
    body += arcText("ARTHO RHEUMA CARE", "Baskerville-SemiBold", 46, 6, cx: cx, cy: cy, r: 310, top: true, fill: "#FFFFFF")
    body += arcText("CARE  ·  RELIEF  ·  MOBILITY", "Baskerville-SemiBold", 28, 4, cx: cx, cy: cy, r: 340, top: false, fill: "#FFFFFF")
    body += "<circle cx=\"\(f(cx - 326))\" cy=\"\(f(cy))\" r=\"7\" fill=\"#FFFFFF\"/><circle cx=\"\(f(cx + 326))\" cy=\"\(f(cy))\" r=\"7\" fill=\"#FFFFFF\"/>"
    let m = arcMark(cx: cx, baseline: cy + 100, size: 190, letterFill: "url(#brand)", sunStroke: GREEN, dots: BLUE, swooshColors: ("url(#wave)", "#7CC4F0"))
    body += m.svg
    write("design-2-badge.svg", CGRect(x: 20, y: 20, width: 760, height: 760), body)
}

// 3. Horizontal: app-style tile plus wordmark, made for the website header
do {
    let S: CGFloat = 300
    var body = "<defs><linearGradient id=\"tile\" x1=\"0\" y1=\"0\" x2=\"1\" y2=\"1\"><stop offset=\"0\" stop-color=\"\(GREEN)\"/><stop offset=\"1\" stop-color=\"\(BLUE)\"/></linearGradient></defs>"
    body += "<rect x=\"0\" y=\"0\" width=\"\(f(S))\" height=\"\(f(S))\" rx=\"64\" fill=\"url(#tile)\"/>"
    let m = arcMark(cx: S / 2, baseline: 207, size: 110, letterFill: "#FFFFFF", sunStroke: "#FFFFFF", dots: GREEN, swooshColors: ("#FFFFFF", "#BFE3F7"))
    body += m.svg
    let x0 = S + 56
    let (wm, wmBox) = colorLine([("ARTHO", INK), ("RHEUMA", GREEN), ("CARE", BLUE)], "Baskerville-SemiBold", 72, 6, gap: 26, x: x0, baseline: 150)
    let tag = run("CARE  ·  RELIEF  ·  MOBILITY", "Baskerville", 30, 8, x: x0, baseline: 236)
    body += defs(x0, wmBox.maxX)
    body += wm
    body += "<rect x=\"\(f(x0))\" y=\"180\" width=\"\(f(wmBox.maxX - x0))\" height=\"3\" rx=\"1.5\" fill=\"url(#brand)\"/>"
    body += "<path d=\"\(tag.d)\" fill=\"\(GRAY)\"/>"
    let right = max(wmBox.maxX, tag.box.maxX)
    write("design-3-horizontal.svg", CGRect(x: -10, y: -10, width: right + 30, height: S + 20), body)
}

// 4. Modern: clean sans-serif monogram in a gradient circle
do {
    let cx: CGFloat = 400, cy: CGFloat = 300, R: CGFloat = 190
    var body = defs(cx - R, cx + R)
    body += "<circle cx=\"\(f(cx))\" cy=\"\(f(cy))\" r=\"\(f(R))\" fill=\"url(#brand)\"/>"
    for deg in stride(from: CGFloat(-60), through: 60, by: 20) {
        let long = Int(deg) % 40 == 0
        let p1 = pt(cx, cy + 20, 132, deg), p2 = pt(cx, cy + 20, long ? 162 : 150, deg)
        body += "<line x1=\"\(f(p1.x))\" y1=\"\(f(p1.y))\" x2=\"\(f(p2.x))\" y2=\"\(f(p2.y))\" stroke=\"#FFFFFF\" stroke-width=\"\(long ? 8 : 6)\" stroke-linecap=\"round\"/>"
    }
    let A = centered("A", "AvenirNext-Heavy", 240, 0, cx: cx, baseline: cy + 80)
    body += "<path d=\"\(A.d)\" fill=\"#FFFFFF\"/>"
    let a = A.box
    for i in 0..<7 {
        let t = 0.18 + CGFloat(i) * 0.115
        let x = a.minX + a.width * (0.47 - 0.37 * t), y = a.minY + a.height * t
        body += "<circle cx=\"\(f(x))\" cy=\"\(f(y))\" r=\"6\" fill=\"\(GREEN)\"/>"
    }
    body += swoosh(L: cx - 95, R: cx + 95, Y: cy + 98, s: 0.39, dark: "#FFFFFF", light: "#BFE3F7")
    let (wm, wmBox) = colorLine([("ARTHO", INK), ("RHEUMA", GREEN), ("CARE", BLUE)], "AvenirNext-DemiBold", 50, 8, gap: 22, cx: cx, baseline: 580)
    let tag = centered("CARE  ·  RELIEF  ·  MOBILITY", "AvenirNext-Medium", 20, 7, cx: cx, baseline: 626)
    body += wm + "<path d=\"\(tag.d)\" fill=\"\(GRAY)\"/>"
    let vb = CGRect(x: cx - R, y: cy - R, width: 2 * R, height: 2 * R).union(wmBox).union(tag.box).insetBy(dx: -30, dy: -30)
    write("design-4-modern.svg", vb, body)
}

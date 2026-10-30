# Assemble kelana4.html (75 s) from kelana3.html: the middle (susun itinerary .. booking) is reused
# with every time shifted by +4 s; hook, landing, problem, mitra, dashboard and end card are new.
import re, os
D = os.path.dirname(os.path.abspath(__file__))
v3 = open(os.path.join(D, '..', 'kelana3.html')).read()
SHIFT = 4.0

def between(a, b):
    i = v3.index(a); j = v3.index(b, i); return v3[i:j]

def fmt(x):
    s = ('%.3f' % x).rstrip('0').rstrip('.'); return s

def sh(m):
    x = float(m.group(0)); return fmt(x + SHIFT) if 10.2 <= x <= 45.5 else m.group(0)

NUM = r'\d+(?:\.\d+)?'
def shift_ctx(s):
    s = re.sub(r'(?<=t >= )' + NUM, sh, s)
    s = re.sub(r'(?<=t < )' + NUM, sh, s)
    s = re.sub(r'(?<=t > )' + NUM, sh, s)
    s = re.sub(r'(?<=seg\(t, )' + NUM, sh, s)
    s = re.sub(r'(?<=seg\(tt, )' + NUM, sh, s)
    s = re.sub(r'(?<=\(t - )' + NUM, sh, s)
    s = re.sub(r'(?<=typed\(s, )' + NUM, sh, s)
    s = re.sub(r'caret\(t, (' + NUM + r'), (' + NUM + r')\)', lambda m: 'caret(t, %s, %s)' % (sh(re.match(NUM, m.group(1))), sh(re.match(NUM, m.group(2)))), s)
    s = re.sub(r"(up\(\$\('\w+'\), )(" + NUM + r")(, )(" + NUM + r"|null)",
               lambda m: m.group(1) + sh(re.match(NUM, m.group(2))) + m.group(3) + (m.group(4) if m.group(4) == 'null' else sh(re.match(NUM, m.group(4)))), s)
    return s

def shift_all_in(s):
    return re.sub(NUM, sh, s)

head = v3[:v3.index('/* ======================= W0 HOOK')]
head = head.replace('<title>Kelana — explainer v3</title>', '<title>Kelana — explainer v4</title>')
head = head.replace('Kelana explainer v3 — 60 s', 'Kelana explainer v4 — 75 s').replace('const DUR = 60;', 'const DUR = 75;')
head = head.replace('</style>', '''.rw{position:absolute;width:540px;height:340px;background:#fff;border:1px solid #E2E8F0;border-radius:14px;box-shadow:0 24px 60px rgba(15,23,42,.16);overflow:hidden;transform-origin:50% 50%}
.rw .bar{position:absolute;left:0;top:0;width:540px;height:38px;background:#F1F5F9;border-bottom:1px solid #E2E8F0}
.rw .dot{position:absolute;top:15px;width:9px;height:9px;border-radius:5px;background:#CBD5E1}
.rw .url{position:absolute;left:72px;top:8px;width:330px;height:22px;border-radius:11px;background:#fff;font-size:12px;line-height:22px;color:#64748B;padding-left:12px;white-space:nowrap}
.rw .ttl{position:absolute;left:20px;top:52px;width:500px;font-size:21px;font-weight:800;letter-spacing:-.02em;line-height:1.22}
.rw .ph{position:absolute;left:20px;top:116px;width:500px;height:148px;border-radius:10px;object-fit:cover}
.rw .sk{position:absolute;height:10px;border-radius:5px;background:#EEF2F6}
.rw .av{position:absolute;width:30px;height:30px;border-radius:15px;background:#E2E8F0}
.rw .st{position:absolute;font-size:15px;color:#F5A524;letter-spacing:2px}
.stp{position:absolute;top:0;height:26px;font-size:14.5px;font-weight:700;line-height:26px;white-space:nowrap;padding-left:34px}
.stp .o{position:absolute;left:0;top:1px;width:24px;height:24px;border-radius:12px;border:2px solid #94A3B8;background:#fff}
.stp .f{position:absolute;left:0;top:1px;width:24px;height:24px;border-radius:12px;background:#0F172A;display:flex;align-items:center;justify-content:center}
</style>''')

mid_defs = between('/* ======================= W2 SUSUN 1', '/* ======================= W7 PROBLEM')
mid_defs = re.sub(r"(win\('\w+', )(" + NUM + "), (" + NUM + ")", lambda m: m.group(1) + sh(re.match(NUM, m.group(2))) + ', ' + sh(re.match(NUM, m.group(3))), mid_defs)
mid_defs = re.sub(r'((?:PICK_T|QF|QFO|QB|QBO) = \[)([^\]]*)\]', lambda m: m.group(1) + shift_all_in(m.group(2)) + ']', mid_defs)
mid_defs = re.sub(r"(quote\('\w+', )(" + NUM + "), (" + NUM + ")", lambda m: m.group(1) + sh(re.match(NUM, m.group(2))) + ', ' + sh(re.match(NUM, m.group(3))), mid_defs)
mid_cams = between('s1.cam = camTrack', 'm1.cam')
mid_cams = re.sub(r'\[(' + NUM + '), (' + NUM + '), ', lambda m: '[%s, %s, ' % (sh(re.match(NUM, m.group(1))), sh(re.match(NUM, m.group(2)))), mid_cams)
mid_seek = shift_ctx(between('  /* ---- susun 1 ---- */', '  /* ---- problem ---- */'))

# arrays from v3 (keep entries inside the shifted range)
uk = between('const UK = [', '];\nconst CUR_WIN')
uk_mid = '\n'.join(re.sub(r'(?<=t: )' + NUM, sh, l) for l in uk.split('\n') if re.search(r't: (' + NUM + ')', l) and 10.5 <= float(re.search(r't: (' + NUM + ')', l).group(1)) <= 44.9)
pr = between('const PRESS = [', '];\nfunction curAt')
pr_mid = ', '.join('[%s, %s]' % (fmt(float(a) + SHIFT), fmt(float(b) + SHIFT)) for a, b in re.findall(r'\[(' + NUM + '), (' + NUM + r')\]', pr) if 10.5 <= float(a) <= 44.9)
caps = between('const CAPS = [', '];\nadd($(\'top\')')
cap_mid = []
for a, b, s in re.findall(r"\[(" + NUM + "), (" + NUM + r"), '([^']*)'\]", caps):
    if 10.4 <= float(a) <= 44.9: cap_mid.append("[%s, %s, '%s']" % (fmt(float(a) + SHIFT), fmt(float(b) + SHIFT), s))
cap_mid = ',\n  '.join(cap_mid)

tail = open(os.path.join(D, 'tail4.js')).read()
for k, v in {'/*@MID_DEFS@*/': mid_defs, '/*@MID_CAMS@*/': mid_cams, '/*@MID_SEEK@*/': mid_seek, '/*@UK_MID@*/': uk_mid, '/*@PRESS_MID@*/': pr_mid, '/*@CAPS_MID@*/': cap_mid}.items():
    assert k in tail, k; tail = tail.replace(k, v)
open(os.path.join(D, '..', 'kelana4.html'), 'w').write(head + tail)
print('ok', len(head + tail))

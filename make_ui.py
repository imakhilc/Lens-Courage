from pathlib import Path
import subprocess, textwrap, os

OUT=Path('/mnt/data/lens_courage_phase1/ui_reference')
OUT.mkdir(parents=True, exist_ok=True)

BASE_CSS = r'''
*{box-sizing:border-box}html,body{margin:0;padding:0;width:412px;height:915px;overflow:hidden;background:#f6f7fb;font-family:Arial,Helvetica,sans-serif;color:#252b3a}body{position:relative}.screen{width:412px;height:915px;position:relative;background:#f6f7fb;overflow:hidden}.status{height:34px;padding:12px 20px 0;display:flex;justify-content:space-between;align-items:center;font-size:12px;font-weight:800;color:#252b3a}.status .icons{letter-spacing:1px}.content{padding:14px 18px 92px}.brand{display:flex;align-items:center;gap:10px}.mark{width:38px;height:38px;border-radius:13px;background:linear-gradient(145deg,#7259ff,#9a87ff);display:grid;place-items:center;box-shadow:0 8px 18px rgba(114,89,255,.25)}.lens{width:18px;height:18px;border:4px solid #fff;border-radius:50%;position:relative}.lens:after{content:'';position:absolute;width:5px;height:5px;border-radius:50%;background:#ffc857;right:-6px;top:-6px}.brand-name{font-size:22px;font-weight:900;letter-spacing:-.4px}.brand-sub{font-size:11px;color:#7d859b;font-weight:700;margin-top:2px}.toprow{display:flex;align-items:center;justify-content:space-between}.chip{display:inline-flex;align-items:center;gap:5px;height:34px;padding:0 12px;border-radius:999px;background:#fff;border:1px solid #e8eaf1;font-size:13px;font-weight:800;box-shadow:0 5px 12px rgba(33,40,62,.05)}.chip.primary{background:#eeeafe;color:#5b45e6;border-color:#dfd7ff}.chip.gold{background:#fff7dc;color:#9d7010;border-color:#ffe9a2}.card{background:#fff;border:1px solid #eceef4;border-radius:24px;box-shadow:0 10px 28px rgba(35,43,58,.06)}.hero{padding:22px;background:linear-gradient(145deg,#7259ff 0%,#8f75ff 62%,#b19fff 100%);color:#fff;border:none;box-shadow:0 16px 34px rgba(114,89,255,.26)}.eyebrow{font-size:11px;font-weight:900;letter-spacing:1.4px;text-transform:uppercase;opacity:.88}.h1{font-size:31px;line-height:1.08;font-weight:900;letter-spacing:-1px}.h2{font-size:25px;line-height:1.1;font-weight:900;letter-spacing:-.65px}.h3{font-size:18px;line-height:1.15;font-weight:900}.body{font-size:15px;line-height:1.42;color:#666f84}.hero .body{color:rgba(255,255,255,.9)}.muted{color:#7d859b}.btn{height:54px;border-radius:18px;display:flex;align-items:center;justify-content:center;font-size:16px;font-weight:900;background:#7259ff;color:#fff;border-bottom:5px solid #5843d6;letter-spacing:.1px}.btn.white{background:#fff;color:#5b45e6;border-bottom-color:#ddd7ff}.btn.dark{background:#252b3a;border-bottom-color:#141822}.btn.coral{background:#ff6b72;border-bottom-color:#db4f57}.btn.secondary{background:#fff;color:#4e5670;border:2px solid #e3e5ed;border-bottom:4px solid #d4d7e0}.progress{height:11px;border-radius:999px;background:#e9eaf0;overflow:hidden}.progress>i{display:block;height:100%;border-radius:999px;background:linear-gradient(90deg,#7259ff,#9c87ff)}.quest{display:grid;grid-template-columns:36px 1fr auto;gap:10px;align-items:center;padding:11px 0;border-bottom:1px solid #f0f1f5}.quest:last-child{border-bottom:0}.qicon{width:36px;height:36px;border-radius:12px;display:grid;place-items:center;font-weight:900;background:#f0edff;color:#7259ff}.qtitle{font-size:13px;font-weight:800}.qsub{font-size:11px;color:#8b92a5;margin-top:4px}.check{width:25px;height:25px;border-radius:50%;border:2px solid #d8dbe5;display:grid;place-items:center;color:#fff;font-size:12px}.check.done{background:#3bc5b5;border-color:#3bc5b5}.tabs{position:absolute;bottom:0;left:0;right:0;height:78px;background:#fff;border-top:1px solid #e6e8ef;display:grid;grid-template-columns:repeat(4,1fr);padding:8px 8px 10px}.tab{display:flex;flex-direction:column;gap:4px;align-items:center;justify-content:center;color:#a1a8ba;font-size:10px;font-weight:800}.tab.active{color:#7259ff}.tab svg{width:23px;height:23px;stroke:currentColor;fill:none;stroke-width:2.2}.tab.active .tabbubble{background:#f0edff}.tabbubble{width:42px;height:34px;border-radius:13px;display:grid;place-items:center}.pill{display:inline-flex;align-items:center;gap:6px;border-radius:999px;padding:7px 10px;font-size:11px;font-weight:900}.pill.light{background:rgba(255,255,255,.15);color:#fff;border:1px solid rgba(255,255,255,.22)}.pill.gray{background:#f0f1f5;color:#5f677b}.pill.teal{background:#e3fbf7;color:#178b7d}.pill.coral{background:#ffeaec;color:#c84b54}.row{display:flex;align-items:center}.space{justify-content:space-between}.divider{height:1px;background:#eceef3}.back{width:38px;height:38px;border-radius:13px;background:#fff;border:1px solid #e7e9ef;display:grid;place-items:center;font-size:22px;font-weight:700}.small-label{font-size:11px;font-weight:900;color:#8b92a5;letter-spacing:.8px;text-transform:uppercase}.metric{padding:14px;border-radius:18px;background:#fff;border:1px solid #eaecf2}.metric .n{font-size:22px;font-weight:900}.metric .l{font-size:11px;color:#858da1;font-weight:700;margin-top:2px}.bottom-fade{position:absolute;left:0;right:0;bottom:0;height:90px;background:linear-gradient(transparent,#f6f7fb)}
'''

NAV = '''<div class="tabs">
<div class="tab active"><div class="tabbubble"><svg viewBox="0 0 24 24"><path d="M3 11.5 12 4l9 7.5"/><path d="M5 10.5V20h14v-9.5"/></svg></div><span>Today</span></div>
<div class="tab"><div class="tabbubble"><svg viewBox="0 0 24 24"><path d="M4 19c3-6 5-10 8-10s3 6 8 6"/><circle cx="5" cy="18" r="2"/><circle cx="12" cy="9" r="2"/><circle cx="20" cy="15" r="2"/></svg></div><span>Path</span></div>
<div class="tab"><div class="tabbubble"><svg viewBox="0 0 24 24"><path d="M4 19V9M10 19V5M16 19v-7M22 19V3"/></svg></div><span>Progress</span></div>
<div class="tab"><div class="tabbubble"><svg viewBox="0 0 24 24"><circle cx="12" cy="8" r="4"/><path d="M4 21c1.5-5 4.2-7 8-7s6.5 2 8 7"/></svg></div><span>Me</span></div>
</div>'''

STATUS='<div class="status"><span>9:41</span><span class="icons">●●●  ◉  ▰</span></div>'
MARK='<div class="brand"><div class="mark"><div class="lens"></div></div><div><div class="brand-name">Lens Courage</div><div class="brand-sub">ONE BRAVE REP AT A TIME</div></div></div>'

screens={}

screens['01_welcome'] = f'''<div class="screen">{STATUS}<div class="content" style="padding-top:28px">{MARK}
<div style="height:48px"></div>
<div class="h1" style="font-size:36px;max-width:350px">Get comfortable on camera, one tiny challenge at a time.</div>
<div class="body" style="font-size:16px;margin-top:15px;max-width:350px">No posting. No audience. Just small daily reps that get a little braver.</div>
<div class="card" style="height:230px;margin-top:28px;position:relative;overflow:hidden;background:linear-gradient(145deg,#eeeafe,#f9f7ff)">
  <div style="position:absolute;width:190px;height:190px;border-radius:50%;background:#7259ff;right:-40px;bottom:-55px;opacity:.95"></div>
  <div style="position:absolute;width:92px;height:150px;border-radius:25px;background:#252b3a;right:66px;bottom:34px;transform:rotate(-6deg);box-shadow:0 16px 26px rgba(37,43,58,.22)"><div style="position:absolute;width:30px;height:30px;border:5px solid #fff;border-radius:50%;left:31px;top:45px"></div><div style="position:absolute;width:10px;height:10px;border-radius:50%;background:#ff6b72;left:41px;top:12px"></div></div>
  <div style="position:absolute;left:22px;top:25px;width:165px"><div class="eyebrow" style="color:#5b45e6">DAY 1 → DAY 30</div><div class="h2" style="margin-top:8px">Bedroom to public vlog.</div><div class="body" style="margin-top:8px;font-size:13px">The app increases difficulty one safe step at a time.</div></div>
</div>
<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-top:18px">
<div class="metric" style="text-align:center"><div style="font-size:20px">🔒</div><div class="qtitle" style="margin-top:6px">Private reps</div></div>
<div class="metric" style="text-align:center"><div style="font-size:20px">⚡</div><div class="qtitle" style="margin-top:6px">Daily path</div></div>
<div class="metric" style="text-align:center"><div style="font-size:20px">✨</div><div class="qtitle" style="margin-top:6px">AI coach</div></div></div>
<div class="btn" style="margin-top:24px">Start my first rep</div>
</div></div>'''

screens['02_baseline'] = f'''<div class="screen">{STATUS}<div class="content" style="padding-top:20px"><div class="row space"><div class="back">‹</div><div class="small-label">1 OF 3</div><div style="width:38px"></div></div>
<div class="progress" style="margin-top:18px"><i style="width:33%"></i></div>
<div style="margin-top:36px" class="eyebrow muted">STARTING POINT</div><div class="h1" style="margin-top:9px">How does talking to a camera feel right now?</div><div class="body" style="margin-top:10px">No right answer. This only changes how we introduce the journey.</div>
<div style="display:grid;gap:11px;margin-top:25px">
<div class="card" style="padding:17px;display:flex;gap:14px;align-items:center"><div style="font-size:27px">😵</div><div><div class="h3">I avoid it</div><div class="qsub">Even recording alone feels weird.</div></div></div>
<div class="card" style="padding:17px;display:flex;gap:14px;align-items:center;border:2px solid #7259ff;background:#f7f5ff;box-shadow:0 9px 22px rgba(114,89,255,.10)"><div style="font-size:27px">😬</div><div style="flex:1"><div class="h3">I can do it alone</div><div class="qsub">But I overthink every take.</div></div><div class="check done">✓</div></div>
<div class="card" style="padding:17px;display:flex;gap:14px;align-items:center"><div style="font-size:27px">🙂</div><div><div class="h3">I can record</div><div class="qsub">Public recording is the scary part.</div></div></div>
<div class="card" style="padding:17px;display:flex;gap:14px;align-items:center"><div style="font-size:27px">😎</div><div><div class="h3">Give me harder reps</div><div class="qsub">I want real vlogging confidence.</div></div></div>
</div><div class="btn" style="position:absolute;left:18px;right:18px;bottom:28px">Continue</div></div></div>'''

screens['03_home'] = f'''<div class="screen">{STATUS}<div class="content" style="padding-top:12px">
<div class="row space">{MARK}<div style="display:flex;gap:7px"><div class="chip gold">⚡ 5</div><div class="chip primary">CP 320</div></div></div>
<div class="row space" style="margin-top:20px"><div><div class="small-label">TODAY'S REP</div><div class="h2" style="margin-top:4px">Challenge 6 of 30</div></div><div class="chip">DAY 6</div></div>
<div class="hero card" style="margin-top:15px;height:248px;position:relative;overflow:hidden">
<div style="position:absolute;width:180px;height:180px;border:26px solid rgba(255,255,255,.09);border-radius:50%;right:-45px;top:-25px"></div>
<div class="row space"><div class="pill light">SOLO LENS</div><div class="pill light">+20 CP</div></div>
<div class="h1" style="margin-top:20px">Stand Up</div><div class="body" style="font-size:15px;margin-top:8px;max-width:310px">Record standing up for 30 seconds while keeping your gaze near the lens.</div>
<div class="row" style="gap:9px;margin-top:16px"><div class="pill light">◷ 30 sec</div><div class="pill light">Front camera</div></div>
<div class="btn white" style="margin-top:18px;height:50px">Start challenge</div>
</div>
<div class="card" style="padding:15px 17px;margin-top:14px"><div class="row space"><div><div class="h3">Daily quests</div><div class="qsub">Complete all 3 for +20 CP</div></div><div class="pill gray">1 / 3</div></div>
<div class="quest"><div class="qicon">1</div><div><div class="qtitle">Complete today's challenge</div><div class="qsub">0 / 1</div></div><div class="check"></div></div>
<div class="quest"><div class="qicon" style="background:#e7fbf7;color:#168c7d">2</div><div><div class="qtitle">Review coach feedback</div><div class="qsub">1 / 1</div></div><div class="check done">✓</div></div>
<div class="quest"><div class="qicon" style="background:#fff3df;color:#bd7a13">3</div><div><div class="qtitle">Record 30 seconds today</div><div class="qsub">0 / 30 sec</div></div><div class="check"></div></div>
</div>
<div class="card" style="padding:15px 17px;margin-top:12px"><div class="row space"><div><div class="h3">Weekly courage chest</div><div class="qsub">Complete 5 challenges</div></div><div style="font-size:27px">🎁</div></div><div class="row" style="gap:10px;margin-top:10px"><div class="progress" style="flex:1"><i style="width:60%;background:linear-gradient(90deg,#ffc857,#ffb647)"></i></div><div class="qtitle">3 / 5</div></div></div>
</div>{NAV}</div>'''

# custom nav active path
nav_path=NAV.replace('class="tab active"','class="tab"',1).replace('<div class="tab"><div class="tabbubble"><svg viewBox="0 0 24 24"><path d="M4 19c3-6 5-10 8-10s3 6 8 6"','<div class="tab active"><div class="tabbubble"><svg viewBox="0 0 24 24"><path d="M4 19c3-6 5-10 8-10s3 6 8 6"',1)

screens['04_path'] = f'''<div class="screen">{STATUS}<div class="content" style="padding-top:12px">
<div class="row space"><div><div class="small-label">YOUR JOURNEY</div><div class="h1" style="margin-top:4px">Solo Lens</div></div><div class="chip primary">6 / 30</div></div>
<div class="card" style="padding:15px 17px;margin-top:14px"><div class="row space"><div><div class="qtitle">Stage 1 progress</div><div class="qsub">One more rep to reach the boss.</div></div><div class="qtitle" style="color:#7259ff">6 / 7</div></div><div class="progress" style="margin-top:11px"><i style="width:86%"></i></div></div>
<div style="height:620px;position:relative;margin-top:12px">
<div style="position:absolute;left:50%;top:20px;bottom:24px;width:8px;background:#e2e4eb;border-radius:9px;transform:translateX(-50%)"></div>
<div style="position:absolute;left:50%;top:20px;height:463px;width:8px;background:linear-gradient(#3bc5b5,#7259ff);border-radius:9px;transform:translateX(-50%)"></div>
'''+''.join([
 f'''<div style="position:absolute;top:{t}px;left:{l}%;transform:translateX(-50%);text-align:center"><div style="width:{s}px;height:{s}px;border-radius:50%;background:{bg};border:{border};display:grid;place-items:center;color:{color};font-weight:900;font-size:{fs}px;box-shadow:{shadow}">{label}</div><div style="font-size:10px;font-weight:800;color:#697186;margin-top:5px;white-space:nowrap">{name}</div></div>'''
 for t,l,s,bg,border,color,fs,shadow,label,name in [
 (18,50,54,'#3bc5b5','4px solid #fff','#fff',18,'0 6px 14px rgba(59,197,181,.25)','✓','Just Say Hi'),
 (105,37,54,'#3bc5b5','4px solid #fff','#fff',18,'0 6px 14px rgba(59,197,181,.25)','✓','Twenty Seconds'),
 (192,63,54,'#3bc5b5','4px solid #fff','#fff',18,'0 6px 14px rgba(59,197,181,.25)','✓','Your Day in 30'),
 (279,38,54,'#3bc5b5','4px solid #fff','#fff',18,'0 6px 14px rgba(59,197,181,.25)','✓','No Delete'),
 (366,62,54,'#3bc5b5','4px solid #fff','#fff',18,'0 6px 14px rgba(59,197,181,.25)','✓','Explain a Favorite'),
 (453,50,66,'#7259ff','6px solid #dcd5ff','#fff',21,'0 0 0 7px rgba(114,89,255,.10), 0 9px 18px rgba(114,89,255,.25)','6','Stand Up'),
 (555,50,76,'linear-gradient(145deg,#ff6b72,#ff8a6b)','5px solid #ffe4e6','#fff',21,'0 10px 22px rgba(255,107,114,.25)','★','BOSS • 1-Min Recap')
 ]])+f'''</div></div>{nav_path}</div>'''

screens['05_challenge_detail'] = f'''<div class="screen">{STATUS}<div class="content" style="padding-top:14px"><div class="row space"><div class="back">‹</div><div class="chip primary">CHALLENGE 6</div><div style="width:38px"></div></div>
<div style="margin-top:28px"><div class="pill teal">STAGE 1 • SOLO LENS</div><div class="h1" style="font-size:38px;margin-top:13px">Stand Up</div><div class="body" style="font-size:17px;margin-top:9px">Record standing up and talk for 30 seconds while keeping your gaze near the lens.</div></div>
<div class="card" style="padding:20px;margin-top:25px;background:linear-gradient(145deg,#fff,#faf9ff)"><div class="small-label">YOUR MISSION</div><div class="h3" style="margin-top:12px">Finish one complete take.</div><div style="display:grid;gap:13px;margin-top:16px">
<div class="row" style="gap:11px"><div class="qicon">1</div><div><div class="qtitle">Stand while recording</div><div class="qsub">Change your body position.</div></div></div>
<div class="row" style="gap:11px"><div class="qicon">2</div><div><div class="qtitle">Look near the lens</div><div class="qsub">Don't chase your own preview.</div></div></div>
<div class="row" style="gap:11px"><div class="qicon">3</div><div><div class="qtitle">Keep going for 30 seconds</div><div class="qsub">Small mistakes are allowed.</div></div></div></div></div>
<div class="row" style="gap:9px;margin-top:15px"><div class="card" style="padding:14px;flex:1;text-align:center"><div class="small-label">TIME</div><div class="h3" style="margin-top:6px">30 sec</div></div><div class="card" style="padding:14px;flex:1;text-align:center"><div class="small-label">REWARD</div><div class="h3" style="margin-top:6px;color:#7259ff">+20 CP</div></div></div>
<div class="card" style="padding:16px;margin-top:15px;background:#fff7dc;border-color:#ffe7a0"><div class="row" style="gap:11px"><div style="font-size:22px">✨</div><div><div class="qtitle">AI coach after you finish</div><div class="qsub" style="line-height:1.35">You'll get one strength and one useful thing to improve next time.</div></div></div></div>
<div class="btn" style="position:absolute;left:18px;right:18px;bottom:28px">Open camera</div></div></div>'''

screens['06_recording'] = '''<div class="screen" style="background:#111218;color:#fff"><div class="status" style="color:#fff;background:#111218"><span>9:41</span><span class="icons">●●●  ◉  ▰</span></div>
<div style="position:absolute;inset:34px 0 0;background:radial-gradient(circle at 65% 35%,#4f5665 0,#333843 28%,#20232b 58%,#15171c 100%)">
<div style="position:absolute;left:20px;top:18px;width:42px;height:42px;border-radius:50%;background:rgba(0,0,0,.36);display:grid;place-items:center;font-size:24px">×</div>
<div style="position:absolute;right:20px;top:18px;width:42px;height:42px;border-radius:50%;background:rgba(0,0,0,.36);display:grid;place-items:center;font-size:18px">↻</div>
<div style="position:absolute;left:50%;top:110px;transform:translateX(-50%);width:220px;height:360px;border:2px solid rgba(255,255,255,.09);border-radius:120px 120px 75px 75px;background:linear-gradient(180deg,rgba(255,255,255,.09),rgba(255,255,255,.02))"></div>
<div style="position:absolute;left:50%;top:163px;transform:translateX(-50%);width:108px;height:108px;border-radius:50%;background:rgba(255,255,255,.08)"></div>
<div style="position:absolute;left:50%;top:294px;transform:translateX(-50%);width:180px;height:215px;border-radius:85px 85px 40px 40px;background:rgba(255,255,255,.06)"></div>
<div style="position:absolute;top:84px;left:0;right:0;text-align:center"><span style="background:rgba(0,0,0,.38);padding:8px 13px;border-radius:999px;font-size:12px;font-weight:800">STAND UP • 30 SEC</span></div>
<div style="position:absolute;left:18px;right:18px;bottom:177px;background:rgba(19,20,26,.72);backdrop-filter:blur(8px);border:1px solid rgba(255,255,255,.12);padding:15px 16px;border-radius:19px"><div style="font-size:11px;font-weight:900;letter-spacing:1px;color:#cfc9ff">PROMPT</div><div style="font-size:15px;font-weight:800;line-height:1.35;margin-top:5px">Tell the camera one thing you did today. Keep your gaze near the lens.</div></div>
<div style="position:absolute;bottom:0;left:0;right:0;height:160px;background:linear-gradient(transparent,rgba(0,0,0,.72) 28%,rgba(0,0,0,.9));text-align:center;padding-top:54px"><div style="position:absolute;left:50%;top:30px;transform:translateX(-50%);width:78px;height:78px;border-radius:50%;border:5px solid #fff;display:grid;place-items:center"><div style="width:57px;height:57px;border-radius:50%;background:#ff5c64"></div></div><div style="font-size:12px;font-weight:700;color:#d8dae0;margin-top:67px">Start when you're ready</div></div>
</div></div>'''

screens['07_feedback'] = f'''<div class="screen">{STATUS}<div class="content" style="padding-top:12px"><div class="row space"><div><div class="small-label">COACH FEEDBACK</div><div class="h1" style="margin-top:4px">Nice rep.</div></div><div class="chip gold">⚡ 6 day</div></div>
<div class="card" style="margin-top:16px;padding:19px;background:linear-gradient(145deg,#eeeafe,#faf9ff);border-color:#dfd8ff"><div class="row space"><div><div class="small-label" style="color:#7259ff">CHALLENGE COMPLETE</div><div class="h2" style="margin-top:6px">Stand Up</div></div><div style="text-align:right"><div class="h2" style="color:#7259ff">+25</div><div class="qsub">CP earned</div></div></div></div>
<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-top:12px"><div class="metric"><div class="n">31s</div><div class="l">Duration</div></div><div class="metric"><div class="n">74</div><div class="l">Words</div></div><div class="metric"><div class="n">143</div><div class="l">WPM</div></div></div>
<div class="card" style="padding:17px;margin-top:12px"><div class="row space"><div class="h3">Filler words</div><div class="pill gray">5 total</div></div><div class="row" style="gap:7px;margin-top:12px;flex-wrap:wrap"><div class="pill coral">um × 2</div><div class="pill coral">like × 2</div><div class="pill coral">so × 1</div></div></div>
<div class="card" style="padding:17px;margin-top:12px;border-left:5px solid #3bc5b5"><div class="small-label" style="color:#188b7d">WHAT WORKED</div><div class="body" style="font-size:14px;margin-top:6px;color:#3f4759">You started quickly and kept the take moving even after a small stumble.</div></div>
<div class="card" style="padding:17px;margin-top:10px;border-left:5px solid #7259ff"><div class="small-label" style="color:#7259ff">ONE THING TO FOCUS ON</div><div class="body" style="font-size:14px;margin-top:6px;color:#3f4759">The middle sped up. Add one deliberate pause after your second sentence.</div></div>
<div class="card" style="padding:17px;margin-top:10px;border-left:5px solid #ffc857"><div class="small-label" style="color:#a8740c">TRY NEXT TIME</div><div class="body" style="font-size:14px;margin-top:6px;color:#3f4759">Take one quiet breath before you press record.</div></div>
<div class="row" style="gap:9px;margin-top:14px"><div class="btn secondary" style="flex:1">Practice again</div><div class="btn" style="flex:1">Continue</div></div>
</div></div>'''

nav_progress=NAV.replace('class="tab active"','class="tab"',1)
# make third active specifically
needle='<div class="tab"><div class="tabbubble"><svg viewBox="0 0 24 24"><path d="M4 19V9M10 19V5M16 19v-7M22 19V3"'
nav_progress=nav_progress.replace(needle,'<div class="tab active"><div class="tabbubble"><svg viewBox="0 0 24 24"><path d="M4 19V9M10 19V5M16 19v-7M22 19V3"',1)

screens['08_progress'] = f'''<div class="screen">{STATUS}<div class="content" style="padding-top:14px"><div class="row space"><div><div class="small-label">YOUR PROGRESS</div><div class="h1" style="margin-top:4px">Keep showing up.</div></div><div class="chip primary">LV 4</div></div>
<div class="card" style="padding:20px;margin-top:18px;background:linear-gradient(145deg,#fff2d4,#fff9e9);border-color:#ffe6a1"><div class="row space"><div><div class="small-label" style="color:#af7910">CURRENT STREAK</div><div class="h1" style="font-size:42px;margin-top:2px">6 days ⚡</div></div><div style="width:72px;height:72px;border-radius:24px;background:#ffc857;display:grid;place-items:center;font-size:31px;box-shadow:0 10px 20px rgba(255,200,87,.28)">⚡</div></div><div class="qsub" style="margin-top:8px;color:#8b6c28">Next milestone: 7 days</div><div class="progress" style="margin-top:11px;background:#f3ddb0"><i style="width:86%;background:#ffc857"></i></div></div>
<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-top:12px"><div class="metric"><div class="n">320</div><div class="l">Total CP</div></div><div class="metric"><div class="n">6</div><div class="l">Challenges</div></div><div class="metric"><div class="n">6</div><div class="l">Best streak</div></div></div>
<div class="card" style="padding:17px;margin-top:12px"><div class="row space"><div><div class="h3">This week</div><div class="qsub">4 practice days</div></div><div class="pill teal">GREAT</div></div><div style="display:grid;grid-template-columns:repeat(7,1fr);gap:7px;margin-top:16px">'''+''.join([f'<div style="text-align:center"><div style="font-size:10px;color:#9299aa;font-weight:800">{d}</div><div style="width:34px;height:34px;border-radius:12px;margin:7px auto 0;background:{bg};color:{co};display:grid;place-items:center;font-weight:900">{tx}</div></div>' for d,bg,co,tx in [('M','#3bc5b5','#fff','✓'),('T','#3bc5b5','#fff','✓'),('W','#eceef3','#9ba2b4','–'),('T','#3bc5b5','#fff','✓'),('F','#3bc5b5','#fff','✓'),('S','#eeeafe','#7259ff','•'),('S','#eceef3','#9ba2b4','')]])+'''</div></div>
<div class="card" style="padding:17px;margin-top:12px"><div class="row space"><div><div class="h3">Speaking trend</div><div class="qsub">Last 5 coached reps</div></div><div class="pill gray">143 WPM avg</div></div><div style="height:88px;margin-top:14px;position:relative;border-bottom:1px solid #e9eaf0"><svg width="100%" height="86" viewBox="0 0 340 86"><polyline points="5,58 70,45 135,54 205,31 270,36 335,20" fill="none" stroke="#7259ff" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/><g fill="#7259ff"><circle cx="5" cy="58" r="5"/><circle cx="70" cy="45" r="5"/><circle cx="135" cy="54" r="5"/><circle cx="205" cy="31" r="5"/><circle cx="270" cy="36" r="5"/><circle cx="335" cy="20" r="5"/></g></svg></div></div>
</div>'''+nav_progress+'''</div>'''

nav_me=NAV.replace('class="tab active"','class="tab"',1)
needle4='<div class="tab"><div class="tabbubble"><svg viewBox="0 0 24 24"><circle cx="12" cy="8" r="4"'
nav_me=nav_me.replace(needle4,'<div class="tab active"><div class="tabbubble"><svg viewBox="0 0 24 24"><circle cx="12" cy="8" r="4"',1)

screens['09_badges'] = f'''<div class="screen">{STATUS}<div class="content" style="padding-top:14px"><div class="row space"><div class="brand"><div class="mark"><div class="lens"></div></div><div><div class="h2">Your profile</div><div class="brand-sub">LEVEL 4 • 320 CP</div></div></div><div class="chip gold">⚡ 6</div></div>
<div class="card" style="padding:18px;margin-top:18px"><div class="row space"><div><div class="small-label">LEVEL 4</div><div class="h3" style="margin-top:5px">80 CP to Level 5</div></div><div class="pill primary" style="background:#eeeafe;color:#5b45e6">320 CP</div></div><div class="progress" style="margin-top:13px"><i style="width:20%"></i></div></div>
<div class="row space" style="margin-top:22px"><div><div class="h2">Badges</div><div class="body" style="font-size:13px;margin-top:3px">Collect proof that you showed up.</div></div><div class="chip">3 / 10</div></div>
<div style="display:grid;grid-template-columns:repeat(2,1fr);gap:11px;margin-top:14px">'''+''.join([f'''<div class="card" style="padding:16px;min-height:150px;opacity:{op}"><div style="width:60px;height:60px;border-radius:21px;background:{bg};display:grid;place-items:center;font-size:28px;border:1px solid {bd}">{ico}</div><div class="h3" style="font-size:15px;margin-top:12px">{name}</div><div class="qsub" style="line-height:1.35;margin-top:5px">{desc}</div></div>''' for bg,bd,ico,name,desc,op in [
('#e8fbf7','#c7f2ea','◉','First Rep','Completed your first challenge.','1'),
('#fff3d7','#ffe3a0','⚡','Three in a Row','Reached a 3-day streak.','1'),
('#eeeafe','#ddd5ff','✦','One-Take Wonder','Finished a one-take challenge.','1'),
('#f0f1f4','#e3e5ea','◌','Seven-Day Lens','Reach a 7-day streak.','.45'),
('#f0f1f4','#e3e5ea','↗','Outside Voice','Complete your first outdoor rep.','.45'),
('#f0f1f4','#e3e5ea','★','Lens Graduate','Complete the final boss.','.45')]])+'''</div></div>'''+nav_me+'''</div>'''

for name, inner in screens.items():
    html=f'''<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=412,initial-scale=1"><style>{BASE_CSS}</style></head><body>{inner}</body></html>'''
    p=OUT/f'{name}.html'
    p.write_text(html)
    png=OUT/f'{name}.png'
    from playwright.sync_api import sync_playwright
    with sync_playwright() as pw:
        browser = pw.chromium.launch(executable_path='/usr/bin/chromium', headless=True, args=['--no-sandbox'])
        page = browser.new_page(viewport={'width': 412, 'height': 915}, device_scale_factor=2)
        page.set_content(html, wait_until='load')
        page.screenshot(path=str(png))
        browser.close()

print('generated', len(screens), 'screens')

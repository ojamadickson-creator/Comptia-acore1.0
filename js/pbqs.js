/* CompTIA A+ Core 1 - Section 2: Performance-Based Questions (10 interactive PBQs)
   Each PBQ: { id, title, domain, max, scenario, render(el), grade(el) -> {score, reviewHtml} }
   Grading contract: grade() returns points earned and injects review markup into the card. */
(function(){
"use strict";

function esc(s){ return s.replace(/&/g,"&amp;").replace(/</g,"&lt;"); }
function disableAll(el){ el.querySelectorAll("input,select,button,textarea").forEach(function(n){ n.disabled = true; }); }
function markList(el, selector, verdicts){
  // verdicts: array of true/false matched to nodes in document order
  el.querySelectorAll(selector).forEach(function(node, i){
    node.classList.remove("pbq-good","pbq-bad");
    if(verdicts[i]===true) node.classList.add("pbq-good");
    if(verdicts[i]===false) node.classList.add("pbq-bad");
  });
}
function reviewBox(score, max, body){
  return '<div class="pbq-review"><div class="verdict '+(score===max?"ok":(score>0?"skip":"bad"))+'">'
    + 'Score: '+score+' / '+max+'</div><div class="explain"><b>Review:</b> '+body+'</div></div>';
}

var PBQS = [];

/* ---------------- PBQ 1: Build-a-PC parts selection ---------------- */
PBQS.push({
  id:"pbq1", title:"Build-a-PC: Video Editing Workstation", domain:"Hardware", max:10,
  scenario:"A customer needs a desktop for 8K video editing: fastest possible project loading, strong rendering power, and stability under long renders. From the parts bin below, <b>select every component appropriate for this build</b> and leave inappropriate parts unselected.",
  render:function(el){
    var parts=[
      {t:"M.2 NVMe PCIe SSD (2 TB)", ok:true},
      {t:"5400 RPM SATA HDD as the boot/project drive", ok:false},
      {t:"12-core CPU with high thread count", ok:true},
      {t:"Low-power 2-core CPU with integrated graphics only", ok:false},
      {t:"750 W 80 PLUS Gold PSU", ok:true},
      {t:"450 W non-certified PSU", ok:false},
      {t:"2 x 16 GB DDR5 UDIMM (dual channel)", ok:true},
      {t:"260-pin DDR4 SODIMM modules", ok:false},
      {t:"PCIe x16 dedicated GPU", ok:true},
      {t:"Registered (buffered) ECC RDIMM for a server board", ok:false}
    ];
    var h='<div class="pbq-bin">';
    parts.forEach(function(p,i){
      h+='<label class="pbq-part" data-ok="'+p.ok+'"><input type="checkbox" data-i="'+i+'"><span>'+p.t+'</span></label>';
    });
    el.innerHTML = h+'</div><p class="pbq-hint">Select the 5 correct parts. Each correctly selected (or correctly rejected) part is worth 1 point.</p>';
  },
  grade:function(el){
    var score=0, verdicts=[], correctPicks=[], wrongPicks=[];
    el.querySelectorAll(".pbq-part").forEach(function(node){
      var ok = node.dataset.ok==="true";
      var picked = node.querySelector("input").checked;
      var good = (ok===picked);
      verdicts.push(good);
      if(good) score++;
      if(ok&&picked) correctPicks.push(node.textContent.trim());
      if(picked&&!ok) wrongPicks.push(node.textContent.trim());
    });
    markList(el,".pbq-part",verdicts);
    disableAll(el);
    return {score:score, review: reviewBox(score,10,
      "Correct build: NVMe SSD (fastest loading), 12-core CPU (rendering scales with cores), 750 W Gold PSU (stable power under load), dual-channel DDR5 UDIMMs (desktops use UDIMM, not SODIMM), and a PCIe x16 GPU."
      + (wrongPicks.length? " <b>Incorrectly selected:</b> "+esc(wrongPicks.join("; "))+".":""))};
  }
});

/* ---------------- PBQ 2: SOHO router configuration ---------------- */
PBQS.push({
  id:"pbq2", title:"Configure the Coffee Shop Router", domain:"Networking", max:10,
  scenario:"You are setting up a coffee shop router. Requirements: (1) customers get Wi-Fi internet but must NOT reach the point-of-sale terminals, (2) the wireless must be secure, (3) a site survey shows neighboring shops on 2.4 GHz channels <b>6</b> and <b>11</b>, (4) the router still has its factory admin password. Configure every field correctly.",
  render:function(el){
    el.innerHTML =
      '<div class="pbq-form">'
      +'<label>Wireless security mode <select id="p2sec"><option value="">-- choose --</option><option>Open (no password)</option><option>WEP</option><option>WPA</option><option value="ok">WPA2-AES / WPA3</option></select></label>'
      +'<label>2.4 GHz channel <select id="p2chan"><option value="">-- choose --</option><option>6</option><option>11</option><option value="ok">1</option><option>7</option></select></label>'
      +'<label>Guest network <select id="p2guest"><option value="">-- choose --</option><option>Disabled — let customers use the main network</option><option value="ok">Enabled, with client isolation from the internal LAN</option><option>Enabled, full access to the internal LAN</option></select></label>'
      +'<label>Administration <select id="p2admin"><option value="">-- choose --</option><option value="ok">Change the default admin password and update firmware</option><option>Keep the default password for convenience</option><option>Disable the firewall to reduce support calls</option></select></label>'
      +'<label>SSID <input type="text" id="p2ssid" placeholder="e.g. BeanHouse-Guest" style="min-width:200px"></label>'
      +'</div><p class="pbq-hint">2 points per correct setting. The SSID must be non-empty and not a factory default.</p>';
  },
  grade:function(el){
    var s=0, notes=[];
    function chk(id, ok, msg){ var n=el.querySelector(id); if(ok){s+=2; n.classList.add("pbq-good");} else {n.classList.add("pbq-bad"); notes.push(msg);} }
    chk("#p2sec", el.querySelector("#p2sec").value==="ok", "security should be WPA2-AES/WPA3 (WEP and WPA are broken)");
    chk("#p2chan", el.querySelector("#p2chan").value==="ok", "neighbors occupy 6 and 11, so channel 1 is the only non-overlapping choice");
    chk("#p2guest", el.querySelector("#p2guest").value==="ok", "a guest network with client isolation keeps customers away from POS terminals");
    chk("#p2admin", el.querySelector("#p2admin").value==="ok", "the default admin password must be changed first");
    var ssid = el.querySelector("#p2ssid").value.trim().toLowerCase();
    chk("#p2ssid", ssid.length>0 && ["linksys","netgear","default","dlink","tp-link"].indexOf(ssid)===-1, "set a non-default SSID");
    disableAll(el);
    return {score:s, review: reviewBox(s,10, notes.length? notes.join("; ")+"." : "All settings correct — secure, isolated, and interference-free.")};
  }
});

/* ---------------- PBQ 3: Cable & connector matching ---------------- */
PBQS.push({
  id:"pbq3", title:"Cable & Connector Deployment", domain:"Networking", max:10,
  scenario:"Match each installation requirement to the correct cable + connector combination from the dropdown lists.",
  render:function(el){
    var rows=[
      {req:"10 Gbps over copper for a full 100 m office run", ans:"Cat6a + RJ45"},
      {req:"Coaxial line from the street to a cable modem", ans:"RG-6 coax + F-type"},
      {req:"Telephone wall jack to a DSL modem", ans:"Phone cable + RJ11"},
      {req:"400 m link between two buildings, immune to lightning and EMI", ans:"Single-mode fiber + LC/SC"},
      {req:"Budget 1 Gbps run of 90 m to a desktop", ans:"Cat5e/Cat6 + RJ45"}
    ];
    var opts=["Cat6a + RJ45","RG-6 coax + F-type","Phone cable + RJ11","Single-mode fiber + LC/SC","Cat5e/Cat6 + RJ45"];
    var h='<div class="pbq-form">';
    rows.forEach(function(r,i){
      h+='<label style="flex-direction:column;align-items:stretch;gap:6px"><span>'+(i+1)+'. '+r.req+'</span>'
        +'<select data-ans="'+r.ans+'"><option value="">-- choose cable + connector --</option>'
        + opts.map(function(o){return '<option>'+o+'</option>';}).join("") +'</select></label>';
    });
    el.innerHTML = h+'</div><p class="pbq-hint">2 points per correct match.</p>';
  },
  grade:function(el){
    var s=0, wrong=[];
    el.querySelectorAll("select").forEach(function(sel,i){
      if(sel.value===sel.dataset.ans){ s+=2; sel.classList.add("pbq-good"); }
      else { sel.classList.add("pbq-bad"); wrong.push("requirement "+(i+1)+" should be "+sel.dataset.ans); }
    });
    disableAll(el);
    return {score:s, review: reviewBox(s,10, wrong.length? wrong.join("; ")+"." : "All five matches correct. Key facts: copper Ethernet tops out at 100 m, Cat6a is required for 10 Gbps at full distance, and only fiber is immune to EMI between buildings.")};
  }
});

/* ---------------- PBQ 4: Troubleshooting methodology ordering ---------------- */
PBQS.push({
  id:"pbq4", title:"Order the Troubleshooting Methodology", domain:"Troubleshooting", max:10,
  scenario:"A technician is resolving a blue-screen issue. The six CompTIA methodology steps below are <b>out of order</b>. Use the ▲ ▼ buttons to arrange them into the correct sequence.",
  render:function(el){
    var steps=[
      "Test the theory to determine the cause",
      "Document findings, actions, and outcomes",
      "Identify the problem",
      "Establish a plan of action and implement the solution",
      "Establish a theory of probable cause",
      "Verify full system functionality and implement preventive measures"
    ];
    // correct order indexes: Identify(2), Theory(4), Test(0), Plan(3), Verify(5), Document(1)
    var h='<ol class="pbq-order">';
    steps.forEach(function(s,i){
      h+='<li data-orig="'+i+'"><span class="pbq-step-text">'+s+'</span><span class="pbq-order-btns"><button type="button" data-mv="-1">▲</button><button type="button" data-mv="1">▼</button></span></li>';
    });
    el.innerHTML = h+'</ol><p class="pbq-hint">Points scale with how many steps end up in their exact correct position.</p>';
    el.addEventListener("click", function(e){
      var b = e.target.closest("button[data-mv]"); if(!b) return;
      var li = b.closest("li"), list = li.parentNode;
      if(b.dataset.mv==="-1" && li.previousElementSibling) list.insertBefore(li, li.previousElementSibling);
      if(b.dataset.mv==="1" && li.nextElementSibling) list.insertBefore(li.nextElementSibling, li);
    });
  },
  grade:function(el){
    var correctSeq=[2,4,0,3,5,1];
    var lis=el.querySelectorAll(".pbq-order li"), placed=0;
    lis.forEach(function(li,i){
      var ok = +li.dataset.orig===correctSeq[i];
      li.classList.add(ok?"pbq-good":"pbq-bad");
      if(ok) placed++;
    });
    var s=Math.round(placed/6*10);
    disableAll(el);
    return {score:s, review: reviewBox(s,10,
      "Correct order: 1) Identify the problem → 2) Establish a theory of probable cause → 3) Test the theory → 4) Establish a plan of action and implement → 5) Verify full system functionality and implement preventive measures → 6) Document findings, actions, and outcomes. You placed "+placed+"/6 correctly.")};
  }
});

/* ---------------- PBQ 5: Simulated terminal — APIPA/DHCP ---------------- */
PBQS.push({
  id:"pbq5", title:"Terminal: Fix 'No Internet' (APIPA)", domain:"Networking Troubleshooting", max:10,
  scenario:"A user's PC shows no connectivity. Initial <code>ipconfig</code> output:<br><code>IPv4 Address . . . : 169.254.45.12 &nbsp;|&nbsp; Subnet . . . : 255.255.0.0 &nbsp;|&nbsp; Gateway . . . : (blank)</code><br>Use the simulated terminal to repair the connection. Type <code>help</code> for available commands.",
  render:function(el){
    el.innerHTML =
      '<div class="pbq-term"><div class="pbq-term-out">C:\\Users\\student&gt; ipconfig\nIPv4 Address . . : 169.254.45.12\nSubnet Mask . . . : 255.255.0.0\nDefault Gateway . : </div>'
      +'<div class="pbq-term-in">&gt; <input type="text" spellcheck="false" autocomplete="off" placeholder="type a command and press Enter"></div></div>'
      +'<p class="pbq-hint">10 pts: full repair · 8 pts: right command without release first · 3 pts: diagnosis only.</p>';
    var out = el.querySelector(".pbq-term-out"), inp = el.querySelector("input");
    var st = {released:false, renewed:false, ranConfig:false};
    el._pbqState = st;
    inp.addEventListener("keydown", function(e){
      if(e.key!=="Enter") return;
      var cmd = inp.value.trim().toLowerCase(); inp.value="";
      var resp="";
      if(cmd==="help") resp="Commands: ipconfig, ipconfig /release, ipconfig /renew, ping 192.168.1.1";
      else if(cmd==="ipconfig"){
        st.ranConfig=true;
        resp = st.renewed ? "IPv4 Address . . : 192.168.1.50\nSubnet Mask . . . : 255.255.255.0\nDefault Gateway . : 192.168.1.1"
                          : "IPv4 Address . . : 169.254.45.12\nSubnet Mask . . . : 255.255.0.0\nDefault Gateway . : ";
      }
      else if(cmd==="ipconfig /release"){ st.released=true; st.renewed=false; resp="The IPv4 address has been released."; }
      else if(cmd==="ipconfig /renew"){
        if(st.released){ st.renewed=true; resp="IPv4 Address . . : 192.168.1.50  (DHCP lease obtained)\nDefault Gateway . : 192.168.1.1\n*** Connectivity restored ***"; }
        else resp="An error occurred while renewing: no address was released. DHCP request sent anyway... lease obtained: 192.168.1.50";
      }
      else if(cmd==="ping 192.168.1.1"){
        resp = st.renewed ? "Reply from 192.168.1.1: bytes=32 time<1ms (x4)" : "PING: transmit failed. General failure.";
      }
      else resp="'"+esc(cmd)+"' is not recognized. Type help.";
      out.textContent += "\nC:\\Users\\student> "+cmd+"\n"+resp;
      el.querySelector(".pbq-term").scrollTop = 1e6;
    });
  },
  grade:function(el){
    var st = el._pbqState||{}, s=0, msg;
    if(st.released && st.renewed){ s=10; msg="Perfect repair: ipconfig /release followed by ipconfig /renew forces a fresh DHCP lease, replacing the 169.254.x.x APIPA self-assignment with a valid 192.168.1.50 address."; }
    else if(st.renewed){ s=8; msg="You renewed the lease and restored connectivity (192.168.1.50). Best practice is /release first, then /renew, to guarantee a clean DHCP transaction."; }
    else if(st.ranConfig){ s=3; msg="You diagnosed the APIPA address (169.254.x.x = no DHCP server contact) but never renewed the lease. The fix: ipconfig /release then ipconfig /renew."; }
    else msg="The 169.254.x.x APIPA address means DHCP failed. Run ipconfig /release then ipconfig /renew to obtain a valid lease.";
    disableAll(el);
    return {score:s, review: reviewBox(s,10,msg)};
  }
});

/* ---------------- PBQ 6: Printer symptom matching ---------------- */
PBQS.push({
  id:"pbq6", title:"Diagnose the Printer Fleet", domain:"Hardware / Printers", max:10,
  scenario:"Five printer tickets came in this morning. Match each symptom to the component or cause that a technician should address first.",
  render:function(el){
    var rows=[
      {req:"Laser printer: pages come out completely blank, toner is full and the drum is new", ans:"Failed transfer roller (toner never reaches the paper)"},
      {req:"Laser printer: toner rubs off the page when touched", ans:"Failed fuser assembly (toner is not being melted into the paper)"},
      {req:"Laser printer: identical black spots repeat at regular intervals down every page", ans:"Scratched/dirty imaging drum (marks repeat once per drum rotation)"},
      {req:"Any printer: it grabs several sheets at once and jams", ans:"Worn pickup rollers / separation pad"},
      {req:"Network printer: every PC's jobs print as pages of random symbols", ans:"Wrong or corrupted printer driver (e.g., PCL vs PostScript mismatch)"}
    ];
    var opts=rows.map(function(r){return r.ans;}).sort();
    var h='<div class="pbq-form">';
    rows.forEach(function(r,i){
      h+='<label style="flex-direction:column;align-items:stretch;gap:6px"><span>'+(i+1)+'. '+r.req+'</span>'
        +'<select data-ans="'+esc(r.ans)+'"><option value="">-- choose cause --</option>'
        + opts.map(function(o){return '<option>'+esc(o)+'</option>';}).join("") +'</select></label>';
    });
    el.innerHTML = h+'</div><p class="pbq-hint">2 points per correct diagnosis.</p>';
  },
  grade:function(el){
    var s=0, wrong=[];
    el.querySelectorAll("select").forEach(function(sel,i){
      if(sel.value===sel.dataset.ans){ s+=2; sel.classList.add("pbq-good"); }
      else { sel.classList.add("pbq-bad"); wrong.push("ticket "+(i+1)); }
    });
    disableAll(el);
    return {score:s, review: reviewBox(s,10, wrong.length? "Missed: "+wrong.join(", ")+". Remember the print path: drum holds the image, transfer roller moves toner to paper, fuser melts it permanently, pickup rollers/separation pad feed paper, and garbled output is a driver language mismatch." : "All five diagnosed correctly — you can trace the full laser print path.")};
  }
});

/* ---------------- PBQ 7: RAID configuration ---------------- */
PBQS.push({
  id:"pbq7", title:"Design the RAID Array", domain:"Hardware / Storage", max:10,
  scenario:"A small business has <b>4 × 4 TB drives</b> for its file server. Requirements: the array must <b>survive a single drive failure</b> with zero data loss, and <b>maximize usable capacity</b> under that constraint. Configure the array and compute its properties.",
  render:function(el){
    el.innerHTML =
      '<div class="pbq-form">'
      +'<label>RAID level <select id="p7level"><option value="">-- choose --</option><option>RAID 0</option><option>RAID 1</option><option value="ok">RAID 5</option><option>RAID 10</option></select></label>'
      +'<label>Usable capacity (TB) <input type="number" id="p7cap" min="0" step="1" style="width:110px"> TB</label>'
      +'<label>Drive failures tolerated <select id="p7tol"><option value="">-- choose --</option><option>0</option><option value="ok">1</option><option>2</option></select></label>'
      +'</div><p class="pbq-hint">3 pts RAID level · 4 pts usable capacity · 3 pts fault tolerance.</p>';
  },
  grade:function(el){
    var s=0, notes=[];
    var lvl=el.querySelector("#p7level"), cap=el.querySelector("#p7cap"), tol=el.querySelector("#p7tol");
    if(lvl.value==="ok"){ s+=3; lvl.classList.add("pbq-good"); } else { lvl.classList.add("pbq-bad"); notes.push("RAID 5 gives redundancy with the most capacity (RAID 0 has no redundancy; RAID 1/10 lose half the capacity)"); }
    if(+cap.value===12){ s+=4; cap.classList.add("pbq-good"); } else { cap.classList.add("pbq-bad"); notes.push("RAID 5 capacity = (n-1) × drive size = (4-1) × 4 TB = 12 TB; one drive's worth holds parity"); }
    if(tol.value==="ok"){ s+=3; tol.classList.add("pbq-good"); } else { tol.classList.add("pbq-bad"); notes.push("RAID 5 tolerates exactly one drive failure"); }
    disableAll(el);
    return {score:s, review: reviewBox(s,10, notes.length? notes.join("; ")+"." : "Correct: RAID 5 with 4 × 4 TB yields 12 TB usable and survives one drive failure — best capacity efficiency with redundancy here. (RAID 10 would also survive one failure but only yields 8 TB.)")};
  }
});

/* ---------------- PBQ 8: Laptop internals hotspot diagram ---------------- */
PBQS.push({
  id:"pbq8", title:"Laptop Post-Repair Diagnosis", domain:"Mobile Devices", max:10,
  scenario:"A technician replaced a cracked laptop screen. Since reassembly, the <b>webcam does not work</b> and the laptop <b>no longer detects the 5 GHz Wi-Fi network</b> (2.4 GHz works). On the diagram, <b>click the TWO components</b> the technician should inspect first.",
  render:function(el){
    el.innerHTML =
      '<svg viewBox="0 0 640 330" class="pbq-svg" role="img" aria-label="Laptop internals diagram">'
      // display lid
      +'<rect x="160" y="8" width="320" height="120" rx="8" fill="#1b2440" stroke="#2a3556"/>'
      +'<text x="320" y="62" fill="#9aa7c4" font-size="13" text-anchor="middle">DISPLAY PANEL</text>'
      +'<g data-part="webcam" class="pbq-partzone"><rect x="290" y="16" width="60" height="22" rx="4" fill="#232f52" stroke="#3d4a75"/><text x="320" y="31" fill="#e8ecf6" font-size="10" text-anchor="middle">WEBCAM</text></g>'
      +'<g data-part="dispcable" class="pbq-partzone"><rect x="300" y="126" width="40" height="46" rx="4" fill="#232f52" stroke="#3d4a75"/><text x="320" y="151" fill="#e8ecf6" font-size="9" text-anchor="middle">DISPLAY</text><text x="320" y="163" fill="#e8ecf6" font-size="9" text-anchor="middle">CABLE</text></g>'
      // base
      +'<rect x="100" y="176" width="440" height="140" rx="10" fill="#151c30" stroke="#2a3556"/>'
      +'<g data-part="ram" class="pbq-partzone"><rect x="130" y="200" width="110" height="34" rx="4" fill="#232f52" stroke="#3d4a75"/><text x="185" y="221" fill="#e8ecf6" font-size="11" text-anchor="middle">SODIMM RAM</text></g>'
      +'<g data-part="wificard" class="pbq-partzone"><rect x="130" y="252" width="110" height="42" rx="4" fill="#232f52" stroke="#3d4a75"/><text x="185" y="270" fill="#e8ecf6" font-size="11" text-anchor="middle">WI-FI CARD</text></g>'
      +'<g data-part="antenna" class="pbq-partzone"><circle cx="252" cy="262" r="9" fill="#232f52" stroke="#3d4a75"/><circle cx="252" cy="284" r="9" fill="#232f52" stroke="#3d4a75"/><text x="270" y="260" fill="#e8ecf6" font-size="9">ANT LEAD 1</text><text x="270" y="288" fill="#e8ecf6" font-size="9">ANT LEAD 2</text></g>'
      +'<g data-part="battery" class="pbq-partzone"><rect x="380" y="252" width="140" height="42" rx="4" fill="#232f52" stroke="#3d4a75"/><text x="450" y="277" fill="#e8ecf6" font-size="11" text-anchor="middle">BATTERY</text></g>'
      +'<g data-part="ssd" class="pbq-partzone"><rect x="380" y="200" width="140" height="34" rx="4" fill="#232f52" stroke="#3d4a75"/><text x="450" y="221" fill="#e8ecf6" font-size="11" text-anchor="middle">M.2 SSD</text></g>'
      +'</svg>'
      +'<p class="pbq-hint">Click exactly two components. 5 points each; wrong picks score 0 for that slot.</p>';
    var picked=[];
    el._pbqState={picked:picked};
    el.querySelectorAll(".pbq-partzone").forEach(function(g){
      g.style.cursor="pointer";
      g.addEventListener("click", function(){
        var p=g.dataset.part;
        var idx=picked.indexOf(p);
        if(idx>=0){ picked.splice(idx,1); g.classList.remove("pbq-picked"); }
        else if(picked.length<2){ picked.push(p); g.classList.add("pbq-picked"); }
      });
    });
  },
  grade:function(el){
    var st=el._pbqState||{picked:[]};
    var correct=["webcam","antenna"], s=0, misses=[];
    el.querySelectorAll(".pbq-partzone").forEach(function(g){
      var p=g.dataset.part, wasPicked=st.picked.indexOf(p)>=0, isCorrect=correct.indexOf(p)>=0;
      g.classList.remove("pbq-picked");
      if(wasPicked&&isCorrect){ s+=5; g.classList.add("pbq-good"); }
      else if(wasPicked&&!isCorrect){ g.classList.add("pbq-bad"); misses.push(p); }
      else if(!wasPicked&&isCorrect){ g.classList.add("pbq-bad"); }
    });
    disableAll(el);
    return {score:s, review: reviewBox(s,10,
      "Both symptoms trace to the screen replacement: the <b>webcam cable</b> through the display assembly was left disconnected (dead webcam), and a loose <b>Wi-Fi antenna lead</b> on the card explains losing one band while 2.4 GHz still works."
      + (misses.length? " You incorrectly picked: "+misses.join(", ")+"." : ""))};
  }
});

/* ---------------- PBQ 9: Simulated terminal — DNS diagnosis ---------------- */
PBQS.push({
  id:"pbq9", title:"Terminal: One User, One Broken App", domain:"Networking Troubleshooting", max:10,
  scenario:"One user cannot reach the internal app <code>intranet.company.local</code>; coworkers can. Facts: the app server's IP is <code>10.20.30.40</code>, the gateway is <code>192.168.1.1</code>. Use the simulated terminal to diagnose (type <code>help</code>), then choose the diagnosis below.",
  render:function(el){
    el.innerHTML =
      '<div class="pbq-term"><div class="pbq-term-out">C:\\Users\\student&gt; (type help for commands)</div>'
      +'<div class="pbq-term-in">&gt; <input type="text" spellcheck="false" autocomplete="off" placeholder="type a command and press Enter"></div></div>'
      +'<div class="pbq-form" style="margin-top:12px"><label>Diagnosis <select id="p9diag">'
      +'<option value="">-- choose the cause --</option>'
      +'<option>The router WAN link is down</option>'
      +'<option>The app server is offline</option>'
      +'<option value="ok">This PC resolves the name to a stale/wrong address (DNS/hosts issue local to this machine)</option>'
      +'<option>The NIC cable is unplugged</option>'
      +'</select></label></div>'
      +'<p class="pbq-hint">6 pts diagnosis · 2 pts each for running nslookup and pinging the server IP.</p>';
    var out = el.querySelector(".pbq-term-out"), inp = el.querySelector("input");
    var st={nslookup:false, pingSrv:false};
    el._pbqState=st;
    inp.addEventListener("keydown", function(e){
      if(e.key!=="Enter") return;
      var cmd=inp.value.trim().toLowerCase(); inp.value=""; var resp="";
      if(cmd==="help") resp="Commands: ping 192.168.1.1, ping 10.20.30.40, nslookup intranet.company.local";
      else if(cmd==="ping 192.168.1.1") resp="Reply from 192.168.1.1: bytes=32 time<1ms (x4) — local network OK";
      else if(cmd==="ping 10.20.30.40"){ st.pingSrv=true; resp="Reply from 10.20.30.40: bytes=32 time=2ms (x4) — the app server is REACHABLE by IP"; }
      else if(cmd==="nslookup intranet.company.local"){ st.nslookup=true; resp="Server: dns.company.local\nName: intranet.company.local\nAddress: 10.20.30.99   <-- server is really 10.20.30.40!"; }
      else resp="'"+esc(cmd)+"' is not recognized. Type help.";
      out.textContent += "\nC:\\Users\\student> "+cmd+"\n"+resp;
      el.querySelector(".pbq-term").scrollTop=1e6;
    });
  },
  grade:function(el){
    var st=el._pbqState||{}, s=0, notes=[];
    var diag=el.querySelector("#p9diag");
    if(diag.value==="ok"){ s+=6; diag.classList.add("pbq-good"); }
    else { diag.classList.add("pbq-bad"); notes.push("the server answers by IP (10.20.30.40) but nslookup returned 10.20.30.99 — name resolution on this PC points to a stale address (hosts file or cached/bad DNS record); fix the local entry and run ipconfig /flushdns"); }
    if(st.nslookup) s+=2; else notes.push("nslookup reveals the name resolving to the wrong IP");
    if(st.pingSrv) s+=2; else notes.push("pinging the server IP directly proves the server and path are alive");
    disableAll(el);
    return {score:s, review: reviewBox(s,10, notes.length? notes.join("; ")+"." : "Textbook diagnosis: reachable by IP but resolving to the wrong address = local name-resolution fault, fixed by removing the stale hosts entry and flushing DNS.")};
  }
});

/* ---------------- PBQ 10: Cloud models + safe malware sandbox VM ---------------- */
PBQS.push({
  id:"pbq10", title:"Cloud Matching + Sandbox VM Setup", domain:"Virtualization & Cloud", max:10,
  scenario:"<b>Part 1:</b> Match each business need to the correct cloud model/deployment. <b>Part 2:</b> You must detonate a suspicious email attachment safely. Check every VM setting that should apply, and leave dangerous settings unchecked.",
  render:function(el){
    var rows=[
      {req:"Staff use webmail the provider fully manages", ans:"SaaS"},
      {req:"Developers deploy code; provider manages the OS/runtime", ans:"PaaS"},
      {req:"Rent virtual servers; you manage the OS yourself", ans:"IaaS"},
      {req:"Hospital keeps patient data on dedicated infrastructure for compliance", ans:"Private cloud"}
    ];
    var opts=["SaaS","PaaS","IaaS","Private cloud"];
    var h='<div class="pbq-form">';
    rows.forEach(function(r,i){
      h+='<label style="flex-direction:column;align-items:stretch;gap:6px"><span>'+(i+1)+'. '+r.req+'</span>'
        +'<select data-ans="'+r.ans+'"><option value="">-- choose --</option>'
        +opts.map(function(o){return '<option>'+o+'</option>';}).join("")+'</select></label>';
    });
    h+='</div><div style="margin:10px 0 6px;color:var(--dim);font-size:13px;font-weight:600">Part 2 — sandbox VM settings:</div><div class="pbq-bin">';
    var sets=[
      {t:"Take a VM snapshot before opening the attachment", ok:true},
      {t:"Disable shared folders between guest and host", ok:true},
      {t:"Disconnect the VM's virtual NIC / networking", ok:true},
      {t:"Enable clipboard sharing with the host", ok:false},
      {t:"Connect the VM to the production LAN", ok:false},
      {t:"Disable the host's antivirus so it does not interfere", ok:false}
    ];
    sets.forEach(function(x,i){
      h+='<label class="pbq-part" data-ok="'+x.ok+'"><input type="checkbox"><span>'+x.t+'</span></label>';
    });
    el.innerHTML = h+'</div><p class="pbq-hint">1 pt per match (4 pts) + 1 pt per correctly handled setting (6 pts).</p>';
  },
  grade:function(el){
    var s=0, notes=[];
    el.querySelectorAll("select").forEach(function(sel){
      if(sel.value===sel.dataset.ans){ s++; sel.classList.add("pbq-good"); }
      else { sel.classList.add("pbq-bad"); notes.push("a missed cloud match — recall: SaaS = finished app, PaaS = managed platform for your code, IaaS = rented infrastructure you manage, private = dedicated single-tenant"); }
    });
    var verdicts=[];
    el.querySelectorAll(".pbq-part").forEach(function(node){
      var ok=node.dataset.ok==="true", picked=node.querySelector("input").checked;
      var good=(ok===picked); verdicts.push(good); if(good) s++;
      if(!good) notes.push(picked? "dangerous setting enabled: "+node.textContent.trim() : "missed safeguard: "+node.textContent.trim());
    });
    markList(el,".pbq-part",verdicts);
    disableAll(el);
    return {score:s, review: reviewBox(s,10, notes.length? notes.join("; ")+"." : "Perfect: correct cloud models, and the sandbox is isolated (snapshot, no shared folders, no networking) with the host defenses left intact.")};
  }
});

window.PBQS = PBQS;
})();

// ============ Construction CRM — mock data + helpers ============

// ---- currency (PKR, crore/lakh aware) ----
function fmtPKR(n){
  if(n==null) return '—';
  return 'Rs ' + Math.round(n).toLocaleString('en-PK');
}
// short form: 4.25 Cr / 85 L
function fmtShort(n){
  if(n==null) return '—';
  const cr = 10000000, lac = 100000;
  if(n>=cr) return 'Rs ' + (n/cr).toFixed(n%cr===0?0:2).replace(/\.00$/,'') + ' Cr';
  if(n>=lac) return 'Rs ' + (n/lac).toFixed(n%lac===0?0:1).replace(/\.0$/,'') + ' L';
  return 'Rs ' + n.toLocaleString('en-PK');
}

// ---- status meta ----
const STATUS = {
  open:    {label:'Available', short:'Open',   color:'var(--open)',    bg:'var(--open-bg)',    line:'var(--open-line)'},
  booked:  {label:'Booked',    short:'Booked', color:'var(--booked)',  bg:'var(--booked-bg)',  line:'var(--booked-line)'},
  token:   {label:'Token',     short:'Token',  color:'var(--token)',   bg:'var(--token-bg)',   line:'var(--token-line)'},
  sold:    {label:'Sold',      short:'Sold',   color:'var(--sold)',    bg:'var(--sold-bg)',    line:'var(--sold-line)'},
  blocked: {label:'Blocked',   short:'Hold',   color:'var(--blocked)', bg:'var(--blocked-bg)', line:'var(--blocked-line)'},
};
const STATUS_ORDER = ['open','token','booked','sold','blocked'];

// ---- unit generator ----
const UNIT_TYPES = [
  {key:'1BR', name:'1 Bed Apartment', area:625},
  {key:'2BR', name:'2 Bed Apartment', area:1050},
  {key:'3BR', name:'3 Bed Apartment', area:1480},
  {key:'PH',  name:'Penthouse',       area:2600},
  {key:'STD', name:'Studio',          area:480},
];
function rate(){ return 28000 + Math.floor(Math.random()*9)*1000; } // per sqft

let _uid = 0;
function makeUnits(floors, perFloor, distribution, ratePerSqft){
  const units = [];
  for(let f=floors; f>=1; f--){
    for(let p=1;p<=perFloor;p++){
      const r = Math.random();
      let st='open', acc=0;
      for(const [s,w] of distribution){ acc+=w; if(r<=acc){st=s;break;} }
      // type by position
      let t = UNIT_TYPES[1];
      if(p===1||p===perFloor) t = UNIT_TYPES[2];
      if(f===floors) t = UNIT_TYPES[3];
      if(perFloor>6 && p%5===0) t = UNIT_TYPES[0];
      const area = t.area + (Math.floor(Math.random()*5)*15);
      const price = area * ratePerSqft + (f*120000); // floor premium
      units.push({
        id:'U'+(++_uid),
        code: String.fromCharCode(64+Math.min(f,26)) + '-' + String(f).padStart(2,'0') + String(p).padStart(2,'0'),
        floor:f, pos:p, type:t.key, typeName:t.name, area,
        price, status:st,
        customer: (st==='sold'||st==='booked'||st==='token') ? pickName() : null,
      });
    }
  }
  return units;
}
const FIRST=['Ahmed','Bilal','Sara','Hassan','Ayesha','Usman','Fatima','Omar','Zara','Imran','Nadia','Kamran','Hina','Raza','Mariam','Tariq'];
const LAST=['Khan','Malik','Sheikh','Qureshi','Butt','Chaudhry','Siddiqui','Ansari','Raja','Mughal'];
function pickName(){ return FIRST[Math.floor(Math.random()*FIRST.length)]+' '+LAST[Math.floor(Math.random()*LAST.length)]; }

// ---- payment plan ----
function makePlan(price){
  const down = Math.round(price*0.20);
  const onPossession = Math.round(price*0.15);
  const balloon = Math.round(price*0.05);
  const installments = 36;
  const monthly = Math.round((price - down - onPossession - balloon)/installments);
  return {
    price, down, onPossession, balloon, installments, monthly,
    schedule:[
      {label:'Booking / Down Payment', pct:20, amount:down, when:'On booking'},
      {label:'Monthly Installments', pct:60, amount:monthly, when:'36 months', count:installments},
      {label:'Balloon Payment (Yr 2)', pct:5, amount:balloon, when:'Month 24'},
      {label:'On Possession', pct:15, amount:onPossession, when:'At handover'},
    ],
  };
}

// ---- projects ----
const DIST_A = [['sold',.28],['booked',.18],['token',.12],['open',.36],['blocked',.06]];
const DIST_B = [['sold',.5],['booked',.2],['token',.1],['open',.18],['blocked',.02]];
const DIST_C = [['sold',.12],['booked',.12],['token',.1],['open',.6],['blocked',.06]];

const PROJECTS = [
  {id:'P1', name:'Gulberg Heights', code:'GBH', city:'Lahore', address:'Main Boulevard, Gulberg III, Lahore',
   type:'Residential High-Rise', launched:'Jan 2025', handover:'Dec 2027', cover:'#1c2c4d',
   floors:14, perFloor:8, dist:DIST_A, rate:32000},
  {id:'P2', name:'DHA Valley Towers', code:'DVT', city:'Islamabad', address:'Sector C, DHA Valley, Islamabad',
   type:'Mixed-Use Towers', launched:'Aug 2024', handover:'Jun 2027', cover:'#163a34',
   floors:18, perFloor:6, dist:DIST_B, rate:38000},
  {id:'P3', name:'Bahria Enclave Residency', code:'BER', city:'Islamabad', address:'Zone B, Bahria Enclave, Islamabad',
   type:'Apartment Community', launched:'Mar 2025', handover:'Mar 2028', cover:'#3a2740',
   floors:10, perFloor:10, dist:DIST_C, rate:29000},
  {id:'P4', name:'Emaar Canyon Views', code:'ECV', city:'Karachi', address:'DHA Phase 8, Karachi',
   type:'Premium Residences', launched:'Nov 2024', handover:'Sep 2027', cover:'#3a2f1c',
   floors:12, perFloor:7, dist:DIST_A, rate:41000},
];
PROJECTS.forEach(p=>{
  p.units = makeUnits(p.floors, p.perFloor, p.dist, p.rate);
  p.totalUnits = p.units.length;
  p.counts = {open:0,booked:0,token:0,sold:0,blocked:0};
  p.units.forEach(u=>p.counts[u.status]++);
  p.sales = p.units.filter(u=>u.status==='sold').reduce((a,u)=>a+u.price,0);
  p.pipeline = p.units.filter(u=>u.status==='booked'||u.status==='token').reduce((a,u)=>a+u.price,0);
  p.inventoryValue = p.units.reduce((a,u)=>a+u.price,0);
  p.sold = p.counts.sold;
});

// ---- users / roles / permissions ----
const ROLES = [
  {id:'r1', name:'Super Admin', desc:'Full access to every module and setting', users:2, color:'#fb7185', system:true},
  {id:'r2', name:'Sales Manager', desc:'Manage projects, units, bookings & team', users:4, color:'#3b82f6', system:false},
  {id:'r3', name:'Sales Agent', desc:'Book units, manage own leads & customers', users:11, color:'#34d399', system:false},
  {id:'r4', name:'Finance Officer', desc:'Expenses, payments & financial reports', users:3, color:'#fbbf24', system:false},
  {id:'r5', name:'Viewer', desc:'Read-only access to dashboards & reports', users:6, color:'#a78bfa', system:false},
];
const MODULES = ['Dashboard','Projects','Units & Booking','Payment Plans','Users','Roles & Permissions','Expenses','Reports'];
const ACTIONS = ['View','Create','Edit','Delete'];
// permission matrix per role: module -> [view,create,edit,delete]
const PERMS = {
  r1: Object.fromEntries(MODULES.map(m=>[m,[1,1,1,1]])),
  r2: {Dashboard:[1,0,0,0],Projects:[1,1,1,0],'Units & Booking':[1,1,1,1],'Payment Plans':[1,1,1,0],Users:[1,0,0,0],'Roles & Permissions':[0,0,0,0],Expenses:[1,1,0,0],Reports:[1,0,0,0]},
  r3: {Dashboard:[1,0,0,0],Projects:[1,0,0,0],'Units & Booking':[1,1,1,0],'Payment Plans':[1,0,0,0],Users:[0,0,0,0],'Roles & Permissions':[0,0,0,0],Expenses:[0,0,0,0],Reports:[1,0,0,0]},
  r4: {Dashboard:[1,0,0,0],Projects:[1,0,0,0],'Units & Booking':[1,0,0,0],'Payment Plans':[1,0,1,0],Users:[0,0,0,0],'Roles & Permissions':[0,0,0,0],Expenses:[1,1,1,1],Reports:[1,1,0,0]},
  r5: Object.fromEntries(MODULES.map(m=>[m,[1,0,0,0]])),
};
const USERS = [
  {id:'u1', name:'Hamza Sheikh', email:'hamza@horizonbuild.pk', role:'Super Admin', roleId:'r1', status:'active', last:'2 min ago', projects:'All'},
  {id:'u2', name:'Ayesha Tariq', email:'ayesha@horizonbuild.pk', role:'Sales Manager', roleId:'r2', status:'active', last:'1 hr ago', projects:'GBH, DVT'},
  {id:'u3', name:'Usman Raja', email:'usman@horizonbuild.pk', role:'Sales Agent', roleId:'r3', status:'active', last:'Today', projects:'GBH'},
  {id:'u4', name:'Nadia Malik', email:'nadia@horizonbuild.pk', role:'Finance Officer', roleId:'r4', status:'active', last:'3 hr ago', projects:'All'},
  {id:'u5', name:'Bilal Ansari', email:'bilal@horizonbuild.pk', role:'Sales Agent', roleId:'r3', status:'active', last:'Yesterday', projects:'BER'},
  {id:'u6', name:'Sara Qureshi', email:'sara@horizonbuild.pk', role:'Sales Agent', roleId:'r3', status:'invited', last:'—', projects:'ECV'},
  {id:'u7', name:'Imran Butt', email:'imran@horizonbuild.pk', role:'Viewer', roleId:'r5', status:'active', last:'2 days ago', projects:'All'},
  {id:'u8', name:'Hina Raza', email:'hina@horizonbuild.pk', role:'Sales Manager', roleId:'r2', status:'suspended', last:'2 wk ago', projects:'ECV'},
];

// ---- expenses ----
const EXP_CATEGORIES = [
  {id:'c1', name:'Construction Material', icon:'cube', desc:'Cement, steel, bricks, finishing', budget:120000000, spent:84500000, count:42, color:'#3b82f6'},
  {id:'c2', name:'Labor & Contractors', icon:'users', desc:'Site labor, subcontractor payments', budget:80000000, spent:61200000, count:28, color:'#34d399'},
  {id:'c3', name:'Sales Commissions', icon:'percent', desc:'Agent & broker commissions', budget:45000000, spent:38900000, count:64, color:'#fbbf24'},
  {id:'c4', name:'Marketing', icon:'mega', desc:'Ads, hoardings, digital, events', budget:30000000, spent:19400000, count:23, color:'#a78bfa'},
  {id:'c5', name:'Salaries', icon:'wallet', desc:'Office staff payroll', budget:24000000, spent:22000000, count:12, color:'#fb7185'},
  {id:'c6', name:'Utilities & Office', icon:'plug', desc:'Rent, electricity, internet', budget:12000000, spent:7800000, count:31, color:'#64748b'},
];
const VENDORS=['Maple Cement Co.','Ittehad Steel','BrightAds Media','Skyline Contractors','PowerGrid Utility','Prime Interiors','Falcon Logistics','MetroPrint'];
const EXP_STATUS=['paid','pending','approved'];
function makeExpenses(){
  const out=[]; let id=0;
  const cats=EXP_CATEGORIES; const projs=PROJECTS;
  const dates=['Jun 04','Jun 03','Jun 02','May 30','May 28','May 27','May 24','May 21','May 19','May 16','May 14','May 11','May 09'];
  for(let i=0;i<26;i++){
    const c=cats[Math.floor(Math.random()*cats.length)];
    const amt=[125000,450000,1800000,95000,3200000,640000,275000,1250000,88000,520000][Math.floor(Math.random()*10)];
    out.push({
      id:'E'+(++id),
      ref:'EXP-'+(2480-i),
      date:dates[i%dates.length],
      category:c.name, catColor:c.color,
      vendor:VENDORS[Math.floor(Math.random()*VENDORS.length)],
      project:projs[Math.floor(Math.random()*projs.length)].code,
      amount:amt,
      status:EXP_STATUS[Math.floor(Math.random()*EXP_STATUS.length)],
    });
  }
  return out;
}
const EXPENSES = makeExpenses();
const EXP_TOTAL = EXP_CATEGORIES.reduce((a,c)=>a+c.spent,0);
const EXP_BUDGET = EXP_CATEGORIES.reduce((a,c)=>a+c.budget,0);

// ---- portfolio rollup ----
const PORTFOLIO = {
  totalUnits: PROJECTS.reduce((a,p)=>a+p.totalUnits,0),
  sold: PROJECTS.reduce((a,p)=>a+p.counts.sold,0),
  available: PROJECTS.reduce((a,p)=>a+p.counts.open,0),
  reserved: PROJECTS.reduce((a,p)=>a+p.counts.booked+p.counts.token,0),
  sales: PROJECTS.reduce((a,p)=>a+p.sales,0),
  pipeline: PROJECTS.reduce((a,p)=>a+p.pipeline,0),
  inventory: PROJECTS.reduce((a,p)=>a+p.inventoryValue,0),
};

Object.assign(window, {
  fmtPKR, fmtShort, STATUS, STATUS_ORDER, PROJECTS, makePlan,
  ROLES, MODULES, ACTIONS, PERMS, USERS,
  EXP_CATEGORIES, EXPENSES, EXP_TOTAL, EXP_BUDGET, PORTFOLIO, UNIT_TYPES,
});

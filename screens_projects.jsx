// ============ Projects: POS overview · unit map · booking · edit ============

// ---------- POS OVERVIEW ----------
function ProjectsScreen({go}){
  const [q,setQ]=useState('');
  const [city,setCity]=useState('all');
  const cities=['all',...new Set(PROJECTS.map(p=>p.city))];
  const list=PROJECTS.filter(p=>(city==='all'||p.city===city)&&
    (p.name.toLowerCase().includes(q.toLowerCase())||p.code.toLowerCase().includes(q.toLowerCase())));

  return (
    <div className="fade-up">
      <PageHeader sub="Project POS" title="Projects" icon="building">
        <Button variant="ghost" icon="filter" size="md">Filters</Button>
        <Button variant="primary" icon="plus" onClick={()=>go('add-project')}>Add Project</Button>
      </PageHeader>

      <div style={{display:'flex',gap:12,marginBottom:18,alignItems:'center',flexWrap:'wrap'}}>
        <div style={{position:'relative',flex:1,minWidth:220,maxWidth:360}}>
          <span style={{position:'absolute',left:12,top:'50%',transform:'translateY(-50%)',color:'var(--text-4)'}}><Icon name="search" size={16}/></span>
          <Input placeholder="Search projects…" value={q} onChange={e=>setQ(e.target.value)} style={{paddingLeft:36}}/>
        </div>
        <Segmented options={cities.map(c=>({value:c,label:c==='all'?'All cities':c}))} value={city} onChange={setCity}/>
      </div>

      <div style={{display:'grid',gridTemplateColumns:'repeat(2,1fr)',gap:16}}>
        {list.map(pr=>(<ProjectCard key={pr.id} pr={pr} go={go}/>))}
      </div>
    </div>
  );
}

function ProjectCard({pr, go}){
  const st=Math.round(pr.counts.sold/pr.totalUnits*100);
  const floors=[...new Set(pr.units.map(u=>u.floor))].sort((a,b)=>b-a);
  const preview=floors.slice(0,4);
  return (
    <Card hover onClick={()=>go('project',{id:pr.id})} pad={0} style={{overflow:'hidden'}}>
      <div style={{padding:'18px 20px',display:'flex',gap:14,alignItems:'flex-start',borderBottom:'1px solid var(--line)'}}>
        <div style={{width:52,height:52,borderRadius:13,flexShrink:0,background:pr.cover,
          border:'1px solid var(--line-2)',display:'flex',alignItems:'center',justifyContent:'center',
          color:'rgba(255,255,255,.85)',fontFamily:'var(--f-display)',fontWeight:700,fontSize:16,
          boxShadow:'0 4px 14px rgba(0,0,0,.18)'}}>{pr.code}</div>
        <div style={{flex:1,minWidth:0}}>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',gap:10}}>
            <h3 style={{fontSize:17,marginBottom:4}}>{pr.name}</h3>
            <Badge tone="accent">{pr.type.split(' ')[0]}</Badge>
          </div>
          <div style={{fontSize:12.5,color:'var(--text-3)',display:'flex',alignItems:'center',gap:6}}>
            <Icon name="pin" size={13}/>{pr.address}
          </div>
        </div>
      </div>

      <div style={{padding:'16px 20px',background:'var(--bg-2)',borderBottom:'1px solid var(--line)'}}>
        <div style={{display:'flex',flexDirection:'column',gap:4}}>
          {preview.map(f=>{
            const us=pr.units.filter(u=>u.floor===f);
            return (
              <div key={f} style={{display:'flex',gap:4,alignItems:'center'}}>
                <span style={{width:22,fontSize:9.5,color:'var(--text-4)',fontFamily:'var(--f-mono)',flexShrink:0}}>F{f}</span>
                <div style={{display:'flex',gap:4,flex:1}}>
                  {us.map(u=><span key={u.id} title={u.code+' · '+STATUS[u.status].label} style={{height:14,flex:1,borderRadius:3,
                    background:STATUS[u.status].color,opacity:.7}}></span>)}
                </div>
              </div>
            );
          })}
          {floors.length>4 && <div style={{fontSize:10.5,color:'var(--text-4)',textAlign:'center',marginTop:2}}>+{floors.length-4} more floors</div>}
        </div>
      </div>

      <div style={{padding:'16px 20px'}}>
        <div style={{display:'flex',justifyContent:'space-between',marginBottom:12}}>
          {[['Units',pr.totalUnits],['Sold',pr.counts.sold],['Available',pr.counts.open],['Sales',fmtShort(pr.sales)]].map(([k,v],i)=>(
            <div key={i}>
              <div style={{fontSize:11,color:'var(--text-3)',marginBottom:3,textTransform:'uppercase',letterSpacing:'.05em'}}>{k}</div>
              <div className="mono" style={{fontWeight:600,fontSize:14}}>{v}</div>
            </div>
          ))}
        </div>
        <div style={{display:'flex',alignItems:'center',gap:10}}>
          <StatusBar counts={pr.counts} total={pr.totalUnits} height={8}/>
          <span style={{fontSize:12,fontWeight:600,color:'var(--open)',whiteSpace:'nowrap'}}>{st}% sold</span>
        </div>
      </div>
    </Card>
  );
}

// ---------- PROJECT DETAIL: unit map ----------
function ProjectDetailScreen({id, go}){
  const pr=PROJECTS.find(p=>p.id===id);
  const [filter,setFilter]=useState('all');
  const [sel,setSel]=useState(null);
  const [bookU,setBookU]=useState(null);
  const [editU,setEditU]=useState(null);
  const [ver,setVer]=useState(0);
  if(!pr) return <div>Project not found</div>;
  const floors=[...new Set(pr.units.map(u=>u.floor))].sort((a,b)=>b-a);

  function handleBook(){
    if(sel&&sel.status==='open'){setBookU(sel);}
    else{const f=pr.units.find(u=>u.status==='open');if(f){setSel(f);setBookU(f);}}
  }

  return (
    <div className="fade-up">
      <button onClick={()=>go('projects')} style={{display:'flex',alignItems:'center',gap:7,color:'var(--text-3)',
        fontSize:13,fontWeight:600,marginBottom:16}}>
        <Icon name="arrowL" size={15}/> All projects</button>

      <div style={{display:'flex',gap:16,alignItems:'flex-start',marginBottom:24,flexWrap:'wrap'}}>
        <div style={{width:64,height:64,borderRadius:16,background:pr.cover,border:'1px solid var(--line-2)',
          display:'flex',alignItems:'center',justifyContent:'center',color:'rgba(255,255,255,.85)',
          fontFamily:'var(--f-display)',fontWeight:700,fontSize:20,boxShadow:'var(--shadow)'}}>{pr.code}</div>
        <div style={{flex:1,minWidth:240}}>
          <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:5}}>
            <h1 style={{fontSize:26}}>{pr.name}</h1>
            <Badge tone="accent">{pr.type}</Badge>
          </div>
          <div style={{display:'flex',gap:18,flexWrap:'wrap',color:'var(--text-3)',fontSize:13}}>
            <span style={{display:'flex',alignItems:'center',gap:6}}><Icon name="pin" size={14}/>{pr.address}</span>
            <span style={{display:'flex',alignItems:'center',gap:6}}><Icon name="calendar" size={14}/>Handover {pr.handover}</span>
          </div>
        </div>
        <div style={{display:'flex',gap:10}}>
          <Button variant="ghost" icon="edit" size="md" onClick={()=>sel&&setEditU(sel)}>Edit Unit</Button>
          <Button variant="primary" icon="plus" onClick={handleBook}>Book Unit</Button>
        </div>
      </div>

      <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:16,marginBottom:20}}>
        <Stat label="Total Units" value={pr.totalUnits} icon="cube" tone="accent" sub={pr.floors+' floors'}/>
        <Stat label="Sold" value={pr.counts.sold} icon="check" tone="rose" sub={fmtShort(pr.sales)+' realised'}/>
        <Stat label="Available" value={pr.counts.open} icon="home" tone="green" sub="ready to book"/>
        <Stat label="Inventory Value" value={fmtShort(pr.inventoryValue)} icon="wallet" tone="violet" sub="at list price"/>
      </div>

      <div style={{display:'grid',gridTemplateColumns:sel?'1fr 380px':'1fr',gap:16,alignItems:'start',transition:'all .2s'}}>
        <Card pad={0}>
          <div style={{padding:'16px 20px',display:'flex',justifyContent:'space-between',alignItems:'center',
            borderBottom:'1px solid var(--line)',flexWrap:'wrap',gap:12}}>
            <div>
              <h3 style={{fontSize:16}}>Unit Map</h3>
              <div style={{fontSize:12,color:'var(--text-3)',marginTop:2}}>Click a unit to view details · Book or edit from the panel</div>
            </div>
            <Segmented size="sm" value={filter} onChange={setFilter}
              options={[{value:'all',label:'All'},...STATUS_ORDER.map(s=>({value:s,label:STATUS[s].short}))]}/>
          </div>

          <div style={{padding:'12px 20px',borderBottom:'1px solid var(--line-soft)',display:'flex',gap:18,flexWrap:'wrap'}}>
            {STATUS_ORDER.map(s=>(
              <div key={s} style={{display:'flex',alignItems:'center',gap:7,fontSize:12}}>
                <span style={{width:12,height:12,borderRadius:4,background:STATUS[s].bg,border:'1.5px solid '+STATUS[s].color}}></span>
                <span style={{color:'var(--text-2)'}}>{STATUS[s].label}</span>
                <span className="mono" style={{color:'var(--text-4)'}}>{pr.counts[s]}</span>
              </div>
            ))}
          </div>

          <div style={{padding:'12px 20px 20px',maxHeight:560,overflowY:'auto'}}>
            {floors.map(f=>{
              const us=pr.units.filter(u=>u.floor===f);
              return (
                <div key={f} style={{display:'flex',gap:12,alignItems:'center',padding:'7px 0'}}>
                  <div style={{width:48,flexShrink:0,textAlign:'right'}}>
                    <div style={{fontSize:12,fontWeight:700,fontFamily:'var(--f-display)'}}>Floor {f}</div>
                    <div style={{fontSize:10,color:'var(--text-4)'}}>{us.length} units</div>
                  </div>
                  <div style={{width:1,alignSelf:'stretch',background:'var(--line)'}}></div>
                  <div style={{display:'flex',gap:7,flexWrap:'wrap',flex:1}}>
                    {us.map(u=><UnitCell key={u.id+ver} u={u} dim={filter!=='all'&&u.status!==filter}
                      active={sel&&sel.id===u.id} onClick={()=>setSel(u===sel?null:u)}/>)}
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        {sel && <UnitPanel u={sel} project={pr} onClose={()=>setSel(null)}
          onBook={()=>setBookU(sel)} onEdit={()=>setEditU(sel)}/>}
      </div>

      <BookUnitSheet open={!!bookU} unit={bookU} project={pr} onClose={()=>setBookU(null)}
        onBooked={()=>{setVer(v=>v+1);setBookU(null);setSel(null);}}/>
      <EditUnitSheet open={!!editU} unit={editU} project={pr} onClose={()=>setEditU(null)}
        onSaved={()=>{setVer(v=>v+1);setEditU(null);}}/>
    </div>
  );
}

function UnitCell({u, onClick, active, dim}){
  const [h,setH]=useState(false);
  const s=STATUS[u.status];
  return (
    <button onClick={onClick} onMouseEnter={()=>setH(true)} onMouseLeave={()=>setH(false)}
      style={{position:'relative',width:54,height:50,borderRadius:9,flexShrink:0,
        background: active?s.color:s.bg,
        border:'1.5px solid '+(active?s.color:s.line),
        opacity:dim?.28:1,transition:'all .15s ease',
        transform:h&&!active?'translateY(-2px)':'none',
        boxShadow:active?'0 6px 16px '+s.line:(h?'var(--shadow)':'none'),
        display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',gap:1}}>
      <span className="mono" style={{fontSize:11,fontWeight:700,color:active?'#0b0e14':s.color}}>{u.pos.toString().padStart(2,'0')}</span>
      <span style={{fontSize:8.5,fontWeight:600,color:active?'rgba(0,0,0,.6)':'var(--text-4)'}}>{u.type}</span>
      {h&&!active&&
        <div style={{position:'absolute',bottom:'calc(100% + 8px)',left:'50%',transform:'translateX(-50%)',
          background:'var(--surface-2)',border:'1px solid var(--line-2)',borderRadius:8,padding:'8px 11px',
          whiteSpace:'nowrap',zIndex:60,boxShadow:'var(--shadow)',pointerEvents:'none',textAlign:'left'}}>
          <div style={{fontSize:12,fontWeight:700,marginBottom:2}}>{u.code}</div>
          <div style={{fontSize:11,color:'var(--text-3)',marginBottom:4}}>{u.typeName} · {u.area} sqft</div>
          <div className="mono" style={{fontSize:11.5,fontWeight:600}}>{fmtShort(u.price)}</div>
          <div style={{marginTop:5}}><StatusPill status={u.status} size="sm"/></div>
        </div>}
    </button>
  );
}

function UnitPanel({u, project, onClose, onBook, onEdit}){
  const plan=makePlan(u.price);
  const s=STATUS[u.status];
  return (
    <Card pad={0} style={{position:'sticky',top:0,animation:'slideIn .25s cubic-bezier(.16,1,.3,1) both'}}>
      <div style={{padding:'18px 20px',borderBottom:'1px solid var(--line)',background:s.bg}}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start'}}>
          <div>
            <div style={{fontSize:11,color:'var(--text-3)',fontWeight:600,letterSpacing:'.06em',textTransform:'uppercase',marginBottom:4}}>Unit</div>
            <div style={{fontSize:24,fontWeight:700,fontFamily:'var(--f-display)'}}>{u.code}</div>
          </div>
          <button onClick={onClose} style={{width:30,height:30,borderRadius:7,background:'var(--surface)',
            border:'1px solid var(--line-2)',color:'var(--text-2)',display:'flex',alignItems:'center',justifyContent:'center'}}>
            <Icon name="x" size={15}/></button>
        </div>
        <div style={{marginTop:12}}><StatusPill status={u.status}/></div>
      </div>

      <div style={{padding:'18px 20px',display:'grid',gridTemplateColumns:'1fr 1fr',gap:'14px 16px',borderBottom:'1px solid var(--line)'}}>
        {[['Type',u.typeName],['Area',u.area+' sqft'],['Floor','Floor '+u.floor],['Rate/sqft',fmtPKR(Math.round(u.price/u.area))]].map(([k,v],i)=>(
          <div key={i}>
            <div style={{fontSize:11,color:'var(--text-3)',marginBottom:3}}>{k}</div>
            <div style={{fontSize:13.5,fontWeight:600}}>{v}</div>
          </div>
        ))}
        {u.customer &&
          <div style={{gridColumn:'1 / -1',marginTop:2,paddingTop:12,borderTop:'1px solid var(--line-soft)',display:'flex',alignItems:'center',gap:10}}>
            <Avatar name={u.customer} size={32}/>
            <div>
              <div style={{fontSize:11,color:'var(--text-3)'}}>{u.status==='sold'?'Owner':'Reserved by'}</div>
              <div style={{fontSize:13.5,fontWeight:600}}>{u.customer}</div>
            </div>
          </div>}
      </div>

      <div style={{padding:'16px 20px',borderBottom:'1px solid var(--line)',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
        <span style={{fontSize:13,color:'var(--text-2)'}}>Total Price</span>
        <span className="mono" style={{fontSize:20,fontWeight:700,fontFamily:'var(--f-display)',color:'var(--accent)'}}>{fmtPKR(u.price)}</span>
      </div>

      <div style={{padding:'18px 20px'}}>
        <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:14}}>
          <Icon name="calendar" size={15} style={{color:'var(--text-3)'}}/>
          <h4 style={{fontSize:14}}>Payment Plan</h4>
          <span style={{marginLeft:'auto',fontSize:11,color:'var(--text-4)'}}>{plan.installments}-month</span>
        </div>
        <div style={{display:'flex',flexDirection:'column',gap:2}}>
          {plan.schedule.map((row,i)=>(
            <div key={i} style={{display:'flex',alignItems:'center',gap:12,padding:'10px 0',
              borderBottom:i<plan.schedule.length-1?'1px solid var(--line-soft)':'none'}}>
              <div style={{width:34,height:34,borderRadius:8,flexShrink:0,background:'var(--surface-2)',
                border:'1px solid var(--line-2)',display:'flex',alignItems:'center',justifyContent:'center',
                fontSize:12,fontWeight:700,fontFamily:'var(--f-mono)',color:'var(--accent)'}}>{row.pct}%</div>
              <div style={{flex:1,minWidth:0}}>
                <div style={{fontSize:12.5,fontWeight:600}}>{row.label}</div>
                <div style={{fontSize:11,color:'var(--text-4)'}}>{row.count?row.count+' × ':''}{row.when}</div>
              </div>
              <div className="mono" style={{fontSize:12.5,fontWeight:600,textAlign:'right',whiteSpace:'nowrap'}}>
                {fmtShort(row.amount)}{row.count?<span style={{color:'var(--text-4)',fontSize:10}}>/mo</span>:''}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* action buttons */}
      <div style={{padding:'0 18px 18px',display:'flex',gap:8}}>
        {u.status==='open'
          ? <Button variant="primary" icon="check" full onClick={onBook}>Book This Unit</Button>
          : <Button variant="soft" icon="users" full onClick={()=>{}}>View Customer</Button>}
        <Button variant="ghost" icon="edit" onClick={onEdit} style={{flexShrink:0,padding:'9px 14px'}}>Edit</Button>
      </div>
    </Card>
  );
}

// ---------- BOOKING SHEET ----------
function BookUnitSheet({open,unit,project,onClose,onBooked}){
  const [form,setForm]=useState({name:'',phone:'',cnic:'',email:''});
  const [err,setErr]=useState({});
  useEffect(()=>{if(open){setForm({name:'',phone:'',cnic:'',email:''});setErr({});};},[open]);
  if(!unit) return null;
  const plan=makePlan(unit.price);

  function submit(){
    const e={};
    if(!form.name.trim()) e.name='Required';
    if(!form.phone.trim()) e.phone='Required';
    if(Object.keys(e).length){setErr(e);return;}
    bookUnit(unit,project,form);
    onBooked();
  }

  return (
    <Sheet open={open} onClose={onClose} title={'Book · '+unit.code} sub="New Booking"
      footer={<>
        <Button variant="ghost" onClick={onClose}>Cancel</Button>
        <Button variant="primary" icon="check" onClick={submit}>Confirm Booking</Button>
      </>}>

      <div style={{background:'var(--bg-2)',border:'1px solid var(--line)',borderRadius:12,padding:16,marginBottom:24}}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:14}}>
          <div>
            <div style={{fontSize:11,color:'var(--text-3)',fontWeight:600,textTransform:'uppercase',letterSpacing:'.06em',marginBottom:4}}>Unit</div>
            <div style={{fontSize:24,fontWeight:700,fontFamily:'var(--f-display)'}}>{unit.code}</div>
          </div>
          <StatusPill status="token"/>
        </div>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12}}>
          {[['Type',unit.typeName],['Floor','Floor '+unit.floor],['Area',unit.area+' sqft'],['Price',fmtPKR(unit.price)]].map(([k,v])=>(
            <div key={k}><div style={{fontSize:11,color:'var(--text-3)',marginBottom:2}}>{k}</div><div style={{fontSize:13.5,fontWeight:600}}>{v}</div></div>
          ))}
        </div>
      </div>

      <Divider label="Customer Information" style={{marginBottom:18}}/>
      <Field label="Full Name" required>
        <Input value={form.name} onChange={e=>setForm(f=>({...f,name:e.target.value}))} placeholder="Ahmed Khan"
          style={err.name?{borderColor:'var(--sold)'}:{}}/>
        {err.name&&<div style={{fontSize:11.5,color:'var(--sold)',marginTop:4}}>{err.name}</div>}
      </Field>
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:16}}>
        <Field label="Phone" required>
          <Input value={form.phone} onChange={e=>setForm(f=>({...f,phone:e.target.value}))} placeholder="0300-1234567"
            style={err.phone?{borderColor:'var(--sold)'}:{}}/>
          {err.phone&&<div style={{fontSize:11.5,color:'var(--sold)',marginTop:4}}>{err.phone}</div>}
        </Field>
        <Field label="CNIC">
          <Input value={form.cnic} onChange={e=>setForm(f=>({...f,cnic:e.target.value}))} placeholder="35202-XXXXXXX-X"/>
        </Field>
      </div>
      <Field label="Email">
        <Input value={form.email} onChange={e=>setForm(f=>({...f,email:e.target.value}))} placeholder="email@example.com" type="email"/>
      </Field>

      <Divider label="Payment Plan" style={{marginTop:4,marginBottom:16}}/>
      <div style={{display:'flex',flexDirection:'column',gap:6}}>
        {plan.schedule.map((row,i)=>(
          <div key={i} style={{display:'flex',alignItems:'center',gap:12,padding:'12px 14px',
            background:'var(--bg-2)',border:'1px solid var(--line)',borderRadius:9}}>
            <div style={{width:34,height:34,borderRadius:8,flexShrink:0,background:'var(--surface-2)',
              border:'1px solid var(--line-2)',display:'flex',alignItems:'center',justifyContent:'center',
              fontSize:12,fontWeight:700,fontFamily:'var(--f-mono)',color:'var(--accent)'}}>{row.pct}%</div>
            <div style={{flex:1}}>
              <div style={{fontSize:13,fontWeight:600}}>{row.label}</div>
              <div style={{fontSize:11,color:'var(--text-4)'}}>{row.count?row.count+' × ':''}{row.when}</div>
            </div>
            <span className="mono" style={{fontSize:13,fontWeight:600,flexShrink:0}}>
              {fmtShort(row.amount)}{row.count&&<span style={{color:'var(--text-4)',fontSize:10}}>/mo</span>}
            </span>
          </div>
        ))}
      </div>
    </Sheet>
  );
}

// ---------- EDIT UNIT SHEET ----------
function EditUnitSheet({open,unit,project,onClose,onSaved}){
  const [status,setStatus]=useState('open');
  const [customer,setCustomer]=useState('');
  const [price,setPrice]=useState('');
  useEffect(()=>{if(unit){setStatus(unit.status);setCustomer(unit.customer||'');setPrice(String(unit.price));}},[unit]);
  if(!unit) return null;

  function save(){
    unit.status=status;
    unit.customer=customer||null;
    unit.price=Number(price)||unit.price;
    project.counts={open:0,booked:0,token:0,sold:0,blocked:0};
    project.units.forEach(u=>project.counts[u.status]++);
    project.sales=project.units.filter(u=>u.status==='sold').reduce((a,u)=>a+u.price,0);
    onSaved();
  }

  return (
    <Sheet open={open} onClose={onClose} title={'Edit · '+unit.code} sub="Unit Details"
      footer={<>
        <Button variant="ghost" onClick={onClose}>Cancel</Button>
        <Button variant="primary" icon="check" onClick={save}>Save Changes</Button>
      </>}>

      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12,marginBottom:22,
        background:'var(--bg-2)',border:'1px solid var(--line)',borderRadius:12,padding:16}}>
        {[['Code',unit.code],['Type',unit.typeName],['Floor','Floor '+unit.floor],['Area',unit.area+' sqft']].map(([k,v])=>(
          <div key={k}><div style={{fontSize:11,color:'var(--text-3)',marginBottom:2}}>{k}</div><div style={{fontSize:13.5,fontWeight:600}}>{v}</div></div>
        ))}
      </div>

      <Field label="Status">
        <Select value={status} onChange={e=>setStatus(e.target.value)}>
          {STATUS_ORDER.map(s=><option key={s} value={s}>{STATUS[s].label}</option>)}
        </Select>
      </Field>
      <Field label="Assigned Customer" hint="Leave blank if unit is available or blocked">
        <Input value={customer} onChange={e=>setCustomer(e.target.value)} placeholder="Full name"/>
      </Field>
      <Field label="List Price (PKR)">
        <Input value={price} onChange={e=>setPrice(e.target.value)} type="number" min="0"/>
      </Field>
    </Sheet>
  );
}

Object.assign(window,{ProjectsScreen, ProjectDetailScreen, ProjectCard, UnitCell, UnitPanel, BookUnitSheet, EditUnitSheet});

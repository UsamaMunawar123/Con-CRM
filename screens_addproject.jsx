// ============ Add Project (with live unit preview) ============

function AddProjectScreen({go}){
  const [form,setForm]=useState({
    name:'', code:'', city:'Lahore', address:'', type:'Residential High-Rise',
    handover:'', floors:8, perFloor:6, rate:32000, unitType:'2BR',
  });
  const set=(k,v)=>setForm(f=>({...f,[k]:v}));
  const ut=UNIT_TYPES.find(t=>t.key===form.unitType)||UNIT_TYPES[1];
  const totalUnits=form.floors*form.perFloor;
  const estPrice=ut.area*form.rate;
  const estInventory=totalUnits*estPrice;
  const [created,setCreated]=useState(false);

  const previewFloors=[];
  for(let f=Math.min(form.floors,6);f>=1;f--) previewFloors.push(f);

  return (
    <div className="fade-up">
      <button onClick={()=>go('projects')} style={{display:'flex',alignItems:'center',gap:7,color:'var(--text-3)',
        fontSize:13,fontWeight:600,marginBottom:16}}>
        <Icon name="arrowL" size={15}/> Back to projects</button>

      <PageHeader sub="New Project" title="Add Project" icon="building"/>

      <div style={{display:'grid',gridTemplateColumns:'1fr 400px',gap:20,alignItems:'start'}}>
        {/* form */}
        <div style={{display:'flex',flexDirection:'column',gap:16}}>
          <Card>
            <div style={{display:'flex',alignItems:'center',gap:9,marginBottom:18}}>
              <span style={{width:26,height:26,borderRadius:7,background:'var(--accent-soft)',color:'var(--accent)',
                display:'flex',alignItems:'center',justifyContent:'center',fontSize:13,fontWeight:700,fontFamily:'var(--f-mono)'}}>1</span>
              <h3 style={{fontSize:16}}>Project Details</h3>
            </div>
            <div style={{display:'grid',gridTemplateColumns:'2fr 1fr',gap:16}}>
              <Field label="Project Name" required>
                <Input placeholder="e.g. Skyline Residency" value={form.name} onChange={e=>set('name',e.target.value)}/>
              </Field>
              <Field label="Project Code" required hint="Short code for unit IDs">
                <Input placeholder="SKY" value={form.code} onChange={e=>set('code',e.target.value.toUpperCase())} style={{fontFamily:'var(--f-mono)'}}/>
              </Field>
            </div>
            <Field label="Address" required>
              <Input placeholder="Plot, sector, area" value={form.address} onChange={e=>set('address',e.target.value)}/>
            </Field>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:16}}>
              <Field label="City">
                <Select value={form.city} onChange={e=>set('city',e.target.value)}>
                  {['Lahore','Islamabad','Karachi','Rawalpindi','Faisalabad'].map(c=><option key={c}>{c}</option>)}
                </Select>
              </Field>
              <Field label="Project Type">
                <Select value={form.type} onChange={e=>set('type',e.target.value)}>
                  {['Residential High-Rise','Mixed-Use Towers','Apartment Community','Premium Residences','Commercial Plaza'].map(c=><option key={c}>{c}</option>)}
                </Select>
              </Field>
              <Field label="Handover">
                <Input placeholder="Dec 2027" value={form.handover} onChange={e=>set('handover',e.target.value)}/>
              </Field>
            </div>
          </Card>

          <Card>
            <div style={{display:'flex',alignItems:'center',gap:9,marginBottom:18}}>
              <span style={{width:26,height:26,borderRadius:7,background:'var(--accent-soft)',color:'var(--accent)',
                display:'flex',alignItems:'center',justifyContent:'center',fontSize:13,fontWeight:700,fontFamily:'var(--f-mono)'}}>2</span>
              <h3 style={{fontSize:16}}>Units & Pricing</h3>
              <span style={{marginLeft:'auto',fontSize:12,color:'var(--text-3)'}}>Auto-generates the unit map</span>
            </div>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:16}}>
              <Stepper label="Number of Floors" value={form.floors} min={1} max={40} onChange={v=>set('floors',v)}/>
              <Stepper label="Units per Floor" value={form.perFloor} min={1} max={20} onChange={v=>set('perFloor',v)}/>
            </div>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:16,marginTop:2}}>
              <Field label="Default Unit Type">
                <Select value={form.unitType} onChange={e=>set('unitType',e.target.value)}>
                  {UNIT_TYPES.map(t=><option key={t.key} value={t.key}>{t.name} · {t.area} sqft</option>)}
                </Select>
              </Field>
              <Field label="Base Rate / sqft (PKR)" hint={'Est. unit price ≈ '+fmtShort(estPrice)}>
                <Input type="number" value={form.rate} onChange={e=>set('rate',+e.target.value||0)} style={{fontFamily:'var(--f-mono)'}}/>
              </Field>
            </div>
            <div style={{padding:'14px 16px',background:'var(--bg-2)',borderRadius:'var(--r)',border:'1px solid var(--line)',
              display:'flex',justifyContent:'space-between',alignItems:'center',marginTop:4}}>
              <div style={{display:'flex',alignItems:'center',gap:10,color:'var(--text-2)',fontSize:13}}>
                <Icon name="cube" size={16} style={{color:'var(--accent)'}}/>
                All new units start as <StatusPill status="open" size="sm"/>
              </div>
              <div style={{fontSize:12,color:'var(--text-4)'}}>You can change status per-unit after creation</div>
            </div>
          </Card>
        </div>

        {/* live preview */}
        <div style={{position:'sticky',top:0}}>
          <Card pad={0}>
            <div style={{padding:'18px 20px',borderBottom:'1px solid var(--line)'}}>
              <h3 style={{fontSize:15}}>Live Preview</h3>
              <div style={{fontSize:12,color:'var(--text-3)',marginTop:2}}>Updates as you fill the form</div>
            </div>
            <div style={{padding:'18px 20px'}}>
              <div style={{display:'flex',gap:12,alignItems:'center',marginBottom:16}}>
                <div style={{width:48,height:48,borderRadius:12,background:'#1c2c4d',border:'1px solid var(--line-2)',
                  display:'flex',alignItems:'center',justifyContent:'center',color:'rgba(255,255,255,.8)',
                  fontFamily:'var(--f-display)',fontWeight:700,fontSize:15}}>{form.code||'—'}</div>
                <div style={{minWidth:0}}>
                  <div style={{fontWeight:600,fontSize:15,whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{form.name||'Untitled Project'}</div>
                  <div style={{fontSize:12,color:'var(--text-3)'}}>{form.city} · {form.type}</div>
                </div>
              </div>

              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10,marginBottom:18}}>
                <div style={{padding:'12px 14px',background:'var(--bg-2)',borderRadius:10,border:'1px solid var(--line)'}}>
                  <div style={{fontSize:11,color:'var(--text-3)',marginBottom:4}}>Total Units</div>
                  <div className="mono" style={{fontSize:20,fontWeight:700}}>{totalUnits}</div>
                </div>
                <div style={{padding:'12px 14px',background:'var(--bg-2)',borderRadius:10,border:'1px solid var(--line)'}}>
                  <div style={{fontSize:11,color:'var(--text-3)',marginBottom:4}}>Est. Inventory</div>
                  <div className="mono" style={{fontSize:20,fontWeight:700,color:'var(--accent)'}}>{fmtShort(estInventory)}</div>
                </div>
              </div>

              <div style={{fontSize:11,fontWeight:700,color:'var(--text-4)',textTransform:'uppercase',letterSpacing:'.1em',marginBottom:10}}>Unit map preview</div>
              <div style={{display:'flex',flexDirection:'column',gap:4,maxHeight:200,overflowY:'auto'}}>
                {previewFloors.map(f=>(
                  <div key={f} style={{display:'flex',gap:4,alignItems:'center'}}>
                    <span style={{width:20,fontSize:9.5,color:'var(--text-4)',fontFamily:'var(--f-mono)',flexShrink:0}}>F{f}</span>
                    <div style={{display:'flex',gap:4,flex:1}}>
                      {Array.from({length:Math.min(form.perFloor,12)}).map((_,i)=>(
                        <span key={i} style={{height:18,flex:1,borderRadius:4,background:'var(--open-bg)',border:'1px solid var(--open-line)'}}></span>
                      ))}
                    </div>
                  </div>
                ))}
                {form.floors>6 && <div style={{fontSize:10.5,color:'var(--text-4)',textAlign:'center',marginTop:2}}>+{form.floors-6} more floors</div>}
              </div>
            </div>
            <div style={{padding:'16px 20px',borderTop:'1px solid var(--line)',display:'flex',gap:10}}>
              <Button variant="ghost" full onClick={()=>go('projects')}>Cancel</Button>
              <Button variant="primary" full icon="check" onClick={()=>setCreated(true)}>Create</Button>
            </div>
          </Card>
        </div>
      </div>

      {created &&
        <div onClick={()=>{setCreated(false);go('projects');}} style={{position:'fixed',inset:0,zIndex:200,
          background:'rgba(5,7,12,.6)',backdropFilter:'blur(3px)',display:'flex',alignItems:'center',justifyContent:'center',animation:'fadeIn .2s'}}>
          <Card onClick={e=>e.stopPropagation()} style={{width:380,textAlign:'center',animation:'popIn .25s both'}}>
            <div style={{width:56,height:56,borderRadius:16,background:'var(--open-bg)',border:'1px solid var(--open-line)',
              color:'var(--open)',display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 18px'}}>
              <Icon name="check" size={28} stroke={2.5}/></div>
            <h3 style={{fontSize:19,marginBottom:8}}>Project Created</h3>
            <p style={{color:'var(--text-3)',fontSize:13.5,marginBottom:22,lineHeight:1.6}}>
              <b style={{color:'var(--text)'}}>{form.name||'New project'}</b> was created with {totalUnits} units, all set to Available.</p>
            <Button variant="primary" full onClick={()=>{setCreated(false);go('projects');}}>Go to Projects</Button>
          </Card>
        </div>}
    </div>
  );
}

function Stepper({label, value, min, max, onChange}){
  return (
    <Field label={label}>
      <div style={{display:'flex',alignItems:'center',gap:0,border:'1px solid var(--line-2)',borderRadius:'var(--r-sm)',
        overflow:'hidden',background:'var(--bg)'}}>
        <button onClick={()=>onChange(Math.max(min,value-1))} style={{width:42,height:40,color:'var(--text-2)',
          fontSize:18,borderRight:'1px solid var(--line-2)',background:'var(--surface-2)'}}>−</button>
        <input value={value} onChange={e=>{const v=+e.target.value; if(!isNaN(v))onChange(Math.max(min,Math.min(max,v)));}}
          style={{flex:1,textAlign:'center',background:'transparent',border:'none',outline:'none',color:'var(--text)',
            fontSize:15,fontWeight:600,fontFamily:'var(--f-mono)',width:'100%'}}/>
        <button onClick={()=>onChange(Math.min(max,value+1))} style={{width:42,height:40,color:'var(--text-2)',
          fontSize:18,borderLeft:'1px solid var(--line-2)',background:'var(--surface-2)'}}>+</button>
      </div>
    </Field>
  );
}

Object.assign(window,{AddProjectScreen, Stepper});

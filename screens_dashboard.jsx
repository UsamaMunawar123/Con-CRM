// ============ Dashboard ============

function StatusBar({counts, total, height=10}){
  return (
    <div style={{display:'flex',height,borderRadius:99,overflow:'hidden',background:'var(--surface-3)'}}>
      {STATUS_ORDER.map(s=>{
        const c=counts[s]||0; if(!c) return null;
        return <div key={s} title={STATUS[s].label+': '+c} style={{width:(c/total*100)+'%',
          background:STATUS[s].color,opacity:.85}}></div>;
      })}
    </div>
  );
}

function StatusLegend({counts}){
  return (
    <div style={{display:'flex',flexWrap:'wrap',gap:'8px 16px'}}>
      {STATUS_ORDER.map(s=>(
        <div key={s} style={{display:'flex',alignItems:'center',gap:7,fontSize:12.5}}>
          <span style={{width:9,height:9,borderRadius:3,background:STATUS[s].color}}></span>
          <span style={{color:'var(--text-2)'}}>{STATUS[s].label}</span>
          <span className="mono" style={{color:'var(--text)',fontWeight:600}}>{counts[s]||0}</span>
        </div>
      ))}
    </div>
  );
}

function DashboardScreen({go}){
  const p=PORTFOLIO;
  const counts=PROJECTS.reduce((a,pr)=>{STATUS_ORDER.forEach(s=>a[s]=(a[s]||0)+pr.counts[s]);return a;},{});
  const sellThrough=Math.round(p.sold/p.totalUnits*100);
  const recent=[
    {who:'Usman Raja',act:'booked unit',obj:'A-1203 · Gulberg Heights',time:'12 min ago',tone:'booked'},
    {who:'Ayesha Tariq',act:'marked sold',obj:'C-0805 · DHA Valley Towers',time:'1 hr ago',tone:'sold'},
    {who:'Nadia Malik',act:'approved expense',obj:'EXP-2480 · Rs 18 L',time:'2 hr ago',tone:'token'},
    {who:'Bilal Ansari',act:'added token',obj:'B-0410 · Bahria Enclave',time:'3 hr ago',tone:'token'},
    {who:'Sara Qureshi',act:'released unit',obj:'D-0702 · Emaar Canyon',time:'5 hr ago',tone:'open'},
  ];

  return (
    <div className="fade-up">
      <PageHeader sub="Welcome back, Hamza" title="Portfolio Overview" icon="grid">
        <Button variant="ghost" icon="download" size="md">Export</Button>
        <Button variant="primary" icon="plus" onClick={()=>go('add-project')}>New Project</Button>
      </PageHeader>

      {/* stat row */}
      <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:16,marginBottom:16}}>
        <Stat label="Total Sales Value" value={fmtShort(p.sales)} icon="wallet" tone="accent" sub="across 4 projects" trend={12}/>
        <Stat label="Units Sold" value={p.sold+' / '+p.totalUnits} icon="building" tone="green" sub={sellThrough+'% sell-through'} trend={8}/>
        <Stat label="Sales Pipeline" value={fmtShort(p.pipeline)} icon="trend" tone="violet" sub={p.reserved+' reserved units'}/>
        <Stat label="Total Expenses" value={fmtShort(EXP_TOTAL)} icon="receipt" tone="rose" sub={Math.round(EXP_TOTAL/EXP_BUDGET*100)+'% of budget'} trend={-4}/>
      </div>

      <div style={{display:'grid',gridTemplateColumns:'1.55fr 1fr',gap:16,marginBottom:16}}>
        {/* projects table */}
        <Card pad={0}>
          <div style={{padding:'18px 20px',display:'flex',justifyContent:'space-between',alignItems:'center',borderBottom:'1px solid var(--line)'}}>
            <div>
              <h3 style={{fontSize:16}}>Active Projects</h3>
              <div style={{fontSize:12.5,color:'var(--text-3)',marginTop:2}}>Inventory & sales performance</div>
            </div>
            <Button variant="bare" size="sm" icon="chevR" onClick={()=>go('projects')}>View all</Button>
          </div>
          <div style={{padding:'8px 12px'}}>
            {PROJECTS.map(pr=>{
              const st=Math.round(pr.counts.sold/pr.totalUnits*100);
              return (
                <button key={pr.id} onClick={()=>go('project',{id:pr.id})} style={{width:'100%',display:'flex',
                  alignItems:'center',gap:14,padding:'13px 12px',borderRadius:10,textAlign:'left',transition:'background .15s'}}
                  onMouseEnter={e=>e.currentTarget.style.background='var(--surface-2)'}
                  onMouseLeave={e=>e.currentTarget.style.background='transparent'}>
                  <div style={{width:42,height:42,borderRadius:10,flexShrink:0,background:pr.cover,
                    border:'1px solid var(--line-2)',display:'flex',alignItems:'center',justifyContent:'center',
                    color:'rgba(255,255,255,.7)',fontFamily:'var(--f-display)',fontWeight:700,fontSize:13}}>{pr.code}</div>
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{fontWeight:600,fontSize:14,marginBottom:5}}>{pr.name}</div>
                    <StatusBar counts={pr.counts} total={pr.totalUnits} height={7}/>
                  </div>
                  <div style={{textAlign:'right',width:96,flexShrink:0}}>
                    <div className="mono" style={{fontWeight:600,fontSize:13.5}}>{fmtShort(pr.sales)}</div>
                    <div style={{fontSize:11.5,color:'var(--text-3)',marginTop:2}}>{st}% sold</div>
                  </div>
                  <Icon name="chevR" size={16} style={{color:'var(--text-4)'}}/>
                </button>
              );
            })}
          </div>
        </Card>

        {/* inventory donut-ish */}
        <Card>
          <h3 style={{fontSize:16,marginBottom:4}}>Inventory Status</h3>
          <div style={{fontSize:12.5,color:'var(--text-3)',marginBottom:20}}>{p.totalUnits} total units</div>
          <div style={{position:'relative',display:'flex',justifyContent:'center',marginBottom:22}}>
            <DonutChart counts={counts} total={p.totalUnits}/>
          </div>
          <StatusLegend counts={counts}/>
        </Card>
      </div>

      <div style={{display:'grid',gridTemplateColumns:'1fr 1.2fr',gap:16}}>
        {/* recent activity */}
        <Card pad={0}>
          <div style={{padding:'18px 20px',borderBottom:'1px solid var(--line)'}}>
            <h3 style={{fontSize:16}}>Recent Activity</h3>
          </div>
          <div style={{padding:'6px 8px'}}>
            {recent.map((r,i)=>(
              <div key={i} style={{display:'flex',gap:12,padding:'11px 12px',alignItems:'center'}}>
                <Avatar name={r.who} size={32}/>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{fontSize:13}}><span style={{fontWeight:600}}>{r.who}</span> <span style={{color:'var(--text-3)'}}>{r.act}</span></div>
                  <div style={{fontSize:12,color:'var(--text-2)',marginTop:2}}>{r.obj}</div>
                </div>
                <div style={{display:'flex',flexDirection:'column',alignItems:'flex-end',gap:5}}>
                  <span style={{width:8,height:8,borderRadius:99,background:STATUS[r.tone].color}}></span>
                  <span style={{fontSize:11,color:'var(--text-4)'}}>{r.time}</span>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* expense breakdown */}
        <Card>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:18}}>
            <h3 style={{fontSize:16}}>Expense Breakdown</h3>
            <Button variant="bare" size="sm" icon="chevR" onClick={()=>go('expenses')}>Details</Button>
          </div>
          <div style={{display:'flex',flexDirection:'column',gap:15}}>
            {EXP_CATEGORIES.slice(0,5).map(c=>{
              const pct=Math.round(c.spent/EXP_TOTAL*100);
              return (
                <div key={c.id}>
                  <div style={{display:'flex',justifyContent:'space-between',marginBottom:6,fontSize:12.5}}>
                    <span style={{color:'var(--text-2)',display:'flex',alignItems:'center',gap:8}}>
                      <span style={{width:9,height:9,borderRadius:3,background:c.color}}></span>{c.name}</span>
                    <span className="mono" style={{fontWeight:600}}>{fmtShort(c.spent)}</span>
                  </div>
                  <Progress value={pct} color={c.color} height={6}/>
                </div>
              );
            })}
          </div>
        </Card>
      </div>
    </div>
  );
}

// simple conic donut
function DonutChart({counts, total, size=168}){
  let acc=0; const segs=[];
  STATUS_ORDER.forEach(s=>{
    const v=counts[s]||0; if(!v)return;
    const start=acc/total*360; acc+=v; const end=acc/total*360;
    segs.push(STATUS[s].color+' '+start+'deg '+end+'deg');
  });
  const sold=counts.sold||0;
  return (
    <div style={{width:size,height:size,borderRadius:'50%',position:'relative',
      background:'conic-gradient('+segs.join(',')+')'}}>
      <div style={{position:'absolute',inset:'22%',borderRadius:'50%',background:'var(--surface)',
        border:'1px solid var(--line)',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center'}}>
        <div style={{fontSize:30,fontWeight:700,fontFamily:'var(--f-display)',lineHeight:1}}>{Math.round(sold/total*100)}%</div>
        <div style={{fontSize:11,color:'var(--text-3)',marginTop:3}}>sold</div>
      </div>
    </div>
  );
}

Object.assign(window,{DashboardScreen, StatusBar, StatusLegend, DonutChart});

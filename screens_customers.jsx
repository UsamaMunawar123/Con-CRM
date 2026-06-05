// ============ Customers: list · detail · payment ledger ============

function CustomersScreen({go}){
  const [q,setQ]=useState('');
  const list=CUSTOMERS.filter(c=>
    !q||c.name.toLowerCase().includes(q.toLowerCase())||c.phone.includes(q)||c.cnic.includes(q)
  );
  const totalValue=CUSTOMERS.reduce((a,c)=>a+c.units.reduce((b,u)=>b+u.price,0),0);
  const totalPaid=CUSTOMERS.reduce((a,c)=>a+c.units.reduce((b,u)=>b+u.ledger.filter(l=>l.paid).reduce((s,l)=>s+l.amount,0),0),0);

  return (
    <div className="fade-up">
      <PageHeader sub="Sales CRM" title="Customers" icon="users">
        <Button variant="ghost" icon="download" size="md">Export</Button>
      </PageHeader>

      <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:16,marginBottom:24}}>
        <Stat label="Total Customers" value={CUSTOMERS.length} icon="users" tone="accent"/>
        <Stat label="Portfolio Value" value={fmtShort(totalValue)} icon="wallet" tone="violet"/>
        <Stat label="Collected" value={fmtShort(totalPaid)} icon="check" tone="green" sub={Math.round(totalPaid/totalValue*100)+'% of total'}/>
        <Stat label="Outstanding" value={fmtShort(totalValue-totalPaid)} icon="clock" tone="amber"/>
      </div>

      <div style={{position:'relative',maxWidth:400,marginBottom:18}}>
        <span style={{position:'absolute',left:12,top:'50%',transform:'translateY(-50%)',color:'var(--text-4)'}}><Icon name="search" size={16}/></span>
        <Input placeholder="Search name, CNIC, phone…" value={q} onChange={e=>setQ(e.target.value)} style={{paddingLeft:36}}/>
      </div>

      <Card pad={0}>
        <div style={{padding:'14px 20px',borderBottom:'1px solid var(--line)',display:'flex',alignItems:'center',justifyContent:'space-between'}}>
          <span style={{fontSize:15,fontWeight:600}}>All Customers <span style={{fontSize:13,color:'var(--text-4)',fontWeight:400,marginLeft:6}}>{list.length} records</span></span>
        </div>
        <div style={{overflowX:'auto'}}>
          <table style={{width:'100%',borderCollapse:'collapse'}}>
            <thead>
              <tr style={{borderBottom:'1px solid var(--line)'}}>
                {['Customer','CNIC','Phone','Units','Total Value','Standing',''].map((h,i)=>(
                  <th key={i} style={{padding:'10px 18px',textAlign:i===6?'right':'left',fontSize:11,fontWeight:700,
                    color:'var(--text-4)',textTransform:'uppercase',letterSpacing:'.07em',whiteSpace:'nowrap'}}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {list.map(c=>{
                const tv=c.units.reduce((a,u)=>a+u.price,0);
                const overdue=c.units.some(u=>u.ledger.some(l=>l.overdue));
                return (
                  <tr key={c.id} onClick={()=>go('customer',{id:c.id})}
                    style={{borderBottom:'1px solid var(--line-soft)',cursor:'pointer',transition:'background .1s'}}
                    onMouseEnter={e=>e.currentTarget.style.background='var(--surface-2)'}
                    onMouseLeave={e=>e.currentTarget.style.background=''}>
                    <td style={{padding:'14px 18px'}}>
                      <div style={{display:'flex',alignItems:'center',gap:11}}>
                        <Avatar name={c.name} size={36}/>
                        <div>
                          <div style={{fontSize:14,fontWeight:600}}>{c.name}</div>
                          <div style={{fontSize:11.5,color:'var(--text-4)',marginTop:1}}>{c.email}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{padding:'14px 18px'}}><span className="mono" style={{fontSize:12.5,color:'var(--text-2)'}}>{c.cnic}</span></td>
                    <td style={{padding:'14px 18px'}}><span style={{fontSize:13,color:'var(--text-2)'}}>{c.phone}</span></td>
                    <td style={{padding:'14px 18px'}}>
                      <div style={{display:'flex',gap:4,flexWrap:'wrap'}}>
                        {c.units.map((u,i)=><StatusPill key={i} status={u.status} size="sm"/>)}
                      </div>
                    </td>
                    <td style={{padding:'14px 18px'}}><span className="mono" style={{fontSize:14,fontWeight:600}}>{fmtShort(tv)}</span></td>
                    <td style={{padding:'14px 18px'}}><Badge tone={overdue?'rose':'green'}>{overdue?'Overdue':'Good Standing'}</Badge></td>
                    <td style={{padding:'14px 18px',textAlign:'right'}}>
                      <Button variant="ghost" size="sm" onClick={e=>{e.stopPropagation();go('customer',{id:c.id});}}>View →</Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {!list.length && <div style={{padding:'48px',textAlign:'center',color:'var(--text-4)'}}>No customers found</div>}
        </div>
      </Card>
    </div>
  );
}

function CustomerDetailScreen({id,go}){
  const [selIdx,setSelIdx]=useState(0);
  const [lFilter,setLFilter]=useState('all');
  const cust=CUSTOMERS.find(c=>c.id===id);
  if(!cust) return <div style={{padding:40,color:'var(--text-3)'}}>Customer not found</div>;

  const unit=cust.units[selIdx];
  const paidAmt=unit.ledger.filter(l=>l.paid).reduce((a,l)=>a+l.amount,0);
  const overdueAmt=unit.ledger.filter(l=>l.overdue).reduce((a,l)=>a+l.amount,0);
  const outAmt=unit.price-paidAmt;
  const paidPct=Math.min(100,Math.round(paidAmt/unit.price*100));

  const rows=unit.ledger.filter(l=>
    lFilter==='all'||(lFilter==='paid'&&l.paid)||(lFilter==='overdue'&&l.overdue)||(lFilter==='upcoming'&&!l.paid&&!l.overdue)
  );

  return (
    <div className="fade-up">
      <button onClick={()=>go('customers')} style={{display:'flex',alignItems:'center',gap:7,color:'var(--text-3)',
        fontSize:13,fontWeight:600,marginBottom:20}}>
        <Icon name="arrowL" size={15}/> All Customers
      </button>

      <div style={{display:'grid',gridTemplateColumns:'320px 1fr',gap:20,alignItems:'start'}}>
        {/* left: profile */}
        <div style={{display:'flex',flexDirection:'column',gap:16}}>
          <Card>
            <div style={{display:'flex',flexDirection:'column',alignItems:'center',textAlign:'center',
              paddingBottom:20,borderBottom:'1px solid var(--line)',marginBottom:20}}>
              <Avatar name={cust.name} size={76}/>
              <h2 style={{fontSize:22,marginTop:14,marginBottom:6}}>{cust.name}</h2>
              <Badge tone="accent">Customer since {cust.since}</Badge>
            </div>
            <div style={{textAlign:'left'}}>
              {[['phone','Phone',cust.phone],['mail','Email',cust.email],['key','CNIC',cust.cnic]].map(([ic,lbl,val])=>(
                <div key={lbl} style={{display:'flex',gap:11,alignItems:'center',marginBottom:14}}>
                  <div style={{width:32,height:32,borderRadius:8,background:'var(--surface-2)',border:'1px solid var(--line)',
                    display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0,color:'var(--text-3)'}}>
                    <Icon name={ic} size={15}/>
                  </div>
                  <div>
                    <div style={{fontSize:11,color:'var(--text-4)',marginBottom:1}}>{lbl}</div>
                    <div style={{fontSize:13.5,fontWeight:600}}>{val||'—'}</div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card pad={16}>
            <div style={{fontSize:11,fontWeight:700,color:'var(--text-4)',textTransform:'uppercase',
              letterSpacing:'.1em',marginBottom:12}}>Booked Units</div>
            {cust.units.map((u,i)=>(
              <button key={u.unitId} onClick={()=>{setSelIdx(i);setLFilter('all');}}
                style={{width:'100%',display:'flex',alignItems:'center',gap:11,padding:'11px 12px',borderRadius:9,
                  marginBottom:6,textAlign:'left',transition:'all .15s',
                  background:i===selIdx?'var(--accent-soft)':'var(--surface-2)',
                  border:'1px solid '+(i===selIdx?'var(--accent-line)':'var(--line)')}}>
                <div style={{width:38,height:38,borderRadius:8,flexShrink:0,
                  background:i===selIdx?'var(--accent)':'var(--surface-3)',
                  display:'flex',alignItems:'center',justifyContent:'center',
                  color:i===selIdx?'#fff':'var(--text-3)',fontFamily:'var(--f-mono)',fontWeight:700,fontSize:11}}>
                  {u.unitCode.split('-')[0]}
                </div>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{fontSize:13.5,fontWeight:600,color:i===selIdx?'var(--accent)':'var(--text)'}}>{u.unitCode}</div>
                  <div style={{fontSize:11,color:'var(--text-3)',marginTop:1}}>{u.projectCode} · {u.typeName}</div>
                </div>
                <StatusPill status={u.status} size="sm"/>
              </button>
            ))}
          </Card>
        </div>

        {/* right: ledger */}
        <div style={{display:'flex',flexDirection:'column',gap:16}}>
          <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:14}}>
            <Stat label="Unit Value" value={fmtShort(unit.price)} icon="wallet" tone="accent"/>
            <Stat label="Collected" value={fmtShort(paidAmt)} icon="check" tone="green" sub={paidPct+'%'}/>
            <Stat label="Outstanding" value={fmtShort(outAmt)} icon="clock" tone="amber"/>
            <Stat label="Overdue" value={fmtShort(overdueAmt)} icon="bolt" tone="rose"/>
          </div>

          <Card pad={0}>
            <div style={{padding:'16px 20px',borderBottom:'1px solid var(--line)',display:'flex',
              alignItems:'center',justifyContent:'space-between',flexWrap:'wrap',gap:12}}>
              <div>
                <h3 style={{fontSize:15}}>Payment Ledger</h3>
                <div style={{fontSize:12,color:'var(--text-3)',marginTop:2}}>{unit.unitCode} · {unit.projectName}</div>
              </div>
              <Segmented size="sm" value={lFilter} onChange={setLFilter}
                options={[{value:'all',label:'All'},{value:'paid',label:'Paid'},
                  {value:'overdue',label:'Overdue'},{value:'upcoming',label:'Upcoming'}]}/>
            </div>

            <div style={{padding:'14px 20px',borderBottom:'1px solid var(--line)',background:'var(--bg-2)'}}>
              <div style={{display:'flex',justifyContent:'space-between',marginBottom:7,fontSize:12.5}}>
                <span style={{color:'var(--text-3)'}}>Collection Progress</span>
                <span className="mono" style={{fontWeight:700,color:'var(--accent)'}}>{paidPct}%</span>
              </div>
              <Progress value={paidPct}/>
            </div>

            <div style={{maxHeight:500,overflowY:'auto'}}>
              {rows.map((row,i)=>{
                const t=row.paid
                  ?{icon:'check',color:'var(--open)',bg:'var(--open-bg)',lbl:'Paid'}
                  :row.overdue
                    ?{icon:'bolt',color:'var(--sold)',bg:'var(--sold-bg)',lbl:'Overdue'}
                    :{icon:'calendar',color:'var(--text-3)',bg:'var(--surface-2)',lbl:'Upcoming'};
                return (
                  <div key={row.id} style={{display:'flex',alignItems:'center',gap:14,padding:'13px 20px',
                    borderBottom:i<rows.length-1?'1px solid var(--line-soft)':'none',
                    background:row.overdue?'rgba(251,113,133,.05)':''}}>
                    <div style={{width:36,height:36,borderRadius:9,flexShrink:0,
                      background:t.bg,display:'flex',alignItems:'center',justifyContent:'center',color:t.color}}>
                      <Icon name={t.icon} size={16}/>
                    </div>
                    <div style={{flex:1,minWidth:0}}>
                      <div style={{fontSize:13.5,fontWeight:600}}>{row.label}</div>
                      <div style={{fontSize:11.5,color:'var(--text-3)',marginTop:2}}>
                        Due: {row.due}{row.paidOn?' · Paid '+row.paidOn:''}
                      </div>
                    </div>
                    <div style={{textAlign:'right',flexShrink:0}}>
                      <div className="mono" style={{fontSize:14,fontWeight:600}}>{fmtShort(row.amount)}</div>
                      <span style={{display:'inline-flex',alignItems:'center',gap:4,padding:'2px 8px',marginTop:3,
                        borderRadius:99,background:t.bg,color:t.color,fontSize:11,fontWeight:600}}>
                        <span style={{width:5,height:5,borderRadius:99,background:t.color}}></span>{t.lbl}
                      </span>
                    </div>
                  </div>
                );
              })}
              {!rows.length && <div style={{padding:'40px',textAlign:'center',color:'var(--text-4)'}}>No entries</div>}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

Object.assign(window,{CustomersScreen, CustomerDetailScreen});

// ============ Expenses: list + categories ============

// ---------- EXPENSES ----------
function ExpensesScreen({go}){
  const [q,setQ]=useState('');
  const [cat,setCat]=useState('all');
  const [add,setAdd]=useState(false);
  const cats=['all',...EXP_CATEGORIES.map(c=>c.name)];
  const list=EXPENSES.filter(e=>(cat==='all'||e.category===cat)&&
    (e.vendor.toLowerCase().includes(q.toLowerCase())||e.ref.toLowerCase().includes(q.toLowerCase())));
  const pending=EXPENSES.filter(e=>e.status==='pending').reduce((a,e)=>a+e.amount,0);
  const statusTone={paid:'green',pending:'amber',approved:'accent'};

  return (
    <div className="fade-up">
      <PageHeader sub="Expenses" title="Expenses" icon="receipt">
        <Button variant="ghost" icon="filter" size="md">Filter by date</Button>
        <Button variant="primary" icon="plus" onClick={()=>setAdd(true)}>Add Expense</Button>
      </PageHeader>

      <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:16,marginBottom:18}}>
        <Stat label="Total Spent" value={fmtShort(EXP_TOTAL)} icon="wallet" tone="rose" sub="this fiscal year"/>
        <Stat label="Total Budget" value={fmtShort(EXP_BUDGET)} icon="chart" tone="accent" sub={Math.round(EXP_TOTAL/EXP_BUDGET*100)+'% utilised'}/>
        <Stat label="Pending Approval" value={fmtShort(pending)} icon="clock" tone="amber" sub={EXPENSES.filter(e=>e.status==='pending').length+' entries'}/>
        <Stat label="Categories" value={EXP_CATEGORIES.length} icon="tag" tone="violet"/>
      </div>

      <Card pad={0}>
        <div style={{padding:'14px 18px',display:'flex',gap:12,alignItems:'center',borderBottom:'1px solid var(--line)',flexWrap:'wrap'}}>
          <div style={{position:'relative',flex:1,minWidth:200,maxWidth:320}}>
            <span style={{position:'absolute',left:12,top:'50%',transform:'translateY(-50%)',color:'var(--text-4)'}}><Icon name="search" size={16}/></span>
            <Input placeholder="Search vendor or ref…" value={q} onChange={e=>setQ(e.target.value)} style={{paddingLeft:36}}/>
          </div>
          <Select value={cat} onChange={e=>setCat(e.target.value)} style={{width:200}}>
            {cats.map(c=><option key={c} value={c}>{c==='all'?'All categories':c}</option>)}
          </Select>
          <Button variant="bare" size="sm" icon="tag" onClick={()=>go('expense-cats')}>Manage categories</Button>
        </div>

        <table style={{width:'100%',borderCollapse:'collapse'}}>
          <thead>
            <tr style={{textAlign:'left'}}>
              {['Reference','Date','Category','Vendor','Project','Amount','Status'].map((h,i)=>(
                <th key={i} style={{padding:'12px 18px',fontSize:11,fontWeight:700,color:'var(--text-4)',
                  textTransform:'uppercase',letterSpacing:'.07em',borderBottom:'1px solid var(--line)',
                  textAlign: h==='Amount'?'right':'left'}}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {list.map(e=>(
              <tr key={e.id} style={{transition:'background .15s'}}
                onMouseEnter={ev=>ev.currentTarget.style.background='var(--surface-2)'}
                onMouseLeave={ev=>ev.currentTarget.style.background='transparent'}>
                <td style={{padding:'12px 18px',borderBottom:'1px solid var(--line-soft)',fontFamily:'var(--f-mono)',fontSize:12.5,fontWeight:600,color:'var(--accent)'}}>{e.ref}</td>
                <td style={{padding:'12px 18px',borderBottom:'1px solid var(--line-soft)',fontSize:12.5,color:'var(--text-3)'}}>{e.date}</td>
                <td style={{padding:'12px 18px',borderBottom:'1px solid var(--line-soft)'}}>
                  <span style={{display:'inline-flex',alignItems:'center',gap:7,fontSize:12.5,fontWeight:600}}>
                    <span style={{width:8,height:8,borderRadius:3,background:e.catColor}}></span>{e.category}</span>
                </td>
                <td style={{padding:'12px 18px',borderBottom:'1px solid var(--line-soft)',fontSize:13}}>{e.vendor}</td>
                <td style={{padding:'12px 18px',borderBottom:'1px solid var(--line-soft)'}}>
                  <Badge tone="neutral" style={{fontFamily:'var(--f-mono)'}}>{e.project}</Badge>
                </td>
                <td style={{padding:'12px 18px',borderBottom:'1px solid var(--line-soft)',textAlign:'right',fontFamily:'var(--f-mono)',fontWeight:600,fontSize:13}}>{fmtPKR(e.amount)}</td>
                <td style={{padding:'12px 18px',borderBottom:'1px solid var(--line-soft)'}}>
                  <Badge tone={statusTone[e.status]} style={{textTransform:'capitalize'}}>{e.status}</Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      <Sheet open={add} onClose={()=>setAdd(false)} sub="Expenses" title="Add Expense"
        footer={<><Button variant="ghost" onClick={()=>setAdd(false)}>Cancel</Button><Button variant="primary" icon="check" onClick={()=>setAdd(false)}>Save Expense</Button></>}>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:16}}>
          <Field label="Category" required><Select>{EXP_CATEGORIES.map(c=><option key={c.id}>{c.name}</option>)}</Select></Field>
          <Field label="Project"><Select><option>— None —</option>{PROJECTS.map(p=><option key={p.id}>{p.code} · {p.name}</option>)}</Select></Field>
        </div>
        <Field label="Vendor / Payee" required><Input placeholder="e.g. Maple Cement Co."/></Field>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:16}}>
          <Field label="Amount (PKR)" required><Input type="number" placeholder="0" style={{fontFamily:'var(--f-mono)'}}/></Field>
          <Field label="Date" required><Input placeholder="Jun 05, 2026"/></Field>
        </div>
        <Field label="Status"><Select><option>Pending</option><option>Approved</option><option>Paid</option></Select></Field>
        <Field label="Notes"><textarea placeholder="Optional description…" style={{...inputStyle,minHeight:80,resize:'vertical'}}/></Field>
      </Sheet>
    </div>
  );
}

// ---------- CATEGORIES ----------
function ExpenseCategoriesScreen({go}){
  return (
    <div className="fade-up">
      <PageHeader sub="Expenses" title="Expense Categories" icon="tag">
        <Button variant="bare" size="md" icon="arrowL" onClick={()=>go('expenses')}>All expenses</Button>
        <Button variant="primary" icon="plus">New Category</Button>
      </PageHeader>

      <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:16}}>
        {EXP_CATEGORIES.map(c=>{
          const pct=Math.round(c.spent/c.budget*100);
          const over=pct>90;
          return (
            <Card key={c.id} hover>
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:16}}>
                <div style={{width:44,height:44,borderRadius:12,background:c.color+'1f',border:'1px solid '+c.color+'55',
                  color:c.color,display:'flex',alignItems:'center',justifyContent:'center'}}>
                  <Icon name={c.icon} size={21}/></div>
                <button style={{width:30,height:30,borderRadius:7,color:'var(--text-3)'}}
                  onMouseEnter={e=>e.currentTarget.style.background='var(--surface-3)'}
                  onMouseLeave={e=>e.currentTarget.style.background='transparent'}><Icon name="dots" size={16}/></button>
              </div>
              <h3 style={{fontSize:16,marginBottom:5}}>{c.name}</h3>
              <p style={{fontSize:12.5,color:'var(--text-3)',marginBottom:18,minHeight:34,lineHeight:1.5}}>{c.desc}</p>

              <div style={{display:'flex',justifyContent:'space-between',alignItems:'baseline',marginBottom:8}}>
                <span className="mono" style={{fontSize:17,fontWeight:700}}>{fmtShort(c.spent)}</span>
                <span style={{fontSize:12,color:'var(--text-4)'}}>of {fmtShort(c.budget)}</span>
              </div>
              <Progress value={pct} color={over?'var(--sold)':c.color} height={7}/>
              <div style={{display:'flex',justifyContent:'space-between',marginTop:10,fontSize:12}}>
                <span style={{color: over?'var(--sold)':'var(--text-3)',fontWeight:600,display:'flex',alignItems:'center',gap:5}}>
                  {over&&<Icon name="bolt" size={12}/>}{pct}% utilised</span>
                <span style={{color:'var(--text-3)'}}>{c.count} entries</span>
              </div>
            </Card>
          );
        })}
      </div>

      {/* budget summary bar */}
      <Card style={{marginTop:16}}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:16}}>
          <h3 style={{fontSize:16}}>Overall Budget Utilisation</h3>
          <span style={{fontSize:13,color:'var(--text-3)'}}>{fmtShort(EXP_TOTAL)} of {fmtShort(EXP_BUDGET)}</span>
        </div>
        <div style={{display:'flex',height:14,borderRadius:8,overflow:'hidden',background:'var(--surface-3)',marginBottom:14}}>
          {EXP_CATEGORIES.map(c=>(
            <div key={c.id} title={c.name+': '+fmtShort(c.spent)} style={{width:(c.spent/EXP_BUDGET*100)+'%',background:c.color,opacity:.85}}></div>
          ))}
        </div>
        <div style={{display:'flex',flexWrap:'wrap',gap:'8px 20px'}}>
          {EXP_CATEGORIES.map(c=>(
            <div key={c.id} style={{display:'flex',alignItems:'center',gap:7,fontSize:12.5}}>
              <span style={{width:9,height:9,borderRadius:3,background:c.color}}></span>
              <span style={{color:'var(--text-2)'}}>{c.name}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

Object.assign(window,{ExpensesScreen, ExpenseCategoriesScreen});

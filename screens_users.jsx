// ============ User Management: Users · Roles · Permissions ============

// ---------- USERS ----------
function UsersScreen({go}){
  const [q,setQ]=useState('');
  const [role,setRole]=useState('all');
  const [add,setAdd]=useState(false);
  const roles=['all',...ROLES.map(r=>r.name)];
  const list=USERS.filter(u=>(role==='all'||u.role===role)&&
    (u.name.toLowerCase().includes(q.toLowerCase())||u.email.toLowerCase().includes(q.toLowerCase())));
  const statusTone={active:'green',invited:'amber',suspended:'rose'};

  return (
    <div className="fade-up">
      <PageHeader sub="User Management" title="Users" icon="users">
        <Button variant="ghost" icon="download" size="md">Export</Button>
        <Button variant="primary" icon="plus" onClick={()=>setAdd(true)}>Invite User</Button>
      </PageHeader>

      <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:16,marginBottom:18}}>
        <Stat label="Total Users" value={USERS.length} icon="users" tone="accent"/>
        <Stat label="Active" value={USERS.filter(u=>u.status==='active').length} icon="check" tone="green"/>
        <Stat label="Pending Invites" value={USERS.filter(u=>u.status==='invited').length} icon="mail" tone="amber"/>
        <Stat label="Roles" value={ROLES.length} icon="shield" tone="violet"/>
      </div>

      <Card pad={0}>
        <div style={{padding:'14px 18px',display:'flex',gap:12,alignItems:'center',borderBottom:'1px solid var(--line)',flexWrap:'wrap'}}>
          <div style={{position:'relative',flex:1,minWidth:200,maxWidth:320}}>
            <span style={{position:'absolute',left:12,top:'50%',transform:'translateY(-50%)',color:'var(--text-4)'}}><Icon name="search" size={16}/></span>
            <Input placeholder="Search users…" value={q} onChange={e=>setQ(e.target.value)} style={{paddingLeft:36}}/>
          </div>
          <Select value={role} onChange={e=>setRole(e.target.value)} style={{width:180}}>
            {roles.map(r=><option key={r} value={r}>{r==='all'?'All roles':r}</option>)}
          </Select>
        </div>

        <table style={{width:'100%',borderCollapse:'collapse'}}>
          <thead>
            <tr style={{textAlign:'left'}}>
              {['User','Role','Projects','Status','Last active',''].map((h,i)=>(
                <th key={i} style={{padding:'12px 18px',fontSize:11,fontWeight:700,color:'var(--text-4)',
                  textTransform:'uppercase',letterSpacing:'.07em',borderBottom:'1px solid var(--line)'}}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {list.map(u=>{
              const r=ROLES.find(x=>x.id===u.roleId);
              return (
                <tr key={u.id} style={{transition:'background .15s'}}
                  onMouseEnter={e=>e.currentTarget.style.background='var(--surface-2)'}
                  onMouseLeave={e=>e.currentTarget.style.background='transparent'}>
                  <td style={{padding:'12px 18px',borderBottom:'1px solid var(--line-soft)'}}>
                    <div style={{display:'flex',alignItems:'center',gap:12}}>
                      <Avatar name={u.name} size={36}/>
                      <div>
                        <div style={{fontWeight:600,fontSize:13.5}}>{u.name}</div>
                        <div style={{fontSize:12,color:'var(--text-3)'}}>{u.email}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{padding:'12px 18px',borderBottom:'1px solid var(--line-soft)'}}>
                    <span style={{display:'inline-flex',alignItems:'center',gap:7,fontSize:13,fontWeight:600}}>
                      <span style={{width:8,height:8,borderRadius:99,background:r?r.color:'var(--text-4)'}}></span>{u.role}</span>
                  </td>
                  <td style={{padding:'12px 18px',borderBottom:'1px solid var(--line-soft)',fontSize:12.5,color:'var(--text-2)',fontFamily:'var(--f-mono)'}}>{u.projects}</td>
                  <td style={{padding:'12px 18px',borderBottom:'1px solid var(--line-soft)'}}>
                    <Badge tone={statusTone[u.status]} style={{textTransform:'capitalize'}}>{u.status}</Badge>
                  </td>
                  <td style={{padding:'12px 18px',borderBottom:'1px solid var(--line-soft)',fontSize:12.5,color:'var(--text-3)'}}>{u.last}</td>
                  <td style={{padding:'12px 18px',borderBottom:'1px solid var(--line-soft)',textAlign:'right'}}>
                    <button style={{width:30,height:30,borderRadius:7,color:'var(--text-3)'}}
                      onMouseEnter={e=>e.currentTarget.style.background='var(--surface-3)'}
                      onMouseLeave={e=>e.currentTarget.style.background='transparent'}><Icon name="dots" size={16}/></button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </Card>

      <Sheet open={add} onClose={()=>setAdd(false)} sub="User Management" title="Invite User"
        footer={<><Button variant="ghost" onClick={()=>setAdd(false)}>Cancel</Button><Button variant="primary" icon="mail" onClick={()=>setAdd(false)}>Send Invite</Button></>}>
        <Field label="Full Name" required><Input placeholder="e.g. Ali Hamza"/></Field>
        <Field label="Email Address" required><Input placeholder="name@horizonbuild.pk"/></Field>
        <Field label="Assign Role" required>
          <Select>{ROLES.map(r=><option key={r.id}>{r.name}</option>)}</Select>
        </Field>
        <Field label="Project Access" hint="Leave blank for all projects">
          <Select><option>All projects</option>{PROJECTS.map(p=><option key={p.id}>{p.name}</option>)}</Select>
        </Field>
        <div style={{padding:'14px 16px',background:'var(--accent-soft)',border:'1px solid var(--accent-line)',borderRadius:10,
          display:'flex',gap:11,fontSize:12.5,color:'var(--text-2)'}}>
          <Icon name="mail" size={17} style={{color:'var(--accent)',flexShrink:0}}/>
          An invitation email with a setup link will be sent. The user appears as <b style={{margin:'0 3px'}}>Invited</b> until they activate.
        </div>
      </Sheet>
    </div>
  );
}

// ---------- ROLES ----------
function RolesScreen({go}){
  return (
    <div className="fade-up">
      <PageHeader sub="User Management" title="Roles" icon="shield">
        <Button variant="primary" icon="plus">New Role</Button>
      </PageHeader>

      <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:16}}>
        {ROLES.map(r=>{
          const perms=PERMS[r.id];
          const granted=MODULES.filter(m=>perms[m] && perms[m].some(x=>x)).length;
          return (
            <Card key={r.id} hover>
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:14}}>
                <div style={{width:42,height:42,borderRadius:11,background:r.color+'1f',border:'1px solid '+r.color+'55',
                  color:r.color,display:'flex',alignItems:'center',justifyContent:'center'}}>
                  <Icon name="shield" size={20}/></div>
                {r.system && <Badge tone="neutral">System</Badge>}
              </div>
              <h3 style={{fontSize:16,marginBottom:6}}>{r.name}</h3>
              <p style={{fontSize:12.5,color:'var(--text-3)',lineHeight:1.55,marginBottom:16,minHeight:38}}>{r.desc}</p>
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',paddingTop:14,borderTop:'1px solid var(--line)'}}>
                <div style={{display:'flex',alignItems:'center',gap:8}}>
                  <div style={{display:'flex'}}>
                    {Array.from({length:Math.min(r.users,3)}).map((_,i)=>(
                      <div key={i} style={{width:24,height:24,borderRadius:7,background:'var(--surface-3)',
                        border:'2px solid var(--surface)',marginLeft:i?-8:0,fontSize:10,fontWeight:700,
                        display:'flex',alignItems:'center',justifyContent:'center',color:'var(--text-3)'}}>
                        {String.fromCharCode(65+i)}</div>
                    ))}
                  </div>
                  <span style={{fontSize:12.5,color:'var(--text-2)',fontWeight:600}}>{r.users} users</span>
                </div>
                <span style={{fontSize:12,color:'var(--text-4)'}}>{granted}/{MODULES.length} modules</span>
              </div>
              <Button variant="ghost" full icon="key" style={{marginTop:14}} onClick={()=>go('permissions',{role:r.id})}>Edit Permissions</Button>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

// ---------- PERMISSIONS ----------
function PermissionsScreen({go, role}){
  const [active,setActive]=useState(role||ROLES[0].id);
  const [perms,setPerms]=useState(()=>JSON.parse(JSON.stringify(PERMS)));
  const r=ROLES.find(x=>x.id===active);
  const toggle=(m,ai)=>{
    if(r.system) return;
    setPerms(p=>{
      const next=JSON.parse(JSON.stringify(p));
      next[active][m][ai]=next[active][m][ai]?0:1;
      return next;
    });
  };
  const cur=perms[active];

  return (
    <div className="fade-up">
      <PageHeader sub="User Management" title="Permissions" icon="key">
        <Button variant="ghost" size="md">Reset</Button>
        <Button variant="primary" icon="check">Save Changes</Button>
      </PageHeader>

      <div style={{display:'grid',gridTemplateColumns:'240px 1fr',gap:16,alignItems:'start'}}>
        {/* role list */}
        <Card pad={8}>
          {ROLES.map(role=>(
            <button key={role.id} onClick={()=>setActive(role.id)} style={{width:'100%',display:'flex',alignItems:'center',gap:11,
              padding:'11px 12px',borderRadius:9,textAlign:'left',transition:'all .15s',marginBottom:2,
              background: active===role.id?'var(--accent-soft)':'transparent'}}
              onMouseEnter={e=>{if(active!==role.id)e.currentTarget.style.background='var(--surface-2)';}}
              onMouseLeave={e=>{if(active!==role.id)e.currentTarget.style.background='transparent';}}>
              <span style={{width:9,height:9,borderRadius:99,background:role.color,flexShrink:0}}></span>
              <div style={{flex:1,minWidth:0}}>
                <div style={{fontSize:13,fontWeight:600,color:active===role.id?'var(--text)':'var(--text-2)'}}>{role.name}</div>
                <div style={{fontSize:11,color:'var(--text-4)'}}>{role.users} users</div>
              </div>
              {active===role.id && <Icon name="chevR" size={15} style={{color:'var(--accent)'}}/>}
            </button>
          ))}
        </Card>

        {/* matrix */}
        <Card pad={0}>
          <div style={{padding:'18px 20px',borderBottom:'1px solid var(--line)',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
            <div style={{display:'flex',alignItems:'center',gap:11}}>
              <span style={{width:34,height:34,borderRadius:9,background:r.color+'1f',border:'1px solid '+r.color+'55',
                color:r.color,display:'flex',alignItems:'center',justifyContent:'center'}}><Icon name="shield" size={17}/></span>
              <div>
                <h3 style={{fontSize:16}}>{r.name}</h3>
                <div style={{fontSize:12,color:'var(--text-3)'}}>{r.desc}</div>
              </div>
            </div>
            {r.system && <Badge tone="amber">Locked · system role</Badge>}
          </div>

          <table style={{width:'100%',borderCollapse:'collapse'}}>
            <thead>
              <tr>
                <th style={{padding:'12px 20px',textAlign:'left',fontSize:11,fontWeight:700,color:'var(--text-4)',
                  textTransform:'uppercase',letterSpacing:'.07em',borderBottom:'1px solid var(--line)'}}>Module</th>
                {ACTIONS.map(a=>(
                  <th key={a} style={{padding:'12px 8px',width:90,fontSize:11,fontWeight:700,color:'var(--text-4)',
                    textTransform:'uppercase',letterSpacing:'.05em',borderBottom:'1px solid var(--line)'}}>{a}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {MODULES.map(m=>(
                <tr key={m}>
                  <td style={{padding:'13px 20px',borderBottom:'1px solid var(--line-soft)',fontSize:13.5,fontWeight:600}}>{m}</td>
                  {ACTIONS.map((a,ai)=>(
                    <td key={a} style={{padding:'13px 8px',textAlign:'center',borderBottom:'1px solid var(--line-soft)'}}>
                      <Toggle on={!!cur[m][ai]} disabled={r.system} onClick={()=>toggle(m,ai)} color={r.color}/>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      </div>
    </div>
  );
}

function Toggle({on, onClick, disabled, color='var(--accent)'}){
  return (
    <button onClick={onClick} disabled={disabled} style={{width:38,height:22,borderRadius:99,position:'relative',
      background: on?color:'var(--surface-3)', border:'1px solid '+(on?color:'var(--line-2)'),
      transition:'all .18s ease', cursor:disabled?'not-allowed':'pointer', opacity:disabled?.55:1}}>
      <span style={{position:'absolute',top:2,left: on?18:2,width:16,height:16,borderRadius:99,
        background:'#fff',transition:'left .18s cubic-bezier(.16,1,.3,1)',boxShadow:'0 1px 3px rgba(0,0,0,.4)'}}></span>
    </button>
  );
}

Object.assign(window,{UsersScreen, RolesScreen, PermissionsScreen, Toggle});

// ============ Sidebar navigation (3 style variations) ============

const NAV_SECTIONS = [
  {title:null, items:[
    {id:'dashboard', label:'Dashboard', icon:'grid'},
    {id:'projects', label:'Projects', icon:'building', badge:'POS'},
  ]},
  {title:'Sales', items:[
    {id:'customers', label:'Customers', icon:'users'},
  ]},
  {title:'User Management', items:[
    {id:'users', label:'Users', icon:'users'},
    {id:'roles', label:'Roles', icon:'shield'},
    {id:'permissions', label:'Permissions', icon:'key'},
  ]},
  {title:'Expenses', items:[
    {id:'expenses', label:'Expenses', icon:'receipt'},
    {id:'expense-cats', label:'Categories', icon:'tag'},
  ]},
];

function Brand({compact}){
  return (
    <div style={{display:'flex',alignItems:'center',gap:12,padding: compact?'0':'0 4px'}}>
      <div style={{width:38,height:38,borderRadius:11,flexShrink:0,position:'relative',
        background:'linear-gradient(140deg,#3b82f6,#1d4ed8)',
        boxShadow:'0 4px 14px rgba(59,130,246,.4),0 1px 0 rgba(255,255,255,.25) inset',
        display:'flex',alignItems:'center',justifyContent:'center'}}>
        <Icon name="layers" size={20} stroke={2.3} style={{color:'#fff'}}/>
      </div>
      {!compact &&
        <div style={{lineHeight:1.1}}>
          <div style={{fontFamily:'var(--f-display)',fontWeight:700,fontSize:16,letterSpacing:'-.01em'}}>Horizon<span style={{color:'var(--accent)'}}>Build</span></div>
          <div style={{fontSize:10.5,color:'var(--text-4)',fontWeight:600,letterSpacing:'.1em',textTransform:'uppercase',marginTop:1}}>Construction CRM 1.2</div>
        </div>}
    </div>
  );
}

function NavItem({item, active, onClick, navStyle}){
  const [hover,setHover]=useState(false);
  const compact = navStyle==='compact';
  const grouped = navStyle==='grouped';
  const showFlyout = compact && hover;

  let bg='transparent', color='var(--text-3)', extra={};
  if(active){
    color='var(--text)';
    if(grouped){ bg='var(--accent)'; color='#fff'; extra={boxShadow:'0 4px 12px rgba(59,130,246,.35)'}; }
    else { bg='var(--accent-soft)'; color='#fff'; }
  } else if(hover){ bg='var(--surface-2)'; color='var(--text)'; }

  return (
    <div style={{position:'relative'}} onMouseEnter={()=>setHover(true)} onMouseLeave={()=>setHover(false)}>
      <button onClick={onClick} style={{
        width:'100%',display:'flex',alignItems:'center',gap:12,
        padding: compact?'11px':'10px 12px', justifyContent: compact?'center':'flex-start',
        borderRadius: grouped?10:'var(--r-sm)', background:bg, color,
        fontSize:13.5, fontWeight:active?600:500, transition:'all .15s ease',
        position:'relative', ...extra}}>
        {/* active bar (expanded only) */}
        {active && !grouped && !compact &&
          <span style={{position:'absolute',left:-12,top:'50%',transform:'translateY(-50%)',
            width:3,height:18,borderRadius:99,background:'var(--accent)'}}></span>}
        <Icon name={item.icon} size={18} stroke={active?2.3:2} style={{flexShrink:0,
          color: active&&!grouped?'var(--accent)':'inherit'}}/>
        {!compact && <span style={{flex:1,textAlign:'left'}}>{item.label}</span>}
        {!compact && item.badge && <span style={{fontSize:9.5,fontWeight:700,padding:'2px 6px',borderRadius:5,
          background: active?'rgba(255,255,255,.18)':'var(--surface-3)', color: active&&grouped?'#fff':'var(--text-3)',
          letterSpacing:'.06em'}}>{item.badge}</span>}
      </button>
      {showFlyout &&
        <div style={{position:'absolute',left:'calc(100% + 12px)',top:'50%',transform:'translateY(-50%)',
          background:'var(--surface-2)',border:'1px solid var(--line-2)',borderRadius:8,padding:'7px 12px',
          fontSize:13,fontWeight:600,whiteSpace:'nowrap',zIndex:50,boxShadow:'var(--shadow)',
          animation:'slideIn .15s ease both',pointerEvents:'none'}}>
          {item.label}
          {item.badge&&<span style={{marginLeft:8,fontSize:9.5,color:'var(--accent)'}}>{item.badge}</span>}
        </div>}
    </div>
  );
}

function Sidebar({route, go, navStyle, setNavStyle}){
  const compact = navStyle==='compact';
  const grouped = navStyle==='grouped';
  const w = compact ? 'var(--nav-w-compact)' : 'var(--nav-w)';

  return (
    <aside style={{width:w,flexShrink:0,height:'100vh',background:'var(--bg-2)',
      borderRight:'1px solid var(--line)',display:'flex',flexDirection:'column',
      transition:'width .25s cubic-bezier(.16,1,.3,1)',position:'relative',zIndex:30}}>
      {/* brand */}
      <div style={{padding: compact?'20px 0':'22px 20px',display:'flex',justifyContent:'center',
        alignItems:'center',borderBottom:'1px solid var(--line-soft)'}}>
        <Brand compact={compact}/>
      </div>

      {/* nav */}
      <nav style={{flex:1,overflowY:'auto',padding: compact?'14px 14px':'16px 16px',
        display:'flex',flexDirection:'column',gap: grouped?14:6}}>
        {NAV_SECTIONS.map((sec,si)=>(
          <div key={si} style={ grouped&&sec.title ? {
            background:'var(--surface)',border:'1px solid var(--line)',borderRadius:'var(--r-lg)',padding:'10px'
          } : {}}>
            {sec.title && !compact &&
              <div style={{fontSize:10.5,fontWeight:700,color:'var(--text-4)',textTransform:'uppercase',
                letterSpacing:'.12em',padding: grouped?'2px 8px 8px':'14px 12px 6px'}}>{sec.title}</div>}
            {sec.title && compact && si>0 &&
              <div style={{height:1,background:'var(--line)',margin:'10px 6px'}}></div>}
            <div style={{display:'flex',flexDirection:'column',gap:3}}>
              {sec.items.map(it=>(
                <NavItem key={it.id} item={it} navStyle={navStyle}
                  active={route.screen===it.id || (it.id==='projects'&&['projects','project','add-project'].includes(route.screen)) || (it.id==='customers'&&['customers','customer'].includes(route.screen)) || (it.id==='expenses'&&route.screen==='expenses')}
                  onClick={()=>go(it.id)}/>
              ))}
            </div>
          </div>
        ))}
      </nav>

      {/* nav-style switcher */}
      <div style={{padding: compact?'10px':'12px 16px',borderTop:'1px solid var(--line-soft)'}}>
        {!compact &&
          <div style={{fontSize:9.5,fontWeight:700,color:'var(--text-4)',textTransform:'uppercase',
            letterSpacing:'.12em',marginBottom:8,display:'flex',alignItems:'center',gap:6}}>
            <Icon name="sliders" size={12}/> Nav style</div>}
        <div style={{display:'flex',gap:4,flexDirection: compact?'column':'row'}}>
          {[{k:'expanded',i:'grid'},{k:'grouped',i:'layers'},{k:'compact',i:'chevL'}].map(o=>(
            <button key={o.k} onClick={()=>setNavStyle(o.k)} title={o.k}
              style={{flex:1,padding:'7px',borderRadius:7,display:'flex',alignItems:'center',justifyContent:'center',
                gap:6,fontSize:11,fontWeight:600,textTransform:'capitalize',
                background: navStyle===o.k?'var(--accent-soft)':'var(--surface-2)',
                color: navStyle===o.k?'var(--accent)':'var(--text-3)',
                border:'1px solid '+(navStyle===o.k?'var(--accent-line)':'var(--line)')}}>
              <Icon name={o.i} size={13}/>{!compact && o.k}
            </button>
          ))}
        </div>
      </div>

      {/* user footer */}
      <div style={{padding: compact?'12px 0':'14px 16px',borderTop:'1px solid var(--line-soft)',
        display:'flex',alignItems:'center',gap:11,justifyContent: compact?'center':'flex-start'}}>
        <Avatar name="Hamza Sheikh" size={compact?34:38}/>
        {!compact &&
          <div style={{flex:1,minWidth:0}}>
            <div style={{fontSize:13,fontWeight:600,whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>Hamza Sheikh</div>
            <div style={{fontSize:11,color:'var(--text-4)'}}>Super Admin</div>
          </div>}
        {!compact &&
          <button style={{width:30,height:30,borderRadius:7,color:'var(--text-3)',display:'flex',
            alignItems:'center',justifyContent:'center'}} title="Sign out">
            <Icon name="logout" size={16}/>
          </button>}
      </div>
    </aside>
  );
}

window.Sidebar = Sidebar;

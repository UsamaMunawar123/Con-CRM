// ============ App shell: routing + topbar + mount ============

const TITLES={
  dashboard:['Dashboard','Portfolio overview'],
  projects:['Projects','Project POS'],
  project:['Project','Project POS'],
  'add-project':['Add Project','Project POS'],
  customers:['Customers','Sales CRM'],
  customer:['Customer','Sales CRM'],
  users:['Users','User Management'],
  roles:['Roles','User Management'],
  permissions:['Permissions','User Management'],
  expenses:['Expenses','Finance'],
  'expense-cats':['Categories','Finance'],
};

function Topbar({route, go}){
  const [title,sub]=TITLES[route.screen]||['',''];
  return (
    <header style={{height:64,flexShrink:0,borderBottom:'1px solid var(--line)',background:'var(--bg-2)',
      display:'flex',alignItems:'center',gap:18,padding:'0 28px',position:'sticky',top:0,zIndex:20}}>
      {/* breadcrumb */}
      <div style={{display:'flex',alignItems:'center',gap:9,minWidth:0}}>
        <span style={{fontSize:12.5,color:'var(--text-4)',fontWeight:600}}>{sub}</span>
        <Icon name="chevR" size={13} style={{color:'var(--text-4)'}}/>
        <span style={{fontSize:13.5,color:'var(--text)',fontWeight:600}}>{title}</span>
      </div>

      {/* global search */}
      <div style={{position:'relative',flex:1,maxWidth:420,marginLeft:'auto'}}>
        <span style={{position:'absolute',left:13,top:'50%',transform:'translateY(-50%)',color:'var(--text-4)'}}><Icon name="search" size={16}/></span>
        <input placeholder="Search units, customers, expenses…" style={{width:'100%',padding:'9px 13px 9px 38px',
          background:'var(--surface)',border:'1px solid var(--line)',borderRadius:'var(--r-sm)',color:'var(--text)',
          fontSize:13,outline:'none'}} onFocus={e=>e.target.style.borderColor='var(--accent-line)'} onBlur={e=>e.target.style.borderColor='var(--line)'}/>
        <kbd style={{position:'absolute',right:10,top:'50%',transform:'translateY(-50%)',fontSize:11,
          color:'var(--text-4)',background:'var(--surface-2)',border:'1px solid var(--line-2)',borderRadius:5,
          padding:'2px 6px',fontFamily:'var(--f-mono)'}}>⌘K</kbd>
      </div>

      {/* actions */}
      <div style={{display:'flex',alignItems:'center',gap:10}}>
        <button style={{width:38,height:38,borderRadius:9,background:'var(--surface)',border:'1px solid var(--line)',
          color:'var(--text-2)',display:'flex',alignItems:'center',justifyContent:'center',position:'relative'}}
          onMouseEnter={e=>e.currentTarget.style.background='var(--surface-2)'}
          onMouseLeave={e=>e.currentTarget.style.background='var(--surface)'}>
          <Icon name="bell" size={17}/>
          <span style={{position:'absolute',top:9,right:10,width:7,height:7,borderRadius:99,background:'var(--sold)',
            border:'2px solid var(--bg-2)'}}></span>
        </button>
        <button style={{height:38,padding:'0 14px 0 12px',borderRadius:9,background:'var(--accent-soft)',
          border:'1px solid var(--accent-line)',color:'var(--accent)',display:'flex',alignItems:'center',gap:8,
          fontSize:13,fontWeight:600}} onClick={()=>go('add-project')}>
          <Icon name="plus" size={16}/> Quick Add
        </button>
      </div>
    </header>
  );
}

function App(){
  const [route,setRoute]=useState({screen:'dashboard',params:{}});
  const [navStyle,setNavStyle]=useState(()=>localStorage.getItem('crm-nav')||'expanded');
  const scrollRef=useRef(null);

  const go=(screen,params={})=>{ setRoute({screen,params}); };
  useEffect(()=>{ localStorage.setItem('crm-nav',navStyle); },[navStyle]);
  useEffect(()=>{ if(scrollRef.current) scrollRef.current.scrollTop=0; },[route]);

  let screen;
  switch(route.screen){
    case 'dashboard': screen=<DashboardScreen go={go}/>; break;
    case 'projects': screen=<ProjectsScreen go={go}/>; break;
    case 'project': screen=<ProjectDetailScreen id={route.params.id} go={go}/>; break;
    case 'add-project': screen=<AddProjectScreen go={go}/>; break;
    case 'users': screen=<UsersScreen go={go}/>; break;
    case 'roles': screen=<RolesScreen go={go}/>; break;
    case 'permissions': screen=<PermissionsScreen go={go} role={route.params.role}/>; break;
    case 'customers': screen=<CustomersScreen go={go}/>; break;
    case 'customer': screen=<CustomerDetailScreen id={route.params.id} go={go}/>; break;
    case 'expenses': screen=<ExpensesScreen go={go}/>; break;
    case 'expense-cats': screen=<ExpenseCategoriesScreen go={go}/>; break;
    default: screen=<DashboardScreen go={go}/>;
  }

  return (
    <div style={{display:'flex',height:'100vh',overflow:'hidden'}}>
      <Sidebar route={route} go={go} navStyle={navStyle} setNavStyle={setNavStyle}/>
      <div style={{flex:1,display:'flex',flexDirection:'column',minWidth:0}}>
        <Topbar route={route} go={go}/>
        <main ref={scrollRef} style={{flex:1,overflowY:'auto',padding:'28px',background:'var(--bg)'}}>
          <div style={{maxWidth:1280,margin:'0 auto'}}>
            {screen}
          </div>
        </main>
      </div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App/>);

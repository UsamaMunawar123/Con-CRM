// ============ Shared UI primitives ============
const { useState, useEffect, useRef, useMemo } = React;

// ---- Icon library (simple stroke icons) ----
const ICONS = {
  grid:'M3 3h7v7H3zM14 3h7v7h-7zM14 14h7v7h-7zM3 14h7v7H3z',
  building:'M3 21h18M5 21V5a1 1 0 0 1 1-1h7a1 1 0 0 1 1 1v16M14 21V9h4a1 1 0 0 1 1 1v11M8 7h2M8 11h2M8 15h2',
  users:'M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75',
  shield:'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z',
  key:'M21 2l-2 2m-7.5 7.5a4.5 4.5 0 1 1-6.36 6.36 4.5 4.5 0 0 1 6.36-6.36zm0 0L15 8l3 3 3-3-3-3',
  receipt:'M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1zM8 7h8M8 11h8M8 15h5',
  tag:'M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82zM7 7h.01',
  wallet:'M3 7a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2zM16 12h.01M3 9h18',
  chart:'M3 3v18h18M7 14l3-3 3 3 5-6',
  plus:'M12 5v14M5 12h14',
  search:'M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16zM21 21l-4.35-4.35',
  bell:'M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 0 1-3.46 0',
  chevR:'M9 18l6-6-6-6',
  chevL:'M15 18l-6-6 6-6',
  chevD:'M6 9l6 6 6-6',
  arrowL:'M19 12H5M12 19l-7-7 7-7',
  check:'M20 6L9 17l-5-5',
  x:'M18 6L6 18M6 6l12 12',
  dots:'M12 13a1 1 0 1 0 0-2 1 1 0 0 0 0 2zM19 13a1 1 0 1 0 0-2 1 1 0 0 0 0 2zM5 13a1 1 0 1 0 0-2 1 1 0 0 0 0 2z',
  filter:'M22 3H2l8 9.46V19l4 2v-8.54z',
  pin:'M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0zM12 13a3 3 0 1 0 0-6 3 3 0 0 0 0 6z',
  calendar:'M8 2v4M16 2v4M3 10h18M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z',
  layers:'M12 2l9 5-9 5-9-5 9-5zM3 12l9 5 9-5M3 17l9 5 9-5',
  edit:'M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7M18.5 2.5a2.12 2.12 0 0 1 3 3L12 15l-4 1 1-4z',
  trash:'M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6',
  download:'M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3',
  logout:'M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9',
  cube:'M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16zM3.27 6.96L12 12l8.73-5.04M12 22V12',
  percent:'M19 5L5 19M6.5 9a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5zM17.5 20a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z',
  mega:'M3 11l18-5v12L3 14v-3zM11.6 16.8a3 3 0 1 1-5.8-1.6',
  plug:'M9 2v6M15 2v6M6 8h12v3a6 6 0 0 1-12 0zM12 17v5',
  bolt:'M13 2L3 14h9l-1 8 10-12h-9z',
  home:'M3 9.5L12 3l9 6.5V21a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1z',
  trend:'M23 6l-9.5 9.5-5-5L1 18M17 6h6v6',
  clock:'M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20zM12 6v6l4 2',
  mail:'M4 4h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2zM22 6l-10 7L2 6',
  sliders:'M4 21v-7M4 10V3M12 21v-9M12 8V3M20 21v-5M20 12V3M1 14h6M9 8h6M17 16h6',
};
function Icon({name, size=18, stroke=2, fill='none', style}){
  const d = ICONS[name] || ICONS.grid;
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke="currentColor"
      strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round" style={style} aria-hidden="true">
      {d.split('M').filter(Boolean).map((seg,i)=><path key={i} d={'M'+seg} />)}
    </svg>
  );
}

// ---- Status pill ----
function StatusPill({status, size='md'}){
  const s = STATUS[status]; if(!s) return null;
  const pad = size==='sm' ? '2px 8px' : '3px 10px';
  return (
    <span style={{display:'inline-flex',alignItems:'center',gap:6,padding:pad,borderRadius:99,
      background:s.bg, border:'1px solid '+s.line, color:s.color, fontSize:size==='sm'?11:12, fontWeight:600,
      lineHeight:1.2, whiteSpace:'nowrap'}}>
      <span style={{width:6,height:6,borderRadius:99,background:s.color}}></span>{s.label}
    </span>
  );
}

// ---- Generic badge ----
function Badge({children, tone='neutral', style}){
  const tones={
    neutral:{bg:'var(--surface-2)',color:'var(--text-2)',line:'var(--line-2)'},
    accent:{bg:'var(--accent-soft)',color:'var(--accent)',line:'var(--accent-line)'},
    green:{bg:'var(--open-bg)',color:'var(--open)',line:'var(--open-line)'},
    amber:{bg:'var(--booked-bg)',color:'var(--booked)',line:'var(--booked-line)'},
    rose:{bg:'var(--sold-bg)',color:'var(--sold)',line:'var(--sold-line)'},
  };
  const t=tones[tone]||tones.neutral;
  return <span style={{display:'inline-flex',alignItems:'center',gap:5,padding:'2px 8px',borderRadius:6,
    background:t.bg,color:t.color,border:'1px solid '+t.line,fontSize:11,fontWeight:600,...style}}>{children}</span>;
}

// ---- Button ----
function Button({children, variant='primary', size='md', icon, onClick, style, type, full}){
  const base={display:'inline-flex',alignItems:'center',justifyContent:'center',gap:8,
    borderRadius:'var(--r-sm)',fontWeight:600,fontFamily:'var(--f-ui)',transition:'all .15s ease',
    whiteSpace:'nowrap', width: full?'100%':'auto',
    padding: size==='sm'?'7px 12px':(size==='lg'?'12px 20px':'9px 16px'),
    fontSize: size==='sm'?12.5:14};
  const variants={
    primary:{background:'var(--accent)',color:'#fff',boxShadow:'0 1px 0 rgba(255,255,255,.12) inset, 0 6px 16px rgba(59,130,246,.28)'},
    soft:{background:'var(--accent-soft)',color:'var(--accent)',border:'1px solid var(--accent-line)'},
    ghost:{background:'var(--surface-2)',color:'var(--text)',border:'1px solid var(--line-2)'},
    bare:{background:'transparent',color:'var(--text-2)'},
    danger:{background:'var(--sold-bg)',color:'var(--sold)',border:'1px solid var(--sold-line)'},
  };
  const [hover,setHover]=useState(false);
  const hv = hover ? (variant==='primary'?{filter:'brightness(1.08)'}:{background:'var(--surface-3)'}) : {};
  return (
    <button type={type||'button'} onClick={onClick} onMouseEnter={()=>setHover(true)} onMouseLeave={()=>setHover(false)}
      style={{...base,...variants[variant],...(variant!=='primary'&&hover?hv:{}),...(variant==='primary'&&hover?{filter:'brightness(1.08)'}:{}),...style}}>
      {icon && <Icon name={icon} size={size==='sm'?14:16} stroke={2.2} />}
      {children}
    </button>
  );
}

// ---- Card ----
function Card({children, style, pad=20, hover, onClick, className}){
  const [h,setH]=useState(false);
  return (
    <div onClick={onClick} className={className}
      onMouseEnter={()=>hover&&setH(true)} onMouseLeave={()=>hover&&setH(false)}
      style={{background:'var(--surface)',border:'1px solid var(--line)',borderRadius:'var(--r-lg)',
        padding:pad, transition:'all .2s ease', cursor:onClick?'pointer':'default',
        ...(h?{borderColor:'var(--line-2)',transform:'translateY(-2px)',boxShadow:'var(--shadow)'}:{}),
        ...style}}>
      {children}
    </div>
  );
}

// ---- Avatar ----
const AV_COLORS=['#3b82f6','#34d399','#fbbf24','#a78bfa','#fb7185','#22d3ee','#f97316'];
function Avatar({name, size=34}){
  const initials=(name||'?').split(' ').map(w=>w[0]).slice(0,2).join('').toUpperCase();
  let h=0; for(const ch of (name||'')) h=(h*31+ch.charCodeAt(0))>>>0;
  const c=AV_COLORS[h%AV_COLORS.length];
  return (
    <div style={{width:size,height:size,borderRadius:size>40?12:9,flexShrink:0,
      background:'linear-gradient(135deg,'+c+'33,'+c+'18)',border:'1px solid '+c+'55',
      color:c,display:'flex',alignItems:'center',justifyContent:'center',
      fontWeight:700,fontSize:size*0.36,fontFamily:'var(--f-display)'}}>{initials}</div>
  );
}

// ---- Progress bar ----
function Progress({value, color='var(--accent)', height=7, track='var(--surface-3)'}){
  return (
    <div style={{height,background:track,borderRadius:99,overflow:'hidden',width:'100%'}}>
      <div style={{height:'100%',width:Math.min(100,value)+'%',background:color,borderRadius:99,
        transition:'width .6s cubic-bezier(.16,1,.3,1)'}}></div>
    </div>
  );
}

// ---- Segmented control ----
function Segmented({options, value, onChange, size='md'}){
  return (
    <div style={{display:'inline-flex',background:'var(--bg-2)',border:'1px solid var(--line)',
      borderRadius:'var(--r-sm)',padding:3,gap:2}}>
      {options.map(o=>{
        const v=o.value??o, label=o.label??o;
        const active=v===value;
        return (
          <button key={v} onClick={()=>onChange(v)} style={{
            padding:size==='sm'?'5px 10px':'6px 14px',borderRadius:5,fontSize:size==='sm'?12:13,fontWeight:600,
            background:active?'var(--surface-2)':'transparent',
            color:active?'var(--text)':'var(--text-3)',
            border:active?'1px solid var(--line-2)':'1px solid transparent',
            transition:'all .15s ease',display:'inline-flex',alignItems:'center',gap:6}}>
            {o.icon&&<Icon name={o.icon} size={14}/>}{label}
          </button>
        );
      })}
    </div>
  );
}

// ---- Page header ----
function PageHeader({title, sub, children, icon}){
  return (
    <div style={{display:'flex',alignItems:'flex-end',justifyContent:'space-between',gap:20,marginBottom:24,flexWrap:'wrap'}}>
      <div>
        {sub && <div style={{color:'var(--text-3)',fontSize:13,fontWeight:600,marginBottom:6,
          textTransform:'uppercase',letterSpacing:'.08em'}}>{sub}</div>}
        <h1 style={{fontSize:28,fontWeight:600,display:'flex',alignItems:'center',gap:12}}>
          {icon&&<span style={{color:'var(--accent)'}}><Icon name={icon} size={26} stroke={2}/></span>}
          {title}
        </h1>
      </div>
      <div style={{display:'flex',gap:10,alignItems:'center'}}>{children}</div>
    </div>
  );
}

// ---- Stat card ----
function Stat({label, value, sub, icon, tone='accent', trend}){
  const colors={accent:'var(--accent)',green:'var(--open)',amber:'var(--booked)',rose:'var(--sold)',violet:'var(--token)'};
  const c=colors[tone]||colors.accent;
  return (
    <Card pad={18} style={{position:'relative',overflow:'hidden'}}>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:14}}>
        <div style={{color:'var(--text-3)',fontSize:12.5,fontWeight:600,textTransform:'uppercase',letterSpacing:'.06em'}}>{label}</div>
        <div style={{width:34,height:34,borderRadius:9,background:c+'1f',border:'1px solid '+c+'44',
          color:c,display:'flex',alignItems:'center',justifyContent:'center'}}><Icon name={icon} size={17}/></div>
      </div>
      <div style={{fontSize:26,fontWeight:700,fontFamily:'var(--f-display)',lineHeight:1.1}}>{value}</div>
      {sub && <div style={{marginTop:7,fontSize:12.5,color:'var(--text-3)',display:'flex',alignItems:'center',gap:6}}>
        {trend!=null && <span style={{color:trend>=0?'var(--open)':'var(--sold)',fontWeight:600,
          display:'inline-flex',alignItems:'center',gap:3}}>
          <Icon name="trend" size={13}/>{trend>=0?'+':''}{trend}%</span>}
        {sub}
      </div>}
    </Card>
  );
}

// ---- Modal / side sheet ----
function Sheet({open, onClose, title, sub, children, footer, width=560}){
  useEffect(()=>{
    function esc(e){if(e.key==='Escape')onClose();}
    if(open)document.addEventListener('keydown',esc);
    return ()=>document.removeEventListener('keydown',esc);
  },[open,onClose]);
  if(!open) return null;
  return (
    <div onClick={onClose} style={{position:'fixed',inset:0,zIndex:200,background:'rgba(5,7,12,.62)',
      backdropFilter:'blur(3px)',display:'flex',justifyContent:'flex-end',animation:'fadeIn .2s ease'}}>
      <div onClick={e=>e.stopPropagation()} style={{width,maxWidth:'94vw',height:'100%',background:'var(--bg-2)',
        borderLeft:'1px solid var(--line-2)',display:'flex',flexDirection:'column',animation:'sheetIn .3s cubic-bezier(.16,1,.3,1) both',
        boxShadow:'var(--shadow-lg)'}}>
        <div style={{padding:'20px 24px',borderBottom:'1px solid var(--line)',display:'flex',
          justifyContent:'space-between',alignItems:'flex-start',gap:16}}>
          <div>
            {sub&&<div style={{color:'var(--text-3)',fontSize:12,fontWeight:600,textTransform:'uppercase',letterSpacing:'.07em',marginBottom:4}}>{sub}</div>}
            <h2 style={{fontSize:20}}>{title}</h2>
          </div>
          <button onClick={onClose} style={{width:34,height:34,borderRadius:8,background:'var(--surface-2)',
            border:'1px solid var(--line-2)',color:'var(--text-2)',display:'flex',alignItems:'center',justifyContent:'center'}}>
            <Icon name="x" size={17}/>
          </button>
        </div>
        <div style={{flex:1,overflowY:'auto',padding:'24px'}}>{children}</div>
        {footer&&<div style={{padding:'16px 24px',borderTop:'1px solid var(--line)',display:'flex',gap:10,justifyContent:'flex-end',
          background:'var(--surface)'}}>{footer}</div>}
      </div>
    </div>
  );
}

// ---- Field ----
function Field({label, children, hint, required, style}){
  return (
    <div style={{marginBottom:18,...style}}>
      {label&&<label style={{display:'block',fontSize:12.5,fontWeight:600,color:'var(--text-2)',marginBottom:7}}>
        {label}{required&&<span style={{color:'var(--sold)'}}> *</span>}</label>}
      {children}
      {hint&&<div style={{fontSize:11.5,color:'var(--text-4)',marginTop:6}}>{hint}</div>}
    </div>
  );
}
const inputStyle={width:'100%',padding:'10px 13px',background:'var(--bg)',border:'1px solid var(--line-2)',
  borderRadius:'var(--r-sm)',color:'var(--text)',fontSize:13.5,outline:'none',transition:'border .15s'};
function Input(props){
  const [f,setF]=useState(false);
  return <input {...props} onFocus={()=>setF(true)} onBlur={()=>setF(false)}
    style={{...inputStyle,...(f?{borderColor:'var(--accent)',boxShadow:'0 0 0 3px var(--accent-soft)'}:{}),...props.style}}/>;
}
function Select({children, ...props}){
  return <select {...props} style={{...inputStyle,appearance:'none',cursor:'pointer',
    backgroundImage:'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'16\' height=\'16\' fill=\'none\' stroke=\'%237682a0\' stroke-width=\'2\' stroke-linecap=\'round\'%3E%3Cpath d=\'M4 6l4 4 4-4\'/%3E%3C/svg%3E")',
    backgroundRepeat:'no-repeat',backgroundPosition:'right 12px center',paddingRight:34,...props.style}}>{children}</select>;
}

// ---- Empty bar / divider helper ----
function Divider({label, style}){
  return <div style={{display:'flex',alignItems:'center',gap:12,margin:'4px 0',...style}}>
    {label&&<span style={{fontSize:11,fontWeight:700,color:'var(--text-4)',textTransform:'uppercase',letterSpacing:'.1em'}}>{label}</span>}
    <div style={{flex:1,height:1,background:'var(--line)'}}></div>
  </div>;
}

Object.assign(window,{
  Icon, StatusPill, Badge, Button, Card, Avatar, Progress, Segmented,
  PageHeader, Stat, Sheet, Field, Input, Select, Divider, inputStyle,
});

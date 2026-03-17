import { WOLF_IMG } from '../../assets/wolf';

export default function ShieldLogo({size="md",dark=true,centered=false,wolf=true}){
  const tx=dark?"#fff":"#1a1a1a",txS=dark?"#888":"#777";
  const sz={
    xs:{num:24,name:12,sub:7,stripe:5,div:32,gap:8,tag:6,wolf:0},
    sm:{num:36,name:16,sub:8,stripe:7,div:42,gap:10,tag:7,wolf:42},
    md:{num:52,name:22,sub:10,stripe:9,div:56,gap:12,tag:8,wolf:65},
    lg:{num:72,name:30,sub:12,stripe:12,div:68,gap:14,tag:9,wolf:90},
    xl:{num:96,name:40,sub:14,stripe:14,div:84,gap:16,tag:10,wolf:130},
  }[size]||{num:52,name:22,sub:10,stripe:9,div:56,gap:12,tag:8,wolf:65};
  return(
    <div style={{display:"flex",alignItems:"center",justifyContent:centered?"center":"flex-start"}}>
      {wolf&&sz.wolf>0&&<img src={WOLF_IMG} alt="" style={{height:sz.wolf,width:"auto",objectFit:"contain",marginRight:sz.gap*0.4,filter:`drop-shadow(0 4px 12px rgba(0,0,0,${dark?0.6:0.2}))`}}/>}
      <div style={{textAlign:"left"}}>
        <div style={{fontFamily:"'Oswald',sans-serif",fontSize:sz.name,fontWeight:700,lineHeight:1,color:tx,letterSpacing:2,textTransform:"uppercase"}}>СӨХ</div>
        <div style={{fontFamily:"'Rajdhani',sans-serif",fontSize:sz.sub,fontWeight:600,letterSpacing:3,color:"#f59e0b",textTransform:"uppercase",marginTop:2}}>менежмент</div>
      </div>
      {wolf&&sz.wolf>0&&<img src={WOLF_IMG} alt="" style={{height:sz.wolf,width:"auto",objectFit:"contain",marginLeft:sz.gap*0.4,transform:"scaleX(-1)",filter:`drop-shadow(0 4px 12px rgba(0,0,0,${dark?0.6:0.2}))`}}/>}
    </div>
  );
}

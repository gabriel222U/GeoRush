import React, {useEffect, useRef, useState} from "react";
import {createRoot} from "react-dom/client";
import {Loader} from "@googlemaps/js-api-loader";
import {Gamepad2, Trophy, UserCircle, Globe2, Clock3, HelpCircle, ChevronRight, Flame, MapPin, Target, RotateCcw} from "lucide-react";
import "./styles.css";

const API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || "";
const DEFAULT_ROUNDS = 5;

const locations = {
  Monde: [
    {lat:48.8566,lng:2.3522},{lat:51.5074,lng:-0.1278},{lat:40.7128,lng:-74.0060},
    {lat:-33.8688,lng:151.2093},{lat:35.6762,lng:139.6503},{lat:-23.5505,lng:-46.6333},
    {lat:52.52,lng:13.405},{lat:41.9028,lng:12.4964},{lat:59.3293,lng:18.0686},
    {lat:1.3521,lng:103.8198},{lat:-1.2921,lng:36.8219},{lat:19.4326,lng:-99.1332}
  ],
  Afrique: [
    {lat:-1.2921,lng:36.8219},{lat:30.0444,lng:31.2357},{lat:-26.2041,lng:28.0473},
    {lat:14.7167,lng:-17.4677},{lat:-33.9249,lng:18.4241}
  ],
  Amériques: [
    {lat:40.7128,lng:-74.0060},{lat:-23.5505,lng:-46.6333},{lat:19.4326,lng:-99.1332},
    {lat:43.6532,lng:-79.3832},{lat:49.2827,lng:-123.1207},{lat:-34.6037,lng:-58.3816}
  ],
  Asie: [
    {lat:35.6762,lng:139.6503},{lat:1.3521,lng:103.8198},{lat:13.7563,lng:100.5018},
    {lat:25.2048,lng:55.2708},{lat:37.5665,lng:126.9780}
  ],
  Europe: [
    {lat:48.8566,lng:2.3522},{lat:51.5074,lng:-0.1278},{lat:52.52,lng:13.405},
    {lat:41.9028,lng:12.4964},{lat:59.3293,lng:18.0686},{lat:40.4168,lng:-3.7038}
  ],
  Océanie: [
    {lat:-33.8688,lng:151.2093},{lat:-37.8136,lng:144.9631},{lat:-27.4698,lng:153.0251}
  ]
};

function App(){
  const [page,setPage]=useState("play");
  const [continent,setContinent]=useState("Monde");
  const [mode,setMode]=useState(null);
  const [profile,setProfile]=useState(()=>JSON.parse(localStorage.getItem("georush_profile")||'{"name":"Relax","best":0,"games":0,"streak":1}'));
  const saveProfile=(p)=>{setProfile(p);localStorage.setItem("georush_profile",JSON.stringify(p))};

  return <div className="app">
    <main className="content">
      {page==="play" && <Home continent={continent} setContinent={setContinent} onMode={setMode}/>}
      {page==="rank" && <Leaderboard profile={profile}/>}
      {page==="profile" && <Profile profile={profile}/>}
      {mode==="geoguess" && <GeoGuess continent={continent} onExit={()=>setMode(null)} profile={profile} saveProfile={saveProfile}/>}
    </main>
    <nav className="bottom">
      <button className={page==="play"&&!mode?"active":""} onClick={()=>{setPage("play");setMode(null)}}><Gamepad2/><span>JOUER</span></button>
      <button className={page==="rank"&&!mode?"active":""} onClick={()=>{setPage("rank");setMode(null)}}><Trophy/><span>CLASSEMENT</span></button>
      <button className={page==="profile"&&!mode?"active":""} onClick={()=>{setPage("profile");setMode(null)}}><UserCircle/><span>PROFIL</span></button>
    </nav>
  </div>
}

function Home({continent,setContinent,onMode}){
  const continents=Object.keys(locations);
  return <div className="home">
    <div className="hello">Salut</div><h1>Relax</h1>
    <div className="duel"><div><b>MULTIJOUEUR</b><h2>Duel 1v1</h2><p>Défie un ami en temps réel avec un code de room</p><button>JOUER <ChevronRight/></button></div><div className="swords">⚔️</div></div>
    <h3>Continent</h3>
    <div className="chips">{continents.map(c=><button className={continent===c?"selected":""} onClick={()=>setContinent(c)} key={c}>{c}</button>)}</div>
    <h3>Modes solo</h3>
    <ModeCard icon={<HelpCircle/>} title="Classic" subtitle="10 questions QCM" onClick={()=>alert("Mode Classic à ajouter ensuite.")}/>
    <ModeCard cyan icon={<Globe2/>} title="GeoGuess" subtitle="Vrai Street View + carte Google" onClick={()=>onMode("geoguess")}/>
    <ModeCard yellow icon={<Clock3/>} title="Chrono" subtitle="15s par question, 3 vies" onClick={()=>alert("Mode Chrono à ajouter ensuite.")}/>
  </div>
}

function ModeCard({icon,title,subtitle,onClick,cyan,yellow}){
 return <button className={"modecard "+(cyan?"cyan ":"")+(yellow?"yellow":"")} onClick={onClick}><div className="modeicon">{icon}</div><div><h2>{title}</h2><p>{subtitle}</p></div><ChevronRight className="arrow"/></button>
}

function GeoGuess({continent,onExit,profile,saveProfile}){
  const streetRef=useRef(null), mapRef=useRef(null);
  const [round,setRound]=useState(1), [score,setScore]=useState(0), [target,setTarget]=useState(null);
  const [guess,setGuess]=useState(null), [result,setResult]=useState(null), [loading,setLoading]=useState(true);
  const [street,setStreet]=useState(null), [map,setMap]=useState(null);

  useEffect(()=>{startRound()},[round]);

  async function startRound(){
    setLoading(true);setGuess(null);setResult(null);
    const pool=locations[continent]||locations.Monde;
    const p=pool[Math.floor(Math.random()*pool.length)];
    setTarget(p);
    if(!API_KEY){setLoading(false);return}
    try{
      const loader=new Loader({apiKey:API_KEY,version:"weekly"});
      const google=await loader.load();
      const service=new google.maps.StreetViewService();
      service.getPanorama({location:p,radius:50000,source:google.maps.StreetViewSource.OUTDOOR},(data,status)=>{
        if(status==="OK" && data){
          const pos=data.location.latLng;
          const sv=new google.maps.StreetViewPanorama(streetRef.current,{position:pos,pov:{heading:Math.random()*360,pitch:0},zoom:1,disableDefaultUI:false});
          const m=new google.maps.Map(mapRef.current,{center:{lat:20,lng:0},zoom:2,minZoom:2,streetViewControl:false,mapTypeControl:false,fullscreenControl:false});
          m.addListener("click",e=>setGuess({lat:e.latLng.lat(),lng:e.latLng.lng()}));
          setStreet(sv);setMap(m);setLoading(false);
        }else setLoading(false);
      });
    }catch(e){console.error(e);setLoading(false)}
  }

  async function validate(){
    if(!guess||!target)return;
    const d=haversine(target.lat,target.lng,guess.lat,guess.lng);
    const pts=Math.max(0,Math.round(5000*Math.exp(-d/2000)));
    const next=score+pts;
    setResult({distance:d,points:pts,total:next});
    setScore(next);
    const markerTarget=new window.google.maps.Marker({position:target,map,label:"✓"});
    const markerGuess=new window.google.maps.Marker({position:guess,map,label:"G"});
    const bounds=new window.google.maps.LatLngBounds();bounds.extend(target);bounds.extend(guess);map.fitBounds(bounds);
  }
  function nextRound(){
    if(round>=DEFAULT_ROUNDS){
      const p={...profile,best:Math.max(profile.best,score),games:profile.games+1};
      saveProfile(p);onExit();
    } else setRound(r=>r+1);
  }

  if(!API_KEY) return <div className="setup"><h1>Google Maps requis</h1><p>Ajoute ta clé Google Maps dans <code>.env</code> :</p><code>VITE_GOOGLE_MAPS_API_KEY=...</code><button onClick={onExit}>Retour</button></div>;

  return <div className="game">
    <div className="gamebar"><button onClick={onExit}>←</button><b>GEOGUESS</b><span>{round}/{DEFAULT_ROUNDS} • {score} pts</span></div>
    <div className="street" ref={streetRef}>{loading&&<div className="loading">Chargement de Street View…</div>}</div>
    <div className="mapwrap"><div className="map" ref={mapRef}></div><div className="maphint">Clique sur la carte pour placer ton guess</div></div>
    {!result?<button className="validate" disabled={!guess} onClick={validate}><Target/> VALIDER</button>:
      <div className="result"><div><strong>{result.points} points</strong><span>{result.distance.toFixed(1)} km</span></div><button onClick={nextRound}>{round<DEFAULT_ROUNDS?"MANCHE SUIVANTE":"VOIR LE SCORE"} <ChevronRight/></button></div>}
  </div>
}

function haversine(a,b,c,d){
 const R=6371,rad=Math.PI/180,x=(c-a)*rad,y=(d-b)*rad;
 const h=Math.sin(x/2)**2+Math.cos(a*rad)*Math.cos(c*rad)*Math.sin(y/2)**2;
 return 2*R*Math.asin(Math.sqrt(h));
}

function Leaderboard({profile}){
 const rows=[["Xixi",1050],["Relax",profile.best],["Tester",850],["TEST_3d8e0a",850],["Nque",600]];
 return <div className="page"><h1>CLASSEMENT</h1><p>Top joueurs mondiaux</p><div className="podium"><div>RE<br/><b>#2</b><strong>Relax</strong><small>{profile.best}</small></div><div>XI<br/><b>#1</b><strong>Xixi</strong><small>1050</small></div><div>TE<br/><b>#3</b><strong>Tester</strong><small>850</small></div></div>{rows.map((r,i)=><div className="row" key={i}><span>{i+1}</span><b>{r[0]}</b><em>{r[1]}</em></div>)}</div>
}
function Profile({profile}){
 return <div className="page profile"><div className="avatar">RE</div><h1>{profile.name}</h1><p>Explorateur du monde</p><div className="stats"><div><Flame/> <b>{profile.streak}</b><span>Streak</span></div><div><Gamepad2/><b>{profile.games}</b><span>Parties</span></div><div><Trophy/><b>{profile.best}</b><span>Meilleur</span></div></div><h2>Historique</h2><div className="history"><div>GEOGUESS <b>{profile.best}</b></div><div>GEOGUESS <b>{Math.max(0,profile.best-300)}</b></div></div></div>
}
createRoot(document.getElementById("root")).render(<App/>);

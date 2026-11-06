/* FONÉTICA-LAB: seguimiento optativo y seudónimo; sin audio, IP ni textos libres. */
(function () {
  'use strict';
  const cfg = window.FONETICA_CONFIG || {};
  const validConfig = /^https:\/\/[a-z0-9-]+\.supabase\.co\/?$/i.test(cfg.supabaseUrl || '') && !!cfg.supabasePublishableKey;
  const KEY = 'fonetica-seguimiento-v1';
  const CODE_KEY = 'fonetica-codigo-alumno-v1';
  const SECTION_NAMES = {inicio:'Inicio', explorar:'Atlas AFI', practicar:'Ejercicios', acustica:'Laboratorio acústico', lectura:'Guía espectral', retos:'Retos y examen', rfe:'Transcripción RFE', resultados:'Resultados locales', docencia:'Guía de aula'};
  let state = {active:false, classCode:'', studentCode:''};
  let lastPage = {};
  let pending = 0;
  const byId = id => document.getElementById(id);
  const escape = text => String(text).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  function randomCode(count){ const alphabet='ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; const bytes=new Uint8Array(count); crypto.getRandomValues(bytes); return Array.from(bytes,b=>alphabet[b%alphabet.length]).join(''); }
  function studentId(){let c=localStorage.getItem(CODE_KEY); if(!/^ALU-[A-Z2-9]{10}$/.test(c||'')){c='ALU-'+randomCode(10);localStorage.setItem(CODE_KEY,c);}return c;}
  function readState(){try {let obj=JSON.parse(localStorage.getItem(KEY)||'{}');if(obj.active && /^[A-Z0-9]{8}$/.test(obj.classCode||'')){state={active:true,classCode:obj.classCode,studentCode:studentId()}}} catch (_){}}
  function status(msg,ok){const el=byId('track-status');if(el){el.textContent=msg;el.style.color=ok?'#106f73':'#ab4636';}}
  async function send(event,module,extras={}){
    if(!state.active || !validConfig)return false;
    const payload={class_code:state.classCode,student_code:state.studentCode,event_type:event,module:String(module||'general').slice(0,70),app_version:'3.1',...extras};
    try{
      pending++;
      const controller=new AbortController(); const timer=setTimeout(()=>controller.abort(),12000);
      const response=await fetch(cfg.supabaseUrl.replace(/\/$/,'')+'/rest/v1/learning_events', {
        method:'POST', headers:{'apikey':cfg.supabasePublishableKey,'Content-Type':'application/json','Prefer':'return=minimal'},
        body:JSON.stringify(payload),signal:controller.signal,mode:'cors',cache:'no-store'
      });clearTimeout(timer);
      if(!response.ok){console.warn('FONÉTICA-LAB: error al registrar actividad',response.status);status('No se ha podido enviar la actividad. Comprueba el código de clase y la conexión.',false);return false;}
      status('Seguimiento activado · código '+state.studentCode,true);return true;
    }catch(e){console.warn('FONÉTICA-LAB: sin conexión con seguimiento',e); status('Actividad local; no se ha enviado al informe de profesora.',false);return false;}
    finally{pending--;}
  }
  function bootstrap(){
    readState();
    const section=byId('inicio');
    if(!section) return;
    const block=document.createElement('div');block.className='card';block.id='seguimiento-docente';block.style.cssText='margin:20px 0;padding:23px;border:1px solid #b9d8d2';
    block.innerHTML=`<div style="display:flex;justify-content:space-between;gap:15px;flex-wrap:wrap;align-items:start"><div><div class="eyebrow" style="color:#106f73">Seguimiento para prácticas docentes</div><h2 style="margin:5px 0">Compartir mi progreso con la profesora</h2></div><span id="track-badge" class="pill">Desactivado</span></div>
      <p class="muted" style="max-width:780px;margin:8px 0 15px">Opcional. Si lo activas, se registrarán el código seudónimo de este navegador, secciones visitadas, ejercicios terminados, notas y preguntas acertadas o falladas. <strong>No se envían grabaciones, archivos de audio, respuestas escritas, nombres ni correos.</strong> Puedes usar toda la web sin activar el seguimiento.</p>
      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(190px,1fr));gap:12px;max-width:800px"><label><span class="field-label">Código de clase dado por la profesora</span><input id="track-class" class="ipa-input" style="font-size:16px;padding:11px" maxlength="8" placeholder="Ej.: A7B2C9D4" autocomplete="off"></label><label><span class="field-label">Tu código seudónimo</span><input id="track-student" class="ipa-input" style="font-size:16px;padding:11px" readonly aria-label="Identificador seudónimo automático"></label></div>
      <label style="display:flex;gap:8px;align-items:flex-start;margin:12px 0;max-width:790px;font-size:13px"><input id="track-accept" type="checkbox" style="margin-top:4px"> <span>He leído qué datos se recogerán y quiero compartir mi actividad con la profesora. Entiendo que puedo desactivarlo en cualquier momento; los registros anteriores permanecerán hasta que se eliminen por la responsable.</span></label>
      <div style="display:flex;gap:10px;flex-wrap:wrap"><button id="track-enable" class="btn secondary">Activar seguimiento</button><button id="track-disable" class="btn outline" type="button">Desactivar</button><button id="track-newcode" class="btn ghost" type="button" title="Genera un nuevo código. Se pierde la continuidad de los registros anteriores">Nuevo código seudónimo</button></div>
      <p id="track-status" role="status" style="font-size:12px;margin:12px 0 0"></p><p class="muted" style="font-size:12px">Para un uso institucional, sigue las indicaciones de protección de datos de la UCA. No utilices este informe como sistema oficial de calificación o control de asistencia.</p>`;
    const hero=section.querySelector('.hero');hero?.insertAdjacentElement('afterend',block);
    byId('track-student').value=studentId();
    if(!validConfig){byId('track-enable').disabled=true;status('Aún no está configurado el servidor: los ejercicios funcionan, pero el informe remoto no.',false)}
    if(state.active){byId('track-class').value=state.classCode;byId('track-accept').checked=true;byId('track-badge').textContent='Activado';status('Seguimiento activado · código '+state.studentCode,true);}
    byId('track-enable').addEventListener('click',async()=>{
      if(!validConfig)return;
      const c=byId('track-class').value.toUpperCase().replace(/\s+/g,'');
      if(!/^[A-Z0-9]{8}$/.test(c)){status('Introduce el código de 8 letras o números que te dio la profesora.',false);return;}
      if(!byId('track-accept').checked){status('Marca la casilla de información antes de activar el seguimiento.',false);return;}
      state={active:true,classCode:c,studentCode:studentId()};
      // No persistir hasta que el servidor confirme el primer envío.
      const ok=await send('inicio_sesion','general');
      if(ok){localStorage.setItem(KEY,JSON.stringify({active:true,classCode:c}));byId('track-badge').textContent='Activado';}
      else{state.active=false;byId('track-badge').textContent='Desactivado';}
    });
    byId('track-disable').addEventListener('click',()=>{state.active=false;localStorage.removeItem(KEY);byId('track-badge').textContent='Desactivado';status('Seguimiento desactivado. Puedes continuar usando todos los ejercicios.',true)});
    byId('track-newcode').addEventListener('click',()=>{const sure=confirm('¿Generar otro código seudónimo? No podrás vincular con el nuevo código las actividades ya enviadas.');if(!sure)return;const value='ALU-'+randomCode(10);localStorage.setItem(CODE_KEY,value);byId('track-student').value=value;state.studentCode=value;status('Nuevo código: '+value+'. Las sesiones anteriores conservarán el anterior.',true)});
    document.addEventListener('click',e=>{const b=e.target.closest('button');if(!b||!state.active)return;
      const page=b.dataset.page||b.dataset.go;
      if(page && SECTION_NAMES[page]){if(Date.now()-(lastPage[page]||0)>30000){lastPage[page]=Date.now();send('visita_seccion',page);}}
      if(b.id==='demo-sound')send('laboratorio_uso','senal_sintetica');
      if(b.id==='record-stop')send('laboratorio_uso','grabacion_local');
      if(b.id==='annotation-export')send('laboratorio_uso','anotaciones_exportadas');
      if(b.id==='export-graphs')send('laboratorio_uso','graficos_exportados');
    });
    byId('audio-file')?.addEventListener('change',e=>{if(state.active && e.target.files?.length)send('laboratorio_uso','audio_local_cargado');});
    // Se intercepta ÚNICAMENTE el historial de sesiones completadas. No se envían entradas libres.
    if(typeof window.saveHistory==='function'){
      const original=window.saveHistory;
      let lastSaved='';
      window.saveHistory=function(rows){
        const result=original.apply(this,arguments);
        const r=rows?.[0]; if(!state.active||!r?.date||!r?.module)return result;
        const unique=r.date+'|'+r.module;if(unique===lastSaved)return result;lastSaved=unique;
        const answers=Array.isArray(r.answers)?r.answers.slice(0,30).map((a,i)=>({
          item: String(a.question||a.word||a.q||('Pregunta '+(i+1))).slice(0,160),
          correct:!!a.correct
        })):[];
        const details={items:answers, dialect:r.dialect==='seseo'?'seseo':r.dialect==='distincion'?'distincion':'no_aplica'};
        const start=(typeof game!=='undefined' && game?.start && ['identificacion','transcripcion','alofonos'].includes(r.module))?game.start:(typeof examSession!=='undefined' && examSession?.start && r.module==='examen-espectral')?examSession.start:null;
        const duration=start?Math.min(7200,Math.max(0,Math.round((new Date(r.date)-new Date(start))/1000))):null;
        send('actividad_finalizada',r.module,{score:Number(r.score)||0,total:Number(r.total)||0,duration_seconds:duration,details});
        return result;
      };
    }
    if(state.active && validConfig){send('inicio_sesion','general');}
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',bootstrap);else bootstrap();
})();

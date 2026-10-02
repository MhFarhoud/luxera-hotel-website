export type EventName='demo_started'|'role_selected'|'dashboard_opened'|'module_viewed'|'ai_used'|'cta_clicked'|'lead_form_started'|'lead_submitted'|'demo_completed';
let consent=false;let session='';
export function setAnalyticsConsent(allow:boolean){consent=allow;if(allow&&!session)session=crypto.randomUUID();}
export function track(event:EventName,role:string,module?:string){if(!consent)return;void fetch('/api/events',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({event,role,module,session,consent:true})}).catch(()=>{});}

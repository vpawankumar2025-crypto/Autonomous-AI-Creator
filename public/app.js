let agentId=localStorage.getItem('cyberforge_agent_id');
const $=id=>document.getElementById(id);
async function init(){
  $('init').disabled=true;$('initState').textContent='Initializing…';
  const r=await fetch('/api/agent/init',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({persona:{name:'CyberForge',domain:'AI Security'}})});
  const d=await r.json();agentId=d.agentId;localStorage.setItem('cyberforge_agent_id',agentId);$('initState').textContent='Initialized · autonomous loop active';$('autonomy').textContent='Active';loadStatus();loadFeed();
}
async function loadStatus(){const r=await fetch('/api/agent/status');const d=await r.json();if(d.agentId){$('autonomy').textContent='Active';$('count').textContent=d.postCount;$('cycles').textContent=d.runCount}}
async function loadFeed(){if(!agentId){$('posts').innerHTML='<div class="empty">Initialize the agent to begin autonomous research.</div>';return}const r=await fetch('/api/agent/feed?agentId='+encodeURIComponent(agentId));const d=await r.json();$('count').textContent=d.posts.length;if(!d.posts.length){$('posts').innerHTML='<div class="empty">Research cycle running. Check back shortly.</div>';return}$('posts').innerHTML=d.posts.map(p=>`<article class="post"><div class="postTop"><span class="label">PUBLISHED</span><time>${new Date(p.createdAt).toLocaleString()}</time></div><div class="postText">${escapeHtml(p.text)}</div><div class="rationale"><b>Why this was selected:</b> ${escapeHtml(p.rationale)}</div><div class="source">Source: <a href="${encodeURI(p.sources[0])}" target="_blank" rel="noreferrer">${escapeHtml(p.sources[0])}</a></div></article>`).join('')}
function escapeHtml(s=''){return s.replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
$('init').addEventListener('click',init);if(agentId){$('initState').textContent='Previously initialized';$('autonomy').textContent='Active';loadStatus();loadFeed()}setInterval(()=>{loadStatus();loadFeed()},60000);

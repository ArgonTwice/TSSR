const MODULE_DIAGRAMS = {};function _svg(t,a,c){const e=document.createElementNS("http://www.w3.org/2000/svg",t);for(const[k,v]of Object.entries(a||{}))e.setAttribute(k,v);if(typeof c==="string")e.textContent=c;else if(c)c.forEach(x=>x&&e.appendChild(x));return e}
function _rx(x,y,w,h,f,o){return _svg("rect",{x:""+x,y:""+y,"width":""+w,"height":""+h,"rx":""+(o?.rx||4),"fill":f,...o?.stroke?{stroke:o.stroke}:{},...o?.opacity?{opacity:o.opacity}:{}})}
function _tx(x,y,t,f,o){return _svg("text",{x:""+x,y:""+y,"text-anchor":o?.anchor||"middle","fill":f||"#e2e8f0","font-size":o?.size||"12","font-weight":o?.weight||"normal"},t)}
function _ln(x1,y1,x2,y2,s,w){return _svg("line",{x1:""+x1,y1:""+y1,x2:""+x2,y2:""+y2,"stroke":s||"#1e293b","stroke-width":w||"1"})}MODULE_DIAGRAMS.reseaux = [{title:"Modèle OSI - 7 couches",build(){
var s=document.createElementNS("http://www.w3.org/2000/svg","svg");s.setAttribute("viewBox","0 0 600 400");s.style.cssText="width:100%;max-width:600px;height:auto";
s.appendChild(_rx(10,10,580,380,"#0f1424",{stroke:"#1e293b",rx:8}));
s.appendChild(_tx(300,38,"Modèle OSI - 7 couches","#00e5a0",{size:"16",weight:"bold"}));
s.appendChild(_ln(50,48,550,48));
[["7 - Application","HTTP FTP SMTP DNS","#3b82f6",58],["6 - Présentation","SSL/TLS JPEG ASCII","#3b82f6",98],["5 - Session","NetBIOS RPC SIP","#3b82f6",138],["4 - Transport","TCP UDP QUIC","#f59e0b",178],["3 - Réseau","IP ICMP OSPF","#ef4444",218],["2 - Liaison","Ethernet MAC VLAN","#ef4444",258],["1 - Physique","Câbles signaux hub","#ef4444",298]].forEach(function(l){s.appendChild(_rx(40,l[3],520,36,l[2],{opacity:"0.15",stroke:l[2]}));s.appendChild(_tx(300,l[3]+22,l[0],"#e2e8f0",{size:"14",weight:"bold"}));s.appendChild(_tx(480,l[3]+22,l[1],"#94a3b8",{size:"11",anchor:"end"}))});
s.appendChild(_ln(50,346,550,346));s.appendChild(_tx(300,370,"↑ Envoi (encapsulation) · Réception (désencapsulation) ↓","#64748b",{size:"11"}));return s}}];MODULE_DIAGRAMS.stockage = [{title:"Niveaux RAID",build(){
var s=document.createElementNS("http://www.w3.org/2000/svg","svg");s.setAttribute("viewBox","0 0 600 270");s.style.cssText="width:100%;max-width:600px;height:auto";
s.appendChild(_rx(10,10,580,260,"#0f1424",{stroke:"#1e293b",rx:8}));
s.appendChild(_tx(300,35,"Niveaux RAID","#00e5a0",{size:"16",weight:"bold"}));
s.appendChild(_ln(40,45,560,45));
var d=[["RAID 0 - Striping","Perf +++ / 0 tolérance","#3b82f6",30,55],["RAID 1 - Mirroring","Redondance / Coût x2","#f59e0b",310,55],["RAID 5 - Parité","N-1 disques utiles","#00e5a0",30,130],["RAID 10 - 1+0","Mirror+Strip / 4 disques","#a855f7",310,130]];
d.forEach(function(r){s.appendChild(_rx(r[3],r[4],260,65,r[2],{opacity:"0.1",stroke:r[2]}));s.appendChild(_tx(r[3]+130,r[4]+20,r[0],r[2],{size:"13",weight:"bold"}));s.appendChild(_tx(r[3]+130,r[4]+45,r[1],"#94a3b8",{size:"10"}))});
s.appendChild(_ln(40,210,560,210));s.appendChild(_tx(300,240,"RAID 0: vitesse | RAID 1: sécurité | RAID 5: économie | RAID 10: les deux","#64748b",{size:"11"}));return s}}];MODULE_DIAGRAMS.virtualisation = [{title:"Hyperviseurs Type 1 vs Type 2",build(){
var s=document.createElementNS("http://www.w3.org/2000/svg","svg");s.setAttribute("viewBox","0 0 600 260");s.style.cssText="width:100%;max-width:600px;height:auto";
s.appendChild(_rx(10,10,580,250,"#0f1424",{stroke:"#1e293b",rx:8}));
s.appendChild(_tx(300,35,"Types d hyperviseurs","#00e5a0",{size:"16",weight:"bold"}));
s.appendChild(_ln(40,45,560,45));
s.appendChild(_rx(30,55,260,180,"#3b82f6",{opacity:"0.08",stroke:"#3b82f6"}));
s.appendChild(_tx(160,78,"Type 1 - Bare Metal","#3b82f6",{size:"14",weight:"bold"}));
s.appendChild(_rx(50,90,90,28,"#3b82f6",{opacity:"0.2"}));s.appendChild(_tx(95,110,"VM1","#e2e8f0",{size:"10"}));
s.appendChild(_rx(160,90,90,28,"#3b82f6",{opacity:"0.2"}));s.appendChild(_tx(205,110,"VM2","#e2e8f0",{size:"10"}));
s.appendChild(_rx(50,128,200,28,"#00e5a0",{opacity:"0.15",stroke:"#00e5a0"}));s.appendChild(_tx(150,148,"HYPERVISEUR","#00e5a0",{size:"11",weight:"bold"}));
s.appendChild(_rx(50,166,200,28,"#475569"));s.appendChild(_tx(150,186,"MATERIEL (serveur)","#e2e8f0",{size:"11"}));
s.appendChild(_tx(160,228,"ESXi - Hyper-V - KVM - XenServer","#94a3b8",{size:"10"}));
s.appendChild(_rx(310,55,260,180,"#f59e0b",{opacity:"0.08",stroke:"#f59e0b"}));
s.appendChild(_tx(440,78,"Type 2 - Hosted","#f59e0b",{size:"14",weight:"bold"}));
s.appendChild(_rx(330,90,90,28,"#f59e0b",{opacity:"0.2"}));s.appendChild(_tx(375,110,"VM1","#e2e8f0",{size:"10"}));
s.appendChild(_rx(440,90,90,28,"#f59e0b",{opacity:"0.2"}));s.appendChild(_tx(485,110,"VM2","#e2e8f0",{size:"10"}));
s.appendChild(_rx(330,128,200,28,"#00e5a0",{opacity:"0.15",stroke:"#00e5a0"}));s.appendChild(_tx(430,148,"HYPERVISEUR","#00e5a0",{size:"11",weight:"bold"}));
s.appendChild(_rx(330,166,200,28,"#475569"));s.appendChild(_tx(430,186,"OS HOTE (Windows/Linux)","#e2e8f0",{size:"11"}));
s.appendChild(_tx(440,228,"VirtualBox - VMware Workstation - Parallels","#94a3b8",{size:"10"}));return s}}];MODULE_DIAGRAMS.securite = [{title:"Architecture DMZ / Firewall",build(){
var s=document.createElementNS("http://www.w3.org/2000/svg","svg");s.setAttribute("viewBox","0 0 600 260");s.style.cssText="width:100%;max-width:600px;height:auto";
s.appendChild(_rx(10,10,580,250,"#0f1424",{stroke:"#1e293b",rx:8}));
s.appendChild(_tx(300,35,"Architecture DMZ","#00e5a0",{size:"16",weight:"bold"}));s.appendChild(_ln(40,45,560,45));
s.appendChild(_rx(30,70,90,70,"#ef4444",{opacity:"0.1",stroke:"#ef4444"}));s.appendChild(_tx(75,100,"Internet","#ef4444",{size:"12",weight:"bold"}));
s.appendChild(_rx(140,65,60,80,"#f59e0b",{opacity:"0.15",stroke:"#f59e0b"}));s.appendChild(_tx(170,92,"FW","#f59e0b",{size:"11",weight:"bold"}));s.appendChild(_tx(170,110,"Péri","#94a3b8",{size:"9"}));s.appendChild(_tx(170,130,"80,443","#94a3b8",{size:"9"}));
s.appendChild(_rx(220,50,120,110,"#00e5a0",{opacity:"0.08",stroke:"#00e5a0"}));s.appendChild(_tx(280,72,"DMZ","#00e5a0",{size:"12",weight:"bold"}));
s.appendChild(_rx(235,82,90,22,"#00e5a0",{opacity:"0.15"}));s.appendChild(_tx(280,98,"Serveur Web","#e2e8f0",{size:"10"}));
s.appendChild(_rx(235,110,90,22,"#00e5a0",{opacity:"0.15"}));s.appendChild(_tx(280,126,"Serveur Mail","#e2e8f0",{size:"10"}));
s.appendChild(_rx(235,138,90,18,"#00e5a0",{opacity:"0.15"}));s.appendChild(_tx(280,151,"Proxy","#e2e8f0",{size:"9"}));
s.appendChild(_rx(360,65,60,80,"#f59e0b",{opacity:"0.15",stroke:"#f59e0b"}));s.appendChild(_tx(390,92,"FW2","#f59e0b",{size:"11",weight:"bold"}));s.appendChild(_tx(390,110,"Interne","#94a3b8",{size:"9"}));s.appendChild(_tx(390,130,"Strict","#94a3b8",{size:"9"}));
s.appendChild(_rx(440,70,130,70,"#3b82f6",{opacity:"0.1",stroke:"#3b82f6"}));s.appendChild(_tx(505,95,"LAN Interne","#3b82f6",{size:"12",weight:"bold"}));s.appendChild(_tx(505,120,"PC - Serveurs - SI","#94a3b8",{size:"10"}));
s.appendChild(_ln(40,210,560,210));s.appendChild(_tx(300,240,"Internet -> FW1 -> DMZ (services exposes) -> FW2 -> LAN interne","#64748b",{size:"11"}));return s}}];MODULE_DIAGRAMS.cisco = [{title:"Routage OSPF - Zones",build(){
var s=document.createElementNS("http://www.w3.org/2000/svg","svg");s.setAttribute("viewBox","0 0 600 280");s.style.cssText="width:100%;max-width:600px;height:auto";
s.appendChild(_rx(10,10,580,270,"#0f1424",{stroke:"#1e293b",rx:8}));
s.appendChild(_tx(300,35,"Routage OSPF - Areas","#00e5a0",{size:"16",weight:"bold"}));s.appendChild(_ln(40,45,560,45));
s.appendChild(_rx(30,55,250,200,"#3b82f6",{opacity:"0.06",stroke:"#3b82f6"}));s.appendChild(_tx(155,75,"Area 0 - Backbone","#3b82f6",{size:"13",weight:"bold"}));
s.appendChild(_rx(80,90,80,30,"#00e5a0",{opacity:"0.15",stroke:"#00e5a0"}));s.appendChild(_tx(120,110,"R1","#e2e8f0",{size:"10"}));
s.appendChild(_rx(180,90,80,30,"#00e5a0",{opacity:"0.15",stroke:"#00e5a0"}));s.appendChild(_tx(220,110,"R2","#e2e8f0",{size:"10"}));
s.appendChild(_ln(160,105,180,105,"#00e5a0","1.5"));s.appendChild(_svg("text",{x:"170",y:"100","font-size":"9","fill":"#64748b"}));
s.appendChild(_rx(80,140,180,30,"#00e5a0",{opacity:"0.15",stroke:"#00e5a0"}));s.appendChild(_tx(170,160,"R3 - ABR","#e2e8f0",{size:"10"}));
s.appendChild(_tx(155,215,"OSPF Backbone (toutes les routes passent ici)","#94a3b8",{size:"9"}));
s.appendChild(_ln(315,170,360,120,"#f59e0b","2"));s.appendChild(_rx(370,55,200,140,"#f59e0b",{opacity:"0.06",stroke:"#f59e0b"}));s.appendChild(_tx(470,75,"Area 1 - Customers","#f59e0b",{size:"13",weight:"bold"}));
s.appendChild(_rx(400,90,70,28,"#f59e0b",{opacity:"0.15"}));s.appendChild(_tx(435,110,"R4","#e2e8f0",{size:"10"}));
s.appendChild(_rx(490,90,70,28,"#f59e0b",{opacity:"0.15"}));s.appendChild(_tx(525,110,"R5","#e2e8f0",{size:"10"}));
s.appendChild(_rx(400,135,160,28,"#f59e0b",{opacity:"0.15"}));s.appendChild(_tx(480,155,"SW1","#e2e8f0",{size:"10"}));
s.appendChild(_rx(480,175,60,18,"#475569"));s.appendChild(_tx(510,188,"PC","#e2e8f0",{size:"8"}));
s.appendChild(_ln(340,170,370,130,"#a855f7","2"));
s.appendChild(_rx(370,210,200,45,"#a855f7",{opacity:"0.06",stroke:"#a855f7"}));s.appendChild(_tx(470,230,"Area 2 - DMZ / Stub","#a855f7",{size:"11",weight:"bold"}));
s.appendChild(_tx(300,268,"ABR = Area Border Router · Stub = pas de routes externes sauf défaut","#64748b",{size:"10"}));return s}}];MODULE_DIAGRAMS["windows"] = [{title:"Active Directory - Domaine",build(){
var s=_svg("svg",{viewBox:"0 0 600 280"});s.style.cssText="width:100%;max-width:600px;height:auto";
s.appendChild(_rx(10,10,580,270,"#0f1424",{stroke:"#1e293b",rx:8}));
s.appendChild(_tx(300,35,"Active Directory - Architecture Domaine","#3b82f6",{size:"16",weight:"bold"}));s.appendChild(_ln(40,45,560,45));
s.appendChild(_rx(30,55,120,120,"#3b82f6",{opacity:"0.08",stroke:"#3b82f6"}));s.appendChild(_tx(90,78,"Foret","#3b82f6",{size:"13",weight:"bold"}));
s.appendChild(_rx(45,88,90,30,"#3b82f6",{opacity:"0.15",stroke:"#3b82f6"}));s.appendChild(_tx(90,110,"Domaine A","#e2e8f0",{size:"11"}));
s.appendChild(_rx(45,130,90,30,"#3b82f6",{opacity:"0.15",stroke:"#3b82f6"}));s.appendChild(_tx(90,152,"Domaine B","#e2e8f0",{size:"11"}));
s.appendChild(_tx(90,198,"Trusts bidirectionnels","#94a3b8",{size:"9"}));
s.appendChild(_rx(200,70,160,90,"#00e5a0",{opacity:"0.08",stroke:"#00e5a0"}));s.appendChild(_tx(280,92,"Controleur de Domaine (DC)","#00e5a0",{size:"13",weight:"bold"}));
s.appendChild(_rx(215,102,130,22,"#00e5a0",{opacity:"0.15"}));s.appendChild(_tx(280,118,"AD DS + DNS + DHCP","#e2e8f0",{size:"10"}));
s.appendChild(_rx(215,132,130,22,"#475569"));s.appendChild(_tx(280,148,"Base de donnees NTDS.DIT","#e2e8f0",{size:"10"}));
s.appendChild(_ln(295,160,295,180,"#64748b","1"));s.appendChild(_svg("polygon",{points:"290,180 300,180 295,188"}));
s.appendChild(_rx(200,188,160,65,"#f59e0b",{opacity:"0.08",stroke:"#f59e0b"}));s.appendChild(_tx(280,208,"Clients du domaine","#f59e0b",{size:"13",weight:"bold"}));
s.appendChild(_rx(215,218,130,22,"#475569"));s.appendChild(_tx(280,234,"PC - Utilisateurs - Groupes","#e2e8f0",{size:"10"}));
s.appendChild(_tx(300,268,"Centralisation des comptes, GPO, Kerberos, LDAP","#64748b",{size:"10"}));return s}}];MODULE_DIAGRAMS.linux = [{title:"Arborescence Linux - Filesystem Hierarchy Standard",build(){
var s=_svg("svg",{viewBox:"0 0 600 280"});s.style.cssText="width:100%;max-width:600px;height:auto";
s.appendChild(_rx(10,10,580,270,"#0f1424",{stroke:"#1e293b",rx:8}));
s.appendChild(_tx(300,35,"Arborescence Linux (FHS)","#00e5a0",{size:"16",weight:"bold"}));s.appendChild(_ln(40,45,560,45));
s.appendChild(_rx(280,55,60,28,"#00e5a0",{opacity:"0.2",stroke:"#00e5a0"}));s.appendChild(_tx(310,75,"/","#00e5a0",{size:"12",weight:"bold"}));
var dirs=[["/bin","Commandes essentielles (ls, cp)","#00e5a0",90,130],["/sbin","Commandes admin (fdisk, mount)","#00e5a0",90,165],["/etc","Fichiers config (passwd, ssh)","#00e5a0",90,200],["/home","Dossiers utilisateurs","#00e5a0",90,235],["/var","Logs, spool, caches (variable)","#f59e0b",310,130],["/tmp","Fichiers temporaires (purg�s)","#f59e0b",310,165],["/dev","P�riph�riques (sda, tty)","#f59e0b",310,200],["/proc","Processus en m�moire virtuelle","#f59e0b",310,235]];
dirs.forEach(function(d){s.appendChild(_rx(d[3],d[4],160,25,"#475569",{stroke:d[2],opacity:"0.15"}));s.appendChild(_tx(d[3]+80,d[4]+18,d[0],d[2],{size:"12",weight:"bold"}));s.appendChild(_tx(d[3]+80,d[4]+30,d[1],"#94a3b8",{size:"8","text-anchor":"middle"})).setAttribute("y",parseInt(_tx().getAttribute("y")||0)+8)});
return s}}];MODULE_DIAGRAMS.reseaux.push({title:"Pile TCP/IP vs OSI",build(){
var s=_svg("svg",{viewBox:"0 0 600 300"});s.style.cssText="width:100%;max-width:600px;height:auto";
s.appendChild(_rx(10,10,580,290,"#0f1424",{stroke:"#1e293b",rx:8}));
s.appendChild(_tx(300,35,"Pile TCP/IP vs Modele OSI","#00e5a0",{size:"16",weight:"bold"}));s.appendChild(_ln(40,48,560,48));
s.appendChild(_rx(150,55,100,36,"#f59e0b",{opacity:"0.15",stroke:"#f59e0b"}));s.appendChild(_tx(200,78,"Application","#f59e0b",{size:"12",weight:"bold"}));
s.appendChild(_rx(300,55,100,36,"#3b82f6",{opacity:"0.15",stroke:"#3b82f6"}));s.appendChild(_tx(350,78,"5-7 OSI","#3b82f6",{size:"12"}));
s.appendChild(_rx(150,100,100,36,"#f59e0b",{opacity:"0.15",stroke:"#f59e0b"}));s.appendChild(_tx(200,123,"Transport","#f59e0b",{size:"12",weight:"bold"}));
s.appendChild(_rx(300,100,100,36,"#3b82f6",{opacity:"0.15",stroke:"#3b82f6"}));s.appendChild(_tx(350,123,"4 Transport","#3b82f6",{size:"12"}));
s.appendChild(_rx(150,145,100,36,"#ef4444",{opacity:"0.15",stroke:"#ef4444"}));s.appendChild(_tx(200,168,"Internet","#ef4444",{size:"12",weight:"bold"}));
s.appendChild(_rx(300,145,100,36,"#3b82f6",{opacity:"0.15",stroke:"#3b82f6"}));s.appendChild(_tx(350,168,"3 Reseau","#3b82f6",{size:"12"}));
s.appendChild(_rx(150,190,100,36,"#00e5a0",{opacity:"0.15",stroke:"#00e5a0"}));s.appendChild(_tx(200,213,"Acces Reseau","#00e5a0",{size:"11",weight:"bold"}));
s.appendChild(_rx(300,190,100,36,"#3b82f6",{opacity:"0.15",stroke:"#3b82f6"}));s.appendChild(_tx(350,213,"1-2 Liaison+Phy","#3b82f6",{size:"11"}));
s.appendChild(_ln(40,245,560,245));s.appendChild(_tx(300,270,"Protocoles : HTTP DNS TLS (App) | TCP UDP (Transport) | IP ICMP (Internet) | Eth WiFi (Acces)","#64748b",{size:"10"}));
[["HTTP","80",70,135],["DNS","53",70,170],["TLS","443",70,95],["TCP","-",420,95],["UDP","-",420,135],["IP","-",420,170],["Ethernet","-",420,205]].forEach(function(p){s.appendChild(_rx(p[2],p[3],50,18,"#475569",{opacity:"0.3"}));s.appendChild(_tx(p[2]+25,p[3]+14,p[0],"#e2e8f0",{size:"9","anchor":"middle"}))});
return s}});MODULE_DIAGRAMS.cloud = [{title:"Cloud Computing - Architectures",build(){
var s=_svg("svg",{viewBox:"0 0 600 280"});s.style.cssText="width:100%;max-width:600px;height:auto";
s.appendChild(_rx(10,10,580,270,"#0f1424",{stroke:"#1e293b",rx:8}));
s.appendChild(_tx(300,35,"Cloud - Modeles de Service","#3b82f6",{size:"16",weight:"bold"}));s.appendChild(_ln(40,48,560,48));
[["IaaS","Infrastructure as a Service","VM, stockage, reseau","Vous gerez : OS, apps, donnees","#3b82f6",30,65],["PaaS","Platform as a Service","Base de donnees, runtime, middleware","Vous devez juste coder","#f59e0b",30,130],["SaaS","Software as a Service","Applications pretes a l emploi","Vous utilisez seulement","#00e5a0",30,195]].forEach(function(d){
s.appendChild(_rx(d[4],parseInt(d[5])+18,180,50,d[4],{opacity:"0.15"}));
s.appendChild(_tx(120,d[5]+18,d[0],d[4],{size:"13",weight:"bold"}));s.appendChild(_tx(120,d[5]+36,d[1],"#e2e8f0",{size:"10"}));
s.appendChild(_tx(120,d[5]+52,d[2],"#94a3b8",{size:"9"}))});
[["Public","Azure, AWS, GCP","orange","#f59e0b",230,65],["Prive","VMware, OpenStack","orange","#3b82f6",230,130],["Hybride","Mixte (le plus courant)","orange","#a855f7",230,195]].forEach(function(d){
s.appendChild(_rx(d[3],parseInt(d[4])+36,260,40,d[3],{opacity:"0.08",stroke:d[3]}));
s.appendChild(_tx(360,d[4]+44,d[0],d[3],{size:"13","anchor":"middle"}));
s.appendChild(_tx(360,d[4]+60,d[1],"#64748b",{size:"10","anchor":"middle"}))});
s.appendChild(_rx(230,65,260,170,"#a855f7",{opacity:"0.04",stroke:"#a855f7",rx:6}));s.appendChild(_tx(360,78,"Modeles de déploiement","#a855f7",{size:"12",weight:"bold"}));
s.appendChild(_ln(40,265,560,265));s.appendChild(_tx(300,262,"IaaS: AWS EC2 / PaaS: Heroku / SaaS: Office365 Gmail","#64748b",{size:"9"}));
return s}}];MODULE_DIAGRAMS.messagerie = [{title:"Messagerie - SMTP POP3 IMAP",build(){
var s=_svg("svg",{viewBox:"0 0 600 260"});s.style.cssText="width:100%;max-width:600px;height:auto";
s.appendChild(_rx(10,10,580,250,"#0f1424",{stroke:"#1e293b",rx:8}));
s.appendChild(_tx(300,35,"Protocoles de Messagerie","#f59e0b",{size:"16",weight:"bold"}));s.appendChild(_ln(40,48,560,48));
s.appendChild(_rx(30,65,90,40,"#3b82f6",{opacity:"0.15",stroke:"#3b82f6"}));s.appendChild(_tx(75,90,"Expéditeur","#3b82f6",{size:"12",weight:"bold"}));
s.appendChild(_rx(150,65,90,40,"#00e5a0",{opacity:"0.15",stroke:"#00e5a0"}));s.appendChild(_tx(195,90,"MTA","#00e5a0",{size:"12",weight:"bold"}));s.appendChild(_tx(195,110,"SMTP","#94a3b8",{size:"8"}));
s.appendChild(_rx(270,65,90,40,"#00e5a0",{opacity:"0.15",stroke:"#00e5a0"}));s.appendChild(_tx(315,90,"MTA","#00e5a0",{size:"12",weight:"bold"}));s.appendChild(_tx(315,110,"SMTP","#94a3b8",{size:"8"}));
s.appendChild(_rx(150,130,90,40,"#00e5a0",{opacity:"0.15",stroke:"#00e5a0"}));s.appendChild(_tx(195,155,"Boîte","#00e5a0",{size:"12",weight:"bold"}));s.appendChild(_tx(195,170,"MX","#94a3b8",{size:"8"}));
s.appendChild(_rx(390,65,90,40,"#f59e0b",{opacity:"0.15",stroke:"#f59e0b"}));s.appendChild(_tx(435,90,"Client","#f59e0b",{size:"12",weight:"bold"}));
s.appendChild(_rx(390,130,90,40,"#a855f7",{opacity:"0.15",stroke:"#a855f7"}));s.appendChild(_tx(435,155,"POP3/IMAP","#a855f7",{size:"12",weight:"bold"}));
s.appendChild(_ln(120,85,150,85,"#3b82f6","2"));s.appendChild(_tx(135,80,"SMTP","#3b82f6",{size:"9"}));
s.appendChild(_ln(240,85,270,85,"#3b82f6","2"));s.appendChild(_tx(255,80,"SMTP","#3b82f6",{size:"9"}));
s.appendChild(_ln(240,150,390,150,"#a855f7","2"));s.appendChild(_tx(315,145,"POP3/IMAP","#a855f7",{size:"9"}));
s.appendChild(_rx(150,185,210,28,"#475569",{opacity:"0.3"}));s.appendChild(_tx(255,205,"Serveur de messagerie (Exchange, Dovecot)","#e2e8f0",{size:"10"}));
s.appendChild(_ln(40,210,560,210));s.appendChild(_tx(300,240,"SMTP=envoi | POP3=telecharge et supprime | IMAP=synchro multi-appareils","#64748b",{size:"10"}));
return s}}];MODULE_DIAGRAMS.supervision = [{title:"Architecture Zabbix - Monitoring",build(){
var s=_svg("svg",{viewBox:"0 0 600 300"});s.style.cssText="width:100%;max-width:600px;height:auto";
s.appendChild(_rx(10,10,580,290,"#0f1424",{stroke:"#1e293b",rx:8}));
s.appendChild(_tx(300,35,"Architecture Zabbix (Monitoring)","#3b82f6",{size:"16",weight:"bold"}));s.appendChild(_ln(40,48,560,48));
s.appendChild(_rx(30,60,140,50,"#3b82f6",{opacity:"0.12",stroke:"#3b82f6"}));s.appendChild(_tx(100,78,"Zabbix Server","#3b82f6",{size:"13",weight:"bold"}));s.appendChild(_tx(100,100,"Centralise, alertes","#94a3b8",{size:"9"}));
s.appendChild(_rx(230,60,140,50,"#00e5a0",{opacity:"0.12",stroke:"#00e5a0"}));s.appendChild(_tx(300,78,"Zabbix Proxy","#00e5a0",{size:"13",weight:"bold"}));s.appendChild(_tx(300,100,"Relai distant","#94a3b8",{size:"9"}));
s.appendChild(_rx(430,60,140,50,"#f59e0b",{opacity:"0.12",stroke:"#f59e0b"}));s.appendChild(_tx(500,78,"Zabbix Agent","#f59e0b",{size:"13",weight:"bold"}));s.appendChild(_tx(500,100,"Collecte metriques","#94a3b8",{size:"9"}));
s.appendChild(_ln(170,85,230,85,"#3b82f6","2"));s.appendChild(_ln(370,85,430,85,"#3b82f6","2"));
s.appendChild(_rx(30,130,140,50,"#a855f7",{opacity:"0.12",stroke:"#a855f7"}));s.appendChild(_tx(100,148,"Base de donnees","#a855f7",{size:"13",weight:"bold"}));s.appendChild(_tx(100,170,"PostgreSQL/MySQL","#94a3b8",{size:"9"}));
s.appendChild(_ln(100,110,100,130,"#64748b","1"));s.appendChild(_rx(230,130,340,50,"#475569",{opacity:"0.15",stroke:"#475569"}));s.appendChild(_tx(400,148,"Perimetres surveilles","#e2e8f0",{size:"13",weight:"bold"}));s.appendChild(_tx(400,170,"CPU - Memoire - Disque - Reseau - Services - Logs - Temperature","#94a3b8",{size:"9"}));
s.appendChild(_ln(500,110,500,130,"#64748b","1"));s.appendChild(_rx(30,200,540,75,"#0f1424",{rx:6}));s.appendChild(_tx(300,218,"Flux de donnees","#64748b",{size:"12",weight:"bold"}));
[["Agent -> Proxy -> Server -> DB","Collecte periodique (push/poll)","#3b82f6",45,235],["Trigger + Action","Seuils -> Alerte -> Escalade","#f59e0b",45,258],["Notification","Email, Telegram, SMS, Webhook","#00e5a0",340,235],["Graph + Dashboard","Grafana/Zabbix UI","#00e5a0",340,258]].forEach(function(d){s.appendChild(_rx(d[2],parseInt(d[3])+12,250,20,d[2],{opacity:"0.08",stroke:d[2]}));s.appendChild(_tx(170,parseInt(d[3])+20,d[0],d[2],{size:"10",anchor:"middle"}));s.appendChild(_tx(170,parseInt(d[3])+32,d[1],"#64748b",{size:"8",anchor:"middle"}))});
return s}}];MODULE_DIAGRAMS.documentation = [{title:"PRA / PCA - Reprise et Continuite",build(){
var s=_svg("svg",{viewBox:"0 0 600 300"});s.style.cssText="width:100%;max-width:600px;height:auto";
s.appendChild(_rx(10,10,580,290,"#0f1424",{stroke:"#1e293b",rx:8}));
s.appendChild(_tx(300,35,"PRA & PCA - Plan de Reprise et Continuite","#f59e0b",{size:"15",weight:"bold"}));s.appendChild(_ln(40,48,560,48));
[["PCA (Continuite)","Service quasi-immediat (RTO<1h)","Bascule site secondaire (actif/actif)","#3b82f6",40,62],["PRA (Reprise)","Reprise en <24-48h","Replication site secondaire (actif/passif)","#f59e0b",40,127],["Sauvegarde","Jours a semaines","Restaurer depuis bande/cloud","#00e5a0",40,192]].forEach(function(d){
s.appendChild(_rx(d[3],parseInt(d[4]),220,55,d[3],{opacity:"0.1",stroke:d[3],rx:6}));
s.appendChild(_tx(150,parseInt(d[4])+16,d[0],d[3],{size:"12",anchor:"middle",weight:"bold"}));
s.appendChild(_tx(150,parseInt(d[4])+32,d[1],"#e2e8f0",{size:"9",anchor:"middle"}));
s.appendChild(_tx(150,parseInt(d[4])+46,d[2],"#94a3b8",{size:"9",anchor:"middle"}))});
s.appendChild(_rx(290,62,270,185,"#475569",{opacity:"0.08",stroke:"#475569",rx:6}));s.appendChild(_tx(425,78,"Metriques cles","#a855f7",{size:"12",weight:"bold"}));
[["RTO","Recovery Time Objectif","Temps max d arret","#3b82f6",305,92],["RPO","Recovery Point Objectif","Age max des donnees perdues","#f59e0b",305,132],["MTD","Maximum Tolerable Downtime","Duree max avant faillite","#00e5a0",305,172],["SLA","Service Level Agreement","Contrat de niveau de service","#a855f7",305,212]].forEach(function(d){s.appendChild(_rx(d[4],parseInt(d[5]),240,30,d[4],{opacity:"0.08",stroke:d[4]}));s.appendChild(_tx(425,parseInt(d[5])+14,d[0],d[4],{size:"13",weight:"bold",anchor:"middle"}));s.appendChild(_tx(425,parseInt(d[5])+28,d[1]+": "+d[2],"#94a3b8",{size:"8",anchor:"middle"}))});
s.appendChild(_ln(40,265,560,265));s.appendChild(_tx(300,282,"Cout: PCA > PRA > Sauvegarde | RTO,RPO definis dans le PCA/PRA","#64748b",{size:"10"}));
return s}}];MODULE_DIAGRAMS["scripting-avance"] = [{title:"Pipeline CI/CD - Integration et Deploiement Continus",build(){
var s=_svg("svg",{viewBox:"0 0 600 300"});s.style.cssText="width:100%;max-width:600px;height:auto";
s.appendChild(_rx(10,10,580,290,"#0f1424",{stroke:"#1e293b",rx:8}));
s.appendChild(_tx(300,35,"Pipeline CI/CD","#00e5a0",{size:"16",weight:"bold"}));s.appendChild(_ln(40,48,560,48));
[["1. Code","Git push","Developpeur -> Depot (GitHub/GitLab)","#3b82f6",20,62,80,55],["2. Build","npm build / mvn","Compilation + gestion dependances","#f59e0b",130,62,100,55],["3. Test","CI pipeline","Tests unitaires + integration + lint","#ef4444",260,62,130,55],["4. Artifact","Docker image / JAR","Empaquetage et versionnage","#a855f7",180,142,150,55],["5. Staging","Deploiement pre-prod","Tests d acceptation + validation","#00e5a0",110,212,150,55],["6. Production","Deploiement final","Zero-downtime, rollback ready","#f59e0b",290,212,150,55]].forEach(function(d){
s.appendChild(_rx(d[4],parseInt(d[5]),d[6],parseInt(d[7]),d[4],{opacity:"0.1",stroke:d[4],rx:6}));
s.appendChild(_tx(parseInt(d[4])+parseInt(d[6])/2,parseInt(d[5])+16,d[0],d[4],{size:"11",anchor:"middle",weight:"bold"}));
s.appendChild(_tx(parseInt(d[4])+parseInt(d[6])/2,parseInt(d[5])+30,d[1],"#e2e8f0",{size:"9",anchor:"middle"}));
s.appendChild(_tx(parseInt(d[4])+parseInt(d[6])/2,parseInt(d[5])+44,d[2],"#94a3b8",{size:"8",anchor:"middle"}))});
s.appendChild(_ln(100,90,130,90,"#3b82f6","2"));s.appendChild(_ln(230,90,260,90,"#f59e0b","2"));s.appendChild(_ln(390,90,180,142,"#ef4444","2"));
s.appendChild(_ln(330,170,110,212,"#a855f7","2"));s.appendChild(_ln(260,240,290,240,"#00e5a0","2"));
s.appendChild(_rx(20,255,220,28,"#475569",{opacity:"0.15"}));s.appendChild(_tx(130,275,"Outils: Jenkins, GitLab CI, GitHub Actions","#64748b",{size:"10",anchor:"middle"}));
s.appendChild(_rx(290,255,290,28,"#475569",{opacity:"0.15"}));s.appendChild(_tx(435,275,"Objectif: automatisation + qualite + deploiement rapide","#64748b",{size:"10",anchor:"middle"}));
return s}}];MODULE_DIAGRAMS.cloud.push({title:"Azure vs AWS - Services Cloud",build(){
var s=_svg("svg",{viewBox:"0 0 600 290"});s.style.cssText="width:100%;max-width:600px;height:auto";
s.appendChild(_rx(10,10,580,280,"#0f1424",{stroke:"#1e293b",rx:8}));
s.appendChild(_tx(300,35,"Azure vs AWS - Equivalences Services","#3b82f6",{size:"15",weight:"bold"}));s.appendChild(_ln(40,48,560,48));
s.appendChild(_rx(30,55,240,28,"#3b82f6",{opacity:"0.15",stroke:"#3b82f6"}));s.appendChild(_tx(150,75,"Azure","#3b82f6",{size:"13",weight:"bold",anchor:"middle"}));
s.appendChild(_rx(330,55,240,28,"#f59e0b",{opacity:"0.15",stroke:"#f59e0b"}));s.appendChild(_tx(450,75,"AWS","#f59e0b",{size:"13",weight:"bold",anchor:"middle"}));
[["Azure VM","EC2","#3b82f6","#f59e0b",70,100],["Azure Functions","Lambda","#3b82f6","#f59e0b",70,132],["Azure SQL Database","RDS","#3b82f6","#f59e0b",70,164],["Azure Blob Storage","S3","#3b82f6","#f59e0b",70,196],["Azure DevOps","CodeCommit+CodeBuild","#3b82f6","#f59e0b",70,228]].forEach(function(d){s.appendChild(_tx(185,parseInt(d[4])+8,d[0],"#e2e8f0",{size:"11",anchor:"middle"}));s.appendChild(_tx(415,parseInt(d[4])+8,d[1],"#e2e8f0",{size:"11",anchor:"middle"}));s.appendChild(_ln(270,parseInt(d[4]),330,parseInt(d[4]),"#475569","1"))});
return s}});MODULE_DIAGRAMS.reseaux.push({title:"VLAN Trunking - 802.1Q",build(){
var s=_svg("svg",{viewBox:"0 0 600 280"});s.style.cssText="width:100%;max-width:600px;height:auto";
s.appendChild(_rx(10,10,580,270,"#0f1424",{stroke:"#1e293b",rx:8}));
s.appendChild(_tx(300,35,"VLAN Trunking - IEEE 802.1Q","#3b82f6",{size:"15",weight:"bold"}));s.appendChild(_ln(40,48,560,48));
s.appendChild(_rx(30,60,100,130,"#3b82f6",{opacity:"0.08",stroke:"#3b82f6"}));s.appendChild(_tx(80,78,"Switch A","#3b82f6",{size:"12",weight:"bold",anchor:"middle"}));
s.appendChild(_rx(45,92,70,22,"#3b82f6",{opacity:"0.15"}));s.appendChild(_tx(80,108,"VLAN 10","#e2e8f0",{size:"10",anchor:"middle"}));
s.appendChild(_rx(45,124,70,22,"#00e5a0",{opacity:"0.15"}));s.appendChild(_tx(80,140,"VLAN 20","#e2e8f0",{size:"10",anchor:"middle"}));
s.appendChild(_rx(45,156,70,22,"#f59e0b",{opacity:"0.15"}));s.appendChild(_tx(80,172,"VLAN 30","#e2e8f0",{size:"10",anchor:"middle"}));
s.appendChild(_rx(200,55,200,60,"#475569",{opacity:"0.1",stroke:"#a855f7",rx:6}));s.appendChild(_tx(300,75,"Trunk 802.1Q","#a855f7",{size:"13",weight:"bold",anchor:"middle"}));s.appendChild(_tx(300,95,"Tagged : VLAN 10,20,30","#94a3b8",{size:"10",anchor:"middle"}));s.appendChild(_tx(300,110,"Native : VLAN 1 (untagged)","#64748b",{size:"9",anchor:"middle"}));
s.appendChild(_ln(130,125,200,85,"#3b82f6","2"));s.appendChild(_ln(400,85,470,125,"#3b82f6","2"));
s.appendChild(_rx(470,60,100,130,"#3b82f6",{opacity:"0.08",stroke:"#3b82f6"}));s.appendChild(_tx(520,78,"Switch B","#3b82f6",{size:"12",weight:"bold",anchor:"middle"}));
s.appendChild(_rx(485,92,70,22,"#3b82f6",{opacity:"0.15"}));s.appendChild(_tx(520,108,"VLAN 10","#e2e8f0",{size:"10",anchor:"middle"}));
s.appendChild(_rx(485,124,70,22,"#00e5a0",{opacity:"0.15"}));s.appendChild(_tx(520,140,"VLAN 20","#e2e8f0",{size:"10",anchor:"middle"}));
s.appendChild(_rx(485,156,70,22,"#f59e0b",{opacity:"0.15"}));s.appendChild(_tx(520,172,"VLAN 30","#e2e8f0",{size:"10",anchor:"middle"}));
s.appendChild(_ln(40,210,560,210));s.appendChild(_tx(300,235,"Un port trunk transporte plusieurs VLANs via le tag 802.1Q dans l entete Ethernet","#64748b",{size:"10"}));
[["Access Port","Un seul VLAN, pas de tag","#3b82f6",40,248],["Trunk Port","Plusieurs VLANs + tag 802.1Q","#a855f7",300,248]].forEach(function(d){s.appendChild(_rx(d[2],parseInt(d[3])-10,220,20,d[2],{opacity:"0.06"}));s.appendChild(_tx(150,parseInt(d[3])-2,d[0],d[2],{size:"10",anchor:"middle",weight:"bold"}));s.appendChild(_tx(150,parseInt(d[3])+12,d[1],"#94a3b8",{size:"8",anchor:"middle"}))});
return s}});MODULE_DIAGRAMS.securite.push({title:"TLS Handshake - Echange securise",build(){
var s=_svg("svg",{viewBox:"0 0 600 300"});s.style.cssText="width:100%;max-width:600px;height:auto";
s.appendChild(_rx(10,10,580,290,"#0f1424",{stroke:"#1e293b",rx:8}));
s.appendChild(_tx(300,35,"TLS Handshake (1.3 simplifie)","#3b82f6",{size:"15",weight:"bold"}));s.appendChild(_ln(40,48,560,48));
[["1. ClientHello","Algorithmes supportes, random","#3b82f6",35,62,160,28],["Serveur","","#00e5a0",35,128,60,100],["Client","","#f59e0b",340,128,60,100],["2. ServerHello","Choix algo + certificat + clef publique","#3b82f6",370,62,190,28],["3. Echange clefs","Key Share (EC) / Pre-master secret","#3b82f6",35,162,190,28],["4. Derivation","Cl de session (symtrique) calcule","#3b82f6",370,162,190,28],["5. Finished (chiffr)","Donnes chiffres AES-GCM","#00e5a0",35,215,160,28],["6. Finished (chiffr)","Donnes chiffres AES-GCM","#00e5a0",370,215,160,28]].forEach(function(d){
s.appendChild(_rx(d[3],parseInt(d[4]),d[5],parseInt(d[6]),d[2],{opacity:"0.1",stroke:d[2],rx:5}));
s.appendChild(_tx(parseInt(d[3])+parseInt(d[5])/2,parseInt(d[4])+11,d[0],d[2],{size:"11",anchor:"middle",weight:"bold"}));
if(d[1])s.appendChild(_tx(parseInt(d[3])+parseInt(d[5])/2,parseInt(d[4])+24,d[1],"#94a3b8",{size:"8",anchor:"middle"}))});
s.appendChild(_ln(195,78,370,78,"#3b82f6","2"));s.appendChild(_ln(195,178,370,178,"#3b82f6","2"));
s.appendChild(_ln(95,190,95,215,"#00e5a0","1.5"));s.appendChild(_svg("polygon",{points:"88,215 102,215 95,223",fill:"#00e5a0"}));
s.appendChild(_ln(450,190,450,215,"#00e5a0","1.5"));s.appendChild(_svg("polygon",{points:"443,215 457,215 450,223",fill:"#00e5a0"}));
s.appendChild(_ln(40,255,560,255));s.appendChild(_tx(300,275,"Resultat: canal chiffr (confidentialite) + certifi (authenticite) + integre (HMAC)","#64748b",{size:"10"}));
s.appendChild(_rx(95,130,50,30,"#3b82f6",{opacity:"0.05"}));s.appendChild(_tx(120,148,"PKI","#3b82f6",{size:"10",anchor:"middle"}))
return s}});
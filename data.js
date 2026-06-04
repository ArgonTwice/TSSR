// data.js — Structure des modules TSSR
// Ajouter les contenus ici au fur et à mesure

const MODULES = [
  {
    id: 'reseaux',
    label: 'Réseaux',
    icon: '🌐',
    color: '#3b82f6',
    desc: 'Modèle OSI, TCP/IP, VLAN, routage, protocoles...',
    topics: ['OSI', 'TCP/IP', 'VLAN', 'Routage', 'DNS', 'DHCP'],
    cours: [],       // { id, titre, sections: [{h2, contenu: string|array}] }
    flashcards: [],  // { id, recto, verso }
    qcm: [],         // { id, question, options: [{text, correct}], explication }
    linux_cli: true, // Terminal réseau Linux (ip, ping, netstat, ifconfig...)
  },
  {
    id: 'windows',
    label: 'Windows Server',
    icon: '🪟',
    color: '#0ea5e9',
    desc: 'Active Directory, GPO, DNS, DHCP, IIS...',
    topics: ['AD DS', 'GPO', 'DNS', 'DHCP', 'IIS', 'RDS'],
    cours: [],
    flashcards: [],
    qcm: [],
    windows_cli: true,  // Active l'onglet PowerShell
  },
  {
    id: 'linux',
    label: 'Linux',
    icon: '🐧',
    color: '#00e5a0',
    desc: 'Commandes, services systemd, droits, scripting bash...',
    topics: ['Commandes', 'Droits', 'Systemd', 'Bash', 'Réseau', 'Logs'],
    cours: [],
    flashcards: [],
    qcm: [],
    linux_cli: true,    // Active l'onglet Terminal Bash
  },
  {
    id: 'securite',
    label: 'Sécurité',
    icon: '🔐',
    color: '#f59e0b',
    desc: 'Firewall, PKI, VPN, chiffrement, audit...',
    topics: ['Firewall', 'PKI', 'VPN', 'SSL/TLS', 'Audit', 'RBAC'],
    cours: [],
    flashcards: [],
    qcm: [],
  },
  {
    id: 'virtualisation',
    label: 'Virtualisation',
    icon: '📦',
    color: '#a78bfa',
    desc: 'VMware vSphere, Hyper-V, conteneurs Docker...',
    topics: ['VMware', 'Hyper-V', 'Docker', 'Snapshots', 'VMs', 'Clusters'],
    cours: [],
    flashcards: [],
    qcm: [],
  },
  {
    id: 'supervision',
    label: 'Supervision',
    icon: '📊',
    color: '#f472b6',
    desc: 'SNMP, Zabbix, Nagios, métriques, alertes...',
    topics: ['SNMP', 'Zabbix', 'Nagios', 'Syslog', 'ITIL', 'Tickets'],
    cours: [],
    flashcards: [],
    qcm: [],
  },
];

'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { authClient } from '@/lib/neon-auth'
import {
  CalendarDays, ChevronRight, Copy, Crown, Gift, Heart, Image as ImageIcon, MessageCircle,
  Mic2, MoreHorizontal, Plus, Send, Settings, Store, User, Users, X, Zap,
} from 'lucide-react'

const rooms = [
  { name: 'সিলেটের আড্ডা...', id: '1000697', tag: 'সিঙ্গি', heat: '17.7K', color: 'from-violet-500 to-fuchsia-500' },
  { name: 'মমতা ময়ী', id: '1000452', tag: '3', heat: '600', color: 'from-pink-500 to-rose-500' },
]

const joinedRooms = [
  { name: "✨🐍Nagin's Chill Zone...", id: '1000919', tag: 'সঙ্গীত', heat: '500.1M', color: 'from-violet-500 to-indigo-500' },
  { name: 'শুকতারা', id: '1000342', tag: 'সঙ্গীত', heat: '300.1M', color: 'from-pink-500 to-orange-400' },
]

function Avatar({ label, className = '', image }: { label: string; className?: string; image?: string | null }) {
  return <div className={`avatar ${className}`} style={image ? { backgroundImage: `url(${image})`, backgroundSize: 'cover', color: 'transparent' } : undefined}>{label}</div>
}

export default function Page() {
  const router = useRouter()
  const [tab, setTab] = useState('hi')
  const [room, setRoom] = useState<(typeof rooms)[number] | (typeof joinedRooms)[number] | null>(null)
  const [modal, setModal] = useState<'settings' | 'room' | 'gift' | null>(null)
  const [toast, setToast] = useState('')
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState(['MD.TUSHAR রুমে প্রবেশ করেছে।'])
  const [logoutConfirm, setLogoutConfirm] = useState(false)

  const notify = (text: string) => { setToast(text); window.setTimeout(() => setToast(''), 2200) }
  const openRoom = (selected: typeof room) => setRoom(selected)
  const sendMessage = () => { if (!message.trim()) return; setMessages([...messages, `ore ore pain: ${message}`]); setMessage('') }
  const confirmLogout = async () => {
    try {
      const result = await authClient.signOut()
      if (result.error) throw new Error(result.error.message)
    } catch (error) {
      console.error('[v0] Logout failed:', error)
    } finally {
      setLogoutConfirm(false)
      router.replace('/login')
      router.refresh()
    }
  }

  return (
    <main className="device-shell">
      <header className="topbar">
        <span className="pill gradient"><Zap size={13} fill="currentColor" /> রাগী <ChevronRight size={12} /></span>
        <div className="top-actions"><Avatar label="Me" /><button className="icon-button" onClick={() => notify('নতুন রুম খোলার আবেদন ফরম খোলা হয়েছে')} aria-label="নতুন রুম"><Plus size={16} /></button></div>
      </header>
      <div className="content">
        {tab === 'hi' && <Home onRoom={openRoom} notify={notify} />}
        {tab === 'moments' && <Moments notify={notify} />}
        {tab === 'rooms' && <Rooms onRoom={openRoom} />}
        {tab === 'chats' && <Chats />}
        {tab === 'profile' && <Profile notify={notify} onSettings={() => setModal('settings')} />}
      </div>
      <nav className="bottom-nav">
        {([['hi', Heart, 'হাই'], ['moments', ImageIcon, 'মুহূর্তগুলো'], ['rooms', Mic2, 'রুম'], ['chats', MessageCircle, 'চ্যাটস'], ['profile', User, 'আমি']] as const).map(([id, Icon, label]) => <button key={id} className={tab === id ? 'active' : ''} onClick={() => setTab(id)}><Icon size={19} /><span>{label}</span>{id === 'chats' && <b>27</b>}</button>)}
      </nav>

      {room && <div className="room-overlay"><div className="room-head"><div className="room-heading"><Avatar label="R" /><div><strong>{room.name}</strong><small>ID: {room.id} · <em>17.7K</em></small></div></div><button onClick={() => setRoom(null)} aria-label="বন্ধ করুন"><X /></button></div><div className="stage-grid">{Array.from({ length: 12 }, (_, i) => <button key={i} onClick={() => notify(`সিট #${i + 1} এ মাইক রিকোয়েস্ট পাঠানো হয়েছে`)}><Avatar label={i < 4 ? `${i + 1}` : String(i + 1)} /><span>{i < 4 ? ['Mott...', 'NAGIN', 'sultan', 'Pakhi'][i] : 'মাইক'}</span></button>)}</div><div className="chat-log">{messages.map((m, i) => <div key={i}>{m}</div>)}</div><div className="room-toolbar"><div className="message-box"><input value={message} onChange={e => setMessage(e.target.value)} onKeyDown={e => e.key === 'Enter' && !e.nativeEvent.isComposing && sendMessage()} placeholder="একটি বার্তা লিখুন..." /><button onClick={sendMessage}><Send size={15} /></button></div><div className="toolbar-actions"><button><Mic2 size={16} /></button><button><ImageIcon size={16} /></button><button className="gradient" onClick={() => setModal('gift')}><Gift size={16} /></button><button onClick={() => notify('রুম লাকি গেম লোড হচ্ছে')}><Zap size={16} /></button><button onClick={() => notify('রুম অপশন মেনু')}><MoreHorizontal size={16} /></button></div></div></div>}
      {modal === 'settings' && <Sheet title="সেটিংস" onClose={() => setModal(null)}><SettingsList notify={notify} onLogout={() => setLogoutConfirm(true)} /></Sheet>}
      {logoutConfirm && <ConfirmLogout onCancel={() => setLogoutConfirm(false)} onConfirm={confirmLogout} />}
      {modal === 'room' && <Sheet title="রুম সম্পর্কে" onClose={() => setModal(null)}><p>✨ নাগিনস চিল জোন-এ স্বাগতম! রিলাক্স করো, আড্ডা দাও আর পজিটিভ ভাইব এনজয় করো।</p><button className="primary" onClick={() => { setModal(null); notify('রুমে যুক্ত হয়েছেন') }}>+ যোগ দি���</button></Sheet>}
      {modal === 'gift' && <Sheet title="উপহার পাঠান" dark onClose={() => setModal(null)}><div className="gift-grid">{[['কেক','🎂','20'],['বাইক','🏍️','5500'],['জ্যাকেট','🧥','7000'],['কারেন্ট','⚡','50']].map(([name, icon, cost]) => <button key={name} onClick={() => { setModal(null); notify(`${name} উপহার সফলভাবে পাঠানো হয়েছে!`) }}><span>{icon}</span><strong>{name}</strong><small>{cost} কয়েন</small></button>)}</div></Sheet>}
      {toast && <div className="toast">{toast}</div>}
    </main>
  )
}

function Home({ onRoom, notify }: { onRoom: (r: typeof rooms[number]) => void; notify: (s: string) => void }) { return <><div className="subtabs"><b>সাজেস্ট</b><span>যোগ দেওয়া হয়েছে</span></div><div className="banner"><div><small>রাগী কমিউনিটি</small><h2>Kukie কমিউনিটি নিয়ম</h2><p>ভদ্র, সৎ ও নিরাপদ থাকুন।</p></div><button onClick={() => notify('কমিউনিটি গাইডলাইন খোলা হয়েছে')}>দেখুন</button></div><div className="stack">{rooms.map(r => <RoomCard key={r.id} room={r} onClick={() => onRoom(r)} />)}</div></> }
function Rooms({ onRoom }: { onRoom: (r: typeof joinedRooms[number]) => void }) { return <><div className="subtabs"><span>সাজেস্ট</span><b>যোগ দেওয়া হয়েছে</b><Plus size={17} /></div><div className="stack">{joinedRooms.map(r => <RoomCard key={r.id} room={r} onClick={() => onRoom(r)} />)}</div></> }
function RoomCard({ room, onClick }: { room: { name: string; id: string; tag: string; heat: string; color: string }; onClick: () => void }) { return <button className="room-card" onClick={onClick}><div className={`room-art ${room.color}`}>♪</div><div className="room-info"><strong>{room.name}</strong><div><span>{room.tag}</span><span><Crown size={11} /> 8</span></div><div className="mini-avatars"><Avatar label="1" /><Avatar label="2" /><Avatar label="3" /></div></div><em>⌁ {room.heat}</em></button> }
function Moments({ notify }: { notify: (s: string) => void }) { return <><button className="composer" onClick={() => notify('নতুন মুহূর্ত পোস্ট উইন্ডো')}><Avatar label="Me" /><span>আপনার মনের কথা বা মুহূর্ত শেয়ার করুন...</span><ImageIcon size={17} /></button><article className="post"><div className="post-user"><Avatar label="Raj" /><div><strong>raj</strong><small>Khulna · ♂ 32 · ২০ ঘণ্ট��� আগে</small></div><button>Hi</button></div><p>মন বসে না শহরে ইট পাথরের নগরে তাইতো এলাম গ্রামে...</p><div className="photo-grid"><i>Pic1</i><i>Pic2</i><i>Pic3</i></div><footer>♡ 126　 ♧ 184</footer></article></> }
function Chats() { return <><div className="section-title"><h2>মেসেজ ও চ্যাট</h2><span>সব পঠিত করুন</span></div><div className="chat-card"><Avatar label="A" /><div><strong>অফিশিয়াল কাস্টমার কেয়ার</strong><small>আপনার অ্যাকাউন্ট ভেরিফিকেশন সফল হয়েছে!</small></div><b>1</b></div></> }
function Profile({ notify, onSettings }: { notify: (s: string) => void; onSettings: () => void }) { return <><div className="profile-head"><Avatar label="Avatar" className="large" /><div><h2>⚡ ore ore pain ⚡</h2><small>ID: 2519478 <Copy size={12} onClick={() => notify('আইডি কপি হয়েছে')} /></small><div><span>♂ 20</span><span>👑 VIP</span></div></div></div><div className="stats">{[['8','অভিভাবক'],['89','বন্ধু'],['326','ফলো করা'],['216','ফলোয়ার']].map(([n,l]) => <div key={l}><strong>{n}</strong><small>{l}</small></div>)}</div><div className="vip"><Crown size={25} /><div><strong>ভিআইপি সেন্টার</strong><small>প্রিমিয়াম সুবিধা আনলক করুন</small></div><ChevronRight /></div><div className="wallet"><div><small>🪙 আমার কয়েন</small><strong>46</strong></div><div><small>⭐ আমার পয়েন্ট</small><strong>6,990</strong></div></div><div className="menu-list">{[['টাস্ক', CalendarDays],['ডিজিটর', Users],['নোবেল সেন্টার', Crown],['সম্পদের স্তর', Zap],['দোকান', Store],['বন্ধুদের আমন্ত্রণ', Users]].map(([label, Icon]) => <button key={label as string} onClick={() => notify(`${label} পেজ`)}><Icon size={17} /><span>{label as string}</span><ChevronRight size={14} /></button>)}<button onClick={onSettings}><Settings size={17} /><span>সেটিংস</span><ChevronRight size={14} /></button></div></> }
function Sheet({ title, children, dark = false, onClose }: { title: string; children: React.ReactNode; dark?: boolean; onClose: () => void }) { return <div className="sheet-backdrop"><section className={`sheet ${dark ? 'dark-sheet' : ''}`}><header><h2>{title}</h2><button onClick={onClose}><X size={19} /></button></header>{children}</section></div> }
function ConfirmLogout({ onCancel, onConfirm }: { onCancel: () => void; onConfirm: () => void }) { return <div className="confirm-backdrop" role="dialog" aria-modal="true" aria-labelledby="logout-title"><section className="confirm-card"><h2 id="logout-title">Logout</h2><p>আপনি কি আপনার অ্যাকাউন্ট থেকে লগআউট করতে চান?</p><div><button className="cancel-button" onClick={onCancel}>Cancel</button><button className="logout-button" onClick={onConfirm}>Logout</button></div></section></div> }
function SettingsList({ notify, onLogout }: { notify: (s: string) => void; onLogout: () => void }) { return <div className="settings-list">{['ভেরিফিকেশন','অ্যাকাউন্ট নিরাপত্তা','অ্যাপের ভাষা','গোপনীয়তা সেটিংস','চ্যাট সেটিংস','বিউটি সেটিংস','ব্ল্যাকলিস্ট','কাস্টমার সাপোর্ট','ভার্সন আপডেট','Kukie সম্পর্কে'].map(item => <button key={item} onClick={() => notify(item)}><span>{item}</span><ChevronRight size={14} /></button>)}<button className="logout-setting" onClick={onLogout}><span>Logout</span><ChevronRight size={14} /></button></div> }

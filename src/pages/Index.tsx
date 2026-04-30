import { useState } from "react";
import Icon from "@/components/ui/icon";

type Page = "home" | "profile" | "settings";
type Status = "online" | "idle" | "dnd" | "offline";

interface Friend {
  id: number;
  name: string;
  username: string;
  status: Status;
  avatar: string;
  activity?: string;
}

const INITIAL_FRIENDS: Friend[] = [
  { id: 1, name: "Алексей Громов", username: "alexgrom", status: "online", avatar: "АГ", activity: "Играет в Valorant" },
  { id: 2, name: "Мария Светлова", username: "mary_s", status: "idle", avatar: "МС" },
  { id: 3, name: "Кирилл Чёрный", username: "k1rill", status: "online", avatar: "КЧ", activity: "В голосовом чате" },
  { id: 4, name: "Диана Орлова", username: "di_orlova", status: "dnd", avatar: "ДО", activity: "Не беспокоить" },
  { id: 5, name: "Павел Рябов", username: "pavel_r", status: "offline", avatar: "ПР" },
];

const STATUS_COLORS: Record<Status, string> = {
  online: "var(--online)",
  idle: "var(--idle)",
  dnd: "var(--dnd)",
  offline: "#555566",
};

const STATUS_LABELS: Record<Status, string> = {
  online: "В сети",
  idle: "Отошёл",
  dnd: "Не беспокоить",
  offline: "Не в сети",
};

function AvatarBubble({ initials, size = "md", color = "#7c3aed" }: { initials: string; size?: "sm" | "md" | "lg"; color?: string }) {
  const sizes = { sm: "w-8 h-8 text-xs", md: "w-10 h-10 text-sm", lg: "w-16 h-16 text-xl" };
  return (
    <div
      className={`${sizes[size]} rounded-full flex items-center justify-center font-bold text-white flex-shrink-0`}
      style={{ background: `linear-gradient(135deg, ${color}, #5b21b6)` }}
    >
      {initials}
    </div>
  );
}

function FriendRow({ friend, onRemove }: { friend: Friend; onRemove: (id: number) => void }) {
  return (
    <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl glass-hover group cursor-pointer animate-fade-in">
      <div className="relative">
        <AvatarBubble initials={friend.avatar} size="md" />
        <span
          className="absolute -bottom-0.5 -right-0.5 rounded-full border-2"
          style={{ width: 12, height: 12, background: STATUS_COLORS[friend.status], borderColor: "var(--surface-2)" }}
        />
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-sm truncate" style={{ color: "var(--text-primary)" }}>{friend.name}</p>
        <p className="text-xs truncate" style={{ color: "var(--text-secondary)" }}>
          {friend.activity || STATUS_LABELS[friend.status]}
        </p>
      </div>
      <button
        onClick={(e) => { e.stopPropagation(); onRemove(friend.id); }}
        className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded-lg hover:bg-red-500/20 hover:text-red-400"
        style={{ color: "var(--text-secondary)" }}
        title="Удалить друга"
      >
        <Icon name="UserMinus" size={15} />
      </button>
    </div>
  );
}

function AddFriendModal({ onAdd, onClose }: { onAdd: (name: string, username: string) => void; onClose: () => void }) {
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");

  const handle = () => {
    if (!name.trim() || !username.trim()) return;
    onAdd(name.trim(), username.trim());
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div
        className="glass rounded-2xl p-6 w-full max-w-sm mx-4 animate-scale-in"
        style={{ border: "1px solid rgba(124,58,237,0.3)" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-bold text-lg" style={{ color: "var(--text-primary)" }}>Добавить друга</h3>
          <button onClick={onClose} className="transition-colors" style={{ color: "var(--text-secondary)" }}>
            <Icon name="X" size={18} />
          </button>
        </div>
        <div className="space-y-3">
          <input
            className="w-full rounded-xl px-4 py-2.5 text-sm focus:outline-none transition-colors"
            style={{
              background: "var(--surface-3)",
              border: "1px solid var(--border)",
              color: "var(--text-primary)",
            }}
            placeholder="Имя пользователя"
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoFocus
          />
          <input
            className="w-full rounded-xl px-4 py-2.5 text-sm focus:outline-none transition-colors"
            style={{
              background: "var(--surface-3)",
              border: "1px solid var(--border)",
              color: "var(--text-primary)",
            }}
            placeholder="Никнейм (без @)"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handle()}
          />
        </div>
        <button
          onClick={handle}
          className="mt-4 w-full py-2.5 rounded-xl font-semibold text-sm text-white transition-all hover:scale-[1.02] active:scale-[0.98]"
          style={{ background: "linear-gradient(135deg, #7c3aed, #5b21b6)" }}
        >
          Добавить
        </button>
      </div>
    </div>
  );
}

function HomePage({ onNavigate }: { onNavigate: (p: Page) => void }) {
  const features = [
    { icon: "MessageCircle", title: "Общение", desc: "Текстовые и голосовые каналы для команд и друзей" },
    { icon: "Users", title: "Сообщество", desc: "Создавай серверы и объединяй людей по интересам" },
    { icon: "Shield", title: "Безопасность", desc: "Шифрование и гибкое управление доступами" },
    { icon: "Zap", title: "Скорость", desc: "Молниеносная доставка сообщений в реальном времени" },
  ];

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="relative overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(ellipse 80% 50% at 50% -5%, rgba(124,58,237,0.25) 0%, transparent 70%)" }}
        />
        <div className="relative z-10 flex flex-col items-center text-center px-6 pt-20 pb-14">
          <div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold mb-6 animate-fade-in"
            style={{ background: "rgba(124,58,237,0.2)", border: "1px solid rgba(124,58,237,0.4)", color: "var(--violet-light)" }}
          >
            <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: "var(--online)" }} />
            Добро пожаловать в Nexus
          </div>
          <h1 className="text-5xl font-black mb-4 leading-tight animate-fade-in stagger-1" style={{ color: "var(--text-primary)" }}>
            Общайся без<br />
            <span className="gradient-text">ограничений</span>
          </h1>
          <p className="text-base mb-8 animate-fade-in stagger-2" style={{ color: "var(--text-secondary)" }}>
            Nexus — пространство для общения, где всё создано вокруг твоих интересов и друзей
          </p>
          <div className="flex gap-3 animate-fade-in stagger-3">
            <button
              onClick={() => onNavigate("profile")}
              className="px-6 py-3 rounded-xl font-semibold text-white text-sm transition-all hover:scale-105"
              style={{ background: "linear-gradient(135deg, #7c3aed, #5b21b6)", boxShadow: "0 0 20px rgba(124,58,237,0.35)" }}
            >
              Мой профиль
            </button>
            <button
              onClick={() => onNavigate("settings")}
              className="px-6 py-3 rounded-xl font-semibold text-sm transition-all hover:scale-105"
              style={{ background: "var(--surface-3)", color: "var(--text-primary)", border: "1px solid var(--border)" }}
            >
              Настройки
            </button>
          </div>
        </div>
      </div>

      <div className="px-4 pb-12">
        <p
          className="text-center text-xs font-semibold tracking-widest uppercase mb-6"
          style={{ color: "var(--text-secondary)" }}
        >
          Возможности
        </p>
        <div className="grid grid-cols-2 gap-3">
          {features.map((f, i) => (
            <div
              key={f.title}
              className={`glass rounded-2xl p-4 glass-hover animate-fade-in stagger-${i + 1}`}
            >
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center mb-3"
                style={{ background: "rgba(124,58,237,0.15)", color: "var(--violet-light)" }}
              >
                <Icon name={f.icon as never} size={18} />
              </div>
              <h3 className="font-bold text-sm mb-1" style={{ color: "var(--text-primary)" }}>{f.title}</h3>
              <p className="text-xs leading-relaxed" style={{ color: "var(--text-secondary)" }}>{f.desc}</p>
            </div>
          ))}
        </div>

        <div className="mt-4 glass rounded-2xl p-5 grid grid-cols-3 gap-4 text-center animate-fade-in stagger-4">
          {[
            { num: "2.4M", label: "Пользователей" },
            { num: "180K", label: "Серверов" },
            { num: "99.9%", label: "Аптайм" },
          ].map((s) => (
            <div key={s.label}>
              <p className="text-xl font-black gradient-text">{s.num}</p>
              <p className="text-xs mt-0.5" style={{ color: "var(--text-secondary)" }}>{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ProfilePage() {
  const [friends, setFriends] = useState<Friend[]>(INITIAL_FRIENDS);
  const [showAdd, setShowAdd] = useState(false);
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState<"all" | "online">("all");

  const filtered = friends.filter((f) => {
    const matchSearch = f.name.toLowerCase().includes(search.toLowerCase()) || f.username.toLowerCase().includes(search.toLowerCase());
    const matchTab = activeTab === "all" || f.status === "online";
    return matchSearch && matchTab;
  });

  const onlineCount = friends.filter((f) => f.status === "online").length;
  const removeFriend = (id: number) => setFriends((prev) => prev.filter((f) => f.id !== id));

  const addFriend = (name: string, username: string) => {
    const statuses: Status[] = ["online", "offline", "idle"];
    setFriends((prev) => [
      ...prev,
      {
        id: Date.now(),
        name,
        username,
        status: statuses[Math.floor(Math.random() * statuses.length)],
        avatar: name.split(" ").map((w: string) => w[0]).join("").toUpperCase().slice(0, 2),
      },
    ]);
  };

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="relative">
        <div className="h-28 w-full" style={{ background: "linear-gradient(135deg, #3b0764 0%, #1e1b4b 50%, var(--surface) 100%)" }} />
        <div className="px-5 pb-6">
          <div className="flex items-end gap-4 -mt-8 mb-4">
            <div className="relative">
              <div style={{ border: "3px solid var(--surface)" }} className="rounded-full">
                <AvatarBubble initials="ВА" size="lg" />
              </div>
              <span
                className="absolute -bottom-0.5 -right-0.5 rounded-full"
                style={{ width: 18, height: 18, background: STATUS_COLORS["online"], border: "3px solid var(--surface)" }}
              />
            </div>
            <div className="flex-1 pb-1">
              <h2 className="font-black text-xl" style={{ color: "var(--text-primary)" }}>Владимир Андреев</h2>
              <p className="text-sm" style={{ color: "var(--text-secondary)" }}>@v_andreev · В сети</p>
            </div>
            <button
              className="px-4 py-2 rounded-xl text-sm font-semibold transition-all hover:scale-105"
              style={{ background: "var(--surface-3)", color: "var(--text-primary)", border: "1px solid var(--border)" }}
            >
              Редактировать
            </button>
          </div>

          <p className="text-sm mb-4" style={{ color: "var(--text-secondary)" }}>
            Люблю игры, музыку и хороший код. Всегда открыт для новых знакомств 🎮
          </p>

          <div className="flex gap-2 flex-wrap">
            {["Геймер", "Музыка", "TypeScript"].map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 rounded-full text-xs font-semibold"
                style={{ background: "rgba(124,58,237,0.2)", color: "var(--violet-light)", border: "1px solid rgba(124,58,237,0.3)" }}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="px-4 pb-8">
        <div className="glass rounded-2xl overflow-hidden">
          <div className="flex items-center justify-between px-4 pt-4 pb-3" style={{ borderBottom: "1px solid var(--border)" }}>
            <div>
              <h3 className="font-bold" style={{ color: "var(--text-primary)" }}>Список друзей</h3>
              <p className="text-xs mt-0.5" style={{ color: "var(--text-secondary)" }}>{friends.length} друзей · {onlineCount} онлайн</p>
            </div>
            <button
              onClick={() => setShowAdd(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-white transition-all hover:scale-105"
              style={{ background: "linear-gradient(135deg, #7c3aed, #5b21b6)" }}
            >
              <Icon name="UserPlus" size={14} />
              Добавить
            </button>
          </div>

          <div className="flex gap-1 px-4 pt-3">
            {(["all", "online"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
                style={{
                  background: activeTab === tab ? "rgba(124,58,237,0.3)" : "transparent",
                  color: activeTab === tab ? "var(--violet-light)" : "var(--text-secondary)",
                }}
              >
                {tab === "all" ? `Все (${friends.length})` : `Онлайн (${onlineCount})`}
              </button>
            ))}
          </div>

          <div className="px-4 pt-2 pb-1">
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "var(--text-secondary)" }}>
                <Icon name="Search" size={14} />
              </span>
              <input
                className="w-full rounded-xl pl-8 pr-4 py-2 text-sm focus:outline-none transition-all"
                style={{ background: "var(--surface-3)", color: "var(--text-primary)" }}
                placeholder="Найти друга..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          <div className="px-2 pb-2 mt-1">
            {filtered.length === 0 ? (
              <p className="text-center text-sm py-8" style={{ color: "var(--text-secondary)" }}>Никого не найдено</p>
            ) : (
              filtered.map((f) => <FriendRow key={f.id} friend={f} onRemove={removeFriend} />)
            )}
          </div>
        </div>
      </div>

      {showAdd && <AddFriendModal onAdd={addFriend} onClose={() => setShowAdd(false)} />}
    </div>
  );
}

function SettingsPage() {
  const [settings, setSettings] = useState({
    notifications: true,
    sounds: true,
    mentions: true,
    dnd: false,
    showActivity: true,
    showOnline: true,
    compactMode: false,
    darkTheme: true,
    twoFactor: false,
  });

  const toggle = (key: keyof typeof settings) =>
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));

  const sections = [
    {
      title: "Уведомления",
      icon: "Bell",
      color: "#7c3aed",
      items: [
        { key: "notifications", label: "Уведомления", desc: "Получать все уведомления" },
        { key: "sounds", label: "Звуки", desc: "Звуковые сигналы событий" },
        { key: "mentions", label: "Упоминания", desc: "Уведомлять при упоминании" },
        { key: "dnd", label: "Не беспокоить", desc: "Отключить все уведомления" },
      ],
    },
    {
      title: "Приватность",
      icon: "Shield",
      color: "#7c3aed",
      items: [
        { key: "showActivity", label: "Показывать активность", desc: "Друзья видят, что ты делаешь" },
        { key: "showOnline", label: "Показывать статус", desc: "Друзья видят, когда ты онлайн" },
        { key: "twoFactor", label: "Двухфакторная аутентификация", desc: "Дополнительная защита аккаунта" },
      ],
    },
    {
      title: "Интерфейс",
      icon: "Monitor",
      color: "#7c3aed",
      items: [
        { key: "compactMode", label: "Компактный режим", desc: "Уменьшить отступы" },
        { key: "darkTheme", label: "Тёмная тема", desc: "Использовать тёмное оформление" },
      ],
    },
  ];

  return (
    <div className="flex-1 overflow-y-auto px-4 py-6">
      <div className="mb-6">
        <h2 className="text-2xl font-black" style={{ color: "var(--text-primary)" }}>Настройки</h2>
        <p className="text-sm mt-1" style={{ color: "var(--text-secondary)" }}>Управляй своим аккаунтом и приложением</p>
      </div>

      <div className="space-y-4">
        {sections.map((section, si) => (
          <div key={section.title} className={`glass rounded-2xl overflow-hidden animate-fade-in stagger-${si + 1}`}>
            <div className="flex items-center gap-2.5 px-5 py-4" style={{ borderBottom: "1px solid var(--border)" }}>
              <div
                className="w-7 h-7 rounded-lg flex items-center justify-center"
                style={{ background: "rgba(124,58,237,0.15)", color: "var(--violet-light)" }}
              >
                <Icon name={section.icon as never} size={15} />
              </div>
              <h3 className="font-bold text-sm" style={{ color: "var(--text-primary)" }}>{section.title}</h3>
            </div>

            <div>
              {section.items.map((item, idx) => {
                const isOn = settings[item.key as keyof typeof settings];
                return (
                  <div
                    key={item.key}
                    className="flex items-center justify-between px-5 py-3.5 cursor-pointer hover:bg-white/[0.02] transition-colors"
                    style={idx < section.items.length - 1 ? { borderBottom: "1px solid var(--border)" } : {}}
                    onClick={() => toggle(item.key as keyof typeof settings)}
                  >
                    <div>
                      <p className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>{item.label}</p>
                      <p className="text-xs mt-0.5" style={{ color: "var(--text-secondary)" }}>{item.desc}</p>
                    </div>
                    <div
                      className="relative flex-shrink-0 ml-4 rounded-full"
                      style={{
                        width: 40,
                        height: 22,
                        background: isOn ? "#7c3aed" : "var(--surface-3)",
                        border: `1px solid ${isOn ? "#7c3aed" : "var(--border)"}`,
                        transition: "background 0.2s, border-color 0.2s",
                      }}
                    >
                      <span
                        className="absolute top-0.5 rounded-full bg-white"
                        style={{ width: 16, height: 16, left: isOn ? 21 : 2, transition: "left 0.2s" }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}

        <div className="glass rounded-2xl overflow-hidden animate-fade-in stagger-4" style={{ border: "1px solid rgba(242,63,67,0.2)" }}>
          <div className="flex items-center gap-2.5 px-5 py-4" style={{ borderBottom: "1px solid rgba(242,63,67,0.15)" }}>
            <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: "rgba(242,63,67,0.15)", color: "#f23f43" }}>
              <Icon name="AlertTriangle" size={15} />
            </div>
            <h3 className="font-bold text-sm" style={{ color: "#f23f43" }}>Опасная зона</h3>
          </div>
          <div className="px-5 py-4 flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>Удалить аккаунт</p>
              <p className="text-xs mt-0.5" style={{ color: "var(--text-secondary)" }}>Безвозвратное удаление всех данных</p>
            </div>
            <button
              className="px-4 py-2 rounded-xl text-xs font-semibold transition-all hover:scale-105"
              style={{ background: "rgba(242,63,67,0.15)", color: "#f23f43", border: "1px solid rgba(242,63,67,0.3)" }}
            >
              Удалить
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function NavItem({ icon, label, active, onClick }: { icon: string; label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all flex-1"
      style={{
        color: active ? "var(--violet-light)" : "var(--text-secondary)",
        background: active ? "rgba(124,58,237,0.15)" : "transparent",
      }}
    >
      <Icon name={icon as never} size={20} />
      <span className="text-xs font-semibold">{label}</span>
    </button>
  );
}

export default function Index() {
  const [page, setPage] = useState<Page>("home");

  return (
    <div
      className="min-h-screen flex flex-col font-golos"
      style={{ background: "var(--surface)", maxWidth: 480, margin: "0 auto" }}
    >
      <header
        className="flex items-center justify-between px-5 py-3.5 glass sticky top-0 z-40"
        style={{ borderBottom: "1px solid var(--border)" }}
      >
        <div className="flex items-center gap-2.5">
          <div
            className="w-8 h-8 rounded-xl flex items-center justify-center"
            style={{ background: "linear-gradient(135deg, #7c3aed, #5b21b6)", boxShadow: "0 0 12px rgba(124,58,237,0.4)" }}
          >
            <Icon name="Hexagon" size={16} className="text-white" />
          </div>
          <span className="font-black text-lg tracking-tight" style={{ color: "var(--text-primary)" }}>nexus</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            className="w-8 h-8 rounded-xl flex items-center justify-center glass-hover transition-colors"
            style={{ color: "var(--text-secondary)" }}
          >
            <Icon name="Bell" size={16} />
          </button>
          <button
            className="w-8 h-8 rounded-xl flex items-center justify-center glass-hover transition-colors"
            style={{ color: "var(--text-secondary)" }}
          >
            <Icon name="Search" size={16} />
          </button>
        </div>
      </header>

      <main className="flex-1 flex flex-col overflow-hidden" key={page}>
        {page === "home" && <HomePage onNavigate={setPage} />}
        {page === "profile" && <ProfilePage />}
        {page === "settings" && <SettingsPage />}
      </main>

      <nav
        className="glass sticky bottom-0 z-40 px-3 py-2 flex gap-1"
        style={{ borderTop: "1px solid var(--border)" }}
      >
        <NavItem icon="Home" label="Главная" active={page === "home"} onClick={() => setPage("home")} />
        <NavItem icon="User" label="Профиль" active={page === "profile"} onClick={() => setPage("profile")} />
        <NavItem icon="Settings" label="Настройки" active={page === "settings"} onClick={() => setPage("settings")} />
      </nav>
    </div>
  );
}

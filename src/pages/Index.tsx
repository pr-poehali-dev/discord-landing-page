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
  bio?: string;
  tags?: string[];
  joinedDays?: number;
}

interface Group {
  id: number;
  name: string;
  emoji: string;
  memberIds: number[];
  color: string;
}

const INITIAL_FRIENDS: Friend[] = [
  { id: 1, name: "Алексей Громов", username: "alexgrom", status: "online", avatar: "АГ", activity: "Играет в Valorant",
    bio: "Киберспорт, стримы, кофе по утрам. Всегда в поиске новых тиммейтов.", tags: ["Игры", "Стримы", "Esports"], joinedDays: 412 },
  { id: 2, name: "Мария Светлова", username: "mary_s", status: "idle", avatar: "МС",
    bio: "Дизайнер интерфейсов. Люблю минимализм и хорошую типографику.", tags: ["Дизайн", "UI/UX", "Кофе"], joinedDays: 218 },
  { id: 3, name: "Кирилл Чёрный", username: "k1rill", status: "online", avatar: "КЧ", activity: "В голосовом чате",
    bio: "Бэкенд-разработчик. Python, Go, и горы по выходным.", tags: ["Код", "Горы", "Музыка"], joinedDays: 95 },
  { id: 4, name: "Диана Орлова", username: "di_orlova", status: "dnd", avatar: "ДО", activity: "Не беспокоить",
    bio: "Иллюстратор и автор комиксов. Не пишите по ночам — кусаюсь.", tags: ["Арт", "Комиксы"], joinedDays: 730 },
  { id: 5, name: "Павел Рябов", username: "pavel_r", status: "offline", avatar: "ПР",
    bio: "Музыкант, продюсер. Ищу вокалистов для нового трека.", tags: ["Музыка", "Продакшн"], joinedDays: 56 },
];

const INITIAL_GROUPS: Group[] = [
  { id: 1, name: "Игровая команда", emoji: "🎮", memberIds: [1, 3], color: "#7c3aed" },
  { id: 2, name: "Дизайн-чат", emoji: "🎨", memberIds: [2, 4], color: "#ec4899" },
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

const GROUP_EMOJIS = ["🎮", "🎨", "🎵", "💻", "📚", "🚀", "🔥", "⚽", "🍕", "🌟"];
const GROUP_COLORS = ["#7c3aed", "#ec4899", "#f59e0b", "#10b981", "#3b82f6", "#ef4444"];

function AvatarBubble({ initials, size = "md", color = "#7c3aed" }: { initials: string; size?: "xs" | "sm" | "md" | "lg" | "xl"; color?: string }) {
  const sizes = {
    xs: "w-6 h-6 text-[10px]",
    sm: "w-8 h-8 text-xs",
    md: "w-10 h-10 text-sm",
    lg: "w-16 h-16 text-xl",
    xl: "w-24 h-24 text-3xl",
  };
  return (
    <div
      className={`${sizes[size]} rounded-full flex items-center justify-center font-bold text-white flex-shrink-0`}
      style={{ background: `linear-gradient(135deg, ${color}, #5b21b6)` }}
    >
      {initials}
    </div>
  );
}

function StackedAvatars({ friends, max = 3 }: { friends: Friend[]; max?: number }) {
  const visible = friends.slice(0, max);
  const rest = friends.length - max;
  return (
    <div className="flex -space-x-2">
      {visible.map((f) => (
        <div key={f.id} style={{ border: "2px solid var(--surface-2)", borderRadius: "9999px" }}>
          <AvatarBubble initials={f.avatar} size="xs" />
        </div>
      ))}
      {rest > 0 && (
        <div
          className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold"
          style={{
            background: "var(--surface-3)",
            color: "var(--text-secondary)",
            border: "2px solid var(--surface-2)",
          }}
        >
          +{rest}
        </div>
      )}
    </div>
  );
}

function FriendRow({
  friend,
  onRemove,
  onOpen,
}: {
  friend: Friend;
  onRemove: (id: number) => void;
  onOpen: (id: number) => void;
}) {
  return (
    <div
      onClick={() => onOpen(friend.id)}
      className="flex items-center gap-3 px-3 py-2.5 rounded-xl glass-hover group cursor-pointer animate-fade-in"
    >
      <div className="relative">
        <AvatarBubble initials={friend.avatar} size="md" />
        <span
          className="absolute -bottom-0.5 -right-0.5 rounded-full"
          style={{ width: 12, height: 12, background: STATUS_COLORS[friend.status], border: "2px solid var(--surface-2)" }}
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
          <button onClick={onClose} style={{ color: "var(--text-secondary)" }}>
            <Icon name="X" size={18} />
          </button>
        </div>
        <div className="space-y-3">
          <input
            className="w-full rounded-xl px-4 py-2.5 text-sm focus:outline-none"
            style={{ background: "var(--surface-3)", border: "1px solid var(--border)", color: "var(--text-primary)" }}
            placeholder="Имя пользователя"
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoFocus
          />
          <input
            className="w-full rounded-xl px-4 py-2.5 text-sm focus:outline-none"
            style={{ background: "var(--surface-3)", border: "1px solid var(--border)", color: "var(--text-primary)" }}
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

function CreateGroupModal({
  friends,
  onCreate,
  onClose,
}: {
  friends: Friend[];
  onCreate: (name: string, memberIds: number[], emoji: string, color: string) => void;
  onClose: () => void;
}) {
  const [name, setName] = useState("");
  const [emoji, setEmoji] = useState(GROUP_EMOJIS[0]);
  const [color, setColor] = useState(GROUP_COLORS[0]);
  const [selected, setSelected] = useState<number[]>([]);

  const toggle = (id: number) =>
    setSelected((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));

  const handle = () => {
    if (!name.trim() || selected.length === 0) return;
    onCreate(name.trim(), selected, emoji, color);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/70 backdrop-blur-sm" onClick={onClose}>
      <div
        className="glass rounded-t-3xl sm:rounded-3xl w-full max-w-sm mx-0 sm:mx-4 animate-scale-in flex flex-col max-h-[85vh]"
        style={{ border: "1px solid rgba(124,58,237,0.3)" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 pt-6 pb-4">
          <div>
            <h3 className="font-black text-xl" style={{ color: "var(--text-primary)" }}>Новая группа</h3>
            <p className="text-xs mt-0.5" style={{ color: "var(--text-secondary)" }}>Собери своих людей в одно место</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: "var(--surface-3)", color: "var(--text-secondary)" }}>
            <Icon name="X" size={16} />
          </button>
        </div>

        <div className="px-6 pb-3">
          <div className="flex items-center gap-3">
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0"
              style={{ background: `linear-gradient(135deg, ${color}, ${color}88)`, boxShadow: `0 0 20px ${color}55` }}
            >
              {emoji}
            </div>
            <input
              className="flex-1 rounded-xl px-4 py-3 text-sm font-semibold focus:outline-none"
              style={{ background: "var(--surface-3)", border: "1px solid var(--border)", color: "var(--text-primary)" }}
              placeholder="Название группы"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoFocus
            />
          </div>
        </div>

        <div className="px-6 pb-3">
          <p className="text-[10px] font-bold tracking-widest uppercase mb-2" style={{ color: "var(--text-secondary)" }}>Иконка</p>
          <div className="flex gap-1.5 overflow-x-auto pb-1">
            {GROUP_EMOJIS.map((e) => (
              <button
                key={e}
                onClick={() => setEmoji(e)}
                className="w-9 h-9 rounded-xl flex items-center justify-center text-lg flex-shrink-0 transition-all"
                style={{
                  background: emoji === e ? "rgba(124,58,237,0.25)" : "var(--surface-3)",
                  border: `1px solid ${emoji === e ? "var(--violet)" : "transparent"}`,
                  transform: emoji === e ? "scale(1.05)" : "scale(1)",
                }}
              >
                {e}
              </button>
            ))}
          </div>
        </div>

        <div className="px-6 pb-3">
          <p className="text-[10px] font-bold tracking-widest uppercase mb-2" style={{ color: "var(--text-secondary)" }}>Цвет</p>
          <div className="flex gap-2">
            {GROUP_COLORS.map((c) => (
              <button
                key={c}
                onClick={() => setColor(c)}
                className="w-7 h-7 rounded-full transition-all"
                style={{
                  background: c,
                  border: color === c ? "2px solid white" : "2px solid transparent",
                  transform: color === c ? "scale(1.15)" : "scale(1)",
                  boxShadow: color === c ? `0 0 12px ${c}` : "none",
                }}
              />
            ))}
          </div>
        </div>

        <div className="px-6 pb-2">
          <div className="flex items-center justify-between mb-2">
            <p className="text-[10px] font-bold tracking-widest uppercase" style={{ color: "var(--text-secondary)" }}>Участники</p>
            <p className="text-[10px] font-semibold" style={{ color: "var(--violet-light)" }}>Выбрано: {selected.length}</p>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-3 pb-2">
          {friends.map((f) => {
            const isSelected = selected.includes(f.id);
            return (
              <div
                key={f.id}
                onClick={() => toggle(f.id)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer transition-all"
                style={{ background: isSelected ? "rgba(124,58,237,0.12)" : "transparent" }}
              >
                <div className="relative">
                  <AvatarBubble initials={f.avatar} size="md" />
                  <span
                    className="absolute -bottom-0.5 -right-0.5 rounded-full"
                    style={{ width: 11, height: 11, background: STATUS_COLORS[f.status], border: "2px solid var(--surface-2)" }}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm truncate" style={{ color: "var(--text-primary)" }}>{f.name}</p>
                  <p className="text-xs truncate" style={{ color: "var(--text-secondary)" }}>@{f.username}</p>
                </div>
                <div
                  className="w-6 h-6 rounded-lg flex items-center justify-center transition-all"
                  style={{
                    background: isSelected ? "var(--violet)" : "transparent",
                    border: `2px solid ${isSelected ? "var(--violet)" : "var(--border)"}`,
                    transform: isSelected ? "scale(1.05)" : "scale(1)",
                  }}
                >
                  {isSelected && <Icon name="Check" size={14} className="text-white" />}
                </div>
              </div>
            );
          })}
        </div>

        <div className="px-6 py-4" style={{ borderTop: "1px solid var(--border)" }}>
          <button
            onClick={handle}
            disabled={!name.trim() || selected.length === 0}
            className="w-full py-3 rounded-xl font-bold text-sm text-white transition-all disabled:opacity-40 disabled:cursor-not-allowed enabled:hover:scale-[1.02] enabled:active:scale-[0.98]"
            style={{ background: "linear-gradient(135deg, #7c3aed, #5b21b6)" }}
          >
            Создать группу{selected.length > 0 ? ` · ${selected.length}` : ""}
          </button>
        </div>
      </div>
    </div>
  );
}

function FriendProfileModal({
  friend,
  onClose,
}: {
  friend: Friend;
  onClose: () => void;
}) {
  const since = friend.joinedDays ?? 0;
  const sinceText = since > 365 ? `${Math.floor(since / 365)} г.` : `${since} дн.`;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/70 backdrop-blur-sm" onClick={onClose}>
      <div
        className="rounded-t-3xl sm:rounded-3xl w-full max-w-sm mx-0 sm:mx-4 animate-scale-in overflow-hidden"
        style={{ background: "var(--surface-2)", border: "1px solid var(--border)" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative">
          <div className="h-24" style={{ background: "linear-gradient(135deg, #3b0764 0%, #1e1b4b 50%, #0f0f13 100%)" }} />
          <button
            onClick={onClose}
            className="absolute top-3 right-3 w-8 h-8 rounded-xl flex items-center justify-center backdrop-blur-md"
            style={{ background: "rgba(0,0,0,0.4)", color: "white" }}
          >
            <Icon name="X" size={16} />
          </button>

          <div className="absolute -bottom-12 left-5">
            <div className="relative" style={{ border: "4px solid var(--surface-2)", borderRadius: "9999px" }}>
              <AvatarBubble initials={friend.avatar} size="xl" />
              <span
                className="absolute bottom-1 right-1 rounded-full"
                style={{ width: 22, height: 22, background: STATUS_COLORS[friend.status], border: "4px solid var(--surface-2)" }}
              />
            </div>
          </div>
        </div>

        <div className="px-5 pt-14 pb-5">
          <div className="flex items-start justify-between mb-3">
            <div className="min-w-0">
              <h2 className="font-black text-xl truncate" style={{ color: "var(--text-primary)" }}>{friend.name}</h2>
              <p className="text-sm truncate" style={{ color: "var(--text-secondary)" }}>@{friend.username}</p>
            </div>
          </div>

          <div
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold mb-3"
            style={{ background: "var(--surface-3)", color: "var(--text-primary)" }}
          >
            <span className="w-1.5 h-1.5 rounded-full" style={{ background: STATUS_COLORS[friend.status] }} />
            {friend.activity || STATUS_LABELS[friend.status]}
          </div>

          {friend.bio && (
            <div className="mb-4 p-3 rounded-xl" style={{ background: "var(--surface-3)" }}>
              <p className="text-[10px] font-bold tracking-widest uppercase mb-1" style={{ color: "var(--text-secondary)" }}>О себе</p>
              <p className="text-sm" style={{ color: "var(--text-primary)" }}>{friend.bio}</p>
            </div>
          )}

          {friend.tags && friend.tags.length > 0 && (
            <div className="mb-4">
              <p className="text-[10px] font-bold tracking-widest uppercase mb-2" style={{ color: "var(--text-secondary)" }}>Интересы</p>
              <div className="flex gap-1.5 flex-wrap">
                {friend.tags.map((t) => (
                  <span
                    key={t}
                    className="px-2.5 py-1 rounded-full text-xs font-semibold"
                    style={{ background: "rgba(124,58,237,0.18)", color: "var(--violet-light)", border: "1px solid rgba(124,58,237,0.3)" }}
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-2 mb-4">
            <div className="p-3 rounded-xl text-center" style={{ background: "var(--surface-3)" }}>
              <p className="text-lg font-black gradient-text">{sinceText}</p>
              <p className="text-[10px] mt-0.5" style={{ color: "var(--text-secondary)" }}>В Nexus</p>
            </div>
            <div className="p-3 rounded-xl text-center" style={{ background: "var(--surface-3)" }}>
              <p className="text-lg font-black gradient-text">{Math.floor(Math.random() * 50) + 5}</p>
              <p className="text-[10px] mt-0.5" style={{ color: "var(--text-secondary)" }}>Общих друзей</p>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              className="flex-1 py-2.5 rounded-xl font-semibold text-sm text-white transition-all hover:scale-[1.02]"
              style={{ background: "linear-gradient(135deg, #7c3aed, #5b21b6)" }}
            >
              <span className="inline-flex items-center gap-1.5">
                <Icon name="MessageCircle" size={15} /> Написать
              </span>
            </button>
            <button
              className="px-4 py-2.5 rounded-xl font-semibold text-sm transition-all hover:scale-[1.02]"
              style={{ background: "var(--surface-3)", color: "var(--text-primary)", border: "1px solid var(--border)" }}
            >
              <Icon name="Phone" size={15} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function GroupCard({ group, friends, onOpen }: { group: Group; friends: Friend[]; onOpen: (g: Group) => void }) {
  const members = friends.filter((f) => group.memberIds.includes(f.id));
  return (
    <button
      onClick={() => onOpen(group)}
      className="w-full glass rounded-2xl p-4 glass-hover transition-all text-left animate-fade-in"
    >
      <div className="flex items-center gap-3">
        <div
          className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0"
          style={{ background: `linear-gradient(135deg, ${group.color}, ${group.color}88)`, boxShadow: `0 0 16px ${group.color}40` }}
        >
          {group.emoji}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-bold text-sm truncate" style={{ color: "var(--text-primary)" }}>{group.name}</p>
          <p className="text-xs mb-1.5" style={{ color: "var(--text-secondary)" }}>{members.length} участников</p>
          <StackedAvatars friends={members} max={4} />
        </div>
      </div>
    </button>
  );
}

function GroupDetailModal({ group, friends, onClose, onDelete }: { group: Group; friends: Friend[]; onClose: () => void; onDelete: (id: number) => void }) {
  const members = friends.filter((f) => group.memberIds.includes(f.id));
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/70 backdrop-blur-sm" onClick={onClose}>
      <div
        className="rounded-t-3xl sm:rounded-3xl w-full max-w-sm mx-0 sm:mx-4 animate-scale-in overflow-hidden"
        style={{ background: "var(--surface-2)", border: "1px solid var(--border)" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative px-6 pt-6 pb-5" style={{ background: `linear-gradient(135deg, ${group.color}30, transparent)` }}>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-xl flex items-center justify-center"
            style={{ background: "rgba(0,0,0,0.4)", color: "white" }}
          >
            <Icon name="X" size={16} />
          </button>
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl mb-3"
            style={{ background: `linear-gradient(135deg, ${group.color}, ${group.color}88)`, boxShadow: `0 0 20px ${group.color}55` }}
          >
            {group.emoji}
          </div>
          <h2 className="font-black text-xl" style={{ color: "var(--text-primary)" }}>{group.name}</h2>
          <p className="text-sm" style={{ color: "var(--text-secondary)" }}>{members.length} участников</p>
        </div>

        <div className="px-3 pb-3 max-h-[40vh] overflow-y-auto">
          <p className="text-[10px] font-bold tracking-widest uppercase px-3 pt-3 pb-2" style={{ color: "var(--text-secondary)" }}>Участники</p>
          {members.map((f) => (
            <div key={f.id} className="flex items-center gap-3 px-3 py-2 rounded-xl">
              <div className="relative">
                <AvatarBubble initials={f.avatar} size="md" />
                <span
                  className="absolute -bottom-0.5 -right-0.5 rounded-full"
                  style={{ width: 11, height: 11, background: STATUS_COLORS[f.status], border: "2px solid var(--surface-2)" }}
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm truncate" style={{ color: "var(--text-primary)" }}>{f.name}</p>
                <p className="text-xs truncate" style={{ color: "var(--text-secondary)" }}>@{f.username}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="px-6 py-4 flex gap-2" style={{ borderTop: "1px solid var(--border)" }}>
          <button
            className="flex-1 py-2.5 rounded-xl font-semibold text-sm text-white transition-all hover:scale-[1.02]"
            style={{ background: "linear-gradient(135deg, #7c3aed, #5b21b6)" }}
          >
            <span className="inline-flex items-center gap-1.5">
              <Icon name="MessageCircle" size={15} /> Открыть чат
            </span>
          </button>
          <button
            onClick={() => { onDelete(group.id); onClose(); }}
            className="px-4 py-2.5 rounded-xl font-semibold text-sm transition-all hover:scale-[1.02]"
            style={{ background: "rgba(242,63,67,0.15)", color: "#f23f43", border: "1px solid rgba(242,63,67,0.3)" }}
          >
            <Icon name="Trash2" size={15} />
          </button>
        </div>
      </div>
    </div>
  );
}

function HomePage({ onNavigate }: { onNavigate: (p: Page) => void }) {
  const features = [
    { icon: "MessageCircle", title: "Общение", desc: "Текстовые и голосовые каналы для команд и друзей" },
    { icon: "Users", title: "Группы", desc: "Создавай группы и собирай друзей по интересам" },
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
        <p className="text-center text-xs font-semibold tracking-widest uppercase mb-6" style={{ color: "var(--text-secondary)" }}>
          Возможности
        </p>
        <div className="grid grid-cols-2 gap-3">
          {features.map((f, i) => (
            <div key={f.title} className={`glass rounded-2xl p-4 glass-hover animate-fade-in stagger-${i + 1}`}>
              <div className="w-9 h-9 rounded-xl flex items-center justify-center mb-3" style={{ background: "rgba(124,58,237,0.15)", color: "var(--violet-light)" }}>
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
  const [groups, setGroups] = useState<Group[]>(INITIAL_GROUPS);
  const [showAdd, setShowAdd] = useState(false);
  const [showCreateGroup, setShowCreateGroup] = useState(false);
  const [openFriendId, setOpenFriendId] = useState<number | null>(null);
  const [openGroup, setOpenGroup] = useState<Group | null>(null);
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState<"friends" | "groups">("friends");

  const filtered = friends.filter(
    (f) => f.name.toLowerCase().includes(search.toLowerCase()) || f.username.toLowerCase().includes(search.toLowerCase()),
  );

  const onlineCount = friends.filter((f) => f.status === "online").length;

  const removeFriend = (id: number) => {
    setFriends((prev) => prev.filter((f) => f.id !== id));
    setGroups((prev) => prev.map((g) => ({ ...g, memberIds: g.memberIds.filter((m) => m !== id) })));
  };

  const addFriend = (name: string, username: string) => {
    const statuses: Status[] = ["online", "offline", "idle"];
    setFriends((prev) => [
      ...prev,
      {
        id: Date.now(),
        name,
        username,
        status: statuses[Math.floor(Math.random() * statuses.length)],
        avatar: name.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2),
        bio: "Новый участник Nexus.",
        tags: ["Новичок"],
        joinedDays: 1,
      },
    ]);
  };

  const createGroup = (name: string, memberIds: number[], emoji: string, color: string) => {
    setGroups((prev) => [...prev, { id: Date.now(), name, memberIds, emoji, color }]);
  };

  const deleteGroup = (id: number) => setGroups((prev) => prev.filter((g) => g.id !== id));

  const openFriend = friends.find((f) => f.id === openFriendId);

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="relative">
        <div className="h-28 w-full" style={{ background: "linear-gradient(135deg, #3b0764 0%, #1e1b4b 50%, var(--surface) 100%)" }} />
        <div className="px-5 pb-6">
          <div className="flex items-end gap-4 -mt-8 mb-4">
            <div className="relative">
              <div style={{ border: "3px solid var(--surface)", borderRadius: "9999px" }}>
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
              Изменить
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

      {/* Switcher */}
      <div className="px-4 mb-3">
        <div className="glass rounded-2xl p-1 flex gap-1">
          {(["friends", "groups"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className="flex-1 py-2 rounded-xl text-sm font-semibold transition-all"
              style={{
                background: activeTab === tab ? "linear-gradient(135deg, #7c3aed, #5b21b6)" : "transparent",
                color: activeTab === tab ? "white" : "var(--text-secondary)",
              }}
            >
              {tab === "friends" ? `Друзья · ${friends.length}` : `Группы · ${groups.length}`}
            </button>
          ))}
        </div>
      </div>

      {activeTab === "friends" ? (
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

            <div className="px-4 pt-3 pb-1">
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "var(--text-secondary)" }}>
                  <Icon name="Search" size={14} />
                </span>
                <input
                  className="w-full rounded-xl pl-8 pr-4 py-2 text-sm focus:outline-none"
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
                filtered.map((f) => (
                  <FriendRow key={f.id} friend={f} onRemove={removeFriend} onOpen={(id) => setOpenFriendId(id)} />
                ))
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="px-4 pb-8">
          <button
            onClick={() => setShowCreateGroup(true)}
            className="w-full mb-3 flex items-center justify-center gap-2 py-3 rounded-2xl font-semibold text-sm text-white transition-all hover:scale-[1.01]"
            style={{ background: "linear-gradient(135deg, #7c3aed, #5b21b6)", boxShadow: "0 4px 24px rgba(124,58,237,0.35)" }}
          >
            <Icon name="Plus" size={16} />
            Создать новую группу
          </button>

          {groups.length === 0 ? (
            <div className="glass rounded-2xl p-10 text-center">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-3 text-2xl" style={{ background: "var(--surface-3)" }}>
                👥
              </div>
              <p className="text-sm font-semibold mb-1" style={{ color: "var(--text-primary)" }}>Пока нет групп</p>
              <p className="text-xs" style={{ color: "var(--text-secondary)" }}>Создай первую и собери друзей вместе</p>
            </div>
          ) : (
            <div className="space-y-2">
              {groups.map((g) => (
                <GroupCard key={g.id} group={g} friends={friends} onOpen={(grp) => setOpenGroup(grp)} />
              ))}
            </div>
          )}
        </div>
      )}

      {showAdd && <AddFriendModal onAdd={addFriend} onClose={() => setShowAdd(false)} />}
      {showCreateGroup && <CreateGroupModal friends={friends} onCreate={createGroup} onClose={() => setShowCreateGroup(false)} />}
      {openFriend && <FriendProfileModal friend={openFriend} onClose={() => setOpenFriendId(null)} />}
      {openGroup && <GroupDetailModal group={openGroup} friends={friends} onClose={() => setOpenGroup(null)} onDelete={deleteGroup} />}
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

  const toggle = (key: keyof typeof settings) => setSettings((prev) => ({ ...prev, [key]: !prev[key] }));

  const sections = [
    {
      title: "Уведомления", icon: "Bell",
      items: [
        { key: "notifications", label: "Уведомления", desc: "Получать все уведомления" },
        { key: "sounds", label: "Звуки", desc: "Звуковые сигналы событий" },
        { key: "mentions", label: "Упоминания", desc: "Уведомлять при упоминании" },
        { key: "dnd", label: "Не беспокоить", desc: "Отключить все уведомления" },
      ],
    },
    {
      title: "Приватность", icon: "Shield",
      items: [
        { key: "showActivity", label: "Показывать активность", desc: "Друзья видят, что ты делаешь" },
        { key: "showOnline", label: "Показывать статус", desc: "Друзья видят, когда ты онлайн" },
        { key: "twoFactor", label: "Двухфакторная аутентификация", desc: "Дополнительная защита аккаунта" },
      ],
    },
    {
      title: "Интерфейс", icon: "Monitor",
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
              <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: "rgba(124,58,237,0.15)", color: "var(--violet-light)" }}>
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
                        width: 40, height: 22,
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

import { FiFolder, FiGrid, FiHeart, FiHome, FiTrash2 } from "react-icons/fi";
import { NavLink } from "react-router-dom";

const navItems = [
	{ to: "/dashboard", label: "Dashboard", icon: FiHome },
	{ to: "/files", label: "My Files", icon: FiFolder },
	{ to: "/favorites", label: "Favorites", icon: FiHeart },
	{ to: "/trash", label: "Trash", icon: FiTrash2 },
];

export default function Sidebar() {
	return (
		<aside className="glass-panel hidden w-[260px] shrink-0 flex-col rounded-[26px] p-3 lg:flex">
			<div className="mb-4 flex items-center gap-3 rounded-2xl bg-[var(--soft)] px-3 py-3">
				<div className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-violet-500 to-sky-400 text-white">
					<FiGrid size={18} />
				</div>
				<div>
					<div className="text-sm font-semibold text-[var(--text)]">FileHub</div>
					<div className="text-xs text-[var(--muted)]">Your workspace</div>
				</div>
			</div>

			<nav className="space-y-1.5">
				{navItems.map(({ to, label, icon: Icon }) => (
					<NavLink
						key={to}
						to={to}
						className={({ isActive }) =>
							`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
								isActive
									? "bg-[var(--soft)] text-[var(--text)]"
									: "text-[var(--muted)] hover:bg-[var(--soft)] hover:text-[var(--text)]"
							}`
						}
					>
						<Icon size={16} />
						{label}
					</NavLink>
				))}
			</nav>
		</aside>
	);
}


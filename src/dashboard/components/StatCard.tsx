import { ReactNode } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, type LucideIcon } from "lucide-react";

type Props = {
  label: string;
  value: ReactNode;
  icon: LucideIcon;
  trend?: string;
  onClick?: () => void;
};

const StatCard = ({ label, value, icon: Icon, trend, onClick }: Props) => (
  <motion.button
    whileHover={{ y: -2 }}
    onClick={onClick}
    type="button"
    className="text-left card-dark p-5 hover:border-primary/50 transition-colors group w-full"
  >
    <div className="flex items-start justify-between mb-3">
      <div className="w-10 h-10 rounded-xl bg-primary/15 border border-primary/30 flex items-center justify-center">
        <Icon className="w-5 h-5 text-primary" />
      </div>
      <ArrowUpRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
    </div>
    <p className="text-xs uppercase tracking-wider text-muted-foreground">{label}</p>
    <p className="text-2xl md:text-3xl font-extrabold mt-1">{value}</p>
    {trend && <p className="text-xs text-emerald-400 mt-1.5 font-medium">{trend}</p>}
  </motion.button>
);

export default StatCard;

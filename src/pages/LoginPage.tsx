import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Circle, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const HERO_VIDEO =
  'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260506_081238_406ed0e3-5d83-436e-a512-0bbff7ec5b95.mp4';

const heroVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.2 },
  },
};

const childVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const success = await login(email, password);
    setLoading(false);
    if (success) navigate('/faq');
    else setError('Please enter a valid email address.');
  };

  return (
    <main className="flex min-h-screen w-full bg-black p-2 transition-all duration-500 selection:bg-white/30 lg:h-screen lg:overflow-hidden lg:p-4">
      {/* Left Column — Hero */}
      <div className="relative hidden h-full w-[52%] flex-col items-center justify-end overflow-hidden rounded-3xl px-12 pb-32 shadow-2xl lg:flex">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 h-full w-full object-cover"
        >
          <source src={HERO_VIDEO} type="video/mp4" />
        </video>

        <motion.div
          variants={heroVariants}
          initial="hidden"
          animate="visible"
          className="relative z-10 w-full max-w-xs space-y-8"
        >
          <motion.div variants={childVariants} className="flex items-center gap-2">
            <Circle className="fill-white text-white" size={24} />
            <span className="text-xl font-semibold tracking-tight">ClickFAQ</span>
          </motion.div>

          <motion.div variants={childVariants} className="space-y-3">
            <h1 className="text-4xl font-medium tracking-tight whitespace-nowrap">
              Welcome Back
            </h1>
            <p className="px-4 text-sm leading-relaxed text-white/60">
              Access your FAQ dashboard, track engagement, and get instant answers.
            </p>
          </motion.div>

          <motion.div variants={childVariants} className="space-y-3">
            <StepItem number={1} text="Sign in to your account" active />
            <StepItem number={2} text="Browse & search FAQs" />
            <StepItem number={3} text="Get help when you need it" />
          </motion.div>
        </motion.div>
      </div>

      {/* Right Column — Login Form */}
      <div className="flex flex-1 flex-col items-center justify-center overflow-y-auto px-4 py-12 sm:px-12 lg:overflow-hidden lg:px-16 lg:py-6 xl:px-24">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="w-full max-w-xl space-y-8 sm:space-y-10 lg:space-y-6"
        >
          <div className="space-y-2">
            <h2 className="text-3xl font-medium tracking-tight">Sign In</h2>
            <p className="text-sm text-white/40">
              Enter your credentials to access the FAQ platform.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <InputGroup
              label="Email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={setEmail}
            />

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-white">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="h-11 w-full rounded-xl border-none bg-brand-gray px-4 pr-12 text-white placeholder:text-white/20 focus:ring-2 focus:ring-white/20 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute top-1/2 right-3 -translate-y-1/2 text-white/30 hover:text-white/60"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {error && (
              <p className="text-sm text-red-400">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="mt-4 h-14 w-full rounded-xl bg-white font-semibold text-black transition-all hover:bg-white/90 active:scale-[0.98] disabled:opacity-50"
            >
              {loading ? 'Signing in…' : 'Sign In'}
            </button>
          </form>

          <p className="text-center text-sm text-white/30">
            Demo mode — any email and password will work.
          </p>
        </motion.div>
      </div>
    </main>
  );
}

function StepItem({
  number,
  text,
  active = false,
}: {
  number: number;
  text: string;
  active?: boolean;
}) {
  return (
    <div
      className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm ${
        active
          ? 'border border-white bg-white text-black'
          : 'border-none bg-brand-gray text-white'
      }`}
    >
      <span
        className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${
          active ? 'bg-black text-white' : 'bg-white/10 text-white/40'
        }`}
      >
        {number}
      </span>
      {text}
    </div>
  );
}

function InputGroup({
  label,
  type,
  placeholder,
  value,
  onChange,
}: {
  label: string;
  type: string;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="space-y-1.5">
      <label className="text-sm font-medium text-white">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="h-11 w-full rounded-xl border-none bg-brand-gray px-4 text-white placeholder:text-white/20 focus:ring-2 focus:ring-white/20 focus:outline-none"
      />
    </div>
  );
}

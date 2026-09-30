// CareOS Hospital Operating System — Role-Based Access Control & Login Modal
import React, { useState } from 'react';
import { useHospital } from '../../state/hospitalStore';
import { PRESET_USERS, ROLE_DEFINITIONS } from '../../data/userRoles';
import { UserProfile, UserRole } from '../../types/hospital';
import {
  X,
  ShieldCheck,
  CheckCircle2,
  Lock,
  UserCheck,
  Building2,
  Stethoscope,
  HeartHandshake,
  Receipt,
  LogOut,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose }) => {
  const { currentUser, setCurrentUser, logoutUser } = useHospital();
  const [selectedUser, setSelectedUser] = useState<UserProfile>(
    currentUser || PRESET_USERS[0]
  );
  const [isManualMode, setIsManualMode] = useState(false);
  const [manualEmail, setManualEmail] = useState('');
  const [manualPassword, setManualPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  if (!isOpen) return null;

  const handleSelectRole = (user: UserProfile) => {
    setSelectedUser(user);
    setErrorMessage('');
  };

  const handleConfirmLogin = (userToLogin?: UserProfile) => {
    const user = userToLogin || selectedUser;
    setCurrentUser(user);
    onClose();
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualEmail.trim()) {
      setErrorMessage('Please enter an email address.');
      return;
    }

    // Match or create custom
    const matched = PRESET_USERS.find(
      (u) => u.email.toLowerCase() === manualEmail.toLowerCase()
    );

    if (matched) {
      setCurrentUser(matched);
      onClose();
    } else {
      // Default to doctor/admin
      const customUser: UserProfile = {
        id: `USR-${Date.now().toString(36)}`,
        name: manualEmail.split('@')[0],
        email: manualEmail,
        role: 'doctor',
        title: 'Clinical Practitioner',
        department: 'General Medicine',
        avatar: '',
        initials: manualEmail.slice(0, 2).toUpperCase(),
        permissions: ['view_patient_journeys', 'review_diagnostics'],
      };
      setCurrentUser(customUser);
      onClose();
    }
  };

  const handleLogout = () => {
    logoutUser();
    onClose();
  };

  const getRoleIcon = (role: UserRole) => {
    switch (role) {
      case 'admin':
        return <ShieldCheck className="w-4 h-4 text-[#2563EB]" />;
      case 'operations':
        return <Building2 className="w-4 h-4 text-[#0F9F9A]" />;
      case 'doctor':
        return <Stethoscope className="w-4 h-4 text-[#7C3AED]" />;
      case 'nurse':
        return <HeartHandshake className="w-4 h-4 text-[#16A34A]" />;
      case 'billing':
        return <Receipt className="w-4 h-4 text-[#D97706]" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
      <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-2xl w-full max-w-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#E2E8F0] bg-[#F6F9FC] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#2563EB] text-white flex items-center justify-center font-bold text-sm shadow-xs">
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#172B4D]">
                CareOS Role-Based Access Control
              </h3>
              <p className="text-[11px] text-[#64748B]">
                Hospital Staff Authentication • CareOne Multispecialty Hospital
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-md text-[#64748B] hover:text-[#172B4D] hover:bg-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-4">
          {/* Active User Banner if logged in */}
          {currentUser && (
            <div className="p-3.5 rounded-xl bg-[#EAF2FF]/60 border border-[#2563EB]/20 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#2563EB] text-white font-bold flex items-center justify-center text-sm shadow-xs">
                  {currentUser.initials}
                </div>
                <div>
                  <div className="text-xs font-bold text-[#172B4D] flex items-center gap-2">
                    <span>{currentUser.name}</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-white text-[#2563EB] border border-[#2563EB]/30 uppercase">
                      {ROLE_DEFINITIONS[currentUser.role]?.label || currentUser.role}
                    </span>
                  </div>
                  <div className="text-[11px] text-[#64748B]">
                    {currentUser.email} • {currentUser.department}
                  </div>
                </div>
              </div>

              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-[#DC2626]/30 text-[#DC2626] hover:bg-[#FEECEC] text-xs font-semibold transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </button>
            </div>
          )}

          {/* Role Selection Mode Switch */}
          <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-2">
            <span className="text-xs font-bold text-[#172B4D] uppercase tracking-wider">
              {isManualMode ? 'Sign In with Email' : 'Quick Role Switcher (Select Staff Persona)'}
            </span>
            <button
              onClick={() => setIsManualMode(!isManualMode)}
              className="text-xs text-[#2563EB] font-semibold hover:underline"
            >
              {isManualMode ? '← Use 1-Click Role Switcher' : 'Enter Custom Email →'}
            </button>
          </div>

          {/* Quick 1-Click Role Selection */}
          {!isManualMode ? (
            <div className="space-y-2 max-h-[310px] overflow-y-auto pr-1">
              {PRESET_USERS.map((user) => {
                const roleMeta = ROLE_DEFINITIONS[user.role];
                const isSelected = selectedUser.id === user.id;

                return (
                  <div
                    key={user.id}
                    onClick={() => handleSelectRole(user)}
                    className={`p-3 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                      isSelected
                        ? 'border-[#2563EB] bg-[#EAF2FF] shadow-xs'
                        : 'border-[#E2E8F0] hover:bg-[#F6F9FC]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-white border border-[#E2E8F0] text-[#172B4D] font-bold flex items-center justify-center text-xs shrink-0 shadow-xs">
                        {user.initials}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-[#172B4D]">
                            {user.name}
                          </span>
                          <span
                            className={`px-2 py-0.2 rounded text-[10px] font-bold border uppercase ${roleMeta.bg} ${roleMeta.color} ${roleMeta.border}`}
                          >
                            {roleMeta.label}
                          </span>
                        </div>
                        <div className="text-[11px] text-[#64748B]">
                          {user.title} • {user.department}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {isSelected ? (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleConfirmLogin(user);
                          }}
                          className="px-3 py-1 rounded-lg bg-[#2563EB] text-white text-xs font-bold shadow-xs hover:bg-[#1D4ED8]"
                        >
                          Switch to Role
                        </button>
                      ) : (
                        <span className="text-xs text-[#64748B] hover:text-[#2563EB]">
                          Select →
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            /* Manual Email Form */
            <form onSubmit={handleManualSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-[#172B4D] mb-1">
                  Hospital Email
                </label>
                <input
                  type="email"
                  value={manualEmail}
                  onChange={(e) => setManualEmail(e.target.value)}
                  placeholder="e.g. dr.murthy@careone.health"
                  className="w-full bg-[#F6F9FC] border border-[#E2E8F0] focus:border-[#2563EB] focus:bg-white rounded-lg px-3 py-2 text-xs text-[#172B4D] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#172B4D] mb-1">
                  Password
                </label>
                <input
                  type="password"
                  value={manualPassword}
                  onChange={(e) => setManualPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-[#F6F9FC] border border-[#E2E8F0] focus:border-[#2563EB] focus:bg-white rounded-lg px-3 py-2 text-xs text-[#172B4D] outline-none"
                />
                <span className="text-[10px] text-[#64748B] mt-1 block">
                  Demo system: Enter any demo password or click 1-Click Role Switcher above.
                </span>
              </div>

              {errorMessage && (
                <div className="text-xs text-[#DC2626] font-semibold bg-[#FEECEC] p-2 rounded-md">
                  {errorMessage}
                </div>
              )}

              <button
                type="submit"
                className="w-full py-2 rounded-lg bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-bold shadow-xs transition-colors"
              >
                Sign In & Grant Role Access
              </button>
            </form>
          )}

          {/* Role Privileges Preview */}
          <div className="p-3.5 rounded-xl bg-[#F6F9FC] border border-[#E2E8F0] text-xs">
            <div className="font-bold text-[#172B4D] flex items-center gap-1.5 mb-1.5">
              {getRoleIcon(selectedUser.role)}
              <span>
                Active Scope for {ROLE_DEFINITIONS[selectedUser.role]?.label}:
              </span>
            </div>
            <p className="text-[#64748B] text-[11px] mb-2 leading-relaxed">
              {ROLE_DEFINITIONS[selectedUser.role]?.description}
            </p>
            <div className="flex flex-wrap gap-1">
              {selectedUser.permissions.map((p) => (
                <span
                  key={p}
                  className="px-2 py-0.5 rounded bg-white border border-[#E2E8F0] font-mono text-[10px] text-[#172B4D]"
                >
                  ✓ {p.replace(/_/g, ' ')}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-[#F6F9FC] border-t border-[#E2E8F0] flex items-center justify-between">
          <span className="text-[11px] text-[#64748B]">
            NABH Role-Based Access Control Matrix
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-3.5 py-1.5 rounded-lg bg-white border border-[#E2E8F0] text-xs font-semibold text-[#172B4D] hover:bg-[#F6F9FC]"
            >
              Cancel
            </button>
            <button
              onClick={() => handleConfirmLogin()}
              className="px-4 py-1.5 rounded-lg bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-bold shadow-xs transition-colors flex items-center gap-1.5"
            >
              <span>Authenticate as {selectedUser.name.split(' ')[0]}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

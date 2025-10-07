import React, { useState, useEffect } from 'react';

// ============= UTILS =============
// 한국 시간 기준 현재 날짜 가져오기
const getKoreanDate = () => {
  const now = new Date();
  const koreanTime = new Date(now.toLocaleString("en-US", { timeZone: "Asia/Seoul" }));
  return koreanTime;
};

const getDaysInMonth = (year, month) => {
  return new Date(year, month, 0).getDate();
};

const getCurrentYear = () => getKoreanDate().getFullYear();
const getCurrentMonth = () => getKoreanDate().getMonth() + 1;
const getCurrentDay = () => getKoreanDate().getDate();

// 미래 날짜인지 체크
const isFutureDate = (year, month, day) => {
  const korean = getKoreanDate();
  const currentYear = korean.getFullYear();
  const currentMonth = korean.getMonth() + 1;
  const currentDay = korean.getDate();
  
  if (year > currentYear) return true;
  if (year === currentYear && month > currentMonth) return true;
  if (year === currentYear && month === currentMonth && day > currentDay) return true;
  return false;
};

// ============= MOCK DATA & AUTH =============
let mockUser = null;
let mockEntries = {};

const mockAuth = {
  signIn: async (email, password) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        mockUser = { email };
        resolve({ user: mockUser });
      }, 500);
    });
  },
  signUp: async (email, password) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        mockUser = { email };
        resolve({ user: mockUser });
      }, 500);
    });
  },
  signOut: async () => {
    mockUser = null;
    mockEntries = {};
  },
  getUser: () => mockUser
};

const mockDb = {
  getEntries: async () => {
    return mockEntries;
  },
  saveEntry: async (date, happy, sad) => {
    // 둘 다 비어있으면 삭제
    const happyTrimmed = happy.trim();
    const sadTrimmed = sad.trim();
    
    if (!happyTrimmed && !sadTrimmed) {
      delete mockEntries[date];
    } else {
      mockEntries[date] = { happy, sad };
    }
  },
  deleteEntry: async (date, type) => {
    if (mockEntries[date]) {
      if (type === 'happy') {
        mockEntries[date].happy = '';
      } else {
        mockEntries[date].sad = '';
      }
      // 둘 다 비어있으면 날짜 자체를 삭제
      if (!mockEntries[date].happy.trim() && !mockEntries[date].sad.trim()) {
        delete mockEntries[date];
      }
    }
  }
};

// ============= MAIN APP =============
export default function App() {
  const [screen, setScreen] = useState('landing');
  const [user, setUser] = useState(null);
  const [selectedYear, setSelectedYear] = useState(getCurrentYear());
  const [selectedMonth, setSelectedMonth] = useState(getCurrentMonth());
  const [selectedDay, setSelectedDay] = useState(getCurrentDay());
  const [entries, setEntries] = useState({});
  const [showModal, setShowModal] = useState(null);

  useEffect(() => {
    const currentUser = mockAuth.getUser();
    if (currentUser) {
      setUser(currentUser);
      loadEntries();
      if (Object.keys(mockEntries).length > 0) {
        setScreen('month');
      } else {
        setScreen('year');
      }
    }
  }, []);

  const loadEntries = async () => {
    const data = await mockDb.getEntries();
    setEntries(data);
  };

  const handleLogin = async (email, password) => {
    const { user } = await mockAuth.signIn(email, password);
    setUser(user);
    await loadEntries();
    if (Object.keys(mockEntries).length > 0) {
      setScreen('month');
    } else {
      setScreen('year');
    }
    setShowModal(null);
  };

  const handleSignUp = async (email, password) => {
    const { user } = await mockAuth.signUp(email, password);
    setUser(user);
    setScreen('year');
    setShowModal(null);
  };

  const handleLogout = async () => {
    await mockAuth.signOut();
    setUser(null);
    setEntries({});
    setScreen('landing');
  };

  const saveEntry = async (date, happy, sad) => {
    await mockDb.saveEntry(date, happy, sad);
    await loadEntries();
  };

  const deleteEntry = async (date, type) => {
    await mockDb.deleteEntry(date, type);
    await loadEntries();
  };

  const getDateKey = (y, m, d) => `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`;

  const hasDataForMonth = (year, month) => {
    const prefix = `${year}-${String(month).padStart(2, '0')}`;
    return Object.keys(entries).some(key => key.startsWith(prefix));
  };

  const hasDataForYear = (year) => {
    return Object.keys(entries).some(key => key.startsWith(`${year}-`));
  };

  const getDateStatus = (year, month, day) => {
    const key = getDateKey(year, month, day);
    const entry = entries[key];
    if (!entry || (!entry.happy.trim() && !entry.sad.trim())) return 'empty';
    if (entry.sad.trim()) return 'sad';
    return 'happy';
  };

  // ============= LANDING SCREEN =============
  if (screen === 'landing') {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4">
        <h1 
          className="text-6xl md:text-8xl mb-12 md:mb-24 font-anton lowercase"
          style={{ 
            WebkitTextStroke: '4px black',
            color: '#e5e5e5',
            paintOrder: 'stroke fill'
          }}
        >
          mind storage
        </h1>
        <div className="flex flex-col gap-4">
          <button
            onClick={() => setShowModal('login')}
            className="px-16 py-4 text-2xl md:text-3xl bg-black text-white hover:bg-gray-800 transition-colors font-anton lowercase"
          >
            login
          </button>
          <button
            onClick={() => setShowModal('signup')}
            className="px-16 py-4 text-2xl md:text-3xl bg-gray-300 text-black hover:bg-gray-400 transition-colors font-anton lowercase"
          >
            sign up
          </button>
        </div>

        {showModal && (
          <AuthModal
            type={showModal}
            onClose={() => setShowModal(null)}
            onSubmit={showModal === 'login' ? handleLogin : handleSignUp}
          />
        )}
      </div>
    );
  }

  // ============= YEAR SCREEN =============
  if (screen === 'year') {
    return <YearScreen
      selectedYear={selectedYear}
      onYearSelect={(year) => {
        setSelectedYear(year);
        setScreen('month');
      }}
      onLogout={handleLogout}
      hasDataForYear={hasDataForYear}
    />;
  }

  // ============= MONTH SCREEN =============
  if (screen === 'month') {
    return <MonthScreen
      year={selectedYear}
      onBack={() => setScreen('year')}
      onMonthSelect={(month) => {
        setSelectedMonth(month);
        setScreen('day');
      }}
      onYearChange={setSelectedYear}
      hasDataForMonth={hasDataForMonth}
    />;
  }

  // ============= DAY SCREEN =============
  if (screen === 'day') {
    return <DayScreen
      year={selectedYear}
      month={selectedMonth}
      onBack={() => setScreen('month')}
      onDaySelect={(day) => {
        setSelectedDay(day);
        setScreen('detail');
      }}
      onMonthChange={(newMonth) => setSelectedMonth(newMonth)}
      getDateStatus={getDateStatus}
    />;
  }

  // ============= DETAIL SCREEN =============
  if (screen === 'detail') {
    return <DetailScreen
      year={selectedYear}
      month={selectedMonth}
      day={selectedDay}
      onBack={() => setScreen('day')}
      onDayChange={(newDay) => setSelectedDay(newDay)}
      entries={entries}
      saveEntry={saveEntry}
      deleteEntry={deleteEntry}
      getDateKey={getDateKey}
    />;
  }

  return null;
}

// ============= AUTH MODAL =============
function AuthModal({ type, onClose, onSubmit }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = () => {
    if (email && password) {
      onSubmit(email, password);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50" onClick={onClose}>
      <div className="bg-white border-2 border-black p-8 md:p-12 w-full max-w-md" onClick={(e) => e.stopPropagation()}>
        <h2 
          className="text-4xl md:text-5xl mb-6 text-center font-anton lowercase"
          style={{ 
            WebkitTextStroke: '3px black',
            color: '#e5e5e5',
            paintOrder: 'stroke fill'
          }}
        >
          {type}
        </h2>
        <div>
          <input
            type="email"
            placeholder="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
            className="w-full p-3 mb-4 bg-gray-300 text-xl font-anton lowercase"
          />
          <input
            type="password"
            placeholder="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
            className="w-full p-3 mb-6 bg-gray-300 text-xl font-anton lowercase"
          />
          <button
            onClick={handleSubmit}
            className="w-full py-3 bg-black text-white text-2xl hover:bg-gray-800 font-anton lowercase"
          >
            ok
          </button>
        </div>
        {type === 'login' && (
          <p className="text-center mt-4 underline cursor-pointer">비밀번호 찾기</p>
        )}
      </div>
    </div>
  );
}

// ============= YEAR SCREEN =============
function YearScreen({ selectedYear, onYearSelect, onLogout, hasDataForYear }) {
  const currentYear = getCurrentYear();
  const years = Array.from({ length: currentYear - 2020 + 1 }, (_, i) => 2020 + i);

  return (
    <div className="min-h-screen bg-white flex flex-col items-center p-4 md:p-8">
      <div className="w-full max-w-2xl">
        <div className="flex justify-between items-start mb-8 md:mb-12">
          <h1 
            className="text-4xl md:text-6xl font-anton lowercase"
            style={{ 
              WebkitTextStroke: '4px black',
              color: '#e5e5e5',
              paintOrder: 'stroke fill'
            }}
          >
            mind storage
          </h1>
          <button
            onClick={onLogout}
            className="px-4 py-2 bg-black text-white text-sm md:text-base font-anton lowercase"
          >
            log out
          </button>
        </div>

        <div className="flex flex-col items-center mt-32 md:mt-40">
          <div className="text-4xl mb-4">▲</div>
          <div className="space-y-4 h-64 overflow-y-auto flex flex-col items-center">
            {years.map((year) => (
              <button
                key={year}
                onClick={() => onYearSelect(year)}
                className={`text-6xl md:text-8xl transition-colors font-anton ${
                  hasDataForYear(year) ? 'text-black' : 'text-gray-300'
                } hover:opacity-70`}
              >
                {year}
              </button>
            ))}
          </div>
          <div className="text-4xl mt-4">▼</div>
        </div>
      </div>
    </div>
  );
}

// ============= MONTH SCREEN =============
function MonthScreen({ year, onBack, onMonthSelect, onYearChange, hasDataForMonth }) {
  const currentYear = getCurrentYear();
  const currentMonth = getCurrentMonth();
  const canGoPrev = year > 2020;
  const canGoNext = year < currentYear;

  // 현재 년도면 현재 월까지만 표시
  const maxMonth = year === currentYear ? currentMonth : 12;
  const months = Array.from({ length: maxMonth }, (_, i) => i + 1);

  // 각 월마다 다른 회전 각도
  const rotations = [-8, 5, -3, 7, -5, 4, -6, 3, -4, 6, -7, 5];

  return (
    <div className="min-h-screen bg-white p-4 md:p-8">
      <button
        onClick={onBack}
        className="mb-4 px-4 py-2 border-2 border-black text-sm md:text-base font-anton lowercase"
      >
        back
      </button>

      <div className="flex items-center justify-center gap-4 md:gap-8 mb-12 md:mb-16 mt-12 md:mt-20">
        <button
          onClick={() => canGoPrev && onYearChange(year - 1)}
          className={`text-4xl md:text-6xl ${canGoPrev ? 'text-black' : 'text-gray-300'}`}
          disabled={!canGoPrev}
        >
          ◀
        </button>
        <h2 className="text-6xl md:text-8xl font-anton">
          {year}
        </h2>
        <button
          onClick={() => canGoNext && onYearChange(year + 1)}
          className={`text-4xl md:text-6xl ${canGoNext ? 'text-black' : 'text-gray-300'}`}
          disabled={!canGoNext}
        >
          ▶
        </button>
      </div>

      <div className="grid grid-cols-3 md:grid-cols-4 gap-8 md:gap-12 max-w-4xl mx-auto">
        {months.map((month) => (
          <button
            key={month}
            onClick={() => onMonthSelect(month)}
            className={`text-5xl md:text-7xl transition-all hover:opacity-70 font-abhaya ${
              hasDataForMonth(year, month) ? 'text-black' : 'text-gray-300'
            }`}
            style={{
              transform: `rotate(${rotations[month - 1]}deg)`,
              transition: 'all 0.2s ease'
            }}
          >
            {month}
          </button>
        ))}
      </div>
    </div>
  );
}

// ============= DAY SCREEN =============
function DayScreen({ year, month, onBack, onDaySelect, onMonthChange, getDateStatus }) {
  const daysInMonth = getDaysInMonth(year, month);
  const currentYear = getCurrentYear();
  const currentMonth = getCurrentMonth();
  const currentDay = getCurrentDay();
  
  const canGoPrev = month > 1 || year > 2020;
  const canGoNext = month < 12 ? (year < currentYear || (year === currentYear && month < currentMonth)) : year < currentYear;

  // 현재 년월이면 오늘까지만 표시
  const maxDay = (year === currentYear && month === currentMonth) ? currentDay : daysInMonth;

  const handlePrev = () => {
    if (month > 1) {
      onMonthChange(month - 1);
    }
  };

  const handleNext = () => {
    if (month < 12 && !isFutureDate(year, month + 1, 1)) {
      onMonthChange(month + 1);
    }
  };

  return (
    <div className="min-h-screen bg-white p-4 md:p-8">
      <button
        onClick={onBack}
        className="mb-4 px-4 py-2 border-2 border-black text-sm md:text-base font-anton lowercase"
      >
        back
      </button>

      <div className="flex items-center justify-center gap-4 md:gap-8 mb-8 md:mb-12">
        <button
          onClick={handlePrev}
          className={`text-4xl md:text-6xl ${canGoPrev ? 'text-black' : 'text-gray-300'}`}
          disabled={!canGoPrev}
        >
          ◀
        </button>
        <h2 className="text-5xl md:text-7xl font-anton">
          {year}.{month}
        </h2>
        <button
          onClick={handleNext}
          className={`text-4xl md:text-6xl ${canGoNext ? 'text-black' : 'text-gray-300'}`}
          disabled={!canGoNext}
        >
          ▶
        </button>
      </div>

      <div className="max-w-2xl mx-auto space-y-2">
        {Array.from({ length: maxDay }, (_, i) => i + 1).map((day) => {
          const status = getDateStatus(year, month, day);
          const color = status === 'empty' ? 'text-gray-300' : status === 'sad' ? 'text-red-600' : 'text-black';
          
          return (
            <button
              key={day}
              onClick={() => onDaySelect(day)}
              className={`w-full py-3 text-3xl md:text-4xl border-t border-gray-300 hover:bg-gray-50 font-anton ${color}`}
            >
              {month}/{day}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ============= DETAIL SCREEN =============
function DetailScreen({ year, month, day, onBack, onDayChange, entries, saveEntry, deleteEntry, getDateKey }) {
  const dateKey = getDateKey(year, month, day);
  const entry = entries[dateKey] || { happy: '', sad: '' };
  
  const [happyText, setHappyText] = useState(entry.happy || '');
  const [sadText, setSadText] = useState(entry.sad || '');
  const [isSadHidden, setIsSadHidden] = useState(true);
  const [showDeleteMenu, setShowDeleteMenu] = useState(null);

  useEffect(() => {
    const currentEntry = entries[dateKey] || { happy: '', sad: '' };
    setHappyText(currentEntry.happy || '');
    setSadText(currentEntry.sad || '');
    setIsSadHidden(true);
  }, [dateKey, entries]);

  const daysInMonth = getDaysInMonth(year, month);
  const canGoPrev = day > 1 || month > 1 || year > 2020;
  const canGoNext = !isFutureDate(year, month, day + 1) && (day < daysInMonth || month < 12 || year < getCurrentYear());

  const handlePrev = () => {
    if (day > 1) {
      onDayChange(day - 1);
    }
  };

  const handleNext = () => {
    if (day < daysInMonth && !isFutureDate(year, month, day + 1)) {
      onDayChange(day + 1);
    }
  };

  const handleSave = () => {
    saveEntry(dateKey, happyText, sadText);
  };

  useEffect(() => {
    handleSave();
  }, [happyText, sadText]);

  const handleDelete = async (type) => {
    await deleteEntry(dateKey, type);
    setShowDeleteMenu(null);
    
    // 즉시 UI 업데이트
    if (type === 'happy') {
      setHappyText('');
    } else {
      setSadText('');
      setIsSadHidden(true);
    }
  };

  return (
    <div className="min-h-screen bg-white p-4 md:p-8">
      <button
        onClick={onBack}
        className="mb-4 px-4 py-2 border-2 border-black text-sm md:text-base font-anton lowercase"
      >
        back
      </button>

      <div className="flex items-center justify-center gap-4 md:gap-8 mb-8 md:mb-12">
        <button
          onClick={handlePrev}
          className={`text-4xl md:text-6xl ${canGoPrev ? 'text-black' : 'text-gray-300'}`}
          disabled={!canGoPrev}
        >
          ◀
        </button>
        <h2 className="text-5xl md:text-7xl font-anton">
          {month}/{day}
        </h2>
        <button
          onClick={handleNext}
          className={`text-4xl md:text-6xl ${canGoNext ? 'text-black' : 'text-gray-300'}`}
          disabled={!canGoNext}
        >
          ▶
        </button>
      </div>

      <div className="max-w-3xl mx-auto space-y-6">
        {/* Happy Box */}
        <div className="relative">
          <div className="flex items-start justify-between mb-2">
            <span className="text-2xl">:)</span>
            <button
              onClick={() => setShowDeleteMenu(showDeleteMenu === 'happy' ? null : 'happy')}
              className="text-2xl px-2"
            >
              ...
            </button>
          </div>
          {showDeleteMenu === 'happy' && (
            <div className="absolute right-0 top-10 bg-white border-2 border-black p-2 z-10 shadow-lg">
              <button
                onClick={() => handleDelete('happy')}
                className="px-4 py-2 hover:bg-gray-100 whitespace-nowrap"
              >
                삭제하기
              </button>
            </div>
          )}
          <textarea
            value={happyText}
            onChange={(e) => setHappyText(e.target.value)}
            className="w-full h-64 p-4 border-2 border-gray-400 bg-gray-100 resize-none text-lg"
            placeholder="행복했던 기억을 적어보세요..."
          />
        </div>

        {/* Sad Box with Band-Aid Image */}
        {isSadHidden ? (
          <button
            onClick={() => setIsSadHidden(false)}
            className="w-full flex items-center justify-center hover:opacity-80 transition-opacity"
          >
            <img 
              src="/images/bandaid.png" 
              alt="bandaid"
              className="w-full max-w-3xl h-auto object-contain"
              style={{ maxHeight: '200px' }}
            />
          </button>
        ) : (
          <div className="relative">
            <div className="flex items-start justify-between mb-2">
              <span className="text-2xl text-red-600">:(</span>
              <button
                onClick={() => setShowDeleteMenu(showDeleteMenu === 'sad' ? null : 'sad')}
                className="text-2xl px-2"
              >
                ...
              </button>
            </div>
            {showDeleteMenu === 'sad' && (
              <div className="absolute right-0 top-10 bg-white border-2 border-black p-2 z-10 shadow-lg">
                <button
                  onClick={() => handleDelete('sad')}
                  className="px-4 py-2 hover:bg-gray-100 whitespace-nowrap"
                >
                  삭제하기
                </button>
              </div>
            )}
            <textarea
              value={sadText}
              onChange={(e) => setSadText(e.target.value)}
              className="w-full h-64 p-4 border-2 border-red-400 bg-red-50 resize-none text-lg"
              placeholder="속상했던 기억을 적어보세요..."
            />
            <button
              onClick={() => setIsSadHidden(true)}
              className="mt-2 px-6 py-2 bg-gray-300 hover:bg-gray-400"
            >
              가리기
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

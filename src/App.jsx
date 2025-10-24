import React, { useState, useEffect, useCallback } from 'react';
import { authService, dbService } from './lib/supabase';

// Custom hook for debounce
function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}


// ============= UTILS =============
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

// ============= MAIN APP =============
const getInitialState = () => {
  try {
    const storedState = sessionStorage.getItem('mindStorageState');
    if (storedState) {
      return JSON.parse(storedState);
    }
  } catch (e) {
    console.error("Failed to parse stored state", e);
  }
  // sessionStorage가 없으면 일단 year로 시작 (데이터 로드 후 month로 변경 가능)
  return {
    screen: 'year',
    selectedYear: getCurrentYear(),
    selectedMonth: getCurrentMonth(),
    selectedDay: getCurrentDay(),
  };
};

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [initialLoadComplete, setInitialLoadComplete] = useState(false);
  const [user, setUser] = useState(null);
  const [entries, setEntries] = useState({});
  const [showModal, setShowModal] = useState(null);

  const [appState, setAppState] = useState(getInitialState);

  const setScreen = (screen) => setAppState(prev => ({ ...prev, screen }));
  const setSelectedYear = (year) => setAppState(prev => ({ ...prev, selectedYear: year }));
  const setSelectedMonth = (month) => setAppState(prev => ({ ...prev, selectedMonth: month }));
  const setSelectedDay = (day) => setAppState(prev => ({ ...prev, selectedDay: day }));

  const { screen, selectedYear, selectedMonth, selectedDay } = appState;

  useEffect(() => {
    try {
      if (user) {
        sessionStorage.setItem('mindStorageState', JSON.stringify(appState));
      }
    } catch (e) {
      console.error("Failed to save state", e);
    }
  }, [appState, user]);


  useEffect(() => {
    const { data: { subscription } } = authService.onAuthStateChange((event, session) => {
      const currentUser = session?.user || null;
      setUser(currentUser);
      if (currentUser) {
        dbService.getEntries(currentUser.id).then(data => {
          setEntries(data);
          
          // 데이터가 있는지 확인
          const hasData = Object.keys(data).some(key => 
            data[key]?.happy?.trim() || data[key]?.sad?.trim()
          );
          
          // 로그인 이벤트이거나 초기 로드일 때는 항상 데이터 유무에 따라 화면 설정
          if (event === 'SIGNED_IN' || !initialLoadComplete) {
            if (hasData) {
              // 데이터가 있으면 현재 날짜 화면으로
              setAppState({
                screen: 'day',
                selectedYear: getCurrentYear(),
                selectedMonth: getCurrentMonth(),
                selectedDay: getCurrentDay(),
              });
            } else {
              // 데이터가 없으면 년도 화면으로
              setAppState({
                screen: 'year',
                selectedYear: getCurrentYear(),
                selectedMonth: getCurrentMonth(),
                selectedDay: getCurrentDay(),
              });
            }
          }
          
          setIsLoading(false);
          setInitialLoadComplete(true);
        });
      } else {
        setIsLoading(false);
        setInitialLoadComplete(true);
      }
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, [initialLoadComplete]);

  const loadEntries = async () => {
    if (!user) return;
    try {
      const data = await dbService.getEntries(user.id);
      setEntries(data);
    } catch (error) {
      console.error('Error loading entries:', error);
    }
  };

  const handleLogin = async (email, password) => {
    // 이메일 형식 검증
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      alert('이메일 형식이 올바르지 않습니다.');
      return;
    }
    
    // 비밀번호 길이 검증
    if (password.length < 6) {
      alert('비밀번호는 6자 이상이어야 합니다.');
      return;
    }
    
    try {
      await authService.signInWithEmail(email, password);
      setShowModal(null);
    } catch (error) {
      // 가입되지 않은 계정이거나 비밀번호 오류
      if (error.message.includes('Invalid login credentials') || error.message.includes('invalid'))  {
        alert('가입되지 않은 계정이거나 비밀번호가 일치하지 않습니다.');
      } else {
        alert('로그인 실패: ' + error.message);
      }
    }
  };

  const handleSignUp = async (email, password) => {
    // 이메일 형식 검증
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      alert('이메일 형식이 올바르지 않습니다.');
      return;
    }
    
    // 비밀번호 길이 검증
    if (password.length < 6) {
      alert('비밀번호는 6자 이상이어야 합니다.');
      return;
    }
    
    try {
      await authService.signUpWithEmail(email, password);
      alert('회원가입이 완료되었습니다!');
      setShowModal(null);
    } catch (error) {
      alert('회원가입 실패: ' + error.message);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await authService.signInWithGoogle();
    } catch (error) {
      alert('구글 로그인 실패: ' + error.message);
    }
  };

  const handleAppleLogin = async () => {
    try {
      await authService.signInWithApple();
    } catch (error) {
      alert('애플 로그인 실패: ' + error.message);
    }
  };

  const handleLogout = async () => {
    try {
      await authService.signOut();
      // 로그아웃 성공 후 상태 초기화
      sessionStorage.removeItem('mindStorageState');
      setAppState(getInitialState());
      setUser(null);
      setEntries({});
      // 페이지 새로고침으로 완전히 초기화
      window.location.reload();
    } catch (error) {
      console.error('Logout error:', error);
      // 에러가 발생해도 강제로 로그아웃 처리
      sessionStorage.removeItem('mindStorageState');
      localStorage.clear(); // 모든 로귱 저장소 삭제
      window.location.reload();
    }
  };

  const handleDeleteAccount = async () => {
    if (!user) return;
    
    const confirmed = window.confirm('정말 탈퇴하시겠습니까?');
    if (!confirmed) return;
    
    try {
      await authService.deleteAccount(user.id);
      alert('계정이 삭제되었습니다.');
      sessionStorage.removeItem('mindStorageState');
      setAppState(getInitialState());
      setUser(null);
      setEntries({});
      setInitialLoadComplete(false);
      setIsLoading(true);
    } catch (error) {
      alert('계정 삭제에 실패했습니다: ' + error.message);
    }
  };

  const saveEntry = useCallback(async (date, happy, sad) => {
    if (!user) return;
    const trimmedHappy = happy.trim();
    const trimmedSad = sad.trim();

    setEntries(prevEntries => ({ ...prevEntries, [date]: { happy: trimmedHappy, sad: trimmedSad } }));
    try {
      await dbService.saveEntry(user.id, date, trimmedHappy, trimmedSad);
    } catch (error) {
      console.error('Error saving entry:', error);
      loadEntries();
    }
  }, [user]);

  const deleteEntry = async (date, type) => {
    if (!user) return;
    try {
      await dbService.deleteEntry(user.id, date, type);
      await loadEntries();
    } catch (error) {
      console.error('Error deleting entry:', error);
    }
  };

  const getDateKey = (y, m, d) => `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`;

  const hasDataForMonth = (year, month) => {
    const prefix = `${year}-${String(month).padStart(2, '0')}`;
    return Object.keys(entries).some(key => key.startsWith(prefix) && (entries[key]?.happy?.trim() || entries[key]?.sad?.trim()));
  };

  const hasDataForYear = (year) => {
    return Object.keys(entries).some(key => key.startsWith(`${year}-`) && (entries[key]?.happy?.trim() || entries[key]?.sad?.trim()));
  };

  const getDateStatus = (year, month, day) => {
    const key = getDateKey(year, month, day);
    const entry = entries[key];
    if (!entry || (!entry.happy?.trim() && !entry.sad?.trim())) return 'empty';
    if (entry.sad?.trim()) return 'sad';
    return 'happy';
  };

  if (isLoading || !initialLoadComplete) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <h1 
          className="text-6xl md:text-8xl font-anton lowercase"
          style={{ 
            WebkitTextStroke: '7px black',
            color: '#e5e5e5',
            paintOrder: 'stroke fill'
          }}
        >
          loading...
        </h1>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4">
        <h1 
          className="text-6xl md:text-8xl mb-12 md:mb-24 font-anton lowercase"
          style={{ 
            WebkitTextStroke: '7px black',
            color: '#e5e5e5',
            paintOrder: 'stroke fill'
          }}
        >
          mind storage
        </h1>
        <div className="flex flex-col gap-4 items-center">
          <button
            onClick={() => setShowModal('login')}
            className="px-16 py-4 text-2xl md:text-3xl bg-black text-white hover:bg-gray-800 transition-colors font-anton lowercase"
          >
            login
          </button>
          <button
            onClick={() => setShowModal('sign up')}
            className="px-6 py-2 text-sm md:text-base text-gray-600 hover:text-black transition-colors"
          >
            회원가입
          </button>
        </div>

        {showModal && (
          <AuthModal
            type={showModal}
            onClose={() => setShowModal(null)}
            onSubmit={showModal === 'login' ? handleLogin : handleSignUp}
            onGoogleLogin={handleGoogleLogin}
            onAppleLogin={handleAppleLogin}
          />
        )}
      </div>
    );
  }

  const mainScreens = {
    year: <YearScreen
      selectedYear={selectedYear}
      onYearSelect={(year) => {
        setSelectedYear(year);
        setScreen('month');
      }}
      onLogout={handleLogout}
      onDeleteAccount={handleDeleteAccount}
      hasDataForYear={hasDataForYear}
    />,
    month: <MonthScreen
      year={selectedYear}
      onBack={() => setScreen('year')}
      onMonthSelect={(month) => {
        setSelectedMonth(month);
        setScreen('day');
      }}
      onYearChange={setSelectedYear}
      hasDataForMonth={hasDataForMonth}
    />,
    day: <DayScreen
      year={selectedYear}
      month={selectedMonth}
      onBack={() => setScreen('month')}
      onDaySelect={(day) => {
        setSelectedDay(day);
        setScreen('detail');
      }}
      onYearMonthChange={(newYear, newMonth) => {
        setSelectedYear(newYear);
        setSelectedMonth(newMonth);
      }}
      onMonthChange={(newMonth) => setSelectedMonth(newMonth)}
      getDateStatus={getDateStatus}
    />,
    detail: <DetailScreen
      key={getDateKey(selectedYear, selectedMonth, selectedDay)}
      year={selectedYear}
      month={selectedMonth}
      day={selectedDay}
      onBack={() => setScreen('day')}
      onDayChange={(newDay) => setSelectedDay(newDay)}
      onYearMonthDayChange={(newYear, newMonth, newDay) => {
        setAppState(prev => ({...prev, selectedYear: newYear, selectedMonth: newMonth, selectedDay: newDay}));
      }}
      entries={entries}
      saveEntry={saveEntry}
      deleteEntry={deleteEntry}
      getDateKey={getDateKey}
    />
  };

  return mainScreens[screen] || mainScreens.year;
}

// ============= AUTH MODAL =============
function AuthModal({ type, onClose, onSubmit, onGoogleLogin, onAppleLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = () => {
    if (email && password) {
      onSubmit(email, password);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50" onClick={onClose}>
      <div className="bg-white border-2 border-black p-8 md:p-12 w-full max-w-md relative" onClick={(e) => e.stopPropagation()}>
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-3xl hover:opacity-70 transition-opacity"
        >
          ×
        </button>
        <h2 
          className="text-4xl md:text-5xl mb-6 text-center font-anton lowercase"
          style={{ 
            WebkitTextStroke: '5px black',
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
            className="w-full p-3 mb-4 bg-gray-300 text-xl font-anton lowercase"
          />
          <button
            onClick={handleSubmit}
            className="w-full py-3 bg-black text-white text-2xl hover:bg-gray-800 font-anton lowercase mb-6"
          >
            {type === 'login' ? 'login' : 'sign up'}
          </button>

          {/* 구분선 */}
          <div className="flex items-center mb-6">
            <div className="flex-1 border-t border-gray-300"></div>
            <span className="px-4 text-gray-500 text-sm">OR</span>
            <div className="flex-1 border-t border-gray-300"></div>
          </div>

          {/* 소셜 로그인 버튼 */}
          <button
            onClick={onGoogleLogin}
            className="w-full py-3 mb-3 bg-white border-2 border-gray-300 text-lg hover:bg-gray-50 font-anton lowercase flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            google
          </button>
        </div>
      </div>
    </div>
  );
}

// ============= YEAR SCREEN =============
function YearScreen({ selectedYear, onYearSelect, onLogout, onDeleteAccount, hasDataForYear }) {
  const currentYear = getCurrentYear();
  const years = Array.from({ length: currentYear - 2020 + 1 }, (_, i) => 2020 + i).reverse();
  const [showHelp, setShowHelp] = useState(false);

  return (
    <div className="min-h-screen bg-white flex flex-col items-center p-4 md:p-8">
      <div className="w-full">
        <div className="flex justify-between items-start mb-12 md:mb-12 px-4 md:px-8 mt-8">
          <h1 
            className="text-4xl md:text-6xl font-anton lowercase"
            style={{ 
              WebkitTextStroke: '5px black',
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

        <div className="flex flex-col items-center mt-40 md:mt-5">
          <div className="text-4xl mb-4">▲</div>
          <div className="space-y-4 h-64 md:h-96 overflow-y-auto flex flex-col items-center">
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

        <button
          onClick={() => setShowHelp(true)}
          className="fixed left-4 bottom-4 md:left-8 md:bottom-8 w-12 h-12 md:w-14 md:h-14 rounded-full bg-black text-white text-2xl md:text-3xl flex items-center justify-center hover:bg-gray-800 transition-colors"
          style={{ fontFamily: 'Anton, sans-serif' }}
        >
          ?
        </button>

        {showHelp && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50" onClick={() => setShowHelp(false)}>
            <div className="bg-white border-2 border-black p-8 md:p-12 w-full max-w-md" onClick={(e) => e.stopPropagation()}>
              <h3 className="text-3xl md:text-4xl mb-6 text-center font-anton lowercase"
                style={{ 
                  WebkitTextStroke: '5px black',
                  color: '#ffffff',
                  paintOrder: 'stroke fill'
                }}
              >
                notice
              </h3>
              
              <div className="space-y-5">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-black rounded flex items-center justify-center text-2xl flex-shrink-0">
                    😊
                  </div>
                  <span className="text-lg">좋은 일만 있었던 날</span>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-red-600 rounded flex items-center justify-center text-2xl flex-shrink-0">
                    😢
                  </div>
                  <span className="text-lg">속상한 기억도 담은 날</span>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-gray-300 rounded flex items-center justify-center text-2xl flex-shrink-0">
                    ✏️
                  </div>
                  <span className="text-lg">아직 기록이 없는 날</span>
                </div>

                <div className="mt-6 pt-6 border-t-2 border-gray-200 space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 rounded flex items-center justify-center text-2xl flex-shrink-0">
                      🩹
                    </div>
                    <div className="text-sm md:text-base">
                      <p>입력창의 <span className="font-bold">반창고 버튼</span>을 누르면 속상한 기억을 작성할 수 있는 칸이 생성됩니다.</p>
                      <p className="mt-1">작성을 마친 후에는 반창고로 속상한 기억을 덮어보세요.</p>
                    </div>
                  </div>

                  <p className="text-base text-gray-700 leading-relaxed">
                    기록을 작성하면 해당 날짜의 <span className="font-bold">월, 년도</span>도 함께 <span className="font-bold">검정색</span>으로 바뀝니다.
                  </p>
                </div>
              </div>

              <button
                onClick={() => setShowHelp(false)}
                className="mt-8 w-full py-3 bg-black text-white text-xl hover:bg-gray-800 font-anton lowercase"
              >
                ok
              </button>
              
              <button
                onClick={() => {
                  setShowHelp(false);
                  onDeleteAccount();
                }}
                className="mt-4 py-2 text-sm text-gray-500 hover:text-red-600 transition-colors"
              >
                탈퇴하기
              </button>
            </div>
          </div>
        )}
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

  const maxMonth = year === currentYear ? currentMonth : 12;
  const months = Array.from({ length: maxMonth }, (_, i) => i + 1);

  const rotations = [-8, 5, -3, 7, -5, 4, -6, 3, -4, 6, -7, 5];

  return (
    <div className="min-h-screen bg-white p-4 md:p-8">
      <button
        onClick={onBack}
        className="mb-4 px-4 py-2 border-2 border-black text-sm md:text-base font-anton lowercase"
      >
        back
      </button>

      <div className="flex items-center justify-center gap-4 md:gap-8 mb-12 md:mb-16 mt-4 md:mt-6">
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

      <div className="grid grid-cols-3 md:grid-cols-4 gap-y-16 gap-x-4 md:gap-y-20 md:gap-x-12 max-w-4xl mx-auto">
        {months.map((month) => (
          <button
            key={month}
            onClick={() => onMonthSelect(month)}
            className={`text-6xl md:text-7xl transition-all hover:opacity-70 ${
              hasDataForMonth(year, month) ? 'text-black' : 'text-gray-300'
            }`}
            style={{
              fontFamily: "'Abhaya Libre', 'Times New Roman', serif",
              fontWeight: 800,
              transform: `rotate(${rotations[month - 1]}deg)`,
              transition: 'all 0.2s ease',
              WebkitFontSmoothing: 'antialiased'
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
function DayScreen({ year, month, onBack, onDaySelect, onYearMonthChange, onMonthChange, getDateStatus }) {
  const daysInMonth = getDaysInMonth(year, month);
  const currentYear = getCurrentYear();
  const currentMonth = getCurrentMonth();
  const currentDay = getCurrentDay();
  
  const isBeforeStart = year === 2020 && month === 1;
  const isCurrentMonth = year === currentYear && month === currentMonth;
  
  const canGoPrev = !isBeforeStart;
  const canGoNext = !isCurrentMonth;

  const maxDay = isCurrentMonth ? currentDay : daysInMonth;

  const handlePrev = () => {
    if (month > 1) {
      onMonthChange(month - 1);
    } else if (year > 2020) {
      onYearMonthChange(year - 1, 12);
    }
  };

  const handleNext = () => {
    if (month < 12) {
      onMonthChange(month + 1);
    } else if (year < currentYear) {
      onYearMonthChange(year + 1, 1);
    }
  };

  return (
    <div className="h-screen bg-white p-4 md:p-8 flex flex-col overflow-hidden">
      <div className="flex-shrink-0">
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
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="max-w-2xl mx-auto space-y-2 pb-8">
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
    </div>
  );
}

// ============= DETAIL SCREEN =============
function DetailScreen({ year, month, day, onBack, onDayChange, onYearMonthDayChange, entries, saveEntry, deleteEntry, getDateKey }) {
  const dateKey = getDateKey(year, month, day);
  const entry = entries[dateKey] || { happy: '', sad: '' };
  
  const [happyText, setHappyText] = useState(entry.happy || '');
  const [sadText, setSadText] = useState(entry.sad || '');
  const [isSadHidden, setIsSadHidden] = useState(true);
  const [showDeleteMenu, setShowDeleteMenu] = useState(null);

  const debouncedHappyText = useDebounce(happyText, 500);
  const debouncedSadText = useDebounce(sadText, 500);

  useEffect(() => {
    const currentEntry = entries[dateKey] || { happy: '', sad: '' };
    if (debouncedHappyText !== currentEntry.happy || debouncedSadText !== currentEntry.sad) {
      saveEntry(dateKey, debouncedHappyText, debouncedSadText);
    }
  }, [debouncedHappyText, debouncedSadText]); // Removed dependencies to prevent re-hiding


  const daysInMonth = getDaysInMonth(year, month);
  const currentYear = getCurrentYear();
  const currentMonth = getCurrentMonth();
  const currentDay = getCurrentDay();
  
  const isBeforeStart = year === 2020 && month === 1 && day === 1;
  const isToday = year === currentYear && month === currentMonth && day === currentDay;
  
  const canGoPrev = !isBeforeStart;
  const canGoNext = !isToday;

  const handlePrev = () => {
    if (day > 1) {
      onDayChange(day - 1);
    } else if (month > 1) {
      const prevMonthDays = getDaysInMonth(year, month - 1);
      onYearMonthDayChange(year, month - 1, prevMonthDays);
    } else if (year > 2020) {
      onYearMonthDayChange(year - 1, 12, 31);
    }
  };

  const handleNext = () => {
    if (day < daysInMonth) {
      onDayChange(day + 1);
    } else if (month < 12) {
      onYearMonthDayChange(year, month + 1, 1);
    } else if (year < currentYear) {
      onYearMonthDayChange(year + 1, 1, 1);
    }
  };

  const handleDelete = async (type) => {
    await deleteEntry(dateKey, type);
    if (type === 'happy') {
      setHappyText('');
    } else {
      setSadText('');
    }
    setShowDeleteMenu(null);
  };

  return (
    <div className="h-screen bg-white p-4 md:p-8 flex flex-col overflow-hidden">
      <div className="flex-shrink-0">
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
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="max-w-3xl mx-auto space-y-6 pb-8">
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
            className="w-full h-64 p-4 border-4 border-gray-800 bg-gray-100 resize-none text-lg"
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
              className="w-full h-64 p-4 border-4 border-red-400 bg-red-50 resize-none text-lg"
              placeholder="속상했던 기억을 적어보세요..."
            />
            <button
              onClick={() => setIsSadHidden(true)}
              className="mt-2 px-6 py-2 bg-red-200 hover:bg-gray-400 font-anton lowercase"
            >
              hide
            </button>
          </div>
        )}
        </div>
      </div>
    </div>
  );
}
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Supabase 클라이언트 생성 (설정이 없으면 null)
export const supabase = (supabaseUrl && supabaseAnonKey && 
  supabaseUrl !== 'https://toovropwifnokpizcjtq.supabase.co' && 
  supabaseAnonKey !== 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRvb3Zyb3B3aWZub2twaXpjanRxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk4ODc3MTUsImV4cCI6MjA3NTQ2MzcxNX0.7l7BCnXCTNL0tUsHQ3nh_bpMwlqSaPrJi-XD-Z3KvCk')
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null

// 인증 함수들
export const authService = {
  // 이메일 로그인
  signInWithEmail: async (email, password) => {
    if (!supabase) throw new Error('Supabase가 설정되지 않았습니다. .env 파일을 확인해주세요.')
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    if (error) throw error
    return data
  },

  // 이메일 회원가입
  signUpWithEmail: async (email, password) => {
    if (!supabase) throw new Error('Supabase가 설정되지 않았습니다. .env 파일을 확인해주세요.')
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    })
    if (error) throw error
    return data
  },

  // 구글 로그인
  signInWithGoogle: async () => {
    if (!supabase) throw new Error('Supabase가 설정되지 않았습니다. .env 파일을 확인해주세요.')
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin,
      },
    })
    if (error) throw error
    return data
  },

  // 애플 로그인
  signInWithApple: async () => {
    if (!supabase) throw new Error('Supabase가 설정되지 않았습니다. .env 파일을 확인해주세요.')
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'apple',
      options: {
        redirectTo: window.location.origin,
      },
    })
    if (error) throw error
    return data
  },

  // 로그아웃
  signOut: async () => {
    if (!supabase) throw new Error('Supabase가 설정되지 않았습니다.')
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  },

  // 현재 사용자 가져오기
  getCurrentUser: async () => {
    if (!supabase) return null
    const { data: { user } } = await supabase.auth.getUser()
    return user
  },

  // 인증 상태 변경 리스너
  onAuthStateChange: (callback) => {
    if (!supabase) return { data: { subscription: { unsubscribe: () => {} } } }
    return supabase.auth.onAuthStateChange(callback)
  },
}

// 데이터베이스 함수들
export const dbService = {
  // 모든 엔트리 가져오기
  getEntries: async (userId) => {
    if (!supabase) return {}
    const { data, error } = await supabase
      .from('entries')
      .select('*')
      .eq('user_id', userId)
    
    if (error) throw error
    
    // 데이터를 날짜 키로 변환
    const entriesMap = {}
    data?.forEach(entry => {
      entriesMap[entry.date] = {
        happy: entry.happy_content || '',
        sad: entry.sad_content || '',
      }
    })
    return entriesMap
  },

  // 엔트리 저장/업데이트
  saveEntry: async (userId, date, happy, sad) => {
    if (!supabase) throw new Error('Supabase가 설정되지 않았습니다.')
    const happyTrimmed = happy.trim()
    const sadTrimmed = sad.trim()

    // 둘 다 비어있으면 삭제
    if (!happyTrimmed && !sadTrimmed) {
      const { error } = await supabase
        .from('entries')
        .delete()
        .eq('user_id', userId)
        .eq('date', date)
      
      if (error) throw error
      return
    }

    // upsert (있으면 업데이트, 없으면 생성)
    const { error } = await supabase
      .from('entries')
      .upsert({
        user_id: userId,
        date: date,
        happy_content: happy,
        sad_content: sad,
      }, {
        onConflict: 'user_id,date'
      })
    
    if (error) throw error
  },

  // 엔트리 삭제
  deleteEntry: async (userId, date, type) => {
    if (!supabase) throw new Error('Supabase가 설정되지 않았습니다.')
    // 현재 엔트리 가져오기
    const { data: currentEntry } = await supabase
      .from('entries')
      .select('*')
      .eq('user_id', userId)
      .eq('date', date)
      .single()

    if (!currentEntry) return

    if (type === 'happy') {
      currentEntry.happy_content = ''
    } else {
      currentEntry.sad_content = ''
    }

    // 둘 다 비어있으면 삭제
    if (!currentEntry.happy_content.trim() && !currentEntry.sad_content.trim()) {
      const { error } = await supabase
        .from('entries')
        .delete()
        .eq('user_id', userId)
        .eq('date', date)
      
      if (error) throw error
    } else {
      // 하나만 업데이트
      const { error } = await supabase
        .from('entries')
        .update({
          happy_content: currentEntry.happy_content,
          sad_content: currentEntry.sad_content,
        })
        .eq('user_id', userId)
        .eq('date', date)
      
      if (error) throw error
    }
  },
}

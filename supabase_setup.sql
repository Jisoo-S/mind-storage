-- Supabase SQL Editor에서 실행하세요

-- entries 테이블 생성
CREATE TABLE IF NOT EXISTS entries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  date TEXT NOT NULL,
  happy_content TEXT,
  sad_content TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  UNIQUE(user_id, date)
);

-- RLS (Row Level Security) 활성화
ALTER TABLE entries ENABLE ROW LEVEL SECURITY;

-- 정책: 사용자는 자신의 엔트리만 조회 가능
CREATE POLICY "Users can view their own entries"
  ON entries FOR SELECT
  USING (auth.uid() = user_id);

-- 정책: 사용자는 자신의 엔트리만 생성 가능
CREATE POLICY "Users can insert their own entries"
  ON entries FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- 정책: 사용자는 자신의 엔트리만 업데이트 가능
CREATE POLICY "Users can update their own entries"
  ON entries FOR UPDATE
  USING (auth.uid() = user_id);

-- 정책: 사용자는 자신의 엔트리만 삭제 가능
CREATE POLICY "Users can delete their own entries"
  ON entries FOR DELETE
  USING (auth.uid() = user_id);

-- 인덱스 생성 (성능 향상)
CREATE INDEX IF NOT EXISTS entries_user_id_idx ON entries(user_id);
CREATE INDEX IF NOT EXISTS entries_date_idx ON entries(date);

-- updated_at 자동 업데이트 함수
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- updated_at 트리거
CREATE TRIGGER update_entries_updated_at BEFORE UPDATE ON entries
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

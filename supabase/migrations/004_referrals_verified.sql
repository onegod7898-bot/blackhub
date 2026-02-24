-- Referral system & verified seller badges
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS referral_code TEXT UNIQUE;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS referred_by UUID REFERENCES auth.users(id) ON DELETE SET NULL;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS referral_earnings_cents INTEGER DEFAULT 0;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS verified_seller BOOLEAN DEFAULT FALSE;

-- Generate referral codes for existing users
UPDATE profiles SET referral_code = 'BH' || UPPER(SUBSTRING(MD5(id::text) FROM 1 FOR 8))
WHERE referral_code IS NULL;

-- Create unique referral codes (handle collisions)
CREATE OR REPLACE FUNCTION ensure_referral_code() RETURNS TRIGGER AS $$
BEGIN
  IF NEW.referral_code IS NULL OR NEW.referral_code = '' THEN
    NEW.referral_code := 'BH' || UPPER(SUBSTRING(MD5(NEW.id::text || NOW()::text) FROM 1 FOR 8));
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS ensure_referral_code_trigger ON profiles;
CREATE TRIGGER ensure_referral_code_trigger BEFORE INSERT ON profiles
FOR EACH ROW EXECUTE FUNCTION ensure_referral_code();

-- Referral earnings log
CREATE TABLE IF NOT EXISTS referral_earnings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  referrer_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  referred_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  amount_cents INTEGER NOT NULL,
  source TEXT DEFAULT 'subscription',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_referral_earnings_referrer ON referral_earnings(referrer_id);

ALTER TABLE referral_earnings ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can view own referral earnings" ON referral_earnings;
CREATE POLICY "Users can view own referral earnings" ON referral_earnings
  FOR SELECT USING (auth.uid() = referrer_id);

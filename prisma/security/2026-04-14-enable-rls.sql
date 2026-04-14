-- Enable Row Level Security on all public application tables.
-- This prevents anon/authenticated API roles from directly reading/writing
-- table data unless explicit policies are added later.

ALTER TABLE "Profile" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Lottery" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Entry" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Winner" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "AuditLog" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "BlockedEntryAttempt" ENABLE ROW LEVEL SECURITY;

-- Enforce RLS even for table owners (except bypassrls roles like service_role).
ALTER TABLE "Profile" FORCE ROW LEVEL SECURITY;
ALTER TABLE "Lottery" FORCE ROW LEVEL SECURITY;
ALTER TABLE "Entry" FORCE ROW LEVEL SECURITY;
ALTER TABLE "Winner" FORCE ROW LEVEL SECURITY;
ALTER TABLE "AuditLog" FORCE ROW LEVEL SECURITY;
ALTER TABLE "BlockedEntryAttempt" FORCE ROW LEVEL SECURITY;

-- Remove broad grants from API roles.
REVOKE ALL ON TABLE "Profile" FROM anon, authenticated;
REVOKE ALL ON TABLE "Lottery" FROM anon, authenticated;
REVOKE ALL ON TABLE "Entry" FROM anon, authenticated;
REVOKE ALL ON TABLE "Winner" FROM anon, authenticated;
REVOKE ALL ON TABLE "AuditLog" FROM anon, authenticated;
REVOKE ALL ON TABLE "BlockedEntryAttempt" FROM anon, authenticated;

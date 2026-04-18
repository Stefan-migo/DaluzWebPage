-- Restore update_ticket_timestamps() to its original AFTER INSERT ON support_messages body.
-- Migration 20250220000001_fix_security_linter_issues.sql accidentally redefined this
-- function with body that references OLD.status / NEW.status_changed_at — fields that
-- belong to support_tickets, not support_messages. The trigger is attached to
-- support_messages (AFTER INSERT), so inserting a message raises:
--   record "old" has no field "status"

CREATE OR REPLACE FUNCTION public.update_ticket_timestamps()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public, pg_temp
AS $$
BEGIN
  -- Update the parent ticket's last_response_at
  UPDATE public.support_tickets
  SET
    last_response_at = NOW(),
    first_response_at = COALESCE(first_response_at, NOW()),
    updated_at = NOW()
  WHERE id = NEW.ticket_id;

  RETURN NEW;
END;
$$;

select * from pgsodium.create_key();

GRANT EXECUTE ON FUNCTION pgsodium.crypto_aead_det_decrypt(bytea, bytea, uuid, bytea) TO authenticated;
GRANT EXECUTE ON FUNCTION pgsodium.crypto_aead_det_encrypt(bytea, bytea, uuid, bytea) TO authenticated;

SECURITY LABEL FOR pgsodium
	ON COLUMN scheduled_events.notes
	IS 'ENCRYPT WITH KEY ID 9da374b4-03d1-4c9a-b662-0fd8f4ea4762';

Kill processes on a port on GitBash: 
netstat -ano | grep :3000 | awk '{print $5}' | xargs -n1 taskkill.exe //F //PID

select set_claim('b85db7b6-227c-497e-a06b-ee11a96091da', 'userlevel', '500');

create policy "scheduled_events admin policy"
on "public"."scheduled_events"
as PERMISSIVE
for ALL
to authenticated
using ((coalesce(get_my_claim('userlevel')::int,0) = 500))
with check ((coalesce(get_my_claim('userlevel')::int,0) = 500));


Started supabase local development setup.

         API URL: http://127.0.0.1:54321
     GraphQL URL: http://127.0.0.1:54321/graphql/v1
          DB URL: postgresql://postgres:postgres@127.0.0.1:54322/postgres
      Studio URL: http://127.0.0.1:54323
    Inbucket URL: http://127.0.0.1:54324
      JWT secret: super-secret-jwt-token-with-at-least-32-characters-long
        anon key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0
service_role key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU
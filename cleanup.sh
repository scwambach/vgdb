#!/bin/bash
# Remove Supabase auth files that are no longer needed

rm -rf /Users/scottwambach/Documents/Github/vgdb/app/login
rm -rf /Users/scottwambach/Documents/Github/vgdb/app/signup
rm -rf /Users/scottwambach/Documents/Github/vgdb/app/user
rm -rf /Users/scottwambach/Documents/Github/vgdb/app/api/auth
rm -rf /Users/scottwambach/Documents/Github/vgdb/app/api/user
rm -rf /Users/scottwambach/Documents/Github/vgdb/lib/supabase

echo "Cleanup complete!"
ls -la app/ | grep -E "login|signup|user"
ls -la app/api/ | grep -E "auth|user"
ls -la lib/ | grep supabase

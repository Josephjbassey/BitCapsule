import sys
content = open('apps/dapp/src/app/page.tsx').read()

# The user wants to manually claim at expired time.
# The contract already has a claim function that checks block.timestamp >= unlockTimestamp.
# The current UI calls handleClaim with id and isLegacy.
# If isLegacy is false, it calls 'claim'.
# If isLegacy is true, it calls 'claimLegacy' (which is the dead man switch claim).
# Wait, handleClaim for TEMPORAL/HODL should call 'claim'.
# Let's check how the buttons are rendered.

open('apps/dapp/src/app/page.tsx', 'w').write(content)

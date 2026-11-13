

// Shown instantly on navigation, while page.tsx waits for the API.
// If the data is already cached, page.tsx resolves immediately and this

import DestinationsPageShell from "../destinations/Destinations-page-shell";
import DestinationsSkeleton from "../destinations/destinations-skeleton";

// never becomes visible.
export default function Loading() {
  return (
    <DestinationsPageShell>
      <DestinationsSkeleton />
    </DestinationsPageShell>
  )
}
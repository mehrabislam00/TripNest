import AddDestinationForm from "@/components/Adddestinationform/Adddestinationform"


export const metadata = {
  title: "Add New Travel Package | Wanderlast",
}

export default function AddDestination() {
  return (
    <main className="min-h-svh bg-gradient-to-b from-sky-50/70 to-white px-4 pb-16 pt-28 sm:pb-20 sm:pt-36 lg:px-12">
      <div className="mx-auto max-w-2xl">
        <header className="mb-10">
          <h1 className="text-4xl font-medium tracking-tight text-neutral-900 sm:text-5xl">
            Add New Travel Package
          </h1>
          <p className="mt-3 text-sm text-neutral-600">
            Fill in the details below to publish a new destination.
          </p>
        </header>

        <AddDestinationForm />
      </div>
    </main>
  )
}
export default function Hero() {
  return (
    <div className="text-center py-8">
      <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
        Innotek Demo
      </h1>
      <p className="mt-6 text-lg leading-8 text-gray-600">
        This demo application shows how to use the Autodesk Viewer and the
        Autodesk Platform Services to create a custom application.
      </p>
      <div className="mt-2 flex items-center justify-center gap-x-6">
        <a
          href="https://innotek.dev"
          className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          Get started
        </a>
        <a
          href="https://innotek.dev/#case-studies"
          className="text-sm font-semibold leading-6"
        >
          Learn more <span aria-hidden="true">→</span>
        </a>
      </div>
      <div className="mt-2 flex flex-col items-center justify-center gap-x-6 text-sm">
        <p>
          Tip: Select <kbd>rme_basic_sample_project.rvt</kbd> from the{" "}
          <strong>Model</strong> list.
        </p>
        <p>
          Once the table on the right loads all models, select{" "}
          <kbd>Electrical Equipment</kbd> from the <strong>Object Type</strong>{" "}
          list.
        </p>
        <p>
          To focus on individual Objects, select any objects from the table on
          the right.
        </p>
      </div>
    </div>
  );
}

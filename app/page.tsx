"use client";

import Hero from "@/components/hero";
import ModelSelect from "@/components/model_select";
import React, { useState, useEffect } from "react";

async function getObjects() {
  try {
    const modelsUrl = new URL("/api/models", window.location.origin).href;
    const resp = await fetch(modelsUrl);
    if (!resp.ok) {
      throw new Error(await resp.text());
    }
    const response = await resp.json();
    return response;
  } catch (err) {
    console.error(err);
  }
}

export default function Home() {
  const [models, setModels] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const data = await getObjects();
      setModels(data);
    }
    fetchData();
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center gap-2">
      <Hero />
      <ModelSelect models={models} />
      <div className="mb-32 grid text-center lg:max-w-5xl lg:w-full lg:mb-0 lg:grid-cols-4 lg:text-left">
        <a
          href="https://innotek.dev/#case-studies"
          className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
          target="_blank"
          rel="noopener noreferrer"
        >
          <h2 className={`mb-3 text-2xl font-semibold`}>
            Case Studies{" "}
            <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
              -&gt;
            </span>
          </h2>
          <p className={`m-0 max-w-[30ch] text-sm opacity-50`}>
            Learn about what Innotek can do for your business.
          </p>
        </a>

        <a
          href="https://innotek.dev/contact"
          className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
          target="_blank"
          rel="noopener noreferrer"
        >
          <h2 className={`mb-3 text-2xl font-semibold`}>
            Contact{" "}
            <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
              -&gt;
            </span>
          </h2>
          <p className={`m-0 max-w-[30ch] text-sm opacity-50`}>
            Tell us about your project idea using the form below and we’ll get
            back to you!
          </p>
        </a>
      </div>
    </main>
  );
}

import { Icons } from "./icons";

export function PromptSuggestions({
  label,
  append,
  suggestions
}) {
  return (
    <div className="space-y-6 w-full lg:p-[6rem]">
      <h2 className="text-center text-2xl font-bold font-mono">{label}</h2>
      <div className="flex gap-6 text-sm">
        {suggestions.map((suggestion) => (
          <button
            key={suggestion}
            onClick={() => append({ role: "user", content: suggestion })}
            className="h-max flex-1 rounded-xl border bg-background p-4 hover:bg-muted">
            <p>{suggestion}</p>
          </button>
        ))}
      </div>
    </div>
  );
}
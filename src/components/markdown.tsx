import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

/**
 * Render isi artikel Markdown di server. HTML mentah di dalam Markdown
 * diabaikan (default react-markdown), jadi aman dari skrip sisipan.
 */
export function Markdown({ children }: { children: string }) {
  return (
    <div className="prose prose-lg max-w-none prose-neutral dark:prose-invert prose-headings:font-display prose-headings:tracking-tight prose-a:text-accent-text prose-a:underline-offset-4 prose-pre:rounded-xl prose-pre:border prose-pre:border-border">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          a: ({ href, children, ...props }) => {
            const external = href?.startsWith("http");
            return (
              <a
                href={href}
                {...(external
                  ? { target: "_blank", rel: "noopener noreferrer" }
                  : {})}
                {...props}
              >
                {children}
              </a>
            );
          },
        }}
      >
        {children}
      </ReactMarkdown>
    </div>
  );
}

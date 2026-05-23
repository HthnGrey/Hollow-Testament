import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export function MarkdownContent({ content }: { content: string }) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        h1: ({ children }) => (
          <h2 className="font-heading mt-8 text-2xl tracking-wide">{children}</h2>
        ),
        h2: ({ children }) => (
          <h3 className="font-heading mt-6 text-xl tracking-wide">{children}</h3>
        ),
        p: ({ children }) => <p className="mt-4 leading-relaxed">{children}</p>,
        a: ({ href, children }) => (
          <a
            href={href}
            className="text-link underline underline-offset-4 hover:text-link-hover"
            target="_blank"
            rel="noopener noreferrer"
          >
            {children}
          </a>
        ),
        ul: ({ children }) => (
          <ul className="mt-4 list-disc space-y-2 pl-6">{children}</ul>
        ),
        ol: ({ children }) => (
          <ol className="mt-4 list-decimal space-y-2 pl-6">{children}</ol>
        ),
      }}
    >
      {content}
    </ReactMarkdown>
  );
}

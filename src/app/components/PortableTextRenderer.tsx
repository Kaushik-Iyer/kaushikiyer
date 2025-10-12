'use client';

// Simple PortableText renderer for JSON-based content
export function PortableTextRenderer({ value }: { value: any[] }) {
  if (!value || !Array.isArray(value)) return null;

  return (
    <div className="space-y-4">
      {value.map((block: any, index: number) => {
        if (block._type === 'block') {
          const style = block.style || 'normal';
          const text = block.children?.map((child: any) => child.text).join('') || '';

          if (style === 'h1') return <h1 key={index} className="text-3xl font-bold">{text}</h1>;
          if (style === 'h2') return <h2 key={index} className="text-2xl font-bold">{text}</h2>;
          if (style === 'h3') return <h3 key={index} className="text-xl font-semibold">{text}</h3>;
          if (style === 'blockquote') return <blockquote key={index} className="border-l-4 border-primary pl-4 italic">{text}</blockquote>;
          
          return <p key={index} className="text-text/90 leading-relaxed">{text}</p>;
        }
        return null;
      })}
    </div>
  );
}

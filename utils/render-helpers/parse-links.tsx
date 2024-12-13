// Function to parse links and convert them into React elements
export const parseLinks = (text: string): JSX.Element[] => {
    // Ensure text is a string
    if (typeof text !== 'string') {
      console.error('parseLinks: text is not a string', text);
      return [];
    }
    
    // Define a regular expression to match the special tag wrapper [LINK][/LINK]
    // This regex does not make assumptions about the URL format
    const linkRegex = /\[LINK\](.*?)\[\/LINK\]/g;
    
    // Split the text by line breaks to maintain them
    const lines = text.split('\n');
  
    return lines.flatMap((line, lineIndex) => {
      // Split the line into parts by the linkRegex
      const parts = line.split(linkRegex).map((part, index) => {
        // If the part is a URL (every second match is a URL), create an anchor element
        if (index % 2 === 1) {
          return (
            <a key={`${lineIndex}-${index}`} href={part} target="_blank" rel="noopener noreferrer" className="text-link">
              Download
            </a>
          );
        } else {
          // If the part is not a URL, return a span element
          return <span key={`${lineIndex}-${index}`}>{part}</span>;
        }
      });
  
      // Add a <br /> after each line except the last one
      return lineIndex < lines.length - 1 ? [...parts, <br key={`br-${lineIndex}`} />] : parts;
    });
  };
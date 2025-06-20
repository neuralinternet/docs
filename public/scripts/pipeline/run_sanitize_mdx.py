import os
import re
import argparse

def sanitize_mdx_file(file_path):
    """
    Reads an .mdx file, sanitizes its content to prevent common parsing errors,
    and writes the changes back to the file if any were made.

    Args:
        file_path (str): The path to the .mdx file.
    """
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
    except Exception as e:
        print(f"Error reading {file_path}: {e}")
        return

    original_content = content
    
    # We split the file into parts: code blocks and markdown text.
    # This allows us to apply different sanitization rules to each part.
    parts = re.split(r'(```[\s\S]*?```)', content)
    
    sanitized_parts = []
    for i, part in enumerate(parts):
        if i % 2 == 1:
            # This part is a code block.
            if part.startswith('```mermaid'):
                # This is a Mermaid diagram. We need to sanitize node labels.
                # The issue is with '=' inside labels, e.g., A["key = value"].
                # We replace '=' with ':' inside the quoted label text.
                def sanitize_mermaid_label(match):
                    label_content = match.group(1)
                    sanitized_label = label_content.replace('=', ':')
                    return f'["{sanitized_label}"]'

                # This regex finds labels in Mermaid nodes and applies the sanitization.
                part = re.sub(r'\[\"(.*?)\"\]', sanitize_mermaid_label, part)
            sanitized_parts.append(part)
        else:
            # This part is Markdown text.
            # The issue here is with unescaped '<' and '>' characters.
            # We replace them with their HTML entity equivalents.
            part = part.replace('<=', '&lt;=')
            part = part.replace('>=', '&gt;=')
            # Handle standalone '<' and '>' carefully to avoid breaking JSX tags.
            # We use spaces to target relational operators, e.g., "a < b".
            part = re.sub(r'\s<\s', ' &lt; ', part)
            part = re.sub(r'\s>\s', ' &gt; ', part)
            sanitized_parts.append(part)

    sanitized_content = "".join(sanitized_parts)

    if sanitized_content != original_content:
        print(f"Sanitizing {file_path}...")
        try:
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(sanitized_content)
        except Exception as e:
            print(f"Error writing to {file_path}: {e}")

def main():
    """
    Parses command-line arguments and runs the sanitization process.
    """
    parser = argparse.ArgumentParser(
        description="Sanitize .mdx files to prevent common MDX rendering errors."
    )
    parser.add_argument(
        "directory", 
        help="The directory to scan for .mdx files (e.g., 'src/content/docs')."
    )
    args = parser.parse_args()

    if not os.path.isdir(args.directory):
        print(f"Error: Directory '{args.directory}' not found.")
        return

    print(f"Starting sanitization in '{args.directory}'...")
    for root, _, files in os.walk(args.directory):
        for file in files:
            if file.endswith(".mdx"):
                sanitize_mdx_file(os.path.join(root, file))
    
    print("Sanitization complete.")

if __name__ == "__main__":
    main() 
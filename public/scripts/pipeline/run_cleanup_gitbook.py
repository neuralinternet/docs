import os

def cleanup_gitbook_file(filepath):
    """
    Reads a .md file and removes the GitBook navigation footer.
    The footer typically starts with a line containing '[Previous' and
    may include a 'Last updated' line.
    """
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            lines = f.readlines()
    except Exception as e:
        print(f"Error reading file {filepath}: {e}")
        return False

    if not lines:
        return False

    original_line_count = len(lines)
    line_to_cut_from = -1

    for i, line in enumerate(lines):
        # The navigation footer in GitBook scrapes often starts with this
        if '[Previous' in line:
            line_to_cut_from = i
            break

    if line_to_cut_from != -1:
        # We truncate the file from this line onwards
        cleaned_lines = lines[:line_to_cut_from]
        
        # Also, trim any trailing whitespace or empty lines from the end
        while cleaned_lines and not cleaned_lines[-1].strip():
            cleaned_lines.pop()

        if len(cleaned_lines) < original_line_count:
            try:
                with open(filepath, 'w', encoding='utf-8') as f:
                    f.writelines(cleaned_lines)
                print(f"Cleaned up footer from: {filepath}")
                return True
            except Exception as e:
                print(f"Error writing updated file {filepath}: {e}")
                return False
    
    return False

def main():
    # The new pages are in a separate directory.
    # We are not using config.py as this is a specific cleanup task.
    target_dir = os.path.join(os.path.dirname(__file__), '..', '..', '..', 'new pages', 'from_gitbook')
    target_dir = os.path.abspath(target_dir)

    print(f"Starting GitBook cleanup script...")
    print(f"Targeting directory: {target_dir}")
    
    if not os.path.exists(target_dir):
        print(f"Error: Target directory '{target_dir}' not found.")
        return

    modified_files_count = 0
    processed_files_count = 0

    for root, _, files in os.walk(target_dir):
        for file in files:
            if file.endswith(".md"):
                filepath = os.path.join(root, file)
                processed_files_count += 1
                if cleanup_gitbook_file(filepath):
                    modified_files_count += 1
    
    print(f"\nProcessed {processed_files_count} .md files.")
    print(f"Cleaned up {modified_files_count} files.")
    print("GitBook cleanup complete.")

if __name__ == "__main__":
    main()

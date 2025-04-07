import os
import argparse

def export_directory(root_dir, output_file):
    """
    Recursively traverses the root directory and writes the structure and file content
    to the output file.
    """
    with open(output_file, "w", encoding="utf-8") as f_out:
        for dirpath, dirnames, filenames in os.walk(root_dir):
            # Determine relative path for clarity
            rel_path = os.path.relpath(dirpath, root_dir)
            f_out.write(f"Directory: {rel_path}\n")
            f_out.write("-" * 80 + "\n")
            
            for filename in filenames:
                file_path = os.path.join(dirpath, filename)
                rel_file_path = os.path.relpath(file_path, root_dir)
                f_out.write(f"File: {rel_file_path}\n")
                f_out.write("-" * 40 + "\n")
                try:
                    with open(file_path, "r", encoding="utf-8") as f_in:
                        content = f_in.read()
                    f_out.write(content + "\n")
                except Exception as e:
                    f_out.write(f"Error reading file: {e}\n")
                f_out.write("-" * 40 + "\n\n")
            
            f_out.write("=" * 80 + "\n\n")

if __name__ == "__main__":
    parser = argparse.ArgumentParser(
        description="Export entire directory structure and file contents to a single TXT file."
    )
    parser.add_argument("directory", nargs="?", default=".", help="Root directory to export (default: current directory)")
    parser.add_argument("-o", "--output", default="directory_export.txt", help="Output TXT file path (default: directory_export.txt)")
    args = parser.parse_args()

    export_directory(args.directory, args.output)
    print(f"Export completed: {args.output}")
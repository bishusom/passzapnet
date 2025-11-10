import { FileCode, Terminal, Braces, Zap } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export interface CheatSheet {
  title: string;
  description: string;
  icon: LucideIcon;
  slug: string;
  items: CheatSheetItem[];
}

export interface CheatSheetItem {
  title: string;
  description: string;
  code: string;
  category: string;
}

export const cheatSheets: CheatSheet[] = [
  {
    title: 'Bash One-Liners',
    description: 'Essential Bash commands and shortcuts for efficient terminal usage',
    icon: Terminal,
    slug: 'bash',
    items: [
      {
        title: 'Find files by name',
        code: 'find . -name "*.txt"',
        description: 'Recursively find all text files in current directory',
        category: 'File Operations'
      },
      {
        title: 'Search in files',
        code: 'grep -r "search_term" .',
        description: 'Recursively search for text in all files',
        category: 'Search'
      },
      {
        title: 'Count lines in file',
        code: 'wc -l filename.txt',
        description: 'Count number of lines in a file',
        category: 'File Operations'
      },
      {
        title: 'Compress directory',
        code: 'tar -czf archive.tar.gz directory/',
        description: 'Create compressed tar archive of directory',
        category: 'Compression'
      },
      {
        title: 'Extract tar archive',
        code: 'tar -xzf archive.tar.gz',
        description: 'Extract compressed tar archive',
        category: 'Compression'
      },
      {
        title: 'Disk usage by directory',
        code: 'du -h --max-depth=1 | sort -hr',
        description: 'Show disk usage sorted by size (human readable)',
        category: 'System'
      },
      {
        title: 'Memory usage',
        code: 'free -h',
        description: 'Show memory usage in human readable format',
        category: 'System'
      },
      {
        title: 'CPU information',
        code: 'lscpu',
        description: 'Display detailed CPU information',
        category: 'System'
      },
      {
        title: 'Kill process by name',
        code: 'pkill -f process_name',
        description: 'Kill process by its name',
        category: 'Process Management'
      },
      {
        title: 'Find process using port',
        code: 'lsof -i :8080',
        description: 'Find which process is using port 8080',
        category: 'Network'
      },
      {
        title: 'Download file',
        code: 'wget -O filename.zip "https://example.com/file.zip"',
        description: 'Download file from URL with custom filename',
        category: 'Network'
      },
      {
        title: 'HTTP server',
        code: 'python3 -m http.server 8000',
        description: 'Start simple HTTP server on port 8000',
        category: 'Network'
      },
      {
        title: 'SSH with key',
        code: 'ssh -i ~/.ssh/key.pem user@host',
        description: 'SSH using specific private key',
        category: 'Network'
      },
      {
        title: 'SCP file transfer',
        code: 'scp file.txt user@remote:/path/',
        description: 'Copy file to remote server via SSH',
        category: 'Network'
      },
      {
        title: 'Monitor file changes',
        code: 'tail -f /var/log/syslog',
        description: 'Follow (monitor) log file in real-time',
        category: 'Monitoring'
      },
      {
        title: 'File permissions recursively',
        code: 'chmod -R 755 directory/',
        description: 'Change permissions recursively for directory',
        category: 'File Operations'
      },
      {
        title: 'Change owner recursively',
        code: 'chown -R user:group directory/',
        description: 'Change owner and group recursively',
        category: 'File Operations'
      },
      {
        title: 'Create symbolic link',
        code: 'ln -s /path/to/file linkname',
        description: 'Create symbolic link to file or directory',
        category: 'File Operations'
      },
      {
        title: 'Find large files',
        code: 'find . -type f -size +100M',
        description: 'Find files larger than 100MB',
        category: 'File Operations'
      },
      {
        title: 'Remove empty files',
        code: 'find . -type f -empty -delete',
        description: 'Find and delete empty files',
        category: 'File Operations'
      },
      {
        title: 'Remove empty directories',
        code: 'find . -type d -empty -delete',
        description: 'Find and delete empty directories',
        category: 'File Operations'
      },
      {
        title: 'Batch rename files',
        code: 'for file in *.jpg; do mv "$file" "${file%.jpg}.png"; done',
        description: 'Change file extension from jpg to png',
        category: 'File Operations'
      },
      {
        title: 'Create backup with timestamp',
        code: 'cp file.txt file.txt.$(date +%Y%m%d)',
        description: 'Create backup with date suffix',
        category: 'Backup'
      },
      {
        title: 'Compare two files',
        code: 'diff file1.txt file2.txt',
        description: 'Show differences between two files',
        category: 'File Operations'
      },
      {
        title: 'Monitor system resources',
        code: 'htop',
        description: 'Interactive process viewer (install with apt)',
        category: 'Monitoring'
      },
      {
        title: 'Check open ports',
        code: 'netstat -tulpn',
        description: 'List all listening ports and associated processes',
        category: 'Network'
      },
      {
        title: 'Check DNS resolution',
        code: 'nslookup example.com',
        description: 'Query DNS for domain information',
        category: 'Network'
      },
      {
        title: 'Trace network route',
        code: 'traceroute google.com',
        description: 'Trace network path to destination',
        category: 'Network'
      },
      {
        title: 'Check SSL certificate',
        code: 'openssl s_client -connect example.com:443',
        description: 'Check SSL certificate of website',
        category: 'Security'
      },
      {
        title: 'Generate random password',
        code: 'openssl rand -base64 32',
        description: 'Generate secure random password (32 characters)',
        category: 'Security'
      },
      {
        title: 'Calculate SHA256 hash',
        code: 'echo -n "text" | sha256sum',
        description: 'Calculate SHA256 hash of text string',
        category: 'Security'
      },
      {
        title: 'Base64 encode',
        code: 'echo -n "text" | base64',
        description: 'Base64 encode a string',
        category: 'Encoding'
      },
      {
        title: 'Base64 decode',
        code: 'echo "dGV4dA==" | base64 --decode',
        description: 'Base64 decode a string',
        category: 'Encoding'
      },
      {
        title: 'URL encode string',
        code: 'echo -n "text with spaces" | jq -s -R -r @uri',
        description: 'URL encode a string (requires jq)',
        category: 'Encoding'
      },
      {
        title: 'Sort lines and remove duplicates',
        code: 'sort file.txt | uniq',
        description: 'Sort lines and remove duplicates',
        category: 'Text Processing'
      },
      {
        title: 'Count occurrences',
        code: 'grep -o "word" file.txt | wc -l',
        description: 'Count how many times word appears in file',
        category: 'Text Processing'
      },
      {
        title: 'Extract IP addresses',
        code: 'grep -Eo "[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}" file.txt',
        description: 'Extract all IP addresses from file',
        category: 'Text Processing'
      },
      {
        title: 'Monitor commands in real-time',
        code: 'watch -n 1 "ls -la"',
        description: 'Execute command every second and show output',
        category: 'Monitoring'
      },
      {
        title: 'Create script template',
        code: 'echo -e "#!/bin/bash\\nset -euo pipefail" > script.sh',
        description: 'Create new bash script with safe defaults',
        category: 'Scripting'
      },
      {
        title: 'Make script executable',
        code: 'chmod +x script.sh',
        description: 'Make file executable',
        category: 'Scripting'
      },
      {
        title: 'Run command in background',
        code: 'nohup command &',
        description: 'Run command in background and detach from terminal',
        category: 'Process Management'
      },
      {
        title: 'Check command execution time',
        code: 'time ls -la',
        description: 'Measure execution time of command',
        category: 'Monitoring'
      },
      {
        title: 'Create directory structure',
        code: 'mkdir -p project/{src,test,docs,bin}',
        description: 'Create multiple directories at once',
        category: 'File Operations'
      },
      {
        title: 'Split file by lines',
        code: 'split -l 1000 large_file.txt output_prefix',
        description: 'Split file into multiple files of 1000 lines each',
        category: 'File Operations'
      },
      {
        title: 'Join files',
        code: 'cat file1.txt file2.txt > combined.txt',
        description: 'Concatenate multiple files into one',
        category: 'File Operations'
      },
      {
        title: 'Create large test file',
        code: 'dd if=/dev/zero of=testfile bs=1M count=100',
        description: 'Create 100MB test file filled with zeros',
        category: 'Testing'
      }
    ]
  },
  {
    title: 'Sed & Awk One-Liners',
    description: 'Powerful text processing commands for data manipulation',
    icon: FileCode, 
    slug: 'sed-awk',
    items: [
      {
        title: 'Replace text in file',
        code: "sed 's/old/new/g' file.txt",
        description: 'Replace all occurrences of old with new',
        category: 'Sed - Replacement'
      },
      {
        title: 'Replace and save in-place',
        code: "sed -i 's/old/new/g' file.txt",
        description: 'Replace text and modify file directly',
        category: 'Sed - Replacement'
      },
      {
        title: 'Delete lines containing pattern',
        code: "sed '/pattern/d' file.txt",
        description: 'Delete all lines that contain pattern',
        category: 'Sed - Deletion'
      },
      {
        title: 'Print specific line',
        code: "sed -n '5p' file.txt",
        description: 'Print only the 5th line of file',
        category: 'Sed - Printing'
      },
      {
        title: 'Print range of lines',
        code: "sed -n '10,20p' file.txt",
        description: 'Print lines 10 through 20',
        category: 'Sed - Printing'
      },
      {
        title: 'Print lines except range',
        code: "sed '10,20d' file.txt",
        description: 'Print all lines except 10 through 20',
        category: 'Sed - Deletion'
      },
      {
        title: 'Add text before line',
        code: "sed '5i\\text to insert' file.txt",
        description: 'Insert text before line 5',
        category: 'Sed - Insertion'
      },
      {
        title: 'Add text after line',
        code: "sed '5a\\text to append' file.txt",
        description: 'Append text after line 5',
        category: 'Sed - Insertion'
      },
      {
        title: 'Multiple substitutions',
        code: "sed -e 's/foo/bar/g' -e 's/hello/world/g' file.txt",
        description: 'Perform multiple substitutions',
        category: 'Sed - Replacement'
      },
      {
        title: 'Replace only on specific lines',
        code: "sed '5,10s/old/new/g' file.txt",
        description: 'Replace only between lines 5-10',
        category: 'Sed - Replacement'
      },
      {
        title: 'Print line numbers',
        code: "sed '=' file.txt | sed 'N;s/\\n/ /'",
        description: 'Print file with line numbers',
        category: 'Sed - Formatting'
      },
      {
        title: 'Remove leading whitespace',
        code: "sed 's/^[ \\t]*//' file.txt",
        description: 'Remove spaces/tabs from beginning of lines',
        category: 'Sed - Cleaning'
      },
      {
        title: 'Remove trailing whitespace',
        code: "sed 's/[ \\t]*$//' file.txt",
        description: 'Remove spaces/tabs from end of lines',
        category: 'Sed - Cleaning'
      },
      {
        title: 'Delete blank lines',
        code: "sed '/^$/d' file.txt",
        description: 'Remove all empty lines',
        category: 'Sed - Deletion'
      },
      {
        title: 'Print lines matching pattern',
        code: "sed -n '/pattern/p' file.txt",
        description: 'Print only lines that match pattern',
        category: 'Sed - Printing'
      },
      {
        title: 'Print AWK style',
        code: "awk '{print}' file.txt",
        description: 'Basic AWK print (like cat)',
        category: 'Awk - Printing'
      },
      {
        title: 'Print specific column',
        code: "awk '{print $1}' file.txt",
        description: 'Print first column (whitespace separated)',
        category: 'Awk - Printing'
      },
      {
        title: 'Print multiple columns',
        code: "awk '{print $1,$3}' file.txt",
        description: 'Print first and third columns',
        category: 'Awk - Printing'
      },
      {
        title: 'Print last column',
        code: "awk '{print $NF}' file.txt",
        description: 'Print the last column',
        category: 'Awk - Printing'
      },
      {
        title: 'Sum numbers in column',
        code: "awk '{sum+=$1} END {print sum}' file.txt",
        description: 'Sum all values in first column',
        category: 'Awk - Math'
      },
      {
        title: 'Average of column',
        code: "awk '{sum+=$1} END {print sum/NR}' file.txt",
        description: 'Calculate average of first column',
        category: 'Awk - Math'
      },
      {
        title: 'Count lines',
        code: "awk 'END {print NR}' file.txt",
        description: 'Print total number of lines',
        category: 'Awk - Counting'
      },
      {
        title: 'Filter lines by condition',
        code: "awk '$1 > 100' file.txt",
        description: 'Print lines where first column > 100',
        category: 'Awk - Filtering'
      },
      {
        title: 'Print lines between patterns',
        code: "awk '/start/,/end/' file.txt",
        description: 'Print lines between start and end patterns',
        category: 'Awk - Range'
      },
      {
        title: 'Field separator',
        code: "awk -F',' '{print $2}' file.csv",
        description: 'Use comma as field separator',
        category: 'Awk - Formatting'
      },
      {
        title: 'Multiple field separators',
        code: "awk -F'[,;]' '{print $1}' file.txt",
        description: 'Use comma or semicolon as separator',
        category: 'Awk - Formatting'
      },
      {
        title: 'Format output',
        code: "awk '{printf \"Name: %s, Age: %d\\n\", $1, $2}' file.txt",
        description: 'Formatted printing with printf',
        category: 'Awk - Formatting'
      },
      {
        title: 'Unique values in column',
        code: "awk '!seen[$1]++' file.txt",
        description: 'Print only first occurrence of each value in column 1',
        category: 'Awk - Filtering'
      },
      {
        title: 'Group by and count',
        code: "awk '{count[$1]++} END {for (word in count) print word, count[word]}' file.txt",
        description: 'Count occurrences of each value in first column',
        category: 'Awk - Counting'
      },
      {
        title: 'Join two files',
        code: "awk 'NR==FNR{a[$1]=$2; next} $1 in a{print $0, a[$1]}' file1.txt file2.txt",
        description: 'Join files on first column',
        category: 'Awk - Processing'
      },
      {
        title: 'Add header',
        code: "awk 'BEGIN {print \"Header1\\tHeader2\"} {print}' file.txt",
        description: 'Add header row to output',
        category: 'Awk - Formatting'
      },
      {
        title: 'Conditional printing',
        code: "awk '$3 == \"error\" {print $1, $2}' log.txt",
        description: 'Print columns 1 and 2 where column 3 is "error"',
        category: 'Awk - Filtering'
      },
      {
        title: 'String manipulation',
        code: "awk '{print substr($1, 1, 3)}' file.txt",
        description: 'Print first 3 characters of first column',
        category: 'Awk - Strings'
      },
      {
        title: 'Length of string',
        code: "awk '{print length($1)}' file.txt",
        description: 'Print length of first column values',
        category: 'Awk - Strings'
      },
      {
        title: 'Convert to uppercase',
        code: "awk '{print toupper($1)}' file.txt",
        description: 'Convert first column to uppercase',
        category: 'Awk - Strings'
      },
      {
        title: 'Convert to lowercase',
        code: "awk '{print tolower($1)}' file.txt",
        description: 'Convert first column to lowercase',
        category: 'Awk - Strings'
      },
      {
        title: 'Pattern replacement',
        code: "awk '{gsub(/old/, \"new\"); print}' file.txt",
        description: 'Replace pattern in entire line',
        category: 'Awk - Replacement'
      },
      {
        title: 'Extract substring',
        code: "awk 'match($0, /[0-9]{3}-[0-9]{3}-[0-9]{4}/) {print substr($0, RSTART, RLENGTH)}' file.txt",
        description: 'Extract phone numbers from text',
        category: 'Awk - Extraction'
      },
      {
        title: 'Split string into array',
        code: "awk '{split($1, a, \",\"); for (i in a) print a[i]}' file.txt",
        description: 'Split first column by comma and print each element',
        category: 'Awk - Arrays'
      },
      {
        title: 'Math operations',
        code: "awk '{print $1, $2, $1+$2, $1*$2}' numbers.txt",
        description: 'Perform addition and multiplication on columns',
        category: 'Awk - Math'
      },
      {
        title: 'Round numbers',
        code: "awk '{printf \"%.2f\\n\", $1}' numbers.txt",
        description: 'Round numbers to 2 decimal places',
        category: 'Awk - Math'
      },
      {
        title: 'Skip first N lines',
        code: "awk 'NR > 5' file.txt",
        description: 'Print all lines except first 5',
        category: 'Awk - Filtering'
      },
      {
        title: 'Print every Nth line',
        code: "awk 'NR % 5 == 0' file.txt",
        description: 'Print every 5th line',
        category: 'Awk - Filtering'
      },
      {
        title: 'Multiple conditions',
        code: "awk '$1 > 100 && $2 < 50' file.txt",
        description: 'Print lines where col1 > 100 AND col2 < 50',
        category: 'Awk - Filtering'
      },
      {
        title: 'If-else condition',
        code: "awk '{if ($1 > 50) print \"High\", $1; else print \"Low\", $1}' file.txt",
        description: 'Categorize values as High or Low',
        category: 'Awk - Logic'
      },
      {
        title: 'Combine sed and awk',
        code: "sed 's/foo/bar/g' file.txt | awk '{print $1}'",
        description: 'Replace text with sed then extract column with awk',
        category: 'Combined'
      }
    ]
  },
  {
    title: 'Python One-Liners',
    description: 'Quick Python snippets for common tasks and data manipulation',
    icon: Braces,
    slug: 'python',
    items: [
      {
        title: 'Read file lines',
        code: "lines = [line.strip() for line in open('file.txt')]",
        description: 'Read all lines from file into list',
        category: 'File I/O'
      },
      {
        title: 'Write to file',
        code: "open('output.txt', 'w').write('text')",
        description: 'Write text to file (overwrites existing)',
        category: 'File I/O'
      },
      {
        title: 'List comprehension',
        code: "squares = [x**2 for x in range(10)]",
        description: 'Create list of squares from 0 to 9',
        category: 'Lists'
      },
      {
        title: 'Filter list',
        code: "even = [x for x in range(10) if x % 2 == 0]",
        description: 'Filter even numbers from list',
        category: 'Lists'
      },
      {
        title: 'Dictionary comprehension',
        code: "squares = {x: x**2 for x in range(5)}",
        description: 'Create dictionary with numbers and their squares',
        category: 'Dictionaries'
      },
      {
        title: 'Swap variables',
        code: "a, b = b, a",
        description: 'Swap values of two variables',
        category: 'Variables'
      },
      {
        title: 'Reverse string',
        code: "reversed_str = 'hello'[::-1]",
        description: 'Reverse a string using slicing',
        category: 'Strings'
      },
      {
        title: 'Flatten 2D list',
        code: "flat = [item for sublist in matrix for item in sublist]",
        description: 'Convert 2D list to 1D list',
        category: 'Lists'
      },
      {
        title: 'Find most common element',
        code: "most_common = max(set(lst), key=lst.count)",
        description: 'Find most frequent element in list',
        category: 'Lists'
      },
      {
        title: 'Merge dictionaries',
        code: "merged = {**dict1, **dict2}",
        description: 'Merge two dictionaries (Python 3.5+)',
        category: 'Dictionaries'
      },
      {
        title: 'Sort dictionary by value',
        code: "sorted_dict = dict(sorted(d.items(), key=lambda x: x[1]))",
        description: 'Sort dictionary by values',
        category: 'Dictionaries'
      },
      {
        title: 'Check if all elements are True',
        code: "all_true = all([True, True, False])  # Returns False",
        description: 'Check if all elements in iterable are True',
        category: 'Logic'
      },
      {
        title: 'Check if any element is True',
        code: "any_true = any([False, True, False])  # Returns True",
        description: 'Check if any element in iterable is True',
        category: 'Logic'
      },
      {
        title: 'Transpose matrix',
        code: "transposed = list(zip(*matrix))",
        description: 'Transpose 2D list (swap rows and columns)',
        category: 'Lists'
      },
      {
        title: 'Remove duplicates from list',
        code: "unique = list(set(original_list))",
        description: 'Remove duplicates (order not preserved)',
        category: 'Lists'
      },
      {
        title: 'Remove duplicates preserving order',
        code: "unique = list(dict.fromkeys(original_list))",
        description: 'Remove duplicates while preserving order',
        category: 'Lists'
      },
      {
        title: 'Count occurrences',
        code: "counts = {item: lst.count(item) for item in set(lst)}",
        description: 'Count occurrences of each element in list',
        category: 'Counting'
      },
      {
        title: 'Find indices of matching elements',
        code: "indices = [i for i, x in enumerate(lst) if x == 'target']",
        description: 'Find all indices where element matches target',
        category: 'Lists'
      },
      {
        title: 'Split string into words',
        code: "words = 'hello world'.split()",
        description: 'Split string by whitespace into list',
        category: 'Strings'
      },
      {
        title: 'Join list into string',
        code: "s = '-'.join(['a', 'b', 'c'])  # 'a-b-c'",
        description: 'Join list elements with separator',
        category: 'Strings'
      },
      {
        title: 'Check if string contains substring',
        code: "contains = 'sub' in 'this is a substring'",
        description: 'Check if string contains another string',
        category: 'Strings'
      },
      {
        title: 'String formatting',
        code: "formatted = f'Value: {value}, Name: {name}'",
        description: 'f-string formatting (Python 3.6+)',
        category: 'Strings'
      },
      {
        title: 'Current timestamp',
        code: "from datetime import datetime; now = datetime.now().isoformat()",
        description: 'Get current ISO formatted timestamp',
        category: 'Date/Time'
      },
      {
        title: 'Parse date string',
        code: "from datetime import datetime; dt = datetime.strptime('2023-12-25', '%Y-%m-%d')",
        description: 'Parse date string into datetime object',
        category: 'Date/Time'
      },
      {
        title: 'HTTP GET request',
        code: "import requests; response = requests.get('https://api.example.com')",
        description: 'Make HTTP GET request (requires requests library)',
        category: 'Web'
      },
      {
        title: 'Simple HTTP server',
        code: "python -m http.server 8000",
        description: 'Start HTTP server in current directory',
        category: 'Web'
      },
      {
        title: 'JSON string to dict',
        code: "import json; data = json.loads('{\"key\": \"value\"}')",
        description: 'Parse JSON string to dictionary',
        category: 'JSON'
      },
      {
        title: 'Dict to JSON string',
        code: "import json; json_str = json.dumps({'key': 'value'})",
        description: 'Convert dictionary to JSON string',
        category: 'JSON'
      },
      {
        title: 'Read JSON file',
        code: "import json; data = json.load(open('file.json'))",
        description: 'Read and parse JSON file',
        category: 'JSON'
      },
      {
        title: 'Write JSON file',
        code: "import json; json.dump(data, open('output.json', 'w'), indent=2)",
        description: 'Write dictionary to JSON file with indentation',
        category: 'JSON'
      },
      {
        title: 'List files in directory',
        code: "import os; files = os.listdir('.')",
        description: 'Get list of files in current directory',
        category: 'File System'
      },
      {
        title: 'Check if file exists',
        code: "import os; exists = os.path.isfile('file.txt')",
        description: 'Check if file exists and is a file (not directory)',
        category: 'File System'
      },
      {
        title: 'Get file size',
        code: "import os; size = os.path.getsize('file.txt')",
        description: 'Get file size in bytes',
        category: 'File System'
      },
      {
        title: 'Run shell command',
        code: "import subprocess; result = subprocess.run(['ls', '-la'], capture_output=True, text=True)",
        description: 'Execute shell command and capture output',
        category: 'System'
      },
      {
        title: 'Current working directory',
        code: "import os; cwd = os.getcwd()",
        description: 'Get current working directory path',
        category: 'File System'
      },
      {
        title: 'Change directory',
        code: "import os; os.chdir('/path/to/dir')",
        description: 'Change current working directory',
        category: 'File System'
      },
      {
        title: 'Environment variables',
        code: "import os; path = os.environ.get('PATH', '')",
        description: 'Get environment variable with default value',
        category: 'System'
      },
      {
        title: 'Command line arguments',
        code: "import sys; args = sys.argv[1:]",
        description: 'Get command line arguments (excluding script name)',
        category: 'System'
      },
      {
        title: 'Measure execution time',
        code: "import time; start = time.time(); [x**2 for x in range(1000)]; print(time.time() - start)",
        description: 'Measure execution time of code block',
        category: 'Performance'
      },
      {
        title: 'Create virtual environment',
        code: "python -m venv myenv",
        description: 'Create Python virtual environment',
        category: 'Environment'
      },
      {
        title: 'Install package',
        code: "pip install requests",
        description: 'Install Python package using pip',
        category: 'Packages'
      },
      {
        title: 'List installed packages',
        code: "pip list",
        description: 'Show all installed packages',
        category: 'Packages'
      },
      {
        title: 'Lambda function',
        code: "square = lambda x: x**2",
        description: 'Create anonymous function',
        category: 'Functions'
      },
      {
        title: 'Map function',
        code: "squared = list(map(lambda x: x**2, [1,2,3,4]))",
        description: 'Apply function to all elements in list',
        category: 'Functions'
      },
      {
        title: 'Filter function',
        code: "even = list(filter(lambda x: x % 2 == 0, [1,2,3,4]))",
        description: 'Filter elements from list',
        category: 'Functions'
      },
      {
        title: 'Reduce function',
        code: "from functools import reduce; product = reduce(lambda x, y: x * y, [1,2,3,4])",
        description: 'Apply function cumulatively to items',
        category: 'Functions'
      },
      {
        title: 'Zip two lists',
        code: "pairs = list(zip([1,2,3], ['a','b','c']))",
        description: 'Combine two lists into list of tuples',
        category: 'Lists'
      },
      {
        title: 'Unzip list of tuples',
        code: "numbers, letters = zip(*[('1','a'), ('2','b'), ('3','c')])",
        description: 'Separate list of tuples into individual lists',
        category: 'Lists'
      },
      {
        title: 'Class definition',
        code: "class Person:\\n    def __init__(self, name):\\n        self.name = name",
        description: 'Simple class with constructor',
        category: 'OOP'
      },
      {
        title: 'List directory with full path',
        code: "import os; full_paths = [os.path.join('.', f) for f in os.listdir('.')]",
        description: 'Get list of files with full paths',
        category: 'File System'
      },
      {
        title: 'Recursive file search',
        code: "import glob; files = glob.glob('**/*.txt', recursive=True)",
        description: 'Find all text files recursively',
        category: 'File System'
      },
      {
        title: 'Read CSV file',
        code: "import csv; data = list(csv.reader(open('file.csv')))",
        description: 'Read CSV file into list of lists',
        category: 'CSV'
      },
      {
        title: 'Write CSV file',
        code: "import csv; csv.writer(open('output.csv', 'w')).writerows(data)",
        description: 'Write data to CSV file',
        category: 'CSV'
      }
    ]
  },
  {
    title: 'PowerShell One-Liners',
    description: 'Windows PowerShell commands for system administration and automation',
    icon: Zap,
    slug: 'powershell',
    items: [
      {
        title: 'Get running processes',
        code: 'Get-Process',
        description: 'List all running processes',
        category: 'Process Management'
      },
      {
        title: 'Stop process by name',
        code: 'Stop-Process -Name "notepad"',
        description: 'Stop all processes with specified name',
        category: 'Process Management'
      },
      {
        title: 'Get service status',
        code: 'Get-Service',
        description: 'List all services and their status',
        category: 'Services'
      },
      {
        title: 'Start service',
        code: 'Start-Service -Name "Spooler"',
        description: 'Start a specific service',
        category: 'Services'
      },
      {
        title: 'Stop service',
        code: 'Stop-Service -Name "Spooler"',
        description: 'Stop a specific service',
        category: 'Services'
      },
      {
        title: 'Get event logs',
        code: 'Get-EventLog -LogName System -Newest 10',
        description: 'Get latest 10 system event log entries',
        category: 'Logging'
      },
      {
        title: 'Get computer info',
        code: 'Get-ComputerInfo',
        description: 'Get detailed computer system information',
        category: 'System Info'
      },
      {
        title: 'Get disk space',
        code: 'Get-PSDrive -PSProvider FileSystem',
        description: 'Show disk space for all drives',
        category: 'Storage'
      },
      {
        title: 'List files recursively',
        code: 'Get-ChildItem -Path "C:\\" -Recurse',
        description: 'Recursively list all files in directory',
        category: 'File System'
      },
      {
        title: 'Find files by extension',
        code: 'Get-ChildItem -Path "C:\\" -Recurse -Filter "*.txt"',
        description: 'Find all text files recursively',
        category: 'File System'
      },
      {
        title: 'Find files by size',
        code: 'Get-ChildItem -Path "C:\\" -Recurse | Where-Object {$_.Length -gt 100MB}',
        description: 'Find files larger than 100MB',
        category: 'File System'
      },
      {
        title: 'Get file content',
        code: 'Get-Content -Path "file.txt"',
        description: 'Read and display file content',
        category: 'File System'
      },
      {
        title: 'Set file content',
        code: 'Set-Content -Path "file.txt" -Value "New content"',
        description: 'Write content to file (overwrites)',
        category: 'File System'
      },
      {
        title: 'Add to file',
        code: 'Add-Content -Path "file.txt" -Value "Appended content"',
        description: 'Append content to file',
        category: 'File System'
      },
      {
        title: 'Copy files recursively',
        code: 'Copy-Item -Path "C:\\source\\*" -Destination "D:\\backup\\" -Recurse',
        description: 'Recursively copy files and directories',
        category: 'File System'
      },
      {
        title: 'Delete files recursively',
        code: 'Remove-Item -Path "C:\\temp\\*" -Recurse -Force',
        description: 'Force delete all files and subdirectories',
        category: 'File System'
      },
      {
        title: 'Create directory',
        code: 'New-Item -Path "C:\\newdir" -ItemType Directory',
        description: 'Create new directory',
        category: 'File System'
      },
      {
        title: 'Check if file exists',
        code: 'Test-Path -Path "C:\\file.txt"',
        description: 'Check if file or directory exists',
        category: 'File System'
      },
      {
        title: 'Get file hash',
        code: 'Get-FileHash -Path "file.iso" -Algorithm SHA256',
        description: 'Calculate SHA256 hash of file',
        category: 'Security'
      },
      {
        title: 'Get network adapters',
        code: 'Get-NetAdapter',
        description: 'List all network adapters',
        category: 'Network'
      },
      {
        title: 'Get IP configuration',
        code: 'Get-NetIPConfiguration',
        description: 'Show IP address configuration',
        category: 'Network'
      },
      {
        title: 'Test network connectivity',
        code: 'Test-NetConnection -ComputerName "google.com"',
        description: 'Test connection to remote host',
        category: 'Network'
      },
      {
        title: 'Get TCP connections',
        code: 'Get-NetTCPConnection',
        description: 'Show active TCP connections',
        category: 'Network'
      },
      {
        title: 'DNS lookup',
        code: 'Resolve-DnsName -Name "google.com"',
        description: 'Perform DNS query',
        category: 'Network'
      },
      {
        title: 'Get system uptime',
        code: '(Get-Date) - (Get-CimInstance Win32_OperatingSystem).LastBootUpTime',
        description: 'Calculate system uptime',
        category: 'System Info'
      },
      {
        title: 'Get installed programs',
        code: 'Get-WmiObject -Class Win32_Product | Select-Object Name, Version',
        description: 'List installed software',
        category: 'Software'
      },
      {
        title: 'Get hotfixes',
        code: 'Get-HotFix',
        description: 'List installed Windows updates',
        category: 'Updates'
      },
      {
        title: 'Get environment variables',
        code: 'Get-ChildItem Env:',
        description: 'List all environment variables',
        category: 'System'
      },
      {
        title: 'Set environment variable',
        code: '[Environment]::SetEnvironmentVariable("MY_VAR", "value", "User")',
        description: 'Set user environment variable',
        category: 'System'
      },
      {
        title: 'Get PowerShell version',
        code: '$PSVersionTable.PSVersion',
        description: 'Show PowerShell version information',
        category: 'PowerShell'
      },
      {
        title: 'Get command help',
        code: 'Get-Help Get-Process',
        description: 'Show help for specific command',
        category: 'PowerShell'
      },
      {
        title: 'Find commands',
        code: 'Get-Command -Noun Process',
        description: 'Find commands related to processes',
        category: 'PowerShell'
      },
      {
        title: 'Export to CSV',
        code: 'Get-Process | Export-Csv -Path "processes.csv" -NoTypeInformation',
        description: 'Export data to CSV file',
        category: 'Data Export'
      },
      {
        title: 'Import from CSV',
        code: '$data = Import-Csv -Path "data.csv"',
        description: 'Import data from CSV file',
        category: 'Data Import'
      },
      {
        title: 'Convert to JSON',
        code: 'Get-Process | ConvertTo-Json',
        description: 'Convert object to JSON string',
        category: 'Data Format'
      },
      {
        title: 'Convert from JSON',
        code: '$obj = Get-Content "data.json" | ConvertFrom-Json',
        description: 'Convert JSON string to object',
        category: 'Data Format'
      },
      {
        title: 'Sort objects',
        code: 'Get-Process | Sort-Object CPU -Descending',
        description: 'Sort processes by CPU usage (descending)',
        category: 'Data Processing'
      },
      {
        title: 'Filter objects',
        code: 'Get-Process | Where-Object {$_.CPU -gt 100}',
        description: 'Filter processes using more than 100 CPU seconds',
        category: 'Data Processing'
      },
      {
        title: 'Select properties',
        code: 'Get-Process | Select-Object Name, CPU, WorkingSet',
        description: 'Select specific properties from objects',
        category: 'Data Processing'
      },
      {
        title: 'Group objects',
        code: 'Get-Process | Group-Object Company',
        description: 'Group processes by company name',
        category: 'Data Processing'
      },
      {
        title: 'Measure objects',
        code: 'Get-Process | Measure-Object',
        description: 'Get count, sum, average of object properties',
        category: 'Data Processing'
      },
      {
        title: 'Format table',
        code: 'Get-Process | Format-Table -AutoSize',
        description: 'Display output as formatted table',
        category: 'Output Format'
      },
      {
        title: 'Format list',
        code: 'Get-Process | Format-List',
        description: 'Display output as list',
        category: 'Output Format'
      },
      {
        title: 'Out-GridView',
        code: 'Get-Process | Out-GridView',
        description: 'Display output in interactive grid window',
        category: 'Output Format'
      },
      {
        title: 'Start job',
        code: 'Start-Job -ScriptBlock { Get-Process }',
        description: 'Start background job',
        category: 'Jobs'
      },
      {
        title: 'Get jobs',
        code: 'Get-Job',
        description: 'List background jobs',
        category: 'Jobs'
      },
      {
        title: 'Receive job results',
        code: 'Receive-Job -Id 1',
        description: 'Get results from background job',
        category: 'Jobs'
      },
      {
        title: 'Remove job',
        code: 'Remove-Job -Id 1',
        description: 'Remove background job',
        category: 'Jobs'
      },
      {
        title: 'Wait for job',
        code: 'Wait-Job -Id 1',
        description: 'Wait for background job to complete',
        category: 'Jobs'
      },
      {
        title: 'Schedule task',
        code: 'Register-ScheduledTask -TaskName "MyTask" -Trigger (New-ScheduledTaskTrigger -AtStartup) -Action (New-ScheduledTaskAction -Execute "powershell.exe" -Argument "script.ps1")',
        description: 'Create scheduled task',
        category: 'Scheduling'
      },
      {
        title: 'Get scheduled tasks',
        code: 'Get-ScheduledTask',
        description: 'List all scheduled tasks',
        category: 'Scheduling'
      },
      {
        title: 'Start scheduled task',
        code: 'Start-ScheduledTask -TaskName "MyTask"',
        description: 'Run scheduled task immediately',
        category: 'Scheduling'
      },
      {
        title: 'Get execution policy',
        code: 'Get-ExecutionPolicy',
        description: 'Show current PowerShell execution policy',
        category: 'Security'
      },
      {
        title: 'Set execution policy',
        code: 'Set-ExecutionPolicy RemoteSigned',
        description: 'Set execution policy to allow local scripts',
        category: 'Security'
      },
      {
        title: 'Get certificate',
        code: 'Get-ChildItem -Path Cert:\\LocalMachine\\My',
        description: 'List certificates in local machine store',
        category: 'Security'
      },
      {
        title: 'Create self-signed certificate',
        code: 'New-SelfSignedCertificate -DnsName "example.com" -CertStoreLocation "Cert:\\LocalMachine\\My"',
        description: 'Create self-signed SSL certificate',
        category: 'Security'
      },
      {
        title: 'Get Windows features',
        code: 'Get-WindowsFeature',
        description: 'List all Windows features and their status',
        category: 'Windows Features'
      },
      {
        title: 'Install Windows feature',
        code: 'Install-WindowsFeature -Name "Web-Server"',
        description: 'Install Windows feature (IIS example)',
        category: 'Windows Features'
      },
      {
        title: 'Remove Windows feature',
        code: 'Remove-WindowsFeature -Name "Web-Server"',
        description: 'Remove Windows feature',
        category: 'Windows Features'
      },
      {
        title: 'Restart computer',
        code: 'Restart-Computer -Force',
        description: 'Force restart computer',
        category: 'System'
      },
      {
        title: 'Shutdown computer',
        code: 'Stop-Computer -Force',
        description: 'Force shutdown computer',
        category: 'System'
      },
      {
        title: 'Get event subscribers',
        code: 'Get-EventSubscriber',
        description: 'List registered event subscriptions',
        category: 'Events'
      },
      {
        title: 'Register event',
        code: 'Register-ObjectEvent -InputObject (Get-Process) -EventName Exited -Action { Write-Host "Process exited" }',
        description: 'Register event handler for process exit',
        category: 'Events'
      },
      {
        title: 'Unregister event',
        code: 'Unregister-Event -SubscriptionId 1',
        description: 'Remove event subscription',
        category: 'Events'
      },
      {
        title: 'Get culture info',
        code: 'Get-Culture',
        description: 'Show current culture settings',
        category: 'System'
      },
      {
        title: 'Set location',
        code: 'Set-Location "C:\\Windows"',
        description: 'Change current directory (like cd)',
        category: 'File System'
      },
      {
        title: 'Get location',
        code: 'Get-Location',
        description: 'Show current directory (like pwd)',
        category: 'File System'
      },
      {
        title: 'Clear console',
        code: 'Clear-Host',
        description: 'Clear console screen (like cls)',
        category: 'Console'
      },
      {
        title: 'Get history',
        code: 'Get-History',
        description: 'Show command history',
        category: 'Console'
      },
      {
        title: 'Invoke history',
        code: 'Invoke-History -Id 5',
        description: 'Execute command from history by ID',
        category: 'Console'
      },
      {
        title: 'Clear history',
        code: 'Clear-History',
        description: 'Clear command history',
        category: 'Console'
      }
    ]
  }
];
import fs from "fs/promises";
import path from "path";
import { glob } from "glob";

interface FileInfo {
  relativePath: string;
  fullPath: string;
  content: string;
  language: string;
}

// Mapeo de extensiones a lenguajes de markdown
const EXTENSION_TO_LANGUAGE: { [key: string]: string } = {
  ".ts": "typescript",
  ".tsx": "typescript",
  ".js": "javascript",
  ".jsx": "javascript",
  ".css": "css",
  ".scss": "scss",
  ".sass": "sass",
  ".less": "less",
  ".html": "html",
  ".json": "json",
  ".md": "markdown",
  ".yml": "yaml",
  ".yaml": "yaml",
  ".xml": "xml",
  ".sql": "sql",
  ".py": "python",
  ".java": "java",
  ".cpp": "cpp",
  ".c": "c",
  ".cs": "csharp",
  ".php": "php",
  ".rb": "ruby",
  ".go": "go",
  ".rs": "rust",
  ".sh": "bash",
  ".bash": "bash",
  ".zsh": "bash",
  ".ps1": "powershell",
  ".dockerfile": "dockerfile",
  dockerfile: "dockerfile",
  ".txt": "text",
};

// Archivos que queremos ignorar
const IGNORED_FILES = [
  "node_modules",
  "dist",
  "build",
  ".git",
  ".DS_Store",
  "*.map",
  "*.log",
  "package-lock.json",
  "yarn.lock",
];

// Directorios/archivos específicos a ignorar
const IGNORED_PATTERNS = [
  "**/node_modules/**",
  "**/dist/**",
  "**/build/**",
  "**/.git/**",
  "**/*.map",
  "**/*.log",
];

class CodeContextGenerator {
  private baseDir: string;
  private outputFile: string;

  constructor(baseDir: string = "src", outputFile: string = "CODE_CONTEXT.md") {
    this.baseDir = baseDir;
    this.outputFile = outputFile;
  }

  private getLanguageFromExtension(filePath: string): string {
    const ext = path.extname(filePath).toLowerCase();
    const fileName = path.basename(filePath).toLowerCase();

    // Caso especial para Dockerfile
    if (fileName === "dockerfile" || fileName.includes("dockerfile")) {
      return "dockerfile";
    }

    return EXTENSION_TO_LANGUAGE[ext] || "text";
  }

  private shouldIncludeFile(filePath: string): boolean {
    const ignored = IGNORED_FILES.some((pattern) => {
      if (pattern.includes("*")) {
        const regex = new RegExp(pattern.replace("*", ".*"));
        return regex.test(path.basename(filePath));
      }
      return path.basename(filePath) === pattern;
    });

    return !ignored;
  }

  private async readFileContent(filePath: string): Promise<string> {
    try {
      return await fs.readFile(filePath, "utf-8");
    } catch (error) {
      console.warn(`❌ No se pudo leer el archivo: ${filePath}`);
      return "";
    }
  }

  private async findAllSourceFiles(): Promise<string[]> {
    try {
      const patterns = [`${this.baseDir}/**/*.*`, `${this.baseDir}/*.*`];

      const allFiles: string[] = [];

      for (const pattern of patterns) {
        const files = await glob(pattern, {
          ignore: IGNORED_PATTERNS,
          nodir: true,
        });
        allFiles.push(...files);
      }

      return allFiles.filter((file) => this.shouldIncludeFile(file));
    } catch (error) {
      console.error("Error buscando archivos:", error);
      return [];
    }
  }

  private async processFiles(filePaths: string[]): Promise<FileInfo[]> {
    const files: FileInfo[] = [];

    for (const filePath of filePaths) {
      const content = await this.readFileContent(filePath);
      if (content) {
        const relativePath = path.relative(process.cwd(), filePath);
        const language = this.getLanguageFromExtension(filePath);

        files.push({
          relativePath,
          fullPath: filePath,
          content,
          language,
        });
      }
    }

    // Ordenar archivos por ruta para mejor organización
    return files.sort((a, b) => a.relativePath.localeCompare(b.relativePath));
  }

  private generateMarkdown(files: FileInfo[]): string {
    let markdown = `# Contexto del Código\n\n`;
    markdown += `*Generado automáticamente el ${new Date().toLocaleString()}*\n\n`;
    markdown += `Este archivo contiene todo el código fuente del proyecto para propósitos de contexto.\n\n`;
    markdown += `## Archivos del Proyecto\n\n`;

    for (const file of files) {
      markdown += `### ${file.relativePath}\n\n`;
      markdown += `\`\`\`${file.language}\n`;
      markdown += `// Archivo: ${file.relativePath}\n`;
      markdown += file.content;
      markdown += `\n\`\`\`\n\n`;
    }

    return markdown;
  }

  public async generate(): Promise<void> {
    console.log(`🔍 Buscando archivos en ${this.baseDir}...`);

    const filePaths = await this.findAllSourceFiles();
    console.log(`📁 Encontrados ${filePaths.length} archivos`);

    if (filePaths.length === 0) {
      console.log("❌ No se encontraron archivos para procesar");
      return;
    }

    console.log("📝 Procesando archivos...");
    const files = await this.processFiles(filePaths);

    console.log("🔄 Generando markdown...");
    const markdown = this.generateMarkdown(files);

    console.log("💾 Guardando archivo...");
    await fs.writeFile(this.outputFile, markdown, "utf-8");

    console.log(`✅ Archivo ${this.outputFile} generado exitosamente!`);
    console.log(`📊 Total de archivos incluidos: ${files.length}`);
  }
}

// Ejecución principal
async function main() {
  const args = process.argv.slice(2);
  const baseDir = args[0] || "src";
  const outputFile = args[1] || "CODE_CONTEXT.md";

  const generator = new CodeContextGenerator(baseDir, outputFile);
  await generator.generate();
}

// Manejo de errores
main().catch((error) => {
  console.error("💥 Error fatal:", error);
  process.exit(1);
});

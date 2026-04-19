import { ToolConfig } from '@/config/tools-config';

const toolAliases: Record<string, string[]> = {
  'base64-tools': ['base64 encoder', 'base64 decoder'],
  'json-formatter': ['json beautifier', 'json validator', 'json prettifier'],
  'javascript-minifier': ['js minifier', 'js compressor'],
  'css-minifier': ['css compressor'],
  'sql-formatter': ['sql beautifier'],
  'jwt-decoder': ['jwt parser', 'token decoder', 'bearer token decoder'],
  'text-diff': ['diff checker', 'compare text', 'compare code'],
  'uuid-generator': ['guid generator'],
  'cron-parser': ['cron generator', 'cron visualizer', 'crontab'],
  'url-encoder': ['url decoder', 'percent encode', 'percent decode'],
  'html-entities': ['html escape', 'html unescape'],
  'csv-to-json': ['csv converter', 'json to csv'],
  'markdown-preview': ['markdown editor', 'md preview'],
  'country-info': ['country lookup', 'country data', 'country facts', 'country profile'],
  'public-holidays': ['holiday calendar', 'holiday lookup', 'public holiday api'],
  'npm-package-inspector': ['npm inspector', 'package lookup', 'package info', 'registry lookup'],
  'dns-lookup': ['dns records', 'dig tool', 'domain lookup', 'record lookup'],
  'string-case-converter': ['camel case', 'snake case', 'kebab case', 'pascal case'],
  'html-to-jsx': ['react converter', 'jsx converter', 'classname converter'],
  'list-converter': ['lines to csv', 'lines to json', 'sql in clause'],
  'config-converter': ['yaml to json', 'json to yaml', 'toml converter', 'config format converter'],
  'css-unit-converter': ['px to rem', 'rem to px', 'em converter', 'vw converter'],
  'color-picker': ['hex color picker', 'rgb color picker'],
  'color-palette': ['palette extractor', 'color extractor'],
  'qr-generator': ['qr code', 'wifi qr'],
  'css-gradient-generator': ['gradient builder'],
  'favicon-generator': ['app icon generator'],
  'svg-converter': ['svg optimizer', 'svg to png'],
  'font-converter': ['ttf converter', 'woff converter'],
  'audio-trimmer': ['audio cutter', 'mp3 trimmer'],
  'video-trimmer': ['video cutter'],
  'audio-joiner': ['audio merger', 'merge mp3'],
  'pdf-tools': ['pdf editor', 'pdf utilities'],
  calculator: ['calc'],
  'currency-converter': ['fx converter', 'exchange rate converter'],
  'unit-converter': ['measurement converter'],
  'stopwatch-timer': ['timer', 'stopwatch', 'countdown'],
  'timezone-converter': ['time zone converter'],
  'epoch-converter': ['unix timestamp converter'],
  'ldap-converter': ['ldap timestamp'],
  'unix-hex-converter': ['unix hex', 'hex timestamp'],
  'ip-tools': ['ip lookup', 'what is my ip'],
  'network-tools': ['dns lookup', 'ping test', 'network checker'],
  'http-status': ['http codes', 'status code reference', '404', '500', 'response code'],
  'user-agent-parser': ['ua parser', 'browser detector', 'device detector'],
  'mime-types': ['content type lookup', 'media type lookup', 'file extension mime'],
};

export interface RankedToolResult {
  tool: ToolConfig;
  score: number;
}

const normalize = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9\s/-]+/g, ' ')
    .replace(/[-_/]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

const getToolKeywords = (tool: ToolConfig) => {
  const aliases = toolAliases[tool.id] ?? [];
  const seoKeywords = tool.seo.keywords
    .split(',')
    .map(keyword => keyword.trim())
    .filter(Boolean);

  return [...aliases, ...seoKeywords];
};

const scoreValue = (value: string, query: string, baseScore: number) => {
  if (!value) return 0;
  if (value === query) return baseScore + 220;
  if (value.startsWith(query)) return baseScore + 140;
  if (value.includes(query)) return baseScore + 70;

  const queryTokens = query.split(' ').filter(Boolean);
  if (queryTokens.length > 1 && queryTokens.every(token => value.includes(token))) {
    return baseScore + 40;
  }

  return 0;
};

const getToolScore = (tool: ToolConfig, query: string) => {
  const normalizedName = normalize(tool.name);
  const normalizedDescription = normalize(tool.description);
  const normalizedCategory = normalize(tool.categoryName);
  const normalizedId = normalize(tool.id);
  const normalizedHref = normalize(tool.href);
  const keywords = getToolKeywords(tool).map(normalize);

  const keywordScore = keywords.reduce(
    (highestScore, keyword) => Math.max(highestScore, scoreValue(keyword, query, 560)),
    0
  );

  const score = Math.max(
    scoreValue(normalizedName, query, 900),
    scoreValue(normalizedId, query, 760),
    scoreValue(normalizedHref, query, 720),
    scoreValue(normalizedCategory, query, 460),
    scoreValue(normalizedDescription, query, 320),
    keywordScore
  );

  return score;
};

export interface SearchToolsOptions {
  category?: string;
  limit?: number;
}

export const searchTools = (
  tools: ToolConfig[],
  query: string,
  options: SearchToolsOptions = {}
): RankedToolResult[] => {
  const normalizedQuery = normalize(query);
  if (!normalizedQuery) return [];

  const filteredTools = options.category
    ? tools.filter(tool => tool.category === options.category)
    : tools;

  const rankedResults = filteredTools
    .map(tool => ({
      tool,
      score: getToolScore(tool, normalizedQuery),
    }))
    .filter(result => result.score > 0)
    .sort((left, right) => {
      if (right.score !== left.score) return right.score - left.score;
      return left.tool.name.localeCompare(right.tool.name);
    });

  return typeof options.limit === 'number'
    ? rankedResults.slice(0, options.limit)
    : rankedResults;
};

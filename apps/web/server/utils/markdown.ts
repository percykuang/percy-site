import MarkdownIt from 'markdown-it'
import { createHighlighter, type Highlighter } from 'shiki'

const markdownLanguages = [
  'bash',
  'css',
  'html',
  'javascript',
  'json',
  'jsx',
  'markdown',
  'shellscript',
  'tsx',
  'typescript',
  'vue',
] as const

const languageAliases: Record<string, string> = {
  js: 'javascript',
  md: 'markdown',
  sh: 'bash',
  shell: 'bash',
  ts: 'typescript',
  txt: 'text',
}

const highlighterPromise = createHighlighter({
  langs: [...markdownLanguages],
  themes: ['github-light'],
})

let markdownRendererPromise: Promise<MarkdownIt> | undefined
type MarkdownToken = ReturnType<MarkdownIt['parse']>[number]

function getMarkdownRenderer() {
  markdownRendererPromise ??= highlighterPromise.then((highlighter) => {
    const markdown = new MarkdownIt({
      breaks: false,
      html: false,
      linkify: true,
      typographer: true,
      highlight: (code, info) => highlightCode(highlighter, code, info),
    })

    markdown.renderer.rules.fence = (tokens, index) => {
      const token = tokens[index]
      const code = token?.content ?? ''
      const info = token?.info ?? ''
      const lang = normalizeLanguage(highlighter, info)
      const label = getLanguageLabel(info, lang)
      const highlightedCode = highlightCode(highlighter, code, info)

      return [
        `<div class="markdown-code-block" data-language="${escapeAttribute(label)}">`,
        '<div class="markdown-code-toolbar">',
        `<span class="markdown-code-lang">${escapeHtml(label)}</span>`,
        '<div class="markdown-code-actions">',
        '<button class="markdown-code-action" type="button" data-code-download aria-label="下载代码">',
        downloadIcon,
        '</button>',
        '<button class="markdown-code-action" type="button" data-code-copy aria-label="复制代码">',
        copyIcon,
        '</button>',
        '</div>',
        '</div>',
        highlightedCode,
        '</div>',
      ].join('')
    }

    const defaultLinkOpen =
      markdown.renderer.rules.link_open ??
      ((tokens, index, options, _env, self) => self.renderToken(tokens, index, options))

    markdown.renderer.rules.link_open = (tokens, index, options, env, self) => {
      const token = tokens[index]
      const href = token?.attrGet('href') ?? ''

      if (/^https?:\/\//.test(href)) {
        token?.attrSet('target', '_blank')
        token?.attrSet('rel', 'noreferrer noopener')
      }

      return defaultLinkOpen(tokens, index, options, env, self)
    }

    const defaultTableOpen =
      markdown.renderer.rules.table_open ??
      ((tokens, index, options, _env, self) => self.renderToken(tokens, index, options))
    const defaultTableClose =
      markdown.renderer.rules.table_close ??
      ((tokens, index, options, _env, self) => self.renderToken(tokens, index, options))

    markdown.renderer.rules.table_open = (tokens, index, options, env, self) => {
      return [
        '<div class="markdown-table-wrapper">',
        '<div class="markdown-table-scroller">',
        defaultTableOpen(tokens, index, options, env, self),
      ].join('')
    }

    markdown.renderer.rules.table_close = (tokens, index, options, env, self) => {
      return [defaultTableClose(tokens, index, options, env, self), '</div>', '</div>'].join('')
    }

    const defaultImageRender =
      markdown.renderer.rules.image ??
      ((tokens, index, options, _env, self) => self.renderToken(tokens, index, options))

    markdown.renderer.rules.image = (tokens, index, options, env, self) => {
      const token = tokens[index]

      token?.attrSet('loading', 'lazy')
      token?.attrSet('decoding', 'async')

      return defaultImageRender(tokens, index, options, env, self)
    }

    const defaultParagraphOpen =
      markdown.renderer.rules.paragraph_open ??
      ((tokens, index, options, _env, self) => self.renderToken(tokens, index, options))
    const defaultParagraphClose =
      markdown.renderer.rules.paragraph_close ??
      ((tokens, index, options, _env, self) => self.renderToken(tokens, index, options))

    markdown.renderer.rules.paragraph_open = (tokens, index, options, env, self) => {
      if (isStandaloneImageParagraph(tokens, index)) {
        return '<figure class="markdown-image-block">'
      }

      return defaultParagraphOpen(tokens, index, options, env, self)
    }

    markdown.renderer.rules.paragraph_close = (tokens, index, options, env, self) => {
      const imageToken = getStandaloneImageToken(tokens, index - 2)

      if (!imageToken) {
        return defaultParagraphClose(tokens, index, options, env, self)
      }

      const caption = imageToken.attrGet('title')?.trim()

      return [
        caption
          ? `<figcaption class="markdown-image-caption">${escapeHtml(caption)}</figcaption>`
          : '',
        '</figure>',
      ].join('')
    }

    return markdown
  })

  return markdownRendererPromise
}

function highlightCode(highlighter: Highlighter, code: string, info: string) {
  const lang = normalizeLanguage(highlighter, info)

  return highlighter.codeToHtml(code, {
    lang,
    theme: 'github-light',
  })
}

function normalizeLanguage(highlighter: Highlighter, info: string) {
  const rawLang = info.trim().split(/\s+/)[0]?.toLowerCase() || 'text'
  const lang = languageAliases[rawLang] ?? rawLang
  const loadedLanguages = new Set(highlighter.getLoadedLanguages())

  return loadedLanguages.has(lang) ? lang : 'text'
}

function getLanguageLabel(info: string, lang: string) {
  const rawLang = info.trim().split(/\s+/)[0]?.toLowerCase()

  return rawLang || lang
}

function escapeHtml(value: string) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;')
}

function escapeAttribute(value: string) {
  return escapeHtml(value)
}

function isStandaloneImageParagraph(tokens: MarkdownToken[], index: number) {
  return getStandaloneImageToken(tokens, index) !== null
}

function getStandaloneImageToken(tokens: MarkdownToken[], index: number) {
  const paragraphOpen = tokens[index]
  const inlineToken = tokens[index + 1]
  const paragraphClose = tokens[index + 2]

  if (
    paragraphOpen?.type !== 'paragraph_open' ||
    inlineToken?.type !== 'inline' ||
    paragraphClose?.type !== 'paragraph_close'
  ) {
    return null
  }

  const children = inlineToken.children ?? []

  if (children.length === 1 && children[0]?.type === 'image') {
    return children[0]
  }

  if (
    children.length === 3 &&
    children[0]?.type === 'link_open' &&
    children[1]?.type === 'image' &&
    children[2]?.type === 'link_close'
  ) {
    return children[1]
  }

  return null
}

const downloadIcon =
  '<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M12 4v10" /><path d="m7.5 9.5 4.5 4.5 4.5-4.5" /><path d="M5 20h14" /></svg>'

const copyIcon =
  '<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><rect width="11" height="13" x="8" y="5" rx="1.5" /><path d="M5 8v11h9" /></svg>'

export async function renderMarkdownToHtml(markdown: string) {
  const renderer = await getMarkdownRenderer()

  return renderer.render(markdown)
}

import type { TocEntry } from "@quartz-community/table-of-contents"
import { QuartzComponent, QuartzComponentProps } from "./types"

const MobileTableOfContents: QuartzComponent = ({ fileData }: QuartzComponentProps) => {
  const toc = fileData.toc as TocEntry[] | undefined
  if (!toc?.length) {
    return null
  }

  return (
    <details class="mobile-toc">
      <summary>目次</summary>
      <ul>
        {toc.map((entry) => (
          <li class={`depth-${entry.depth}`}>
            <a href={`#${entry.slug}`}>{entry.text}</a>
          </li>
        ))}
      </ul>
    </details>
  )
}

MobileTableOfContents.displayName = "MobileTableOfContents"

export default MobileTableOfContents

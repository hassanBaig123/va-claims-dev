'use client'

import React from 'react'
import parse, { domToReact } from 'html-react-parser'

import Heading1 from './blogs-component/headings/h1'
import Heading2 from './blogs-component/headings/h2'
import Heading3 from './blogs-component/headings/h3'
import Heading4 from './blogs-component/headings/h4'
import Heading5 from './blogs-component/headings/h5'
import Heading6 from './blogs-component/headings/h6'
import Paragraph from './blogs-component/paragraph'
import Quote from './blogs-component/quote'
import BlogImage from './blogs-component/image'
import LinkComponent from './blogs-component/link'
import ListComponent from './blogs-component/list'
import CodeComponent from './blogs-component/code'
import TableComponent from './blogs-component/table/table-component'
import TableRowComponent from './blogs-component/table/table-row'
import TableCellComponent from './blogs-component/table/table-cell'
import MediaComponent from './blogs-component/media/media'
import BlogBannerComponent from './blogs-component/blog-banner'
import OptInComponent from './blogs-component/optin'
import CallToActionComponent from './blogs-component/call-to-action'

// Type definitions for props
interface HtmlRenderProps {
  content: string
  blogBanner: Array<{ label: string; [key: string]: any }>
  optIn: Array<{ label: string; [key: string]: any }>
  callToAction: Array<{ label: string; [key: string]: any }>
}

// Define a type for the components map
type ComponentMap = {
  [key: string]: React.FC<React.ComponentProps<any>>
}

// Define a type for the dynamic components
interface DynamicComponentProps {
  [key: string]: any
}

const componentsMap: ComponentMap = {
  h1: Heading1,
  h2: Heading2,
  h3: Heading3,
  h4: Heading4,
  h5: Heading5,
  h6: Heading6,
  p: Paragraph,
  blockquote: Quote,
  a: (props) => (
    <LinkComponent href={props.href} underline={true}>
      {props.children}
    </LinkComponent>
  ),
  ol: (props) => <ListComponent ordered {...props} />,
  ul: (props) => <ListComponent {...props} />,
  img: BlogImage,
  code: CodeComponent,
  table: TableComponent,
  tr: TableRowComponent,
  th: (props) => <TableCellComponent header {...props} />,
  td: TableCellComponent,
  oembed: (props) => <MediaComponent url={props.url} />,
  OptInComponent: OptInComponent,
  BlogBannerComponent: BlogBannerComponent,
  CallToActionComponent: CallToActionComponent,
}

const HtmlRender: React.FC<HtmlRenderProps> = ({
  content,
  blogBanner,
  optIn,
  callToAction,
}) => {
  if (!content) return null

  const findByLabel = <T extends { label: string }>(
    arr: T[],
    label: string,
  ): T | undefined => {
    return arr.find((item) => item.label === label)
  }

  type ComponentType = 'Banner' | 'CTA' | 'optIn'
  interface ComponentConfig {
    data: any[]
    component: React.ComponentType<any>
  }
  const componentMap: Record<ComponentType, ComponentConfig> = {
    Banner: {
      data: blogBanner,
      component: BlogBannerComponent,
    },
    CTA: {
      data: callToAction,
      component: CallToActionComponent,
    },
    optIn: {
      data: optIn,
      component: OptInComponent,
    },
  }

  const renderDynamicComponent = (
    contentText: string,
    type: ComponentType,
  ): JSX.Element | null => {
    const match = contentText.match(new RegExp(`{{${type}-(\\d+)}}`))
    if (match) {
      const label = match[1]
      const { data, component: Component } = componentMap[type]
      const found = findByLabel(data, label)
      return found ? <Component {...found} /> : null
    }
    return null
  }

  const options = {
    replace: (domNode: any) => {
      if (domNode.type === 'text' && domNode.data) {
        const contentText = domNode.data
        for (const type in componentMap) {
          const renderedComponent = renderDynamicComponent(
            contentText,
            type as ComponentType,
          )
          if (renderedComponent) {
            return renderedComponent
          }
        }
      }

      if (domNode.type === 'tag' && componentsMap[domNode.name]) {
        const Component = componentsMap[domNode.name]
        return (
          <Component {...domNode.attribs}>
            {domToReact(domNode.children, options)}
          </Component>
        )
      }
      return null
    },
  }

  return <>{parse(content, options)}</>
}

export default HtmlRender
